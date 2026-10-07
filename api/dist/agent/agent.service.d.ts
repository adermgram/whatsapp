import { PrismaService } from '../prisma/prisma.service.js';
import { LlmClient } from './llm.client.js';
import { ToolContext, Toolbox } from './toolbox.js';
import { OrdersService } from '../orders/orders.service.js';
export interface AgentResult {
    reply: string;
    handoffReason?: string;
    notifyReason?: string;
    photos?: {
        productName: string;
        caption: string;
        imageIds: string[];
    };
    meta?: {
        shown: string[];
    };
}
export declare class AgentService {
    private readonly prisma;
    private readonly llm;
    private readonly tools;
    private readonly orders;
    private readonly log;
    constructor(prisma: PrismaService, llm: LlmClient, tools: Toolbox, orders: OrdersService);
    private stateLine;
    respond(ctx: Omit<ToolContext, 'effects'>): Promise<AgentResult>;
    private finish;
}
