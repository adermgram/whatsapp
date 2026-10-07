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
import { MessagingGateway } from '../messaging/messaging.types.js';
import { OwnerNotifier } from '../handoff/owner-notifier.js';
import { HandoffService } from '../handoff/handoff.service.js';
import { SpeechToText } from '../speech/speech-to-text.js';
import { OwnerCommands } from './owner-commands.js';
import { TurnBatcher } from './turn-batcher.js';
import { debounceMs, env } from '../config/env.js';
import { formatNaira } from '../common/money.js';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const IMAGE_ALERT_GAP_MS = 5 * 60_000;
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
    lastImageAlert = new Map();
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
        let text = msg.text ?? '';
        if (msg.type === 'audio' && msg.mediaRef) {
            try {
                const audio = await this.gateway.downloadMedia(msg.merchantId, msg.mediaRef);
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
        else if (msg.type === 'image') {
            text = `[customer sent an image${text ? `: ${text}` : ''}]`;
        }
        if (!text)
            return null;
        await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', text, msg.type === 'audio' ? 'audio' : 'text');
        if (msg.type === 'image')
            void this.flagPossiblePaymentProof(conversation.id).catch((e) => this.log.error(`proof alert failed: ${String(e)}`));
        if (conversation.mode === 'HUMAN') {
            await this.notifier.notifyMessageWhileHuman(msg.merchantId, msg.chatId, text);
            await this.holdingReply(msg, conversation);
            return null;
        }
        if (!merchant.aiEnabled)
            return null;
        return { merchantId: msg.merchantId, chatId: msg.chatId, conversationId: conversation.id, customerId: customer.id };
    }
    async flagPossiblePaymentProof(conversationId) {
        const unpaid = await this.prisma.order.findFirst({
            where: { conversationId, status: { in: ['AWAITING_PAYMENT', 'EXPIRED'] } },
            orderBy: { createdAt: 'desc' },
        });
        if (!unpaid)
            return;
        const last = this.lastImageAlert.get(conversationId) ?? 0;
        if (Date.now() - last < IMAGE_ALERT_GAP_MS)
            return;
        this.lastImageAlert.set(conversationId, Date.now());
        await this.handoffs.notify(conversationId, `Sent an image, probably proof of payment for ${unpaid.orderNumber} (${formatNaira(unpaid.totalKobo)}). If the money reached your account, reply /paid ${unpaid.orderNumber}`);
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