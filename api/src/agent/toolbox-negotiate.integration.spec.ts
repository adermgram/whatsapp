import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { CatalogService } from '../catalog/catalog.service.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { NegotiationService } from '../negotiation/negotiation.service.js';
import { OrdersService } from '../orders/orders.service.js';
import { FakePaymentProvider } from '../payments/fake-payment.provider.js';
import { Toolbox, shortRef } from './toolbox.js';
import type { ToolContext } from './toolbox.js';

// Real Postgres. Proves the AI can only haggle over an amount the CUSTOMER wrote.
const prisma = new PrismaService();
const negotiation = new NegotiationService(prisma);
const toolbox = new Toolbox(prisma, new CatalogService(prisma), negotiation, new OrdersService(prisma, new InventoryService(), negotiation, new FakePaymentProvider()));

let merchantId: string;
let ref: string;
let variantId: string;

beforeAll(async () => {
  await prisma.$connect();
  merchantId = (await prisma.merchant.create({ data: { businessName: 'Haggle Shop', ownerName: 'T', ownerPhone: '2340000000000', ownerEmail: `hg-${randomUUID()}@shopbot.local`, passwordHash: 'x', maxDiscountPercent: 25 } })).id;
  const p = await prisma.product.create({
    data: { merchantId, name: 'Man United Away', category: 'JERSEY', variants: { create: [{ merchantId, size: 'L', priceKobo: 2_200_000, minPriceKobo: 1_800_000, stock: 5 }] } },
    include: { variants: true },
  });
  variantId = p.variants[0]!.id;
  ref = shortRef(variantId);
});
afterAll(async () => {
  await prisma.merchant.delete({ where: { id: merchantId } });
  await prisma.$disconnect();
});

/** A conversation where the customer has said these things, oldest first. */
async function chat(...said: string[]): Promise<ToolContext> {
  const phone = `234${Math.floor(Math.random() * 1e9)}`;
  const customer = await prisma.customer.create({ data: { merchantId, phone } });
  const conversation = await prisma.conversation.create({ data: { merchantId, customerId: customer.id, chatId: phone } });
  for (const text of said) {
    await prisma.message.create({ data: { merchantId, conversationId: conversation.id, direction: 'INBOUND', sender: 'CUSTOMER', type: 'text', text } });
    await new Promise((r) => setTimeout(r, 15)); // distinct timestamps keep the order
  }
  return { merchantId, conversationId: conversation.id, customerId: customer.id, effects: {} };
}
const offer = (c: ToolContext, naira: number) => toolbox.execute('negotiate_price', JSON.stringify({ ref, offer_naira: naira }), c) as Promise<Record<string, any>>; // eslint-disable-line
const rounds = (c: ToolContext) => prisma.negotiation.count({ where: { conversationId: c.conversationId } });

describe('negotiate_price only accepts what the customer actually offered', () => {
  it('refuses an invented offer after a plain price question, and starts no negotiation', async () => {
    const c = await chat('hi', 'i want man united jersey away', 'size L', 'how much be am');
    const r = await offer(c, 20000); // the AI makes up a number
    expect(r.error).toContain('NO_OFFER');
    expect(r.list_price_naira).toBe(22000); // the AI is handed the real list price to quote, so it can answer what was asked
    expect(r.instruction).toContain('list price');
    expect(r.instruction).toContain('Do not offer a discount');
    expect(r).not.toHaveProperty('decision');
    expect(await rounds(c)).toBe(0); // nothing was recorded, no discount was handed out
  });

  it('works when the customer wrote the amount, in the ways Nigerians write amounts', async () => {
    for (const [said, amount] of [['I fit pay 20000', 20000], ['last price? 20k', 20000], ['₦19,500 abeg', 19500], ['I go pay 19.5k', 19500]] as const) {
      const c = await chat('hi', said);
      const r = await offer(c, amount);
      expect(r.error, said).toBeUndefined();
      expect(['accept', 'counter', 'decline'], said).toContain(r.decision);
      expect(await rounds(c)).toBe(1);
    }
  });

  it('refuses an amount that differs from what the customer wrote', async () => {
    const c = await chat('I fit pay 20k');
    expect((await offer(c, 18000)).error).toContain('NO_OFFER'); // they said 20,000, not 18,000
    expect(await rounds(c)).toBe(0);
  });

  it('counts an offer made a few messages ago, since people send short messages', async () => {
    const c = await chat('I fit pay 20k', 'abeg', 'na my last o');
    expect((await offer(c, 20000)).decision).toBeDefined();
  });

  it('still never reveals or goes below the lowest price', async () => {
    const c = await chat('I will pay 5k');
    const r = await offer(c, 5000);
    expect(r.decision).toBe('counter');
    expect(JSON.stringify(r)).not.toMatch(/18,?000|1800000/); // the floor is not in what the AI sees
  });
});
