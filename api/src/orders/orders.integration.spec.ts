import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { NegotiationService } from '../negotiation/negotiation.service.js';
import { FakePaymentProvider } from '../payments/fake-payment.provider.js';
import { OrderError, OrdersService } from './orders.service.js';

// Real Postgres (Supabase). Each test run creates its own throwaway merchant and deletes it after.
const prisma = new PrismaService();
const inventory = new InventoryService();
const negotiation = new NegotiationService(prisma);
const orders = new OrdersService(prisma, inventory, negotiation, new FakePaymentProvider());

let merchantId: string;
const naira = (n: number) => n * 100;

async function newBuyer(variantId: string, qty = 1) {
  const customer = await prisma.customer.create({
    data: { merchantId, phone: `234${Math.floor(Math.random() * 1e9)}`, name: 'Test Buyer', address: '1 Test Street, Lagos' },
  });
  const conversation = await prisma.conversation.create({
    data: { merchantId, customerId: customer.id, chatId: customer.phone },
  });
  await orders.setItem(merchantId, customer.id, conversation.id, variantId, qty);
  return { customer, conversation };
}

async function newVariant(stock: number, price = 20000, floor = 15000) {
  const product = await prisma.product.create({
    data: {
      merchantId,
      name: `Test Jersey ${randomUUID().slice(0, 4)}`,
      category: 'JERSEY',
      imageKeys: [],
      variants: { create: [{ merchantId, size: 'M', priceKobo: naira(price), minPriceKobo: naira(floor), stock }] },
    },
    include: { variants: true },
  });
  return product.variants[0]!;
}

const stockOf = (variantId: string) => prisma.variant.findUniqueOrThrow({ where: { id: variantId } });

beforeAll(async () => {
  await prisma.$connect();
  const m = await prisma.merchant.create({
    data: {
      businessName: 'Test Store',
      ownerName: 'Tester',
      ownerPhone: '2340000000000',
      ownerEmail: `test-${randomUUID()}@shopbot.local`,
      passwordHash: 'x',
      maxDiscountPercent: 30,
    },
  });
  merchantId = m.id;
});

afterAll(async () => {
  await prisma.merchant.delete({ where: { id: merchantId } });
  await prisma.$disconnect();
});

describe('stock reservation', () => {
  it('never oversells the last item when several customers check out at once', async () => {
    const variant = await newVariant(1);
    const buyers = await Promise.all(Array.from({ length: 5 }, () => newBuyer(variant.id)));

    const results = await Promise.allSettled(buyers.map((b) => orders.checkout(merchantId, b.conversation.id)));

    const won = results.filter((r) => r.status === 'fulfilled');
    const lost = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[];
    expect(won).toHaveLength(1);
    expect(lost).toHaveLength(4);
    for (const l of lost) expect((l.reason as OrderError).code).toBe('OUT_OF_STOCK');

    const v = await stockOf(variant.id);
    expect(v.reserved).toBe(1);
    expect(v.stock).toBe(1);
  });

  it('refuses to add more than is available to the cart', async () => {
    const variant = await newVariant(2);
    await expect(newBuyer(variant.id, 3)).rejects.toMatchObject({ code: 'OUT_OF_STOCK' });
  });
});

describe('payment confirmation', () => {
  it('marks paid once, commits stock once, and ignores a repeated webhook', async () => {
    const variant = await newVariant(3);
    const { conversation } = await newBuyer(variant.id, 2);
    const { order } = await orders.checkout(merchantId, conversation.id);

    expect((await stockOf(variant.id)).reserved).toBe(2);

    const first = await orders.markPaid(order.id, order.totalKobo);
    const second = await orders.markPaid(order.id, order.totalKobo);
    expect(first).toMatchObject({ status: 'paid', oversold: false });
    expect(second.status).toBe('already_paid');

    const v = await stockOf(variant.id);
    expect(v).toMatchObject({ stock: 1, reserved: 0 });
  });

  it('rejects a payment smaller than the order total', async () => {
    const variant = await newVariant(1);
    const { conversation } = await newBuyer(variant.id);
    const { order } = await orders.checkout(merchantId, conversation.id);

    const res = await orders.markPaid(order.id, order.totalKobo - 100);
    expect(res.status).toBe('amount_mismatch');
    const o = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(o.status).toBe('AWAITING_PAYMENT');
  });
});

describe('expiry', () => {
  it('releases stock for unpaid orders, and still honours a late payment', async () => {
    const variant = await newVariant(1);
    const { conversation } = await newBuyer(variant.id);
    const { order } = await orders.checkout(merchantId, conversation.id);

    const expired = await orders.expireStale(new Date(Date.now() + 31 * 60_000));
    expect(expired).toBeGreaterThanOrEqual(1);
    expect(await stockOf(variant.id)).toMatchObject({ stock: 1, reserved: 0 });

    // The customer pays after expiry while the item is still free: order is honoured.
    const res = await orders.markPaid(order.id, order.totalKobo);
    expect(res).toMatchObject({ status: 'paid', oversold: false });
    expect(await stockOf(variant.id)).toMatchObject({ stock: 0, reserved: 0 });
  });

  it('flags oversold when a late payment arrives after someone else bought the item', async () => {
    const variant = await newVariant(1);
    const a = await newBuyer(variant.id);
    const { order: orderA } = await orders.checkout(merchantId, a.conversation.id);
    await orders.expireStale(new Date(Date.now() + 31 * 60_000));

    const b = await newBuyer(variant.id);
    const { order: orderB } = await orders.checkout(merchantId, b.conversation.id);
    await orders.markPaid(orderB.id, orderB.totalKobo);

    const late = await orders.markPaid(orderA.id, orderA.totalKobo);
    expect(late).toMatchObject({ status: 'paid', oversold: true });
    const v = await stockOf(variant.id);
    expect(v.stock).toBeGreaterThanOrEqual(0);
  });
});

describe('pricing is decided by the server', () => {
  it('uses list price without a deal, and the agreed price after one, never below the floor', async () => {
    const variant = await newVariant(5, 20000, 15000);

    const plain = await newBuyer(variant.id);
    const plainCart = await orders.summary((await orders.getOrCreateDraft(merchantId, plain.customer.id, plain.conversation.id)).id);
    expect(plainCart!.items[0]!.unitPriceKobo).toBe(naira(20000));

    const haggler = await newBuyer(variant.id);
    const counter = await negotiation.submitOffer(merchantId, haggler.conversation.id, variant.id, naira(12000));
    expect(counter).toMatchObject({ decision: 'counter', priceKobo: naira(18000) });
    const deal = await negotiation.submitOffer(merchantId, haggler.conversation.id, variant.id, naira(18000));
    expect(deal).toMatchObject({ decision: 'accept', priceKobo: naira(18000) });

    const cart = await orders.setItem(merchantId, haggler.customer.id, haggler.conversation.id, variant.id, 1);
    expect(cart!.items[0]!.unitPriceKobo).toBe(naira(18000));
    expect(cart!.items[0]!.unitPriceKobo).toBeGreaterThanOrEqual(naira(15000));
  });

  it('locks in the quoted price only when the customer accepts it', async () => {
    const variant = await newVariant(5, 20000, 15000);
    const buyer = await newBuyer(variant.id);

    expect(await negotiation.acceptQuoted(buyer.conversation.id, variant.id)).toBeNull(); // nothing quoted yet

    await negotiation.submitOffer(merchantId, buyer.conversation.id, variant.id, naira(12000)); // we quote 18,000
    expect(await negotiation.pendingQuote(buyer.conversation.id, variant.id)).toBe(naira(18000));
    // not accepted yet: cart still uses list price, never the unaccepted quote
    expect(await negotiation.priceFor(buyer.conversation.id, variant.id, naira(20000))).toBe(naira(20000));

    expect(await negotiation.acceptQuoted(buyer.conversation.id, variant.id)).toBe(naira(18000));
    expect(await negotiation.priceFor(buyer.conversation.id, variant.id, naira(20000))).toBe(naira(18000));

    // re-haggling afterwards cannot knock the deal back to list price
    await negotiation.submitOffer(merchantId, buyer.conversation.id, variant.id, naira(5000));
    expect(await negotiation.priceFor(buyer.conversation.id, variant.id, naira(20000))).toBe(naira(18000));
  });
});
