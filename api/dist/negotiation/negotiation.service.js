var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { evaluateOffer } from './negotiation.logic.js';
let NegotiationService = class NegotiationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitOffer(merchantId, conversationId, variantId, offerKobo) {
        const variant = await this.prisma.variant.findFirst({
            where: { id: variantId, merchantId },
            include: { product: { include: { merchant: true } } },
        });
        if (!variant)
            return null;
        const existing = await this.prisma.negotiation.findUnique({
            where: { conversationId_variantId: { conversationId, variantId } },
        });
        const result = evaluateOffer({
            listKobo: variant.priceKobo,
            floorKobo: variant.minPriceKobo,
            maxDiscountPercent: variant.product.merchant.maxDiscountPercent,
            offerKobo,
            priorRounds: existing?.rounds ?? 0,
        });
        const accepted = result.decision === 'accept';
        await this.prisma.negotiation.upsert({
            where: { conversationId_variantId: { conversationId, variantId } },
            create: {
                conversationId,
                variantId,
                rounds: 1,
                lastOfferKobo: offerKobo,
                quotedKobo: result.priceKobo,
                agreedKobo: accepted ? result.priceKobo : null,
                status: accepted ? 'AGREED' : result.decision === 'decline' ? 'DECLINED' : 'OPEN',
            },
            update: {
                rounds: { increment: 1 },
                lastOfferKobo: offerKobo,
                quotedKobo: result.priceKobo,
                agreedKobo: accepted ? result.priceKobo : existing?.agreedKobo ?? null,
                status: accepted || existing?.status === 'AGREED'
                    ? 'AGREED'
                    : result.decision === 'decline'
                        ? 'DECLINED'
                        : 'OPEN',
            },
        });
        return {
            decision: result.decision,
            priceKobo: result.priceKobo,
            final: result.decision === 'accept' ? true : result.final,
            suggestHandoff: result.decision === 'decline' ? result.suggestHandoff : false,
        };
    }
    async acceptQuoted(conversationId, variantId) {
        const n = await this.prisma.negotiation.findUnique({
            where: { conversationId_variantId: { conversationId, variantId } },
        });
        if (!n)
            return null;
        if (n.status === 'AGREED' && n.agreedKobo)
            return n.agreedKobo;
        if (!n.quotedKobo)
            return null;
        await this.prisma.negotiation.update({
            where: { id: n.id },
            data: { status: 'AGREED', agreedKobo: n.quotedKobo },
        });
        return n.quotedKobo;
    }
    async pendingQuote(conversationId, variantId) {
        const n = await this.prisma.negotiation.findUnique({
            where: { conversationId_variantId: { conversationId, variantId } },
        });
        return n && n.status !== 'AGREED' ? (n.quotedKobo ?? null) : null;
    }
    async priceFor(conversationId, variantId, listKobo) {
        const n = await this.prisma.negotiation.findUnique({
            where: { conversationId_variantId: { conversationId, variantId } },
        });
        return n?.status === 'AGREED' && n.agreedKobo ? Math.min(n.agreedKobo, listKobo) : listKobo;
    }
};
NegotiationService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], NegotiationService);
export { NegotiationService };
//# sourceMappingURL=negotiation.service.js.map