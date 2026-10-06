import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { evaluateOffer } from './negotiation.logic.js';

/** What the agent is allowed to know. Deliberately has no floor price. */
export interface NegotiationOutcome {
  decision: 'accept' | 'counter' | 'decline';
  /** Accepted price, or the price the seller can do. */
  priceKobo: number;
  final: boolean;
  suggestHandoff: boolean;
}

@Injectable()
export class NegotiationService {
  constructor(private readonly prisma: PrismaService) {}

  async submitOffer(
    merchantId: string,
    conversationId: string,
    variantId: string,
    offerKobo: number,
  ): Promise<NegotiationOutcome | null> {
    const variant = await this.prisma.variant.findFirst({
      where: { id: variantId, merchantId },
      include: { product: { include: { merchant: true } } },
    });
    if (!variant) return null;

    const existing = await this.prisma.negotiation.findUnique({
      where: { conversationId_variantId: { conversationId, variantId } },
    });

    // The same amount offered again is NOT a new round: it gets the identical answer. (Without this, a model
    // that re-submits the customer's old offer when they accept our quote walks the price down for free.)
    const repeated = !!existing && existing.rounds > 0 && existing.lastOfferKobo === offerKobo;

    const result = evaluateOffer({
      listKobo: variant.priceKobo,
      floorKobo: variant.minPriceKobo,
      maxDiscountPercent: variant.product.merchant.maxDiscountPercent,
      offerKobo,
      priorRounds: repeated ? existing!.rounds - 1 : (existing?.rounds ?? 0),
    });

    if (repeated) return this.outcome(result);

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
        // A deal already struck stays struck; re-haggling cannot silently drop the order back to list price.
        status:
          accepted || existing?.status === 'AGREED'
            ? 'AGREED'
            : result.decision === 'decline'
              ? 'DECLINED'
              : 'OPEN',
      },
    });

    return this.outcome(result);
  }

  private outcome(result: ReturnType<typeof evaluateOffer>): NegotiationOutcome {
    return {
      decision: result.decision,
      priceKobo: result.priceKobo,
      final: result.decision === 'accept' ? true : result.final,
      suggestHandoff: result.decision === 'decline' ? result.suggestHandoff : false,
    };
  }

  /** Customer agreed to the price we last quoted: lock it in. Returns null if we never quoted one. */
  async acceptQuoted(conversationId: string, variantId: string): Promise<number | null> {
    const n = await this.prisma.negotiation.findUnique({
      where: { conversationId_variantId: { conversationId, variantId } },
    });
    if (!n) return null;
    if (n.status === 'AGREED' && n.agreedKobo) return n.agreedKobo;
    if (!n.quotedKobo) return null;
    await this.prisma.negotiation.update({
      where: { id: n.id },
      data: { status: 'AGREED', agreedKobo: n.quotedKobo },
    });
    return n.quotedKobo;
  }

  /** A quote the customer has not accepted yet (cart would silently use list price). */
  async pendingQuote(conversationId: string, variantId: string): Promise<number | null> {
    const n = await this.prisma.negotiation.findUnique({
      where: { conversationId_variantId: { conversationId, variantId } },
    });
    return n && n.status !== 'AGREED' ? (n.quotedKobo ?? null) : null;
  }

  /** The price an order line gets: the agreed price if one exists, otherwise list price. */
  async priceFor(conversationId: string, variantId: string, listKobo: number): Promise<number> {
    const n = await this.prisma.negotiation.findUnique({
      where: { conversationId_variantId: { conversationId, variantId } },
    });
    return n?.status === 'AGREED' && n.agreedKobo ? Math.min(n.agreedKobo, listKobo) : listKobo;
  }
}
