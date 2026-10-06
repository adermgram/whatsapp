import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AgentService } from '../agent/agent.service.js';
import { InboundMessage, MessagingGateway } from '../messaging/messaging.types.js';
import { OwnerNotifier } from '../handoff/owner-notifier.js';
import { SpeechToText } from '../speech/speech-to-text.js';
export declare class ConversationService implements OnModuleInit {
    private readonly prisma;
    private readonly gateway;
    private readonly agent;
    private readonly notifier;
    private readonly speech;
    private readonly log;
    private readonly chains;
    constructor(prisma: PrismaService, gateway: MessagingGateway, agent: AgentService, notifier: OwnerNotifier, speech: SpeechToText);
    onModuleInit(): void;
    enqueue(msg: InboundMessage): Promise<void>;
    private process;
    handoff(conversationId: string, reason: string): Promise<void>;
    resumeAi(conversationId: string): Promise<void>;
    private reply;
    private store;
}
