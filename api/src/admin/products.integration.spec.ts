import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service.js';
import { LocalStorage } from '../storage/local.storage.js';
import { MAX_IMAGES_PER_PRODUCT, ProductsAdminService, productPatch, variantInput } from './products.service.js';

// Real Postgres + real image processing + real files on disk. Each run uses two throwaway shops.
const prisma = new PrismaService();
const storage = new LocalStorage();
const svc = new ProductsAdminService(prisma, storage);

let shopA: string;
let shopB: string;

const makeShop = async (name: string) =>
  (
    await prisma.merchant.create({
      data: { businessName: name, ownerName: 'T', ownerPhone: '2340000000000', ownerEmail: `p-${randomUUID()}@shopbot.local`, passwordHash: 'x' },
    })
  ).id;

const photo = (w = 800, h = 600, color = { r: 200, g: 30, b: 30 }) =>
  sharp({ create: { width: w, height: h, channels: 3, background: color } }).jpeg().toBuffer();

const expectNotFound = (p: Promise<unknown>) => expect(p).rejects.toMatchObject({ status: 404 });

beforeAll(async () => {
  await prisma.$connect();
  shopA = await makeShop('Shop A');
  shopB = await makeShop('Shop B');
});

afterAll(async () => {
  await prisma.merchant.deleteMany({ where: { id: { in: [shopA, shopB] } } });
  for (const id of [shopA, shopB]) await rm(resolve('storage', 'products', id), { recursive: true, force: true });
  await prisma.$disconnect();
});

describe('input rules', () => {
  const ok = { price: 18000, minPrice: 14000, stock: 3 };

  it('accepts a sensible size option and rejects nonsense', () => {
    expect(variantInput.safeParse({ ...ok, size: 'M' }).success).toBe(true);
    expect(variantInput.safeParse({ ...ok, minPrice: 20000 }).success).toBe(false); // lowest price above selling price
    expect(variantInput.safeParse({ ...ok, price: 0 }).success).toBe(false);
    expect(variantInput.safeParse({ ...ok, price: -5 }).success).toBe(false);
    expect(variantInput.safeParse({ ...ok, stock: -1 }).success).toBe(false);
    expect(variantInput.safeParse({ ...ok, stock: 1.5 }).success).toBe(false);
    expect(variantInput.safeParse({ ...ok, price: '18000' }).success).toBe(false); // a string is not a number
    expect(variantInput.safeParse({ ...ok, size: 'x'.repeat(50) }).success).toBe(false);
  });

  it('rejects an unknown category and an empty name', () => {
    expect(productPatch.safeParse({ category: 'WEAPONS' }).success).toBe(false);
    expect(productPatch.safeParse({ name: '   ' }).success).toBe(false);
    expect(productPatch.safeParse({ name: 'Arsenal', category: 'JERSEY' }).success).toBe(true);
  });
});

describe('products and size options', () => {
  it('creates a product with size options, and shows prices in naira', async () => {
    const p = await svc.create(shopA, { name: 'Arsenal Home Jersey', category: 'JERSEY', description: '  Red fan version ', attributes: { club: 'Arsenal' } });
    expect(p).toMatchObject({ name: 'Arsenal Home Jersey', description: 'Red fan version', active: true, variants: [], images: [] });

    const withSize = await svc.addVariant(shopA, p.id, { size: 'M', price: 18000, minPrice: 14000, stock: 3 });
    expect(withSize.variants[0]).toMatchObject({ size: 'M', price: 18000, minPrice: 14000, stock: 3, reserved: 0, available: 3 });
    expect(withSize.totalAvailable).toBe(3);

    const v = await prisma.variant.findFirstOrThrow({ where: { productId: p.id } });
    expect(v.priceKobo).toBe(1_800_000); // stored in kobo
  });

  it('lists, searches and archives', async () => {
    const p = await svc.create(shopA, { name: 'Nike Air Force Special', category: 'SHOES' });
    expect((await svc.list(shopA, { q: 'air force' })).map((x) => x.id)).toContain(p.id);
    expect((await svc.list(shopA, { q: 'zzz-nothing' }))).toHaveLength(0);
    await svc.update(shopA, p.id, { active: false });
    expect((await svc.list(shopA, { active: true })).map((x) => x.id)).not.toContain(p.id);
    expect((await svc.list(shopA, { active: false })).map((x) => x.id)).toContain(p.id);
  });

  it('refuses to push the selling price below the lowest price', async () => {
    const p = await svc.create(shopA, { name: 'Price Test', category: 'CLOTHES' });
    const withSize = await svc.addVariant(shopA, p.id, { size: 'L', price: 10000, minPrice: 8000, stock: 1 });
    const id = withSize.variants[0]!.id;
    await expect(svc.updateVariant(shopA, id, { price: 7000 })).rejects.toMatchObject({ status: 400 }); // would sit below the 8,000 floor
    const ok = await svc.updateVariant(shopA, id, { price: 9000, minPrice: 8500 });
    expect(ok.variants[0]).toMatchObject({ price: 9000, minPrice: 8500 });
  });

  it('will not set stock below what unpaid customers are holding', async () => {
    const p = await svc.create(shopA, { name: 'Stock Test', category: 'SHOES' });
    const id = (await svc.addVariant(shopA, p.id, { size: '42', price: 10000, minPrice: 9000, stock: 5 })).variants[0]!.id;
    await prisma.variant.update({ where: { id }, data: { reserved: 3 } }); // three units held in unpaid orders

    await expect(svc.setStock(shopA, id, 2)).rejects.toMatchObject({ status: 409 });
    expect((await prisma.variant.findUniqueOrThrow({ where: { id } })).stock).toBe(5); // unchanged
    await svc.setStock(shopA, id, 3); // exactly what is held is fine
    await svc.updateVariant(shopA, id, { stock: 8 });
    expect((await prisma.variant.findUniqueOrThrow({ where: { id } })).stock).toBe(8);
  });

  it('will not delete a size option that has been ordered, but deletes an unused one', async () => {
    const p = await svc.create(shopA, { name: 'Delete Test', category: 'CLOTHES' });
    const used = (await svc.addVariant(shopA, p.id, { size: 'S', price: 5000, minPrice: 4000, stock: 2 })).variants[0]!.id;
    const unused = (await svc.addVariant(shopA, p.id, { size: 'M', price: 5000, minPrice: 4000, stock: 2 })).variants.find((v) => v.id !== used)!.id;

    const customer = await prisma.customer.create({ data: { merchantId: shopA, phone: '2348000000001' } });
    const conversation = await prisma.conversation.create({ data: { merchantId: shopA, customerId: customer.id, chatId: '2348000000001' } });
    const order = await prisma.order.create({ data: { merchantId: shopA, customerId: customer.id, conversationId: conversation.id, orderNumber: `T-${randomUUID().slice(0, 6)}` } });
    await prisma.orderItem.create({ data: { orderId: order.id, variantId: used, quantity: 1, listPriceKobo: 500000, unitPriceKobo: 500000 } });

    await expect(svc.deleteVariant(shopA, used)).rejects.toMatchObject({ status: 409 });
    const after = await svc.deleteVariant(shopA, unused);
    expect(after.variants.map((v) => v.id)).toEqual([used]);
  });
});

describe('product photos', () => {
  async function newProduct() {
    return svc.create(shopA, { name: `Photo Test ${randomUUID().slice(0, 4)}`, category: 'JERSEY' });
  }

  it('stores a resized, cleaned picture and serves it back, only to its own shop', async () => {
    const p = await newProduct();
    const { results, product } = await svc.addImages(shopA, p.id, [{ buffer: await photo(3000, 2000), originalname: 'IMG_2231.JPG' }], 'Red');
    expect(results).toEqual([{ name: 'IMG_2231.JPG', ok: true, imageId: expect.any(String) }]);
    expect(product.images).toHaveLength(1);
    expect(product.images[0]).toMatchObject({ color: 'Red', position: 0 });
    expect(product.mainImageId).toBe(product.images[0]!.id);

    const bytes = await svc.readImage(shopA, product.images[0]!.id);
    const meta = await sharp(bytes).metadata();
    expect(meta.format).toBe('jpeg');
    expect(Math.max(meta.width!, meta.height!)).toBe(1280); // shrunk from 3000px
    expect(bytes.length).toBeLessThan(300 * 1024);
  });

  it('accepts the good pictures and reports the bad one, rather than losing everything', async () => {
    const p = await newProduct();
    const { results, product } = await svc.addImages(shopA, p.id, [
      { buffer: await photo(), originalname: 'front.jpg' },
      { buffer: Buffer.from('MZ pretend this is back.jpg'), originalname: 'back.jpg' },
      { buffer: Buffer.from('%PDF-1.4 not a photo at all padding'), originalname: 'sizes.pdf' },
      { buffer: await photo(400, 400, { r: 0, g: 0, b: 200 }), originalname: 'side.png' },
    ]);
    expect(results.map((r) => r.ok)).toEqual([true, false, false, true]);
    expect(results[1]!.error).toContain('JPG, PNG or WebP');
    expect(product.images).toHaveLength(2);
  });

  it(`stops at ${MAX_IMAGES_PER_PRODUCT} pictures per product`, async () => {
    const p = await newProduct();
    const buf = await photo(100, 100);
    const { results, product } = await svc.addImages(shopA, p.id, Array.from({ length: MAX_IMAGES_PER_PRODUCT + 2 }, (_, i) => ({ buffer: buf, originalname: `${i}.jpg` })));
    expect(product.images).toHaveLength(MAX_IMAGES_PER_PRODUCT);
    expect(results.filter((r) => !r.ok)).toHaveLength(2);
    expect(results.at(-1)!.error).toContain('at most');
  }, 60_000);

  it('reorders pictures, tags a colour, and deleting removes the file too', async () => {
    const p = await newProduct();
    const { product } = await svc.addImages(shopA, p.id, [
      { buffer: await photo(100, 100, { r: 1, g: 1, b: 1 }) },
      { buffer: await photo(100, 100, { r: 2, g: 2, b: 2 }) },
      { buffer: await photo(100, 100, { r: 3, g: 3, b: 3 }) },
    ]);
    const [a, b, c] = product.images.map((i) => i.id) as [string, string, string];

    const reordered = await svc.reorderImages(shopA, p.id, [c, a]); // b is not mentioned: it goes last
    expect(reordered.images.map((i) => i.id)).toEqual([c, a, b]);
    expect(reordered.mainImageId).toBe(c);

    const tagged = await svc.updateImage(shopA, a, { color: 'Black' });
    expect(tagged.images.find((i) => i.id === a)!.color).toBe('Black');

    const key = (await prisma.productImage.findUniqueOrThrow({ where: { id: b } })).key;
    expect(await storage.get(key)).not.toBeNull();
    await svc.deleteImage(shopA, b);
    expect(await storage.get(key)).toBeNull(); // the file is gone, not just the row
    await expectNotFound(svc.readImage(shopA, b));
  });

  it('ignores ids from other products when reordering', async () => {
    const p = await newProduct();
    const other = await newProduct();
    const mine = (await svc.addImages(shopA, p.id, [{ buffer: await photo(50, 50) }])).product.images[0]!.id;
    const theirs = (await svc.addImages(shopA, other.id, [{ buffer: await photo(50, 50) }])).product.images[0]!.id;
    const result = await svc.reorderImages(shopA, p.id, [theirs, mine]);
    expect(result.images.map((i) => i.id)).toEqual([mine]);
    expect((await prisma.productImage.findUniqueOrThrow({ where: { id: theirs } })).productId).toBe(other.id); // untouched
  });
});

describe('one shop can never reach another shop\'s catalog', () => {
  it('treats every operation on someone else\'s data as "not found"', async () => {
    const p = await svc.create(shopA, { name: 'Private Jersey', category: 'JERSEY' });
    const withSize = await svc.addVariant(shopA, p.id, { size: 'M', price: 9000, minPrice: 7000, stock: 4 });
    const variantId = withSize.variants[0]!.id;
    const withPhoto = await svc.addImages(shopA, p.id, [{ buffer: await photo(60, 60) }]);
    const imageId = withPhoto.product.images[0]!.id;

    // shop B tries everything against shop A's ids
    await expectNotFound(svc.get(shopB, p.id));
    await expectNotFound(svc.update(shopB, p.id, { name: 'Hacked' }));
    await expectNotFound(svc.addVariant(shopB, p.id, { size: 'X', price: 1, minPrice: 1, stock: 1 }));
    await expectNotFound(svc.updateVariant(shopB, variantId, { price: 1, minPrice: 1 }));
    await expectNotFound(svc.setStock(shopB, variantId, 999));
    await expectNotFound(svc.deleteVariant(shopB, variantId));
    await expectNotFound(svc.addImages(shopB, p.id, [{ buffer: await photo(60, 60) }]));
    await expectNotFound(svc.readImage(shopB, imageId));
    await expectNotFound(svc.updateImage(shopB, imageId, { color: 'Hacked' }));
    await expectNotFound(svc.deleteImage(shopB, imageId));
    await expectNotFound(svc.reorderImages(shopB, p.id, [imageId]));
    expect((await svc.list(shopB)).map((x) => x.id)).not.toContain(p.id);

    // and nothing of shop A's changed
    const after = await svc.get(shopA, p.id);
    expect(after.name).toBe('Private Jersey');
    expect(after.variants[0]).toMatchObject({ price: 9000, stock: 4 });
    expect(after.images).toHaveLength(1);
    expect((await svc.readImage(shopA, imageId)).length).toBeGreaterThan(0);
  });
});
