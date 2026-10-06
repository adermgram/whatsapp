import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { SimulatorGateway } from '../messaging/simulator.gateway.js';
import { OrdersService } from '../orders/orders.service.js';
import { FakePaymentProvider } from '../payments/fake-payment.provider.js';

// Boots the real HTTP server and drives the Paystack webhook endpoint over the network.
// Uses the fake payment driver, so signature checking itself is covered by unit tests, not here.
const PORT = 3999;
const base = `http://localhost:${PORT}`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const failures: string[] = [];
const check = (ok: boolean, what: string) => {
  console.log(`${ok ? '✓' : '✗'} ${what}`);
  if (!ok) failures.push(what);
};

const app = await NestFactory.create(AppModule, { rawBody: true, logger: ['error', 'warn'] });
await app.listen(PORT);
const prisma = app.get(PrismaService);
const gateway = app.get(SimulatorGateway);
const orders = app.get(OrdersService);
const fake = app.get(FakePaymentProvider);

const merchant = await prisma.merchant.create({
  data: { businessName: 'E2E Store', ownerName: 'E2E', ownerPhone: '2340000000000', ownerEmail: `e2e-${randomUUID()}@shopbot.local`, passwordHash: 'x' },
});
try {
  const product = await prisma.product.create({
    data: { merchantId: merchant.id, name: 'E2E Jersey', category: 'JERSEY', imageKeys: [], variants: { create: [{ merchantId: merchant.id, size: 'L', priceKobo: 1500000, minPriceKobo: 1200000, stock: 5 }] } },
    include: { variants: true },
  });
  const customer = await prisma.customer.create({ data: { merchantId: merchant.id, phone: '2348099887766', name: 'Ife Ade', address: '9 Test Road, Surulere, Lagos' } });
  const conv = await prisma.conversation.create({ data: { merchantId: merchant.id, customerId: customer.id, chatId: customer.phone } });
  await orders.setItem(merchant.id, customer.id, conv.id, product.variants[0]!.id, 1);
  const { order, reference } = await orders.checkout(merchant.id, conv.id);
  fake.markPaid(reference, order.totalKobo);

  const post = (merchantId: string, body: unknown) =>
    fetch(`${base}/webhooks/paystack/${merchantId}`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-paystack-signature': 'ignored-by-fake-driver' }, body: JSON.stringify(body) });
  const event = { event: 'charge.success', data: { reference, amount: order.totalKobo, status: 'success' } };

  const r1 = await post(merchant.id, event);
  check(r1.status === 200, `webhook answers 200 immediately (got ${r1.status})`);

  let status = '';
  for (let i = 0; i < 40 && status !== 'PAID'; i++) {
    await sleep(500);
    status = (await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status;
  }
  check(status === 'PAID', `order became PAID via the webhook (status ${status})`);

  await sleep(1500);
  const docs = () => gateway.sent.filter((s) => s.chatId === customer.phone && s.kind === 'document');
  check(docs().length === 1, `exactly one receipt PDF sent to the customer (${docs().length})`);

  const r2 = await post(merchant.id, event);
  await sleep(2500);
  check(r2.status === 200 && docs().length === 1, 'a repeated webhook is accepted and sends no second receipt');

  const r3 = await post(randomUUID(), event);
  check(r3.status === 404, `unknown merchant gets 404 (got ${r3.status})`);

  const r4 = await post(merchant.id, { event: 'transfer.success', data: { reference } });
  check(r4.status === 200, 'unrelated event types are acknowledged and ignored');

  const v = await prisma.variant.findUniqueOrThrow({ where: { id: product.variants[0]!.id } });
  check(v.stock === 4 && v.reserved === 0, `stock committed once (stock ${v.stock}, reserved ${v.reserved})`);
} finally {
  await prisma.merchant.delete({ where: { id: merchant.id } });
  await rm(resolve('storage', 'receipts', merchant.id), { recursive: true, force: true });
  await app.close();
}
console.log(failures.length ? `\n${failures.length} check(s) FAILED` : '\nAll webhook checks passed');
process.exit(failures.length ? 1 : 0);
