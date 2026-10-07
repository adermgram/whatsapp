import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AgentService } from '../agent/agent.service.js';
import { InboundMessage, MediaTooLargeError, MessagingGateway } from '../messaging/messaging.types.js';
import { OwnerNotifier } from '../handoff/owner-notifier.js';
import type { ProofFile } from '../handoff/owner-notifier.js';
import { HandoffService } from '../handoff/handoff.service.js';
import { SpeechToText } from '../speech/speech-to-text.js';
import { StoragePort } from '../storage/storage.port.js';
import { OwnerCommands } from './owner-commands.js';
import { TurnBatcher, TurnControl } from './turn-batcher.js';
import { MAX_PROOF_BYTES, ProofRateLimiter, checkProof, cleanCaption, proofFileName } from './proof-files.js';
import { debounceMs, env } from '../config/env.js';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Turn {
  merchantId: string;
  chatId: string;
  conversationId: string;
  customerId: string;
}

/**
 * The inbound pipeline.
 *
 *   ingest  (one at a time per chat, in order): dedupe, store, owner commands, owner takeover, human-mode handling
 *   answer  (batched): wait for a quiet moment, run the AI once over everything the customer said, reply
 *
 * Splitting the two is what lets a customer send "hi" / "i want man united jersey" / "away one" and get ONE sensible
 * answer, while every message is still stored the instant it arrives.
 */
@Injectable()
export class ConversationService implements OnModuleInit {
  private readonly log = new Logger(ConversationService.name);
  /** Quiet period before answering. Public so tests can shorten it. */
  debounceMs = debounceMs;
  private batcherInstance?: TurnBatcher;
  private readonly ingestChains = new Map<string, Promise<unknown>>();
  /** At most a few payment files per customer per 10 minutes get forwarded, so nobody can flood the owner. */
  private readonly proofLimiter = new ProofRateLimiter(3, 10 * 60_000);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: MessagingGateway,
    private readonly agent: AgentService,
    private readonly notifier: OwnerNotifier,
    private readonly handoffs: HandoffService,
    private readonly speech: SpeechToText,
    private readonly commands: OwnerCommands,
    private readonly storage: StoragePort,
  ) {}

  private get batcher(): TurnBatcher {
    return (this.batcherInstance ??= new TurnBatcher(this.debounceMs));
  }

  onModuleInit() {
    this.gateway.onInbound((msg) => this.enqueue(msg));
  }

  /** Public so tests and the CLI can await completion: resolves once the message has been fully dealt with. */
  enqueue(msg: InboundMessage): Promise<void> {
    const key = `${msg.merchantId}:${msg.chatId}`;
    // The moment a message ARRIVES the AI must not start (or finish) answering that chat until the message is stored:
    // storing takes several round trips to a remote database, and a burst of messages should be answered together.
    const release = this.batcher.hold(key);

    const prev = this.ingestChains.get(key) ?? Promise.resolve();
    const ingest = prev.catch(() => undefined).then(() => this.ingest(msg));
    const tail = ingest.catch(() => undefined);
    this.ingestChains.set(key, tail);
    void tail.then(() => {
      if (this.ingestChains.get(key) === tail) this.ingestChains.delete(key);
    });

    return ingest
      .then((turn) => {
        const answered = turn ? this.batcher.submit(key, (control) => this.runTurn(turn, control)) : undefined;
        release(); // after submit, so the quiet period starts only now
        return answered;
      })
      .catch((err) => {
        release();
        this.log.error(`Failed processing ${key}: ${err instanceof Error ? err.stack : String(err)}`);
      });
  }

  /** After a chat is handed back to the AI: answer anything the customer is still waiting on. */
  async catchUp(conversationId: string): Promise<void> {
    const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv || conv.mode !== 'AI') return;
    const last = await this.prisma.message.findFirst({ where: { conversationId }, orderBy: { createdAt: 'desc' } });
    if (last?.sender !== 'CUSTOMER') return; // nobody is waiting
    const turn: Turn = { merchantId: conv.merchantId, chatId: conv.chatId, conversationId, customerId: conv.customerId };
    await this.batcher.submit(`${conv.merchantId}:${conv.chatId}`, (control) => this.runTurn(turn, control));
  }

  // ---- step 1: ingest ----------------------------------------------------------------------------

  /** Returns a Turn when the AI should answer, or null when nothing more needs doing. */
  private async ingest(msg: InboundMessage): Promise<Turn | null> {
    const merchant = await this.prisma.merchant.findUnique({ where: { id: msg.merchantId } });
    if (!merchant) return null;

    // The owner talking to the bot (/resume, /paid ...) is not a customer: no conversation, no AI.
    if (!msg.fromMe && this.commands.isOwnerCommand(merchant, msg.chatId, msg.text)) {
      const out = await this.commands.handle(merchant, msg.text!);
      await this.gateway.sendText(msg.merchantId, msg.chatId, out.reply);
      for (const id of out.resumed) void this.catchUp(id).catch((e) => this.log.error(`catch-up failed: ${String(e)}`));
      return null;
    }

    if (msg.messageId) {
      const seen = await this.prisma.message.findFirst({
        where: { merchantId: msg.merchantId, externalId: msg.messageId },
        select: { id: true },
      });
      if (seen) return null; // provider redelivery
    }

    const customer = await this.prisma.customer.upsert({
      where: { merchantId_phone: { merchantId: msg.merchantId, phone: msg.chatId } },
      create: { merchantId: msg.merchantId, phone: msg.chatId },
      update: {},
    });
    const conversation = await this.prisma.conversation.upsert({
      where: { merchantId_chatId: { merchantId: msg.merchantId, chatId: msg.chatId } },
      create: { merchantId: msg.merchantId, customerId: customer.id, chatId: msg.chatId },
      update: { lastMessageAt: new Date() },
    });

    // The owner typed from their own phone: store it, and the AI steps back for this chat.
    if (msg.fromMe) {
      await this.store(msg, conversation.id, 'OUTBOUND', 'OWNER', msg.text ?? '');
      if (conversation.mode !== 'HUMAN' || conversation.handoffBy !== 'OWNER') {
        await this.handoffs.handoff(conversation.id, 'Owner replied manually', 'OWNER');
      }
      return null;
    }

    // A screenshot or PDF from someone with an unpaid order is payment proof: pass it to the owner, reply nicely.
    if (msg.type === 'image' || msg.type === 'document') {
      if (await this.handlePaymentProof(msg, merchant, conversation, customer)) return null;
    }

    let text = msg.text ?? '';
    if (msg.type === 'audio' && msg.mediaRef) {
      try {
        const audio = await this.gateway.downloadMedia(msg.merchantId, msg.mediaRef, 15 * 1024 * 1024);
        text = await this.speech.transcribe(audio);
      } catch (err) {
        this.log.warn(`Voice note transcription failed: ${err instanceof Error ? err.message : String(err)}`);
        text = '';
      }
      if (!text) {
        await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', '[voice note could not be understood]');
        await this.reply(msg, conversation.id, "Sorry, I couldn't hear that voice note clearly. Abeg type your message for me?");
        return null;
      }
    } else if (msg.type === 'image' || msg.type === 'document') {
      // No unpaid order, so not payment proof. The AI only learns that something arrived; it never sees the file.
      const caption = cleanCaption(text);
      text = `[customer sent ${msg.type === 'image' ? 'an image' : 'a file'}${caption ? `: ${caption}` : ''}]`;
    }
    if (!text) return null;

    await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', text, msg.type === 'audio' ? 'audio' : 'text');

    if (conversation.mode === 'HUMAN') {
      await this.notifier.notifyMessageWhileHuman(msg.merchantId, msg.chatId, text);
      await this.holdingReply(msg, conversation);
      return null;
    }
    if (!merchant.aiEnabled) return null;

    return { merchantId: msg.merchantId, chatId: msg.chatId, conversationId: conversation.id, customerId: customer.id };
  }

  /**
   * Payment proof: a screenshot or PDF from a customer who has an unpaid order.
   *
   * Returns true when the message was dealt with here (the AI is NOT asked to answer it, so the customer gets exactly
   * one reply and the AI can never promise anything about the money). Returns false when it is not payment proof.
   *
   * Security: the file is only ever passed along in memory. Its real type is read from its bytes (never from the
   * name or type the customer claims), size is capped, only images and PDFs get through, the owner's number comes from
   * our database, the filename is ours, the caption is cleaned, and forwards are rate-limited.
   * Nothing here can mark an order paid: only Paystack or the owner (/paid) can.
   */
  private async handlePaymentProof(
    msg: InboundMessage,
    merchant: { aiEnabled: boolean },
    conversation: { id: string; mode: string; handoffBy: string | null },
    customer: { name: string | null; phone: string },
  ): Promise<boolean> {
    const unpaid = await this.prisma.order.findFirst({
      where: { conversationId: conversation.id, status: { in: ['AWAITING_PAYMENT', 'EXPIRED'] } },
      orderBy: { createdAt: 'desc' },
    });
    if (!unpaid) return false; // nothing is waiting for money: an ordinary attachment, handled as before

    // The owner is already in this chat (or the shop has the AI off): keep the record and stay out of it.
    if ((conversation.mode === 'HUMAN' && conversation.handoffBy === 'OWNER') || !merchant.aiEnabled) {
      await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', '[customer sent a payment file; the owner is handling this chat]');
      return true;
    }

    // 1. Look at the file. Refuse anything oversized or not a real image/PDF, without forwarding it.
    let file: ProofFile | undefined;
    let rejected: 'too_large' | 'unsupported' | 'empty' | undefined;
    if (msg.fileSize !== undefined && msg.fileSize > MAX_PROOF_BYTES) {
      rejected = 'too_large'; // refused before downloading a single byte
    } else if (msg.mediaRef) {
      try {
        const data = await this.gateway.downloadMedia(msg.merchantId, msg.mediaRef, MAX_PROOF_BYTES);
        const check = checkProof(data);
        if (!check.ok) rejected = check.reason;
        else file = { data, mimeType: check.mimeType, kind: check.kind, fileName: proofFileName(unpaid.orderNumber, check.extension) };
      } catch (err) {
        if (err instanceof MediaTooLargeError) rejected = 'too_large'; // the sender lied about the size
        else this.log.warn(`Could not fetch a payment file for ${unpaid.orderNumber}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    if (rejected) {
      await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', '[customer sent a file that was not accepted]');
      await this.reply(
        msg,
        conversation.id,
        rejected === 'too_large'
          ? 'Sorry, that file is too big 🙏 Please send a screenshot or a PDF of the payment, under 10 MB.'
          : 'Sorry, I can only take a screenshot (image) or a PDF of your payment 🙏 Please send it again that way.',
      );
      return true;
    }

    // 2. Do not let one customer flood the owner.
    if (!this.proofLimiter.allow(conversation.id)) {
      await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', '[customer sent another payment file; already forwarded]');
      await this.reply(
        msg,
        conversation.id,
        `I've already sent your payment proof to the owner 🙏 Once it's confirmed, I'll send your receipt right here.`,
      );
      return true;
    }

    // 3. Pass it to the owner.
    let forwarded = false;
    try {
      forwarded = await this.notifier.notifyPaymentProof(msg.merchantId, {
        orderNumber: unpaid.orderNumber,
        totalKobo: unpaid.totalKobo,
        customerName: customer.name,
        customerPhone: customer.phone,
        caption: cleanCaption(msg.text),
        file,
      });
    } catch (err) {
      this.log.error(`Payment proof alert failed for ${unpaid.orderNumber}: ${err instanceof Error ? err.message : String(err)}`);
    }

    // 4. Tell the customer, honestly: "forwarded" only if the file really reached the owner.
    const kind = file?.kind === 'pdf' ? 'PDF' : 'screenshot';
    await this.store(
      msg,
      conversation.id,
      'INBOUND',
      'CUSTOMER',
      `[customer sent a payment ${kind} for ${unpaid.orderNumber}${forwarded ? ', forwarded to the owner' : ''}]`,
    );
    const first = customer.name?.split(/\s+/)[0];
    const thanks = first ? `Thank you, ${first}!` : 'Thank you!';
    await this.reply(
      msg,
      conversation.id,
      forwarded
        ? `${thanks} 🙏 I've forwarded your payment proof to the owner. Once the payment is confirmed, I'll send your receipt right here.`
        : `${thanks} 🙏 I've noted your payment. The owner will confirm it, and I'll send your receipt right here once it's done.`,
    );
    return true;
  }

  /** A chat that is with a human is never ignored in silence: say the owner has been told, at most once per while. */
  private async holdingReply(msg: InboundMessage, conversation: { id: string; handoffBy: string | null }) {
    if (conversation.handoffBy === 'OWNER') return; // the owner is actively in this chat
    const last = await this.prisma.message.findFirst({
      where: { conversationId: conversation.id, direction: 'OUTBOUND' },
      orderBy: { createdAt: 'desc' },
    });
    if (last && Date.now() - last.createdAt.getTime() < env.HOLDING_REPLY_GAP_MINUTES * 60_000) return;
    await this.reply(msg, conversation.id, "Thanks for your message 🙏 I've told the owner and they'll reply you shortly.");
  }

  // ---- step 2: answer (batched) ----------------------------------------------------------------------

  private async runTurn(turn: Turn, control: TurnControl): Promise<void> {
    // Nothing to do if the owner stepped in during the quiet period, or the customer is already answered.
    if (!(await this.awaitingAnswer(turn.conversationId))) return;

    let result;
    try {
      result = await this.agent.respond({
        merchantId: turn.merchantId,
        conversationId: turn.conversationId,
        customerId: turn.customerId,
      });
    } catch (err) {
      // LLM outage, rate limit, or a bug: the customer must never be left on read.
      this.log.error(`Agent failed for ${turn.chatId}: ${err instanceof Error ? err.message : String(err)}`);
      if (!control.isStale() && (await this.awaitingAnswer(turn.conversationId))) {
        await this.reply(
          turn,
          turn.conversationId,
          'Sorry, I had a small problem on my side. Please send that again in a minute and I will sort you out.',
        );
      }
      return;
    }

    // A newer message arrived while the AI was thinking: this answer is out of date, so drop it. The batcher
    // runs the turn again over everything the customer has said. Same if the owner stepped in meanwhile.
    if (control.isStale()) return;
    if (!(await this.awaitingAnswer(turn.conversationId))) return;

    // Pictures first, then the words: the reply usually ends with a question ("which size?"), which belongs last.
    if (result.photos) await this.sendPhotos(turn, result.photos).catch((e) => this.log.error(`Sending photos failed: ${e instanceof Error ? e.message : String(e)}`));
    await this.reply(turn, turn.conversationId, result.reply, result.meta);

    if (result.handoffReason) await this.handoffs.handoff(turn.conversationId, result.handoffReason, 'AI');
    else if (result.notifyReason) await this.handoffs.notify(turn.conversationId, result.notifyReason);
  }

  /**
   * Sends the catalog pictures the AI asked for. Each one is looked up by id AND shop, so only this shop's own photos
   * can ever go out. A photo that has gone missing from storage is skipped rather than failing the whole reply.
   */
  private async sendPhotos(turn: Turn, photos: { productName: string; caption: string; imageIds: string[] }) {
    let sent = 0;
    for (const id of photos.imageIds) {
      const image = await this.prisma.productImage.findFirst({ where: { id, merchantId: turn.merchantId } });
      const bytes = image ? await this.storage.get(image.key) : null;
      if (!bytes) continue;
      await this.gateway.sendImageBuffer(turn.merchantId, turn.chatId, bytes, 'image/jpeg', sent === 0 ? photos.caption : undefined);
      sent++;
    }
    if (sent > 0) {
      // Recorded so the AI knows next turn that the customer has already been shown pictures.
      await this.prisma.message.create({
        data: {
          merchantId: turn.merchantId,
          conversationId: turn.conversationId,
          direction: 'OUTBOUND',
          sender: 'AI',
          type: 'text',
          text: `[sent ${sent} photo${sent === 1 ? '' : 's'} of ${photos.productName}]`,
        },
      });
    }
  }

  /**
   * True only while the AI is in charge of this chat AND the customer's message is the latest thing in it.
   * That one check covers: the owner stepping in, an answer already sent, and a duplicate trigger.
   */
  private async awaitingAnswer(conversationId: string): Promise<boolean> {
    const c = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { mode: true, messages: { orderBy: { createdAt: 'desc' }, take: 1, select: { sender: true } } },
    });
    return c?.mode === 'AI' && c.messages[0]?.sender === 'CUSTOMER';
  }

  // ---- sending ---------------------------------------------------------------------------------------

  private async reply(
    to: { merchantId: string; chatId: string },
    conversationId: string,
    text: string,
    meta?: { shown: string[] },
  ) {
    // Typing indicator + short delay: reads more human and is gentler on WhatsApp's bot detection.
    if (env.WHATSAPP_ADAPTER !== 'simulator') {
      await this.gateway.setTyping(to.merchantId, to.chatId, true);
      await sleep(Math.min(800 + text.length * 25, 4000));
      await this.gateway.setTyping(to.merchantId, to.chatId, false);
    }
    await this.gateway.sendText(to.merchantId, to.chatId, text);
    await this.prisma.message.create({
      data: { merchantId: to.merchantId, conversationId, direction: 'OUTBOUND', sender: 'AI', type: 'text', text, meta },
    });
  }

  private store(
    msg: InboundMessage,
    conversationId: string,
    direction: 'INBOUND' | 'OUTBOUND',
    sender: 'CUSTOMER' | 'AI' | 'OWNER',
    text: string,
    type = 'text',
  ) {
    return this.prisma.message.create({
      data: {
        merchantId: msg.merchantId,
        conversationId,
        externalId: msg.messageId || null,
        direction,
        sender,
        type,
        text,
      },
    });
  }
}
