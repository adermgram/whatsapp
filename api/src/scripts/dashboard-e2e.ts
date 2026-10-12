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
import { ChatAccess } from '../messaging/chat-access.js';

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

  console.log('--- orders, chats and WhatsApp (dashboard pages)');
  for (const path of ['/api/orders', '/api/chats', '/api/whatsapp', '/api/overview', `/api/orders/${randomUUID()}/receipt`]) {
    check((await call('GET', path)).status === 401, `GET ${path.replace(/[0-9a-f-]{36}/, ':id')} without logging in is refused (401)`);
  }
  check((await call('POST', `/api/orders/${randomUUID()}/mark-paid`)).status === 401, 'marking an order paid without logging in is refused (401)');
  check((await call('POST', `/api/chats/${randomUUID()}/resume`)).status === 401, 'resuming a chat without logging in is refused (401)');

  const mkCustomer = (merchantId: string, phone: string) => prisma.customer.create({ data: { merchantId, phone, name: 'Ife Ade', address: '9 Test Road, Lagos' } });
  const custA = await mkCustomer(A.id, '2348011110001');
  const custB = await mkCustomer(B.id, '2348011110002');
  const convA = await prisma.conversation.create({ data: { merchantId: A.id, customerId: custA.id, chatId: custA.phone, mode: 'HUMAN', humanSince: new Date(), handoffBy: 'AI', handoffReason: 'Customer wants to negotiate a bulk price' } });
  const convB = await prisma.conversation.create({ data: { merchantId: B.id, customerId: custB.id, chatId: custB.phone, mode: 'HUMAN', humanSince: new Date(), handoffBy: 'AI', handoffReason: 'Shop B only' } });
  const t0 = Date.now();
  // the last message is from the owner so that resuming does not wake the AI (which would call the real model)
  await prisma.message.createMany({
    data: [
      { merchantId: A.id, conversationId: convA.id, direction: 'INBOUND', sender: 'CUSTOMER', type: 'text', text: 'Can I get 10 jerseys for less?', createdAt: new Date(t0 - 3000) },
      { merchantId: A.id, conversationId: convA.id, direction: 'OUTBOUND', sender: 'AI', type: 'text', text: 'Let me get the owner for you.', createdAt: new Date(t0 - 2000) },
      { merchantId: A.id, conversationId: convA.id, direction: 'OUTBOUND', sender: 'OWNER', type: 'text', text: 'Hello, how many exactly?', createdAt: new Date(t0 - 1000) },
    ],
  });
  await prisma.variant.update({ where: { id: vid }, data: { reserved: 2 } }); // as if the checkout had reserved 2
  const orderA = await prisma.order.create({
    data: {
      merchantId: A.id, customerId: custA.id, conversationId: convA.id, orderNumber: 'ORD-000901', status: 'AWAITING_PAYMENT',
      subtotalKobo: 3_600_000, totalKobo: 3_600_000, deliveryAddress: custA.address, expiresAt: new Date(Date.now() + 1_800_000),
      items: { create: [{ variantId: vid, quantity: 2, listPriceKobo: 1_800_000, unitPriceKobo: 1_800_000 }] },
      payment: { create: { reference: `e2e-${randomUUID()}`, amountKobo: 3_600_000, checkoutUrl: 'https://fake-pay.local/x' } },
    },
  });
  const draftA = await prisma.order.create({ data: { merchantId: A.id, customerId: custA.id, conversationId: convA.id, orderNumber: `DRAFT-${randomUUID().slice(0, 6)}` } });
  const orderB = await prisma.order.create({
    data: { merchantId: B.id, customerId: custB.id, conversationId: convB.id, orderNumber: 'ORD-000902', status: 'AWAITING_PAYMENT', totalKobo: 500_000, subtotalKobo: 500_000 },
  });

  const ordersA = await call('GET', '/api/orders', { cookie: cookieA });
  check(ordersA.status === 200 && ordersA.body.orders.length === 1 && ordersA.body.orders[0].orderNumber === 'ORD-000901', 'the orders list shows this shop\'s order, and not the unfinished cart');
  check(ordersA.body.orders[0].total === 36000 && ordersA.body.orders[0].items[0].name === 'E2E Arsenal Jersey' && ordersA.body.counts.AWAITING_PAYMENT === 1, 'the order shows its total in naira, its items, and the status counts');
  check(!JSON.stringify(ordersA.body).toLowerCase().includes('minprice') && !JSON.stringify(ordersA.body).includes('14000'), 'the lowest acceptable price never appears in an order');
  check((await call('GET', '/api/orders?status=PAID', { cookie: cookieA })).body.orders.length === 0, 'filtering by status works');
  check((await call('GET', '/api/orders?q=ife', { cookie: cookieA })).body.orders.length === 1 && (await call('GET', '/api/orders?q=nobody', { cookie: cookieA })).body.orders.length === 0, 'searching by customer name works');
  check((await call('GET', '/api/orders?status=HACKED', { cookie: cookieA })).status === 400, 'an unknown status filter is rejected (400)');
  check((await call('GET', `/api/orders/${draftA.id}`, { cookie: cookieA })).status === 404, 'an unfinished cart cannot be opened as an order (404)');
  check((await call('POST', `/api/orders/${draftA.id}/mark-paid`, { cookie: cookieA })).status === 409, 'an unfinished cart cannot be marked paid (409)');

  check((await call('GET', '/api/orders', { cookie: cookieB })).body.orders.every((o: { id: string }) => o.id !== orderA.id), "shop B's order list does not contain shop A's order");
  check((await call('GET', `/api/orders/${orderA.id}`, { cookie: cookieB })).status === 404, "shop B cannot open shop A's order (404)");
  check((await call('POST', `/api/orders/${orderA.id}/mark-paid`, { cookie: cookieB })).status === 404, "shop B cannot mark shop A's order paid (404)");
  check((await call('POST', `/api/chats/${convA.id}/resume`, { cookie: cookieB })).status === 404, "shop B cannot hand shop A's chat back to the AI (404)");
  check((await call('POST', `/api/chats/${convA.id}/take-over`, { cookie: cookieB })).status === 404, "shop B cannot take over shop A's chat (404)");
  check((await call('GET', `/api/chats/${convA.id}`, { cookie: cookieB })).status === 404, "shop B cannot read shop A's chat (404)");
  check((await call('POST', `/api/orders/${orderA.id}/mark-paid`, { cookie: cookieA, origin: 'https://evil.example' })).status === 403, 'marking paid from another website is refused (403)');
  check((await prisma.order.findUnique({ where: { id: orderA.id } }))?.status === 'AWAITING_PAYMENT', "and shop A's order is still unpaid after all those attempts");
  check((await call('GET', `/api/orders/${orderA.id}/receipt`, { cookie: cookieA })).status === 404, 'there is no receipt before the order is paid (404)');

  const paid = await call('POST', `/api/orders/${orderA.id}/mark-paid`, { cookie: cookieA });
  check(paid.status === 200 && paid.body.outcome === 'paid' && paid.body.order.status === 'PAID' && paid.body.order.payment.manual === true, 'marking an order paid works, and records that the owner confirmed it');
  check(paid.body.order.receipt?.sent === true && !!paid.body.order.paidAt, 'the receipt was issued and sent');
  const vAfter = await prisma.variant.findUniqueOrThrow({ where: { id: vid } });
  check(vAfter.stock === 1 && vAfter.reserved === 0, 'stock was committed: 3 in stock, 2 sold, none held');
  const again = await call('POST', `/api/orders/${orderA.id}/mark-paid`, { cookie: cookieA });
  const vAgain = await prisma.variant.findUniqueOrThrow({ where: { id: vid } });
  check(again.status === 200 && again.body.outcome === 'already_paid' && vAgain.stock === 1, 'pressing it twice changes nothing the second time');
  const pdf = await call('GET', `/api/orders/${orderA.id}/receipt`, { cookie: cookieA });
  check(pdf.status === 200 && pdf.headers.get('content-type') === 'application/pdf' && String(pdf.body).startsWith('%PDF'), 'the receipt downloads as a real PDF');
  check((await call('GET', `/api/orders/${orderA.id}/receipt`, { cookie: cookieB })).status === 404, "shop B cannot download shop A's receipt (404)");
  check((await prisma.order.findUnique({ where: { id: orderB.id } }))?.status === 'AWAITING_PAYMENT', "shop B's order was not touched");

  const waiting = await call('GET', '/api/chats?waiting=true', { cookie: cookieA });
  check(waiting.status === 200 && waiting.body.waitingCount === 1 && waiting.body.chats[0].id === convA.id && waiting.body.chats[0].lastMessage.text.startsWith('Payment received'), 'the waiting list shows the chat that needs the owner, with its latest message (the receipt notice sent when the order was marked paid)');
  const thread = await call('GET', `/api/chats/${convA.id}`, { cookie: cookieA });
  check(thread.body.messages.map((m: { sender: string }) => m.sender).join().startsWith('CUSTOMER,AI,OWNER') && thread.body.orders[0]?.orderNumber === 'ORD-000901', 'opening a chat shows the messages in order, and the customer\'s orders');
  check(thread.body.handoffReason === 'Customer wants to negotiate a bulk price', 'and why the AI stepped back');
  const resumed = await call('POST', `/api/chats/${convA.id}/resume`, { cookie: cookieA });
  check(resumed.status === 200 && resumed.body.mode === 'AI' && resumed.body.handoffReason === null, 'giving a chat back to the AI works');
  check((await call('GET', '/api/chats?waiting=true', { cookie: cookieA })).body.waitingCount === 0, 'and it leaves the waiting list');
  const taken = await call('POST', `/api/chats/${convA.id}/take-over`, { cookie: cookieA });
  check(taken.status === 200 && taken.body.mode === 'HUMAN' && taken.body.handoffBy === 'OWNER', 'taking a chat over makes the AI stop answering it');
  check((await call('GET', '/api/chats', { cookie: cookieB })).body.chats.every((c: { id: string }) => c.id !== convA.id), "shop B's chat list does not contain shop A's chats");

  const wa = await call('GET', '/api/whatsapp', { cookie: cookieA });
  check(wa.status === 200 && wa.body.live === false && wa.body.state === 'DISCONNECTED' && wa.body.qr === null, 'WhatsApp status: the test server is not linked, and no QR is handed out');
  check(!/auth|creds|secret|key/i.test(Object.keys(wa.body).join()), 'the status carries no credentials');
  console.log('--- who the assistant answers (approved numbers)');
  const access = app.get(ChatAccess);
  check((await call('POST', '/api/whatsapp/allowed', { json: { phone: '08012345678' } })).status === 401, 'adding a number without logging in is refused (401)');
  check((await call('PUT', '/api/whatsapp/reply-mode', { json: { mode: 'EVERYONE' } })).status === 401, 'switching to "everyone" without logging in is refused (401)');
  check((await call('PUT', '/api/whatsapp/reply-mode', { cookie: cookieA, json: { mode: 'EVERYONE' }, origin: 'https://evil.example' })).status === 403, 'switching to "everyone" from another website is refused (403)');
  const w0 = (await call('GET', '/api/whatsapp', { cookie: cookieA })).body.access;
  check(w0.mode === 'ALLOWLIST' && w0.allowed.length === 0 && w0.ignored.length === 0, 'a new shop answers nobody until a number is approved');
  check((await access.isAllowed(A.id, '2348012345678', 'hi')) === false, 'and the bot really ignores an unapproved number');

  const add1 = await call('POST', '/api/whatsapp/allowed', { cookie: cookieA, json: { phone: '0801 234 5678', label: 'Aunty Bisi' } });
  check(add1.status === 200 && add1.body.allowed.length === 1 && add1.body.allowed[0].phone === '2348012345678' && add1.body.allowed[0].label === 'Aunty Bisi', 'a number typed the Nigerian way is saved in international form, with its label');
  check((await access.isAllowed(A.id, '2348012345678', 'hi')) === true, 'and the bot answers it straight away, no restart needed');
  const add2 = await call('POST', '/api/whatsapp/allowed', { cookie: cookieA, json: { phone: '+234 801 234 5678', label: 'Bisi (testing)' } });
  check(add2.body.allowed.length === 1 && add2.body.allowed[0].label === 'Bisi (testing)', 'adding the same number in another format does not duplicate it (the label is updated)');
  for (const bad of ['hello', '12345', 'lid:123', '', '0801234']) {
    check((await call('POST', '/api/whatsapp/allowed', { cookie: cookieA, json: { phone: bad } })).status === 400, `"${bad}" is rejected as a phone number (400)`);
  }
  check((await call('PUT', '/api/whatsapp/reply-mode', { cookie: cookieA, json: { mode: 'ALL' } })).status === 400, 'an unknown reply mode is rejected (400)');
  check((await access.isAllowed(A.id, '2340000000000', '/paid ORD-000001')) === true && (await access.isAllowed(A.id, '2340000000000', 'hello')) === false, "the owner's own commands always work, but their ordinary messages follow the list");

  access.noteIgnored(A.id, '2347000000000', 'Stranger Danger');
  access.noteIgnored(A.id, '2347000000000', 'Stranger Danger'); // within a minute: not counted twice
  await new Promise((r) => setTimeout(r, 1500));
  const w1 = (await call('GET', '/api/whatsapp', { cookie: cookieA })).body.access;
  check(w1.ignored.length === 1 && w1.ignored[0].phone === '2347000000000' && w1.ignored[0].name === 'Stranger Danger' && w1.ignored[0].count === 1, 'someone who messaged without approval is remembered (name and number only, no message text)');
  const ignoredId: string = w1.ignored[0].id;
  check((await call('POST', `/api/whatsapp/ignored/${ignoredId}/allow`, { cookie: cookieB })).status === 404, "shop B cannot approve shop A's ignored number (404)");
  const allowed1 = await call('POST', `/api/whatsapp/ignored/${ignoredId}/allow`, { cookie: cookieA });
  check(allowed1.status === 200 && allowed1.body.ignored.length === 0 && allowed1.body.allowed.some((n: { phone: string; label: string }) => n.phone === '2347000000000' && n.label === 'Stranger Danger'), 'one tap approves an ignored number and takes it off the ignored list');
  check((await access.isAllowed(A.id, '2347000000000', 'hi')) === true, 'and it is answered right away');

  const wb = (await call('GET', '/api/whatsapp', { cookie: cookieB })).body.access;
  check(wb.allowed.length === 0 && wb.ignored.length === 0, "shop B's lists do not contain shop A's numbers");
  check((await access.isAllowed(B.id, '2348012345678', 'hi')) === false, "and shop A's approved number is not approved for shop B");
  const entryId: string = allowed1.body.allowed.find((n: { phone: string }) => n.phone === '2348012345678').id;
  check((await call('DELETE', `/api/whatsapp/allowed/${entryId}`, { cookie: cookieB })).status === 404, "shop B cannot remove shop A's approved number (404)");
  check((await access.isAllowed(A.id, '2348012345678', 'hi')) === true, "which is therefore still approved");
  const removed = await call('DELETE', `/api/whatsapp/allowed/${entryId}`, { cookie: cookieA });
  check(removed.status === 200 && removed.body.allowed.every((n: { phone: string }) => n.phone !== '2348012345678'), 'removing a number takes it off the list');
  check((await access.isAllowed(A.id, '2348012345678', 'hi')) === false, 'and the bot stops answering it straight away');

  const everyone = await call('PUT', '/api/whatsapp/reply-mode', { cookie: cookieA, json: { mode: 'EVERYONE' } });
  check(everyone.status === 200 && everyone.body.mode === 'EVERYONE' && (await access.isAllowed(A.id, '2347999999999', 'hi')) === true, 'switching to "everyone" makes the bot answer any number');
  check((await access.isAllowed(B.id, '2347999999999', 'hi')) === false, "and that only applies to shop A, not shop B");
  const back = await call('PUT', '/api/whatsapp/reply-mode', { cookie: cookieA, json: { mode: 'ALLOWLIST' } });
  check(back.body.mode === 'ALLOWLIST' && (await access.isAllowed(A.id, '2347999999999', 'hi')) === false, 'switching back stops it again');

  // limits: nobody can grow these lists without bound
  await prisma.allowedNumber.createMany({ data: Array.from({ length: 200 }, (_, i) => ({ merchantId: B.id, phone: `23480000${String(i).padStart(5, '0')}` })) });
  const over = await call('POST', '/api/whatsapp/allowed', { cookie: cookieB, json: { phone: '2348099999999' } });
  check(over.status === 400 && /up to 200/.test(JSON.stringify(over.body)), 'a shop cannot approve more than 200 numbers (400)');
  await prisma.ignoredNumber.createMany({ data: Array.from({ length: 100 }, (_, i) => ({ merchantId: B.id, phone: `23470000${String(i).padStart(5, '0')}`, lastSeenAt: new Date(Date.now() - (200 - i) * 1000) })) });
  access.noteIgnored(B.id, '2347111111111', 'Newest');
  await new Promise((r) => setTimeout(r, 2500));
  const bIgnored = await prisma.ignoredNumber.findMany({ where: { merchantId: B.id } });
  check(bIgnored.length === 100 && bIgnored.some((i) => i.phone === '2347111111111') && !bIgnored.some((i) => i.phone === '2347000000000'), 'the ignored list is capped at 100, dropping the oldest, so strangers cannot flood the database');

  const ov = await call('GET', '/api/overview', { cookie: cookieA });
  check(ov.status === 200 && ov.body.waitingChats === 1 && ov.body.awaitingPayment === 0 && ov.body.paidLast7Days.count === 1 && ov.body.paidLast7Days.total === 36000, 'the home numbers add up (waiting chats, unpaid orders, paid this week)');

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
  for (const id of [A.id, B.id]) {
    await rm(resolve(env.STORAGE_DIR, 'products', id), { recursive: true, force: true });
    await rm(resolve(env.STORAGE_DIR, 'receipts', id), { recursive: true, force: true });
  }
  await app.close();
}

console.log(failures.length ? `\n${failures.length} check(s) FAILED` : '\nAll dashboard security checks passed');
process.exit(failures.length ? 1 : 0);
