import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AgentService } from '../agent/agent.service.js';
import { InboundMessage, MessagingGateway } from '../messaging/messaging.types.js';
import { OwnerNotifier } from '../handoff/owner-notifier.js';
import { HandoffService } from '../handoff/handoff.service.js';
import { SpeechToText } from '../speech/speech-to-text.js';
import { env } from '../config/env.js';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Inbound pipeline: dedupe, store, decide AI vs human, run the agent, reply. */
@Injectable()
export class ConversationService implements OnModuleInit {
  private readonly log = new Logger(ConversationService.name);
  /** One in-flight job per chat so replies never interleave. (Single instance; pg-boss when we scale out.) */
  private readonly chains = new Map<string, Promise<void>>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: MessagingGateway,
    private readonly agent: AgentService,
    private readonly notifier: OwnerNotifier,
    private readonly handoffs: HandoffService,
    private readonly speech: SpeechToText,
  ) {}

  onModuleInit() {
    this.gateway.onInbound((msg) => this.enqueue(msg));
  }

  /** Public so tests and the CLI can await completion. */
  enqueue(msg: InboundMessage): Promise<void> {
    const key = `${msg.merchantId}:${msg.chatId}`;
    const prev = this.chains.get(key) ?? Promise.resolve();
    const next = prev
      .catch(() => undefined)
      .then(() => this.process(msg))
      .catch((err) => this.log.error(`Failed processing ${key}: ${err instanceof Error ? err.stack : err}`))
      .finally(() => {
        if (this.chains.get(key) === next) this.chains.delete(key);
      });
    this.chains.set(key, next);
    return next;
  }

  private async process(msg: InboundMessage) {
    const merchant = await this.prisma.merchant.findUnique({ where: { id: msg.merchantId } });
    if (!merchant) return;

    if (msg.messageId) {
      const seen = await this.prisma.message.findFirst({
        where: { merchantId: msg.merchantId, externalId: msg.messageId },
        select: { id: true },
      });
      if (seen) return; // provider redelivery
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

    // The owner typed from their own phone: store it and silence the AI for this chat.
    if (msg.fromMe) {
      await this.store(msg, conversation.id, 'OUTBOUND', 'OWNER', msg.text ?? '');
      if (conversation.mode !== 'HUMAN') {
        await this.prisma.conversation.update({
          where: { id: conversation.id },
          data: { mode: 'HUMAN', humanSince: new Date(), handoffReason: 'Owner replied manually' },
        });
      }
      return;
    }

    let text = msg.text ?? '';
    if (msg.type === 'audio' && msg.mediaRef) {
      try {
        const audio = await this.gateway.downloadMedia(msg.merchantId, msg.mediaRef);
        text = await this.speech.transcribe(audio);
      } catch (err) {
        this.log.warn(`Voice note transcription failed: ${err instanceof Error ? err.message : String(err)}`);
        text = '';
      }
      if (!text) {
        await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', '[voice note could not be understood]');
        await this.reply(msg, conversation.id, "Sorry, I couldn't hear that voice note clearly. Abeg type your message for me?");
        return;
      }
    } else if (msg.type === 'image') {
      text = text || '[customer sent an image]';
    }
    if (!text) return;

    await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', text, msg.type === 'audio' ? 'audio' : 'text');

    if (conversation.mode === 'HUMAN') {
      await this.notifier.notifyMessageWhileHuman(msg.merchantId, msg.chatId, text);
      return;
    }
    if (!merchant.aiEnabled) return;

    let result;
    try {
      result = await this.agent.respond({
        merchantId: msg.merchantId,
        conversationId: conversation.id,
        customerId: customer.id,
      });
    } catch (err) {
      // LLM outage, rate limit, or a bug: the customer must never be left on read.
      this.log.error(`Agent failed for ${msg.chatId}: ${err instanceof Error ? err.message : String(err)}`);
      await this.reply(
        msg,
        conversation.id,
        'Sorry, I had a small problem on my side. Please send that again in a minute and I will sort you out.',
      );
      return;
    }

    await this.reply(msg, conversation.id, result.reply, result.meta);

    if (result.handoffReason) await this.handoffs.handoff(conversation.id, result.handoffReason);
  }

  private async reply(msg: InboundMessage, conversationId: string, text: string, meta?: { shown: string[] }) {
    // Typing indicator + short delay: reads more human and is gentler on WhatsApp's bot detection.
    if (env.WHATSAPP_ADAPTER !== 'simulator') {
      await this.gateway.setTyping(msg.merchantId, msg.chatId, true);
      await sleep(Math.min(800 + text.length * 25, 4000));
      await this.gateway.setTyping(msg.merchantId, msg.chatId, false);
    }
    await this.gateway.sendText(msg.merchantId, msg.chatId, text);
    await this.prisma.message.create({
      data: { merchantId: msg.merchantId, conversationId, direction: 'OUTBOUND', sender: 'AI', type: 'text', text, meta },
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
