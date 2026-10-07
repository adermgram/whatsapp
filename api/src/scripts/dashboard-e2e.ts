import 'dotenv/config';
import './scenario-env.js'; // simulator WhatsApp + fake payments, whatever .env says
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { JwtService } from '@nestjs/jwt';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import sharp from 'sharp';
import { AppModule } from '../app.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { env } from '../config/env.js';
import { originCheck } from '../common/origin-check.js';

// Boots the real server and attacks the dashboard API over real HTTP.
const PORT = 3998;
const base = `http://localhost:${PORT}`;
const DASH = env.DASHBOARD_ORIGIN;
const failures: string[] = [];
const check = (ok: boolean, what: string) => {
  console.log(`${ok ? '✓' : '✗'} ${what}`);
  if (!ok) failures.push(what);
};

const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true, logger: ['error'] });
app.set('trust proxy', 'loopback');
app.use(helmet());
app.use(cookieParser());
app.use(originCheck([DASH])); // the same wiring as main.ts
await app.listen(PORT);
const prisma = app.get(PrismaService);

const password = 'correct horse battery';
const mk = async (name: string) =>
  prisma.merchant.create({
    data: { businessName: name, ownerName: 'E2E', ownerPhone: '2340000000000', ownerEmail: `e2e-${randomUUID()}@shopbot.local`, passwordHash: await bcrypt.hash(password, 4) },
  });
const A = await mk('E2E Shop A');
const B = await mk('E2E Shop B');

type Res = { status: number; body: any; headers: Headers }; // eslint-disable-line
async function call(method: string, path: string, opts: { cookie?: string; json?: unknown; form?: FormData; origin?: string | null; bearer?: string } = {}): Promise<Res> {
  const headers: Record<string, string> = {};
  if (opts.cookie) headers.cookie = opts.cookie;
  if (opts.bearer) headers.authorization = `Bearer ${opts.bearer}`;
  if (opts.origin !== null) headers.origin = opts.origin ?? DASH; // a browser always sends Origin on changes
  let body: BodyInit | undefined;
  if (opts.json !== undefined) {
    headers['content-type'] = 'application/json';
    body = JSON.stringify(opts.json);
  } else if (opts.form) body = opts.form;
  const r = await fetch(base + path, { method, headers, body });
  const text = await r.text();
  let parsed: unknown = text;
  try {
    parsed = JSON.parse(text);
  } catch {
    /* binary or empty */
  }
  return { status: r.status, body: parsed, headers: r.headers };
}
const login = async (email: string, pw = password) => {
  const r = await call('POST', '/api/auth/login', { json: { email, password: pw } });
  const cookie = r.headers.getSetCookie().find((c) => c.startsWith('shop_session='));
  return { r, cookie: cookie?.split(';')[0] };
};
const jpeg = () => sharp({ create: { width: 900, height: 700, channels: 3, background: { r: 30, g: 120, b: 200 } } }).jpeg().toBuffer();
const upload = async (productId: string, cookie: string, files: { name: string; data: Buffer; type: string }[]) => {
  const form = new FormData();
  for (const f of files) form.append('files', new Blob([new Uint8Array(f.data)], { type: f.type }), f.name);
  return call('POST', `/api/products/${productId}/images`, { cookie, form });
};

const cleanup: string[] = [];
try {
  console.log('--- not logged in');
  check((await call('GET', '/api/products')).status === 401, 'listing products without logging in is refused (401)');
  check((await call('GET', `/api/images/${randomUUID()}`)).status === 401, 'fetching a picture without logging in is refused (401)');
  check((await call('POST', '/api/products', { json: { name: 'x', category: 'SHOES' } })).status === 401, 'creating a product without logging in is refused (401)');

  console.log('--- logging in');
  const wrong = await login(A.ownerEmail, 'wrong password');
  const unknown = await login(`nobody-${randomUUID()}@shopbot.local`, password);
  check(wrong.r.status === 401 && unknown.r.status === 401, 'wrong password and unknown email are both refused (401)');
  check(JSON.stringify(wrong.r.body.message) === JSON.stringify(unknown.r.body.message), 'both failures give the SAME message, so emails cannot be discovered');

  const a = await login(A.ownerEmail);
  check(a.r.status === 200 && !!a.cookie, 'correct password logs in and sets a session cookie');
  const setCookie = a.r.headers.getSetCookie().find((c) => c.startsWith('shop_session=')) ?? '';
  check(/httponly/i.test(setCookie) && /samesite=lax/i.test(setCookie), 'the cookie is HttpOnly and SameSite=Lax (page scripts cannot read it)');
  check(!JSON.stringify(a.r.body).includes('eyJ'), 'the login token is never in the response body');
  const cookieA = a.cookie!;
  const me = await call('GET', '/api/auth/me', { cookie: cookieA });
  check(me.status === 200 && me.body.id === A.id, 'GET /me returns the logged-in shop');

  console.log('--- brute force');
  const victim = `victim-${randomUUID()}@shopbot.local`;
  const codes: number[] = [];
  for (let i = 0; i < 8; i++) codes.push((await login(victim, `guess ${i}`)).r.status);
  check(codes.slice(0, 5).every((c) => c === 401) && codes.slice(5).every((c) => c === 429), `after 5 wrong guesses the account is rate-limited (${codes.join(',')})`);
  const stillWorks = await login(A.ownerEmail);
  check(stillWorks.r.status === 200, 'other accounts are not affected by that lockout');

  console.log('--- forged and tampered logins');
  const forged = await new JwtService({ secret: 'not-the-real-secret' }).signAsync({ sub: A.id, email: A.ownerEmail });
  check((await call('GET', '/api/products', { bearer: forged })).status === 401, 'a token signed with another secret is refused');
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const noneAlg = `${b64({ alg: 'none', typ: 'JWT' })}.${b64({ sub: A.id, email: A.ownerEmail })}.`;
  check((await call('GET', '/api/products', { bearer: noneAlg })).status === 401, 'an "alg: none" unsigned token is refused');
  const tampered = cookieA.slice(0, -3) + (cookieA.endsWith('aaa') ? 'bbb' : 'aaa');
  check((await call('GET', '/api/products', { cookie: tampered })).status === 401, 'a token with an altered signature is refused');
  const expired = await new JwtService({ secret: env.JWT_SECRET }).signAsync({ sub: A.id, email: A.ownerEmail }, { expiresIn: -10 });
  check((await call('GET', '/api/products', { bearer: expired })).status === 401, 'an expired token is refused');

  console.log('--- requests from another website');
  const evil = await call('POST', '/api/products', { cookie: cookieA, json: { name: 'Planted', category: 'SHOES' }, origin: 'https://evil.example' });
  check(evil.status === 403, 'a state-changing request from another website is refused even with a valid cookie (403)');
  const list0 = await call('GET', '/api/products', { cookie: cookieA });
  check(list0.status === 200 && !list0.body.some((p: { name: string }) => p.name === 'Planted'), 'and nothing was created');
  const hook = await call('POST', `/webhooks/paystack/${randomUUID()}`, { json: { event: 'x' }, origin: null });
  check(hook.status === 404, 'Paystack-style webhooks (no Origin) still reach their handler');

  console.log('--- products');
  const bad = await call('POST', '/api/products', { cookie: cookieA, json: { name: '', category: 'WEAPONS' } });
  check(bad.status === 400, 'an invalid product is rejected with a clear 400');
  const created = await call('POST', '/api/products', { cookie: cookieA, json: { name: 'E2E Arsenal Jersey', category: 'JERSEY', description: 'Red' } });
  check(created.status === 201 && created.body.name === 'E2E Arsenal Jersey', 'a valid product is created');
  const pid: string = created.body.id;
  const badVariant = await call('POST', `/api/products/${pid}/variants`, { cookie: cookieA, json: { size: 'M', price: 5000, minPrice: 9000, stock: 2 } });
  check(badVariant.status === 400, 'a lowest price above the selling price is rejected');
  const variant = await call('POST', `/api/products/${pid}/variants`, { cookie: cookieA, json: { size: 'M', price: 18000, minPrice: 14000, stock: 3 } });
  check(variant.status === 201 && variant.body.variants[0].price === 18000, 'a size option is added (prices in naira)');
  const vid: string = variant.body.variants[0].id;
  check((await call('GET', '/api/products/not-a-uuid', { cookie: cookieA })).status === 400, 'a malformed id is rejected (400)');

  console.log('--- photos');
  const good = await jpeg();
  const up = await upload(pid, cookieA, [
    { name: 'front.jpg', data: good, type: 'image/jpeg' },
    { name: 'virus.jpg', data: Buffer.from('MZ\u0090 this is a program, not a photo'), type: 'image/jpeg' },
    { name: 'notes.pdf', data: Buffer.from('%PDF-1.4 hello hello hello hello'), type: 'application/pdf' },
  ]);
  check(up.status === 201 && up.body.results.map((r: { ok: boolean }) => r.ok).join() === 'true,false,false', 'a real picture is saved; a disguised program and a PDF are refused, in the same request');
  const imageId: string = up.body.product.images[0].id;
  const img = await call('GET', `/api/images/${imageId}`, { cookie: cookieA });
  check(img.status === 200 && img.headers.get('content-type') === 'image/jpeg', 'the saved picture is served back as a JPEG');
  check(img.headers.get('x-content-type-options') === 'nosniff', 'the picture is served with nosniff');
  const big = Buffer.alloc(9 * 1024 * 1024);
  big.set([0xff, 0xd8, 0xff]);
  check((await upload(pid, cookieA, [{ name: 'huge.jpg', data: big, type: 'image/jpeg' }])).status === 413, 'a 9 MB upload is refused (413)');
  check((await upload(pid, cookieA, [])).status === 400, 'an upload with no file is rejected (400)');

  console.log('--- one shop reaching into another');
  const b = await login(B.ownerEmail);
  const cookieB = b.cookie!;
  check((await call('GET', '/api/products', { cookie: cookieB })).body.length === 0, "shop B's product list does not contain shop A's products");
  check((await call('GET', `/api/products/${pid}`, { cookie: cookieB })).status === 404, "shop B cannot read shop A's product (404)");
  check((await call('PATCH', `/api/products/${pid}`, { cookie: cookieB, json: { name: 'Hacked' } })).status === 404, "shop B cannot rename shop A's product");
  check((await call('PATCH', `/api/variants/${vid}`, { cookie: cookieB, json: { price: 1, minPrice: 1 } })).status === 404, "shop B cannot change shop A's prices");
  check((await call('DELETE', `/api/variants/${vid}`, { cookie: cookieB })).status === 404, "shop B cannot delete shop A's size option");
  check((await call('GET', `/api/images/${imageId}`, { cookie: cookieB })).status === 404, "shop B cannot download shop A's picture");
  check((await call('DELETE', `/api/images/${imageId}`, { cookie: cookieB })).status === 404, "shop B cannot delete shop A's picture");
  check((await upload(pid, cookieB, [{ name: 'x.jpg', data: good, type: 'image/jpeg' }])).status === 404, "shop B cannot add pictures to shop A's product");
  const intact = await call('GET', `/api/products/${pid}`, { cookie: cookieA });
  check(intact.body.name === 'E2E Arsenal Jersey' && intact.body.variants[0].price === 18000 && intact.body.images.length === 1, "and shop A's data is untouched");

  console.log('--- password and logout');
  check((await call('POST', '/api/auth/password', { cookie: cookieA, json: { current: 'wrong', next: 'a brand new password' } })).status === 401, 'changing the password needs the current one');
  check((await call('POST', '/api/auth/password', { cookie: cookieA, json: { current: password, next: 'short' } })).status === 400, 'a short new password is rejected');
  check((await call('POST', '/api/auth/password', { cookie: cookieA, json: { current: password, next: 'a brand new password' } })).status === 200, 'the password can be changed');
  check((await login(A.ownerEmail, password)).r.status === 401 && (await login(A.ownerEmail, 'a brand new password')).r.status === 200, 'the old password stops working, the new one works');
  const out = await call('POST', '/api/auth/logout', { cookie: cookieA });
  check(out.status === 200 && out.headers.getSetCookie().some((c) => c.startsWith('shop_session=;') || /shop_session=;?/.test(c)), 'logout clears the cookie');

  console.log('--- security headers');
  const h = await call('GET', '/api/auth/me', { cookie: cookieB });
  check(h.headers.get('x-content-type-options') === 'nosniff' && !!h.headers.get('strict-transport-security') && h.headers.get('x-powered-by') === null, 'helmet headers are on, and the framework is not advertised');
} finally {
  cleanup.push(A.id, B.id);
  await prisma.merchant.deleteMany({ where: { id: { in: [A.id, B.id] } } });
  for (const id of [A.id, B.id]) await rm(resolve(env.STORAGE_DIR, 'products', id), { recursive: true, force: true });
  await app.close();
}

console.log(failures.length ? `\n${failures.length} check(s) FAILED` : '\nAll dashboard security checks passed');
process.exit(failures.length ? 1 : 0);
