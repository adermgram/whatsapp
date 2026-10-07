var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ConversationService_1;
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AgentService } from '../agent/agent.service.js';
import { MediaTooLargeError, MessagingGateway } from '../messaging/messaging.types.js';
import { OwnerNotifier } from '../handoff/owner-notifier.js';
import { HandoffService } from '../handoff/handoff.service.js';
import { SpeechToText } from '../speech/speech-to-text.js';
import { OwnerCommands } from './owner-commands.js';
import { TurnBatcher } from './turn-batcher.js';
import { MAX_PROOF_BYTES, ProofRateLimiter, checkProof, cleanCaption, proofFileName } from './proof-files.js';
import { debounceMs, env } from '../config/env.js';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ConversationService = ConversationService_1 = class ConversationService {
    prisma;
    gateway;
    agent;
    notifier;
    handoffs;
    speech;
    commands;
    log = new Logger(ConversationService_1.name);
    debounceMs = debounceMs;
    batcherInstance;
    ingestChains = new Map();
    proofLimiter = new ProofRateLimiter(3, 10 * 60_000);
    constructor(prisma, gateway, agent, notifier, handoffs, speech, commands) {
        this.prisma = prisma;
        this.gateway = gateway;
        this.agent = agent;
        this.notifier = notifier;
        this.handoffs = handoffs;
        this.speech = speech;
        this.commands = commands;
    }
    get batcher() {
        return (this.batcherInstance ??= new TurnBatcher(this.debounceMs));
    }
    onModuleInit() {
        this.gateway.onInbound((msg) => this.enqueue(msg));
    }
    enqueue(msg) {
        const key = `${msg.merchantId}:${msg.chatId}`;
        const release = this.batcher.hold(key);
        const prev = this.ingestChains.get(key) ?? Promise.resolve();
        const ingest = prev.catch(() => undefined).then(() => this.ingest(msg));
        const tail = ingest.catch(() => undefined);
        this.ingestChains.set(key, tail);
        void tail.then(() => {
            if (this.ingestChains.get(key) === tail)
                this.ingestChains.delete(key);
        });
        return ingest
            .then((turn) => {
            const answered = turn ? this.batcher.submit(key, (control) => this.runTurn(turn, control)) : undefined;
            release();
            return answered;
        })
            .catch((err) => {
            release();
            this.log.error(`Failed processing ${key}: ${err instanceof Error ? err.stack : String(err)}`);
        });
    }
    async catchUp(conversationId) {
        const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conv || conv.mode !== 'AI')
            return;
        const last = await this.prisma.message.findFirst({ where: { conversationId }, orderBy: { createdAt: 'desc' } });
        if (last?.sender !== 'CUSTOMER')
            return;
        const turn = { merchantId: conv.merchantId, chatId: conv.chatId, conversationId, customerId: conv.customerId };
        await this.batcher.submit(`${conv.merchantId}:${conv.chatId}`, (control) => this.runTurn(turn, control));
    }
    async ingest(msg) {
        const merchant = await this.prisma.merchant.findUnique({ where: { id: msg.merchantId } });
        if (!merchant)
            return null;
        if (!msg.fromMe && this.commands.isOwnerCommand(merchant, msg.chatId, msg.text)) {
            const out = await this.commands.handle(merchant, msg.text);
            await this.gateway.sendText(msg.merchantId, msg.chatId, out.reply);
            for (const id of out.resumed)
                void this.catchUp(id).catch((e) => this.log.error(`catch-up failed: ${String(e)}`));
            return null;
        }
        if (msg.messageId) {
            const seen = await this.prisma.message.findFirst({
                where: { merchantId: msg.merchantId, externalId: msg.messageId },
                select: { id: true },
            });
            if (seen)
                return null;
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
        if (msg.fromMe) {
            await this.store(msg, conversation.id, 'OUTBOUND', 'OWNER', msg.text ?? '');
            if (conversation.mode !== 'HUMAN' || conversation.handoffBy !== 'OWNER') {
                await this.handoffs.handoff(conversation.id, 'Owner replied manually', 'OWNER');
            }
            return null;
        }
        if (msg.type === 'image' || msg.type === 'document') {
            if (await this.handlePaymentProof(msg, merchant, conversation, customer))
                return null;
        }
        let text = msg.text ?? '';
        if (msg.type === 'audio' && msg.mediaRef) {
            try {
                const audio = await this.gateway.downloadMedia(msg.merchantId, msg.mediaRef, 15 * 1024 * 1024);
                text = await this.speech.transcribe(audio);
            }
            catch (err) {
                this.log.warn(`Voice note transcription failed: ${err instanceof Error ? err.message : String(err)}`);
                text = '';
            }
            if (!text) {
                await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', '[voice note could not be understood]');
                await this.reply(msg, conversation.id, "Sorry, I couldn't hear that voice note clearly. Abeg type your message for me?");
                return null;
            }
        }
        else if (msg.type === 'image' || msg.type === 'document') {
            const caption = cleanCaption(text);
            text = `[customer sent ${msg.type === 'image' ? 'an image' : 'a file'}${caption ? `: ${caption}` : ''}]`;
        }
        if (!text)
            return null;
        await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', text, msg.type === 'audio' ? 'audio' : 'text');
        if (conversation.mode === 'HUMAN') {
            await this.notifier.notifyMessageWhileHuman(msg.merchantId, msg.chatId, text);
            await this.holdingReply(msg, conversation);
            return null;
        }
        if (!merchant.aiEnabled)
            return null;
        return { merchantId: msg.merchantId, chatId: msg.chatId, conversationId: conversation.id, customerId: customer.id };
    }
    async handlePaymentProof(msg, merchant, conversation, customer) {
        const unpaid = await this.prisma.order.findFirst({
            where: { conversationId: conversation.id, status: { in: ['AWAITING_PAYMENT', 'EXPIRED'] } },
            orderBy: { createdAt: 'desc' },
        });
        if (!unpaid)
            return false;
        if ((conversation.mode === 'HUMAN' && conversation.handoffBy === 'OWNER') || !merchant.aiEnabled) {
            await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', '[customer sent a payment file; the owner is handling this chat]');
            return true;
        }
        let file;
        let rejected;
        if (msg.fileSize !== undefined && msg.fileSize > MAX_PROOF_BYTES) {
            rejected = 'too_large';
        }
        else if (msg.mediaRef) {
            try {
                const data = await this.gateway.downloadMedia(msg.merchantId, msg.mediaRef, MAX_PROOF_BYTES);
                const check = checkProof(data);
                if (!check.ok)
                    rejected = check.reason;
                else
                    file = { data, mimeType: check.mimeType, kind: check.kind, fileName: proofFileName(unpaid.orderNumber, check.extension) };
            }
            catch (err) {
                if (err instanceof MediaTooLargeError)
                    rejected = 'too_large';
                else
                    this.log.warn(`Could not fetch a payment file for ${unpaid.orderNumber}: ${err instanceof Error ? err.message : String(err)}`);
            }
        }
        if (rejected) {
            await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', '[customer sent a file that was not accepted]');
            await this.reply(msg, conversation.id, rejected === 'too_large'
                ? 'Sorry, that file is too big 🙏 Please send a screenshot or a PDF of the payment, under 10 MB.'
                : 'Sorry, I can only take a screenshot (image) or a PDF of your payment 🙏 Please send it again that way.');
            return true;
        }
        if (!this.proofLimiter.allow(conversation.id)) {
            await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', '[customer sent another payment file; already forwarded]');
            await this.reply(msg, conversation.id, `I've already sent your payment proof to the owner 🙏 Once it's confirmed, I'll send your receipt right here.`);
            return true;
        }
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
        }
        catch (err) {
            this.log.error(`Payment proof alert failed for ${unpaid.orderNumber}: ${err instanceof Error ? err.message : String(err)}`);
        }
        const kind = file?.kind === 'pdf' ? 'PDF' : 'screenshot';
        await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', `[customer sent a payment ${kind} for ${unpaid.orderNumber}${forwarded ? ', forwarded to the owner' : ''}]`);
        const first = customer.name?.split(/\s+/)[0];
        const thanks = first ? `Thank you, ${first}!` : 'Thank you!';
        await this.reply(msg, conversation.id, forwarded
            ? `${thanks} 🙏 I've forwarded your payment proof to the owner. Once the payment is confirmed, I'll send your receipt right here.`
            : `${thanks} 🙏 I've noted your payment. The owner will confirm it, and I'll send your receipt right here once it's done.`);
        return true;
    }
    async holdingReply(msg, conversation) {
        if (conversation.handoffBy === 'OWNER')
            return;
        const last = await this.prisma.message.findFirst({
            where: { conversationId: conversation.id, direction: 'OUTBOUND' },
            orderBy: { createdAt: 'desc' },
        });
        if (last && Date.now() - last.createdAt.getTime() < env.HOLDING_REPLY_GAP_MINUTES * 60_000)
            return;
        await this.reply(msg, conversation.id, "Thanks for your message 🙏 I've told the owner and they'll reply you shortly.");
    }
    async runTurn(turn, control) {
        if (!(await this.awaitingAnswer(turn.conversationId)))
            return;
        let result;
        try {
            result = await this.agent.respond({
                merchantId: turn.merchantId,
                conversationId: turn.conversationId,
                customerId: turn.customerId,
            });
        }
        catch (err) {
            this.log.error(`Agent failed for ${turn.chatId}: ${err instanceof Error ? err.message : String(err)}`);
            if (!control.isStale() && (await this.awaitingAnswer(turn.conversationId))) {
                await this.reply(turn, turn.conversationId, 'Sorry, I had a small problem on my side. Please send that again in a minute and I will sort you out.');
            }
            return;
        }
        if (control.isStale())
            return;
        if (!(await this.awaitingAnswer(turn.conversationId)))
            return;
        await this.reply(turn, turn.conversationId, result.reply, result.meta);
        if (result.handoffReason)
            await this.handoffs.handoff(turn.conversationId, result.handoffReason, 'AI');
        else if (result.notifyReason)
            await this.handoffs.notify(turn.conversationId, result.notifyReason);
    }
    async awaitingAnswer(conversationId) {
        const c = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            select: { mode: true, messages: { orderBy: { createdAt: 'desc' }, take: 1, select: { sender: true } } },
        });
        return c?.mode === 'AI' && c.messages[0]?.sender === 'CUSTOMER';
    }
    async reply(to, conversationId, text, meta) {
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
    store(msg, conversationId, direction, sender, text, type = 'text') {
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
};
ConversationService = ConversationService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        MessagingGateway,
        AgentService,
        OwnerNotifier,
        HandoffService,
        SpeechToText,
        OwnerCommands])
], ConversationService);
export { ConversationService };
//# sourceMappingURL=conversation.service.js.map