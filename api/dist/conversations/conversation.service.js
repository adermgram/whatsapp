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
import { env } from '../config/env.js';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ConversationService = ConversationService_1 = class ConversationService {
    prisma;
    gateway;
    agent;
    notifier;
    handoffs;
    speech;
    log = new Logger(ConversationService_1.name);
    chains = new Map();
    constructor(prisma, gateway, agent, notifier, handoffs, speech) {
        this.prisma = prisma;
        this.gateway = gateway;
        this.agent = agent;
        this.notifier = notifier;
        this.handoffs = handoffs;
        this.speech = speech;
    }
    onModuleInit() {
        this.gateway.onInbound((msg) => this.enqueue(msg));
    }
    enqueue(msg) {
        const key = `${msg.merchantId}:${msg.chatId}`;
        const prev = this.chains.get(key) ?? Promise.resolve();
        const next = prev
            .catch(() => undefined)
            .then(() => this.process(msg))
            .catch((err) => this.log.error(`Failed processing ${key}: ${err instanceof Error ? err.stack : err}`))
            .finally(() => {
            if (this.chains.get(key) === next)
                this.chains.delete(key);
        });
        this.chains.set(key, next);
        return next;
    }
    async process(msg) {
        const merchant = await this.prisma.merchant.findUnique({ where: { id: msg.merchantId } });
        if (!merchant)
            return;
        if (msg.messageId) {
            const seen = await this.prisma.message.findFirst({
                where: { merchantId: msg.merchantId, externalId: msg.messageId },
                select: { id: true },
            });
            if (seen)
                return;
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
            }
            catch (err) {
                this.log.warn(`Voice note transcription failed: ${err instanceof Error ? err.message : String(err)}`);
                text = '';
            }
            if (!text) {
                await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', '[voice note could not be understood]');
                await this.reply(msg, conversation.id, "Sorry, I couldn't hear that voice note clearly. Abeg type your message for me?");
                return;
            }
        }
        else if (msg.type === 'image') {
            text = text || '[customer sent an image]';
        }
        if (!text)
            return;
        await this.store(msg, conversation.id, 'INBOUND', 'CUSTOMER', text, msg.type === 'audio' ? 'audio' : 'text');
        if (conversation.mode === 'HUMAN') {
            await this.notifier.notifyMessageWhileHuman(msg.merchantId, msg.chatId, text);
            return;
        }
        if (!merchant.aiEnabled)
            return;
        let result;
        try {
            result = await this.agent.respond({
                merchantId: msg.merchantId,
                conversationId: conversation.id,
                customerId: customer.id,
            });
        }
        catch (err) {
            this.log.error(`Agent failed for ${msg.chatId}: ${err instanceof Error ? err.message : String(err)}`);
            await this.reply(msg, conversation.id, 'Sorry, I had a small problem on my side. Please send that again in a minute and I will sort you out.');
            return;
        }
        await this.reply(msg, conversation.id, result.reply, result.meta);
        if (result.handoffReason)
            await this.handoffs.handoff(conversation.id, result.handoffReason);
    }
    async reply(msg, conversationId, text, meta) {
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
        SpeechToText])
], ConversationService);
export { ConversationService };
//# sourceMappingURL=conversation.service.js.map