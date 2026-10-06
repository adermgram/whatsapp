import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env } from '../config/env.js';
const DEMO_EMAIL = 'demo@shopbot.local';
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
    await prisma.merchant.deleteMany({ where: { ownerEmail: DEMO_EMAIL } });
    const merchant = await prisma.merchant.create({
        data: {
            businessName: 'Kemi Kicks & Kits',
            ownerName: 'Kemi',
            ownerPhone: '2348000000000',
            ownerEmail: DEMO_EMAIL,
            passwordHash: await bcrypt.hash('demo1234', 10),
            maxDiscountPercent: 25,
        },
    });
    for (const p of products) {
        await prisma.product.create({
            data: {
                merchantId: merchant.id,
                name: p.name,
                category: p.category,
                description: p.description,
                attributes: p.attributes,
                imageKeys: [],
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