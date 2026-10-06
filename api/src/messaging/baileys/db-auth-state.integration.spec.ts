import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { hasStoredLogin, useDbAuthState } from './db-auth-state.js';

// Real Postgres. Proves a WhatsApp login written by one process can be read back by the next.
const prisma = new PrismaService();
let merchantId: string;

beforeAll(async () => {
  await prisma.$connect();
  merchantId = (
    await prisma.merchant.create({
      data: { businessName: 'WA Test', ownerName: 'T', ownerPhone: '2340000000000', ownerEmail: `wa-${randomUUID()}@shopbot.local`, passwordHash: 'x' },
    })
  ).id;
});

afterAll(async () => {
  await prisma.merchant.delete({ where: { id: merchantId } });
  await prisma.$disconnect();
});

describe('database auth state', () => {
  it('starts with fresh credentials, and no stored login', async () => {
    const { state } = await useDbAuthState(prisma, merchantId);
    expect(state.creds.noiseKey).toBeDefined();
    expect(await hasStoredLogin(prisma, merchantId)).toBe(false);
  });

  it('persists credentials (including Buffers) so the next start reuses the same identity', async () => {
    const first = await useDbAuthState(prisma, merchantId);
    first.state.creds.registered = true;
    await first.saveCreds();

    const second = await useDbAuthState(prisma, merchantId);
    expect(second.state.creds.registered).toBe(true);
    expect(Buffer.from(second.state.creds.noiseKey.public).equals(Buffer.from(first.state.creds.noiseKey.public))).toBe(true);
    expect(Buffer.from(second.state.creds.signedIdentityKey.private).equals(Buffer.from(first.state.creds.signedIdentityKey.private))).toBe(true);
    expect(await hasStoredLogin(prisma, merchantId)).toBe(true);
  });

  it('stores, reads back and deletes signal keys, with binary values intact', async () => {
    const { state } = await useDbAuthState(prisma, merchantId);
    const session = Buffer.from([1, 2, 3, 250, 251]);
    await state.keys.set({
      session: { 'a.1': session, 'b.2': Buffer.from([9]) },
      'pre-key': { '7': { private: Buffer.from([4, 5]), public: Buffer.from([6, 7]) } },
    });

    const got = await state.keys.get('session', ['a.1', 'b.2', 'missing']);
    expect(Buffer.from(got['a.1']!).equals(session)).toBe(true);
    expect(got['missing']).toBeUndefined();
    const pre = await state.keys.get('pre-key', ['7']);
    expect(Buffer.from(pre['7']!.public).equals(Buffer.from([6, 7]))).toBe(true);

    // overwrite one, delete another (null = delete), in a single set
    await state.keys.set({ session: { 'a.1': Buffer.from([42]), 'b.2': null } });
    const after = await state.keys.get('session', ['a.1', 'b.2']);
    expect(Buffer.from(after['a.1']!).equals(Buffer.from([42]))).toBe(true);
    expect(after['b.2']).toBeUndefined();
  });

  it('isolates merchants from each other', async () => {
    const other = (
      await prisma.merchant.create({
        data: { businessName: 'Other', ownerName: 'T', ownerPhone: '2340000000000', ownerEmail: `wa-${randomUUID()}@shopbot.local`, passwordHash: 'x' },
      })
    ).id;
    try {
      const mine = await useDbAuthState(prisma, merchantId);
      const theirs = await useDbAuthState(prisma, other);
      await mine.state.keys.set({ session: { shared: Buffer.from([1]) } });
      expect(await theirs.state.keys.get('session', ['shared'])).toEqual({});
    } finally {
      await prisma.merchant.delete({ where: { id: other } });
    }
  });

  it('clear() forgets the login completely', async () => {
    const { clear } = await useDbAuthState(prisma, merchantId);
    await clear();
    expect(await hasStoredLogin(prisma, merchantId)).toBe(false);
    const fresh = await useDbAuthState(prisma, merchantId);
    expect(fresh.state.creds.registered).toBeFalsy();
  });
});
