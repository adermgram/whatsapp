import 'dotenv/config';
import { createInterface } from 'node:readline';
import { resolve } from 'node:path';

// Terminal chat against the real agent + real DB, with the WhatsApp side simulated.
//   npm run chat         payments are FAKE: type /pay to pretend the customer paid
//   npm run chat:real    payments are REAL Paystack (test key): pay the link in your browser;
//                        the receipt then appears here by itself (checked every 10 seconds)
// Commands: /pay (fake mode)  /owner  /resume  /quit
const real = process.argv.includes('--real');
if (real) process.env.PAYMENT_DRIVER = 'paystack'; // must be set before the app modules load

const { NestFactory } = await import('@nestjs/core');
const { AppModule } = await import('../app.module.js');
const { PrismaService } = await import('../prisma/prisma.service.js');
const { SimulatorGateway } = await import('../messaging/simulator.gateway.js');
const { PaymentConfirmationService } = await import('../payments/payment-confirmation.service.js');
const { PaymentJobs } = await import('../payments/payment.jobs.js');
const { FakePaymentProvider } = await import('../payments/fake-payment.provider.js');
const { OwnerNotifier } = await import('../handoff/owner-notifier.js');
const { HandoffService } = await import('../handoff/handoff.service.js');
const { env } = await import('../config/env.js');

const CHAT_ID = process.env.CHAT_ID ?? '2348011112222';

const app = await NestFactory.createApplicationContext(AppModule, {
  logger: process.env.DEBUG_AGENT ? ['error', 'warn', 'debug'] : ['error', 'warn'],
});
const prisma = app.get(PrismaService);
const gateway = app.get(SimulatorGateway);
const confirmation = app.get(PaymentConfirmationService);
const jobs = app.get(PaymentJobs);
const fake = app.get(FakePaymentProvider);
const notifier = app.get(OwnerNotifier) as unknown as { alerts: unknown[] };
const handoffs = app.get(HandoffService);

const merchant = await prisma.merchant.findFirstOrThrow({ where: { ownerEmail: 'demo@shopbot.local' } });
if (real && !merchant.paystackSecretEnc) {
  console.error('No Paystack key stored for this store yet. Run: npm run paystack:set-key');
  process.exit(1);
}
console.log(`Chatting with "${merchant.businessName}" as customer ${CHAT_ID}.`);
console.log(
  real
    ? 'Payments: REAL Paystack (test mode). Pay the link in your browser; the receipt shows up here within ~10 seconds.'
    : 'Payments: FAKE. Links are not real; type /pay to pretend the customer paid.',
);
console.log('Commands: /pay /owner /resume /quit\n');

// Everything the system sends (replies AND things it sends by itself, like a receipt) prints here.
gateway.onSend((s) => {
  if (s.kind === 'text') console.log(`bot> ${s.text}\n`);
  else if (s.kind === 'document') {
    console.log(`bot> [PDF ${s.fileName}, ${s.size} bytes] ${s.text ?? ''}`);
    console.log(`     saved at ${resolve(env.STORAGE_DIR)}\\receipts\\${merchant.id}\\${s.fileName}\n`);
  } else console.log(`bot> [${s.kind}] ${s.url ?? ''}\n`);
});

// In real mode, don't wait for the 2-minute background job: ask Paystack every 10 seconds.
const poller = real
  ? setInterval(() => void jobs.reconcile().catch(() => undefined), 10_000)
  : undefined;

let n = 0;
const rl = createInterface({ input: process.stdin });
for await (const line of rl) {
  const text = line.trim();
  if (!text) continue;
  console.log(`you> ${text}`);
  if (text === '/quit') break;
  if (text === '/owner') {
    console.log(JSON.stringify(notifier.alerts, null, 2), '\n');
    continue;
  }
  if (text === '/resume') {
    const c = await prisma.conversation.findFirstOrThrow({ where: { merchantId: merchant.id, chatId: CHAT_ID } });
    await handoffs.resumeAi(c.id);
    console.log('(AI resumed)\n');
    continue;
  }
  if (text === '/pay') {
    if (real) {
      console.log('(real mode: open the Paystack link and pay with the test card; no /pay needed)\n');
      continue;
    }
    const order = await prisma.order.findFirst({
      where: { merchantId: merchant.id, customer: { phone: CHAT_ID }, status: 'AWAITING_PAYMENT' },
      include: { payment: true },
      orderBy: { createdAt: 'desc' },
    });
    if (!order?.payment) {
      console.log('(no order awaiting payment)\n');
      continue;
    }
    fake.markPaid(order.payment.reference, order.totalKobo);
    console.log('(payment result)', await confirmation.confirm({ merchantId: merchant.id, reference: order.payment.reference }), '\n');
    continue;
  }
  await gateway.simulateInbound({ merchantId: merchant.id, chatId: CHAT_ID, messageId: `sim-${Date.now()}-${n++}`, type: 'text', text });
}
if (poller) clearInterval(poller);
await app.close();
