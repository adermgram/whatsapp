import { PrismaService } from '../prisma/prisma.service.js';
export interface NegotiationOutcome {
    decision: 'accept' | 'counter' | 'decline';
    priceKobo: number;
    final: boolean;
    suggestHandoff: boolean;
}
export declare class NegotiationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    submitOffer(merchantId: string, conversationId: string, variantId: string, offerKobo: number): Promise<NegotiationOutcome | null>;
    acceptQuoted(conversationId: string, variantId: string): Promise<number | null>;
    pendingQuote(conversationId: string, variantId: string): Promise<number | null>;
    priceFor(conversationId: string, variantId: string, listKobo: number): Promise<number>;
}
