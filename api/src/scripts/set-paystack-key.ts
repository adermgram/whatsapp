import 'dotenv/config';
import { readFileSync, writeFileSync } from 'node:fs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env } from '../config/env.js';
import { encryptSecret } from '../config/secrets.js';

// Stores a merchant's Paystack secret key ENCRYPTED in the database.
//   1. Put   PAYSTACK_SECRET_KEY=sk_test_...   in apps/api/.env  (temporary)
//   2. npm run paystack:set-key
// The script validates the key against Paystack, saves it encrypted, then deletes the line from .env.
const DEMO_EMAIL = process.env.MERCHANT_EMAIL ?? 'demo@shopbot.local';
const key = process.env.PAYSTACK_SECRET_KEY?.trim();

if (!key) {
  console.error('PAYSTACK_SECRET_KEY is not set. Add PAYSTACK_SECRET_KEY=sk_test_... to apps/api/.env first.');
  process.exit(1);
}
if (!/^sk_(test|live)_[A-Za-z0-9]+$/.test(key)) {
  console.error('That does not look like a Paystack secret key (expected sk_test_... or sk_live_...). Public keys (pk_...) will not work.');
  process.exit(1);
}
if (key.startsWith('sk_live_')) {
  console.warn('WARNING: this is a LIVE key. Real money will move. Use sk_test_ while testing.');
}

// Prove the key works before storing it.
const res = await fetch('https://api.paystack.co/balance', { headers: { Authorization: `Bearer ${key}` } });
if (!res.ok) {
  console.error(`Paystack rejected this key (HTTP ${res.status}). Re-copy it from Settings > API Keys & Webhooks.`);
  process.exit(1);
}
console.log(`Key accepted by Paystack (${key.startsWith('sk_test_') ? 'TEST' : 'LIVE'} mode).`);

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: env.DATABASE_URL }) });
try {
  const merchant = await prisma.merchant.findUniqueOrThrow({ where: { ownerEmail: DEMO_EMAIL } });
  await prisma.merchant.update({ where: { id: merchant.id }, data: { paystackSecretEnc: encryptSecret(key) } });
  console.log(`Saved (encrypted) for "${merchant.businessName}".`);
  console.log(`Webhook URL to give Paystack:  <your public https url>/webhooks/paystack/${merchant.id}`);
} finally {
  await prisma.$disconnect();
}

// The plain-text key should not stay on disk.
try {
  const envPath = new URL('../../.env', import.meta.url);
  const kept = readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .filter((l) => !l.startsWith('PAYSTACK_SECRET_KEY='));
  writeFileSync(envPath, kept.join('\n'));
  console.log('Removed PAYSTACK_SECRET_KEY from .env.');
} catch {
  console.log('Could not edit .env automatically: please delete the PAYSTACK_SECRET_KEY line yourself.');
}
