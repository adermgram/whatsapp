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

// Real Postgres. Shows exactly what the AI can and cannot make the bot send.
const prisma = new PrismaService();
const negotiation = new NegotiationService(prisma);
const toolbox = new Toolbox(prisma, new CatalogService(prisma), negotiation, new OrdersService(prisma, new InventoryService(), negotiation, new FakePaymentProvider()));

let shopA: string;
let shopB: string;

const makeShop = async (name: string) =>
  (await prisma.merchant.create({ data: { businessName: name, ownerName: 'T', ownerPhone: '2340000000000', ownerEmail: `ph-${randomUUID()}@shopbot.local`, passwordHash: 'x' } })).id;

async function product(merchantId: string, name: string, photos: { color?: string | null }[], variantColor: string | null = null) {
  const p = await prisma.product.create({
    data: { merchantId, name, category: 'JERSEY', variants: { create: [{ merchantId, size: 'M', color: variantColor, priceKobo: 1_800_000, minPriceKobo: 1_437_700, stock: 3 }] } },
    include: { variants: true },
  });
  const ids: string[] = [];
  for (const [i, ph] of photos.entries()) {
    const id = randomUUID();
    await prisma.productImage.create({ data: { id, productId: p.id, merchantId, key: `products/${merchantId}/${id}.jpg`, color: ph.color ?? null, position: i, bytes: 100 } });
    ids.push(id);
  }
  return { ref: shortRef(p.variants[0]!.id), imageIds: ids, productId: p.id };
}

const ctx = (merchantId: string): ToolContext => ({ merchantId, conversationId: randomUUID(), customerId: randomUUID(), effects: {} });
const call = (c: ToolContext, args: object) => toolbox.execute('send_product_photos', JSON.stringify(args), c) as Promise<Record<string, any>>; // eslint-disable-line

beforeAll(async () => {
  await prisma.$connect();
  shopA = await makeShop('Photo Shop A');
  shopB = await makeShop('Photo Shop B');
});
afterAll(async () => {
  await prisma.merchant.deleteMany({ where: { id: { in: [shopA, shopB] } } });
  await prisma.$disconnect();
});

describe('send_product_photos', () => {
  it('queues the main photos of the item, with its name and LIST price, and never the lowest price', async () => {
    const p = await product(shopA, 'Arsenal Home Jersey', [{}, {}, {}]);
    const c = ctx(shopA);
    const r = await call(c, { ref: p.ref });

    expect(r.sent).toBe(2); // two by default
    expect(c.effects.photos).toEqual({ productName: 'Arsenal Home Jersey', caption: 'Arsenal Home Jersey · ₦18,000', imageIds: [p.imageIds[0], p.imageIds[1]] });
    expect(JSON.stringify([r, c.effects])).not.toMatch(/14,?377|1437700|14377/); // the owner's floor never appears
    expect(r.note).toContain('do not describe');
  });

  it('honours how many were asked for, up to three', async () => {
    const p = await product(shopA, 'Count Jersey', [{}, {}, {}, {}]);
    const c = ctx(shopA);
    await call(c, { ref: p.ref, count: 3 });
    expect(c.effects.photos!.imageIds).toHaveLength(3);
  });

  it('prefers photos in the colour the customer wants, and says so honestly when there are none', async () => {
    const p = await product(shopA, 'Colour Jersey', [{ color: 'Red' }, { color: 'Blue' }, { color: 'Blue' }]);
    const blue = ctx(shopA);
    const r1 = await call(blue, { ref: p.ref, colour: 'blue', count: 3 });
    expect(blue.effects.photos!.imageIds).toEqual([p.imageIds[1], p.imageIds[2]]);
    expect(r1.colour_matched).toBe(true);

    const green = ctx(shopA);
    const r2 = await call(green, { ref: p.ref, colour: 'Green' });
    expect(r2.colour_matched).toBe(false);
    expect(r2.note).toContain('no photo specifically in Green');
  });

  it('uses the colour of the size option itself when the customer did not say one', async () => {
    const p = await product(shopA, 'Black Variant', [{ color: 'White' }, { color: 'Black' }], 'Black');
    const c = ctx(shopA);
    await call(c, { ref: p.ref, count: 1 });
    expect(c.effects.photos!.imageIds).toEqual([p.imageIds[1]]);
  });

  it('with no photos uploaded: sends nothing, tells the AI not to describe it, and quietly alerts the owner', async () => {
    const p = await product(shopA, 'Bare Jersey', []);
    const c = ctx(shopA);
    const r = await call(c, { ref: p.ref });
    expect(r.sent).toBe(0);
    expect(r.error).toContain('no photos yet');
    expect(c.effects.photos).toBeUndefined();
    expect(c.effects.notifyReason).toContain('Bare Jersey');
  });

  it('cannot be made to send another shop\'s photos', async () => {
    const theirs = await product(shopB, 'Private Jersey', [{}, {}]);
    const c = ctx(shopA);
    const r = await call(c, { ref: theirs.ref });
    expect(r.error).toContain('Unknown item ref');
    expect(c.effects.photos).toBeUndefined();
  });

  it('rejects nonsense arguments instead of acting on them', async () => {
    const p = await product(shopA, 'Args Jersey', [{}]);
    const c = ctx(shopA);
    expect((await call(c, { ref: p.ref, count: 50 })).error).toContain('Invalid arguments');
    expect((await call(c, { ref: 'zz' })).error).toBeDefined();
    expect(c.effects.photos).toBeUndefined();
  });

  it('stops a customer being flooded with photos', async () => {
    const p = await product(shopA, 'Flood Jersey', [{}, {}, {}, {}]);
    const c = ctx(shopA); // one conversation asking again and again
    expect((await call(c, { ref: p.ref, count: 3 })).sent).toBe(3);
    expect((await call({ ...c, effects: {} }, { ref: p.ref, count: 3 })).sent).toBe(3);
    const third = await call({ ...c, effects: {} }, { ref: p.ref, count: 3 }); // allowance of 6 is used up
    expect(third.sent).toBe(0);
    expect(third.error).toContain('Photo limit');
  });
});

describe('search_catalog tells the AI whether photos exist', () => {
  it('reports a photo count per product', async () => {
    await product(shopA, 'Searchable Photo Jersey', [{}, {}]);
    const r = (await toolbox.execute('search_catalog', JSON.stringify({ query: 'searchable photo jersey' }), ctx(shopA))) as { results: { photos: number }[] };
    expect(r.results[0]!.photos).toBe(2);
  });
});
