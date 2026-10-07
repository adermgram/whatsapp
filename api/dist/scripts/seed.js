import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env } from '../config/env.js';
import { normalizePhone } from '../messaging/reply-policy.js';
const DEMO_EMAIL = process.env.SEED_EMAIL ?? 'demo@shopbot.local';
const naira = (n) => n * 100;
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: env.DATABASE_URL }) });
const products = [
    { name: 'Arsenal Home Jersey 24/25', category: 'JERSEY', description: 'Red fan version, breathable', attributes: { club: 'Arsenal', season: '24/25', version: 'fan' }, sizes: ['S', 'M', 'L', 'XL'], price: 18000, floor: 14000, stock: 3 },
    { name: 'Manchester United Away Jersey 24/25', category: 'JERSEY', description: 'Black away kit, player version', attributes: { club: 'Manchester United', season: '24/25', version: 'player' }, sizes: ['M', 'L', 'XL'], price: 22000, floor: 18000, stock: 2 },
    { name: 'Super Eagles Home Jersey', category: 'JERSEY', description: 'Green Nigeria national team jersey', attributes: { club: 'Nigeria', season: '2024', version: 'fan' }, sizes: ['S', 'M', 'L', 'XL', 'XXL'], price: 15000, floor: 12000, stock: 5 },
    { name: 'Nike Air Force 1 White', category: 'SHOES', description: 'Classic white leather sneakers', attributes: { brand: 'Nike' }, sizes: ['40', '41', '42', '43', '44', '45'], price: 45000, floor: 38000, stock: 2 },
    { name: 'Adidas Samba Black', category: 'SHOES', description: 'Black suede terrace sneakers', attributes: { brand: 'Adidas' }, sizes: ['41', '42', '43', '44'], price: 38000, floor: 32000, stock: 1 },
    { name: 'Ankara Print Shirt', category: 'CLOTHES', description: 'Men short sleeve Ankara shirt, blue pattern', attributes: { gender: 'men' }, sizes: ['M', 'L', 'XL'], price: 12000, floor: 9000, stock: 4 },
    { name: 'Corporate Trouser Black', category: 'CLOTHES', description: 'Slim fit black trouser', attributes: { gender: 'men' }, sizes: ['30', '32', '34', '36'], price: 14000, floor: 11000, stock: 3 },
];
async function main() {
    const ownerPhone = normalizePhone(process.env.DEMO_OWNER_PHONE ?? '2348000000000');
    const fields = {
        businessName: 'Hafiz & Kits',
        ownerName: 'Hafiz',
        ownerPhone,
        alertEmail: process.env.DEMO_ALERT_EMAIL?.trim() || null,
        maxDiscountPercent: 25,
        receiptCounter: 0,
        orderCounter: 0,
    };
    const existing = await prisma.merchant.findUnique({ where: { ownerEmail: DEMO_EMAIL } });
    let merchant;
    if (existing) {
        const photos = await prisma.productImage.findMany({ where: { merchantId: existing.id }, select: { key: true } });
        if (photos.length > 0 && process.env.SEED_FORCE !== 'true') {
            console.error(`Refusing to reseed: this shop has ${photos.length} uploaded product photo(s) that reseeding would delete.\n` +
                'If you really want to wipe the shop back to the demo products, run:  SEED_FORCE=true npm run seed');
            process.exit(1);
        }
        for (const { key } of photos)
            await rm(resolve(env.STORAGE_DIR, key), { force: true });
        await prisma.order.deleteMany({ where: { merchantId: existing.id } });
        await prisma.conversation.deleteMany({ where: { merchantId: existing.id } });
        await prisma.customer.deleteMany({ where: { merchantId: existing.id } });
        await prisma.product.deleteMany({ where: { merchantId: existing.id } });
        merchant = await prisma.merchant.update({ where: { id: existing.id }, data: fields });
    }
    else {
        merchant = await prisma.merchant.create({
            data: { ...fields, ownerEmail: DEMO_EMAIL, passwordHash: await bcrypt.hash('demo1234', 10) },
        });
    }
    for (const p of products) {
        await prisma.product.create({
            data: {
                merchantId: merchant.id,
                name: p.name,
                category: p.category,
                description: p.description,
                attributes: p.attributes,
                variants: {
                    create: p.sizes.map((size) => ({
                        merchantId: merchant.id,
                        size,
                        color: p.color ?? null,
                        priceKobo: naira(p.price),
                        minPriceKobo: naira(p.floor),
                        stock: p.stock,
                    })),
                },
            },
        });
    }
    console.log(`Seeded merchant ${merchant.id} (${merchant.businessName}) with ${products.length} products`);
}
await main().finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map