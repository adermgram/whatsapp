import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createHmac, randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PrismaService } from '../prisma/prisma.service.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { NegotiationService } from '../negotiation/negotiation.service.js';
import { OrdersService } from '../orders/orders.service.js';
import { FakePaymentProvider } from './fake-payment.provider.js';
import { PaystackProvider } from './paystack.provider.js';
import { PaymentConfirmationService } from './payment-confirmation.service.js';
import { PaymentJobs } from './payment.jobs.js';
import { ReceiptService } from '../receipts/receipt.service.js';
import { LocalStorage } from '../storage/local.storage.js';
import { SimulatorGateway } from '../messaging/simulator.gateway.js';
import { LogOwnerNotifier } from '../handoff/owner-notifier.js';
import { HandoffService } from '../handoff/handoff.service.js';

const prisma = new PrismaService();
const fake = new FakePaymentProvider();
const gateway = new SimulatorGateway();
const notifier = new LogOwnerNotifier();
const orders = new OrdersService(prisma, new InventoryService(), new NegotiationService(prisma), fake);
const confirmation = new PaymentConfirmationService(
  prisma,
  orders,
  fake,
  new ReceiptService(prisma, new LocalStorage()),
  gateway,
  notifier,
  new HandoffService(prisma, notifier),
);
const jobs = new PaymentJobs(prisma, orders, confirmation);

const naira = (n: number) => n * 100;
let merchantId: string;
let otherMerchantId: string;

async function makeMerchant(name: string) {
  const m = await prisma.merchant.create({
    data: {
      businessName: name,
      ownerName: 'Tester',
      ownerPhone: '2340000000000',
      ownerEmail: `test-${randomUUID()}@shopbot.local`,
      passwordHash: 'x',
    },
  });
  return m.id;
}

/** A buyer with an order at AWAITING_PAYMENT. Returns what the tests need. */
async function awaitingOrder(mid = merchantId, stock = 3, qty = 1) {
  const product = await prisma.product.create({
    data: {
      merchantId: mid,
      name: 'Test Jersey',
      category: 'JERSEY',
      imageKeys: [],
      variants: { create: [{ merchantId: mid, size: 'M', priceKobo: naira(20000), minPriceKobo: naira(15000), stock }] },
    },
    include: { variants: true },
  });
  const variant = product.variants[0]!;
  const customer = await prisma.customer.create({
    data: { merchantId: mid, phone: `234${Math.floor(Math.random() * 1e9)}`, name: 'Ada Obi', address: '1 Test Street, Ikeja, Lagos' },
  });
  const conversation = await prisma.conversation.create({ data: { merchantId: mid, customerId: customer.id, chatId: customer.phone } });
  await orders.setItem(mid, customer.id, conversation.id, variant.id, qty);
  const { order, reference } = await orders.checkout(mid, conversation.id);
  return { order, reference, variant, customer, conversation };
}

const sentTo = (chatId: string) => gateway.sent.filter((s) => s.chatId === chatId);

beforeAll(async () => {
  await prisma.$connect();
  merchantId = await makeMerchant('Test Store');
  otherMerchantId = await makeMerchant('Other Store');
});

afterAll(async () => {
  await prisma.merchant.deleteMany({ where: { id: { in: [merchantId, otherMerchantId] } } });
  await rm(resolve('storage', 'receipts', merchantId), { recursive: true, force: true });
  await prisma.$disconnect();
});

describe('confirming a payment', () => {
  it('marks the order paid, commits stock, and sends one receipt PDF to the customer', async () => {
    const { order, reference, variant, customer } = await awaitingOrder();
    fake.markPaid(reference, order.totalKobo);

    expect(await confirmation.confirm({ merchantId, reference })).toBe('paid');

    const o = await prisma.order.findUniqueOrThrow({ where: { id: order.id }, include: { receipt: true } });
    expect(o.status).toBe('PAID');
    expect(o.receipt?.number).toMatch(/^RCP-\d{6}$/);
    expect(o.receipt?.sentAt).not.toBeNull();

    const v = await prisma.variant.findUniqueOrThrow({ where: { id: variant.id } });
    expect(v).toMatchObject({ stock: 2, reserved: 0 });

    const sent = sentTo(customer.phone);
    expect(sent.filter((s) => s.kind === 'document')).toHaveLength(1);
    expect(sent.find((s) => s.kind === 'document')).toMatchObject({ fileName: `${o.receipt!.number}.pdf` });
    expect(sent.find((s) => s.kind === 'text')?.text).toContain(order.orderNumber);
    expect(notifier.alerts).toContainEqual(expect.objectContaining({ type: 'payment', orderNumber: order.orderNumber }));
  });

  it('sends the receipt exactly once when the webhook and the reconciler race', async () => {
    const { order, reference, customer } = await awaitingOrder();
    fake.markPaid(reference, order.totalKobo);

    const results = await Promise.all([
      confirmation.confirm({ merchantId, reference }),
      confirmation.confirm({ merchantId, reference }),
      confirmation.confirm({ merchantId, reference }),
    ]);

    expect(results.filter((r) => r === 'paid')).toHaveLength(1);
    expect(sentTo(customer.phone).filter((s) => s.kind === 'document')).toHaveLength(1);
    const o = await prisma.order.findUniqueOrThrow({ where: { id: order.id }, include: { items: true } });
    const v = await prisma.variant.findUniqueOrThrow({ where: { id: o.items[0]!.variantId } });
    expect(v.stock).toBe(2); // stock committed once, not three times
  });

  it('numbers receipts sequentially per merchant', async () => {
    const a = await awaitingOrder();
    const b = await awaitingOrder();
    fake.markPaid(a.reference, a.order.totalKobo);
    fake.markPaid(b.reference, b.order.totalKobo);
    await confirmation.confirm({ merchantId, reference: a.reference });
    await confirmation.confirm({ merchantId, reference: b.reference });
    const nums = (
      await prisma.receipt.findMany({ where: { orderId: { in: [a.order.id, b.order.id] } } })
    ).map((r) => Number(r.number.slice(4)));
    expect(new Set(nums).size).toBe(2);
  });

  it('does nothing when the provider says the customer has not paid', async () => {
    const { order, reference, customer } = await awaitingOrder();
    expect(await confirmation.confirm({ merchantId, reference })).toBe('not_paid');
    expect((await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status).toBe('AWAITING_PAYMENT');
    expect(sentTo(customer.phone)).toHaveLength(0);
  });

  it('refuses a payment smaller than the order total and alerts the owner', async () => {
    const { order, reference, customer } = await awaitingOrder();
    fake.markPaid(reference, order.totalKobo - 5000);

    expect(await confirmation.confirm({ merchantId, reference })).toBe('amount_mismatch');
    expect((await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status).toBe('AWAITING_PAYMENT');
    expect(await prisma.receipt.findUnique({ where: { orderId: order.id } })).toBeNull();
    expect(sentTo(customer.phone)).toHaveLength(0);
    expect(notifier.alerts).toContainEqual(
      expect.objectContaining({ type: 'payment', orderNumber: order.orderNumber, problem: expect.stringContaining('order total') }),
    );
  });

  it('ignores a reference that belongs to another merchant or does not exist', async () => {
    const { order, reference } = await awaitingOrder();
    fake.markPaid(reference, order.totalKobo);
    expect(await confirmation.confirm({ merchantId: otherMerchantId, reference })).toBe('unknown_reference');
    expect(await confirmation.confirm({ merchantId, reference: 'does-not-exist' })).toBe('unknown_reference');
    expect((await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status).toBe('AWAITING_PAYMENT');
  });

  it('tells the customer and the owner when a paid order turns out to be oversold', async () => {
    const a = await awaitingOrder(merchantId, 1);
    await orders.expireStale(new Date(Date.now() + 31 * 60_000), merchantId); // a's reservation lapses
    // someone else takes the last unit
    const b = await (async () => {
      const customer = await prisma.customer.create({ data: { merchantId, phone: `234${Math.floor(Math.random() * 1e9)}`, name: 'Bayo', address: '2 Other Street, Yaba, Lagos' } });
      const conversation = await prisma.conversation.create({ data: { merchantId, customerId: customer.id, chatId: customer.phone } });
      await orders.setItem(merchantId, customer.id, conversation.id, a.variant.id, 1);
      return { ...(await orders.checkout(merchantId, conversation.id)), customer };
    })();
    fake.markPaid(b.reference, b.order.totalKobo);
    await confirmation.confirm({ merchantId, reference: b.reference });

    fake.markPaid(a.reference, a.order.totalKobo); // a pays late, item gone
    expect(await confirmation.confirm({ merchantId, reference: a.reference })).toBe('paid');

    expect(sentTo(a.customer.phone).some((s) => /sold out/i.test(s.text ?? ''))).toBe(true);
    expect(sentTo(a.customer.phone).filter((s) => s.kind === 'document')).toHaveLength(0);
    expect(notifier.alerts).toContainEqual(expect.objectContaining({ type: 'payment', problem: expect.stringContaining('OVERSOLD') }));
    const conv = await prisma.conversation.findUniqueOrThrow({ where: { id: a.conversation.id } });
    expect(conv.mode).toBe('HUMAN');
  });
});

describe('reconciler (missed webhooks)', () => {
  it('finds a paid order whose webhook never arrived and completes it', async () => {
    const { order, reference, customer } = await awaitingOrder();
    fake.markPaid(reference, order.totalKobo); // customer paid, but no webhook was delivered

    await jobs.reconcile(merchantId); // only this test's store, never real shops

    expect((await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status).toBe('PAID');
    expect(sentTo(customer.phone).filter((s) => s.kind === 'document')).toHaveLength(1);
  });
});

describe('Paystack webhook signature', () => {
  const provider = new PaystackProvider();
  const secret = 'sk_test_example';
  const body = Buffer.from(JSON.stringify({ event: 'charge.success', data: { reference: 'abc', amount: 1000 } }));
  const sign = (b: Buffer, key = secret) => createHmac('sha512', key).update(b).digest('hex');

  it('accepts a correct HMAC-SHA512 of the raw body', () => {
    expect(provider.isValidSignature(secret, body, sign(body))).toBe(true);
  });

  it('rejects a forged signature, a tampered body, the wrong key, and a missing header', () => {
    expect(provider.isValidSignature(secret, body, sign(body, 'sk_test_other'))).toBe(false);
    expect(provider.isValidSignature(secret, Buffer.from(body.toString().replace('1000', '9999')), sign(body))).toBe(false);
    expect(provider.isValidSignature(secret, body, 'deadbeef')).toBe(false);
    expect(provider.isValidSignature(secret, body, undefined)).toBe(false);
    expect(provider.isValidSignature(null, body, sign(body))).toBe(false);
  });
});
