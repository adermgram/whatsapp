import type { ChatCompletionTool } from 'openai/resources/chat/completions';
import { PrismaService } from '../prisma/prisma.service.js';
import { CatalogService } from '../catalog/catalog.service.js';
import { NegotiationService } from '../negotiation/negotiation.service.js';
import { OrdersService } from '../orders/orders.service.js';
export interface ToolContext {
    merchantId: string;
    conversationId: string;
    customerId: string;
    effects: {
        handoffReason?: string;
        notifyReason?: string;
        paymentLink?: string;
        shown?: string[];
    };
}
export declare const TOOL_DEFINITIONS: ChatCompletionTool[];
export declare const shortRef: (id: string) => string;
export declare class Toolbox {
    private readonly prisma;
    private readonly catalog;
    private readonly negotiation;
    private readonly orders;
    constructor(prisma: PrismaService, catalog: CatalogService, negotiation: NegotiationService, orders: OrdersService);
    execute(name: string, rawArgs: string, ctx: ToolContext): Promise<unknown>;
    private resolveVariant;
    private search;
    private negotiate;
    private acceptPrice;
    private setCartItem;
    private removeCartItem;
    private viewCart;
    private saveDetails;
    private createPaymentLink;
    private orderStatus;
    private cartForModel;
}
