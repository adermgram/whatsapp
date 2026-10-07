import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { NegotiationService } from '../negotiation/negotiation.service.js';
import { PaymentProvider } from '../payments/payment.provider.js';
import { decryptSecret } from '../config/secrets.js';
import { env } from '../config/env.js';

const RESERVATION_MINUTES = 30;

export class OrderError extends Error {
  constructor(
    public readonly code:
      | 'VARIANT_NOT_FOUND'
      | 'OUT_OF_STOCK'
      | 'EMPTY_CART'
      | 'MISSING_DETAILS'
      | 'NOT_FOUND'
      | 'PAYMENT_INIT_FAILED',
    message: string,
  ) {
    super(message);
  }
}

export interface MarkPaidResult {
  status: 'paid' | 'already_paid' | 'amount_mismatch' | 'not_found';
  /** Money arrived but the stock was gone (reservation had expired). The owner must be told. */
  oversold?: boolean;
  orderId?: string;
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventory: InventoryService,
    private readonly negotiation: NegotiationService,
    private readonly payments: PaymentProvider,
  ) {}

  async getOrCreateDraft(merchantId: string, customerId: string, conversationId: string) {
    const existing = await this.prisma.order.findFirst({
      where: { merchantId, conversationId, status: 'DRAFT' },
      include: { items: true },
    });
    if (existing) return existing;
    return this.prisma.order.create({
      data: { merchantId, customerId, conversationId, orderNumber: `DRAFT-${randomBytes(4).toString('hex')}` },
      include: { items: true },
    });
  }

  /** Price comes from the server (agreed negotiation or list), never from the caller or the LLM. */
  async setItem(
    merchantId: string,
    customerId: string,
    conversationId: string,
    variantId: string,
    quantity: number,
  ) {
    const variant = await this.prisma.variant.findFirst({
      where: { id: variantId, merchantId },
      include: { product: true },
    });
    if (!variant) throw new OrderError('VARIANT_NOT_FOUND', 'That item does not exist');
    if (quantity < 1) throw new OrderError('OUT_OF_STOCK', 'Quantity must be at least 1');
    if (variant.stock - variant.reserved < quantity) {
      throw new OrderError('OUT_OF_STOCK', `Only ${Math.max(variant.stock - variant.reserved, 0)} left`);
    }

    const unitPriceKobo = await this.negotiation.priceFor(conversationId, variantId, variant.priceKobo);
    const draft = await this.getOrCreateDraft(merchantId, customerId, conversationId);

    await this.prisma.tx(async (tx) => {
      await tx.orderItem.deleteMany({ where: { orderId: draft.id, variantId } });
      await tx.orderItem.create({
        data: { orderId: draft.id, variantId, quantity, listPriceKobo: variant.priceKobo, unitPriceKobo },
      });
    });
    return this.summary(draft.id);
  }

  async removeItem(merchantId: string, conversationId: string, variantId: string) {
    const draft = await this.prisma.order.findFirst({ where: { merchantId, conversationId, status: 'DRAFT' } });
    if (!draft) return null;
    await this.prisma.orderItem.deleteMany({ where: { orderId: draft.id, variantId } });
    return this.summary(draft.id);
  }

  async saveCustomerDetails(
    customerId: string,
    details: { name?: string; address?: string },
  ) {
    return this.prisma.customer.update({
      where: { id: customerId },
      data: {
        ...(details.name ? { name: details.name } : {}),
        ...(details.address ? { address: details.address } : {}),
      },
    });
  }

  async summary(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { variant: { include: { product: true } } } }, customer: true },
    });
    if (!order) return null;
    const subtotalKobo = order.items.reduce((sum, i) => sum + i.unitPriceKobo * i.quantity, 0);
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      subtotalKobo,
      deliveryFeeKobo: order.deliveryFeeKobo,
      totalKobo: subtotalKobo + order.deliveryFeeKobo,
      deliveryAddress: order.customer.address,
      customerName: order.customer.name,
      items: order.items.map((i) => ({
        variantId: i.variantId,
        name: i.variant.product.name,
        size: i.variant.size,
        color: i.variant.color,
        quantity: i.quantity,
        unitPriceKobo: i.unitPriceKobo,
      })),
    };
  }

  /**
   * Draft -> AWAITING_PAYMENT. Reserves all stock atomically (all or nothing),
   * then creates the Paystack link. If the link cannot be created, the reservation is undone.
   */
  async checkout(merchantId: string, conversationId: string, opts: { deliveryFeeKobo?: number } = {}) {
    // A customer who asks for "the link" again must get the SAME order, not a second one that
    // reserves the stock twice. If they changed the cart since, the old order is cancelled first.
    const pending = await this.prisma.order.findFirst({
      where: { merchantId, conversationId, status: 'AWAITING_PAYMENT' },
      include: { items: true, payment: true },
      orderBy: { createdAt: 'desc' },
    });
    const draft = await this.prisma.order.findFirst({
      where: { merchantId, conversationId, status: 'DRAFT' },
      include: { items: true, customer: true, merchant: true },
    });
    if (pending?.payment?.checkoutUrl) {
      const key = (items: { variantId: string; quantity: number; unitPriceKobo: number }[]) =>
        items.map((i) => `${i.variantId}:${i.quantity}:${i.unitPriceKobo}`).sort().join('|');
      if (!draft || draft.items.length === 0 || key(draft.items) === key(pending.items)) {
        if (draft) await this.prisma.order.delete({ where: { id: draft.id } }); // identical duplicate cart
        return {
          order: (await this.summary(pending.id))!,
          checkoutUrl: pending.payment.checkoutUrl,
          expiresAt: pending.expiresAt,
          reference: pending.payment.reference,
          reused: true,
        };
      }
      await this.cancelAwaiting(pending.id);
    }

    if (!draft || draft.items.length === 0) throw new OrderError('EMPTY_CART', 'The cart is empty');
    if (!draft.customer.name || !draft.customer.address) {
      throw new OrderError('MISSING_DETAILS', 'Need the customer name and delivery address first');
    }

    const deliveryFeeKobo = opts.deliveryFeeKobo ?? 0;
    const subtotalKobo = draft.items.reduce((s, i) => s + i.unitPriceKobo * i.quantity, 0);
    const totalKobo = subtotalKobo + deliveryFeeKobo;
    const expiresAt = new Date(Date.now() + RESERVATION_MINUTES * 60_000);

    await this.prisma.tx(async (tx) => {
      for (const item of draft.items) {
        const ok = await this.inventory.reserve(tx, item.variantId, item.quantity);
        if (!ok) throw new OrderError('OUT_OF_STOCK', 'One of the items just sold out');
      }
      const m = await tx.merchant.update({
        where: { id: merchantId },
        data: { orderCounter: { increment: 1 } },
        select: { orderCounter: true },
      });
      await tx.order.update({
        where: { id: draft.id },
        data: {
          status: 'AWAITING_PAYMENT',
          orderNumber: `ORD-${String(m.orderCounter).padStart(6, '0')}`,
          subtotalKobo,
          deliveryFeeKobo,
          totalKobo,
          deliveryAddress: draft.customer.address,
          expiresAt,
        },
      });
    });

    const reference = `ord${draft.id.replace(/-/g, '')}`;
    try {
      const secret = draft.merchant.paystackSecretEnc ? decryptSecret(draft.merchant.paystackSecretEnc) : null;
      const { checkoutUrl } = await this.payments.initialize({
        secretKey: secret,
        // digits only: a WhatsApp privacy id looks like "lid:123", which is not a valid email local part
        email: `${draft.customer.phone.replace(/\D/g, '')}@${env.PAYMENT_EMAIL_DOMAIN}`,
        amountKobo: totalKobo,
        reference,
        callbackUrl: undefined,
        metadata: { orderId: draft.id, merchantId },
      });
      await this.prisma.payment.create({
        data: { orderId: draft.id, reference, amountKobo: totalKobo, checkoutUrl },
      });
      const order = await this.summary(draft.id);
      return { order: order!, checkoutUrl, expiresAt, reference, reused: false };
    } catch (err) {
      await this.revertToDraft(draft.id);
      throw new OrderError('PAYMENT_INIT_FAILED', err instanceof Error ? err.message : 'payment failed');
    }
  }

  /** The customer changed their mind after getting a link: free the stock held for the old order. */
  async cancelAwaiting(orderId: string): Promise<void> {
    await this.prisma.tx(async (tx) => {
      const won = await tx.order.updateMany({
        where: { id: orderId, status: 'AWAITING_PAYMENT' },
        data: { status: 'CANCELLED' },
      });
      if (won.count === 0) return;
      const items = await tx.orderItem.findMany({ where: { orderId } });
      for (const i of items) await this.inventory.release(tx, i.variantId, i.quantity);
    });
  }

  private async revertToDraft(orderId: string) {
    await this.prisma.tx(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (!order || order.status !== 'AWAITING_PAYMENT') return;
      for (const i of order.items) await this.inventory.release(tx, i.variantId, i.quantity);
      await tx.order.update({ where: { id: orderId }, data: { status: 'DRAFT', expiresAt: null } });
    });
  }

  /**
   * Called only after the provider confirms the payment (webhook + verify API).
   * Idempotent: a repeated call returns 'already_paid' and changes nothing.
   */
  async markPaid(orderId: string, paidAmountKobo: number, rawEvent?: unknown): Promise<MarkPaidResult> {
    return this.prisma.tx(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (!order) return { status: 'not_found' as const };
      if (order.status === 'PAID' || order.status === 'FULFILLED') {
        return { status: 'already_paid' as const, orderId };
      }
      if (paidAmountKobo < order.totalKobo) return { status: 'amount_mismatch' as const, orderId };

      const prev = order.status;
      const won = await tx.order.updateMany({
        where: { id: orderId, status: prev },
        data: { status: 'PAID', paidAt: new Date() },
      });
      if (won.count === 0) return { status: 'already_paid' as const, orderId };

      await tx.payment.updateMany({
        where: { orderId },
        data: { status: 'SUCCESS', rawEvent: (rawEvent ?? undefined) as never },
      });

      let oversold = false;
      for (const i of order.items) {
        if (prev === 'AWAITING_PAYMENT') {
          await this.inventory.commit(tx, i.variantId, i.quantity);
        } else if (!(await this.inventory.takeUnreserved(tx, i.variantId, i.quantity))) {
          oversold = true; // reservation had expired and the stock is gone
        }
      }
      return { status: 'paid' as const, orderId, oversold };
    });
  }

  /** Cron: free stock held by orders nobody paid for. Late payments are still honoured by markPaid. */
  async expireStale(now = new Date(), merchantId?: string): Promise<number> {
    const stale = await this.prisma.order.findMany({
      where: { status: 'AWAITING_PAYMENT', expiresAt: { lt: now }, ...(merchantId ? { merchantId } : {}) },
      select: { id: true },
      take: 100,
    });
    let expired = 0;
    for (const { id } of stale) {
      await this.prisma.tx(async (tx) => {
        const won = await tx.order.updateMany({
          where: { id, status: 'AWAITING_PAYMENT' },
          data: { status: 'EXPIRED' },
        });
        if (won.count === 0) return;
        const items = await tx.orderItem.findMany({ where: { orderId: id } });
        for (const i of items) await this.inventory.release(tx, i.variantId, i.quantity);
        expired++;
      });
    }
    return expired;
  }
}
