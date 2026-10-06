import 'dotenv/config';
import { createInterface } from 'node:readline';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { SimulatorGateway } from '../messaging/simulator.gateway.js';
import { PaymentConfirmationService } from '../payments/payment-confirmation.service.js';
import { FakePaymentProvider } from '../payments/fake-payment.provider.js';
import { OwnerNotifier, LogOwnerNotifier } from '../handoff/owner-notifier.js';
import { HandoffService } from '../handoff/handoff.service.js';

// Terminal chat against the real agent + real DB, with the WhatsApp side simulated.
//   /pay    pretend the customer paid the latest order (fake provider)
//   /owner  show handoff alerts the owner would have received
//   /resume give the chat back to the AI
//   /quit
const CHAT_ID = process.env.CHAT_ID ?? '2348011112222';

const app = await NestFactory.createApplicationContext(AppModule, { logger: process.env.DEBUG_AGENT ? ['error', 'warn', 'debug'] : ['error', 'warn'] });
const prisma = app.get(PrismaService);
const gateway = app.get(SimulatorGateway);
const confirmation = app.get(PaymentConfirmationService);
const fake = app.get(FakePaymentProvider);
const notifier = app.get(OwnerNotifier) as LogOwnerNotifier;
const handoffs = app.get(HandoffService);

const merchant = await prisma.merchant.findFirstOrThrow({ where: { ownerEmail: 'demo@shopbot.local' } });
console.log(`Chatting with "${merchant.businessName}" as customer ${CHAT_ID}. Commands: /pay /owner /resume /quit\n`);

let n = 0;
async function say(text: string) {
  const before = gateway.sent.length;
  await gateway.simulateInbound({ merchantId: merchant.id, chatId: CHAT_ID, messageId: `sim-${Date.now()}-${n++}`, type: 'text', text });
  for (const s of gateway.sent.slice(before)) console.log(`bot> ${s.kind === 'text' ? s.text : `[${s.kind}] ${s.fileName ?? s.url ?? ''}`}\n`);
}

const rl = createInterface({ input: process.stdin });
for await (const line of rl) {
  const text = line.trim();
  if (!text) continue;
  console.log(`you> ${text}`);
  if (text === '/quit') break;
  if (text === '/owner') { console.log(JSON.stringify(notifier.alerts, null, 2), '\n'); continue; }
  if (text === '/resume') {
    const c = await prisma.conversation.findFirstOrThrow({ where: { merchantId: merchant.id, chatId: CHAT_ID } });
    await handoffs.resumeAi(c.id);
    console.log('(AI resumed)\n');
    continue;
  }
  if (text === '/pay') {
    const order = await prisma.order.findFirst({
      where: { merchantId: merchant.id, customer: { phone: CHAT_ID }, status: 'AWAITING_PAYMENT' },
      include: { payment: true },
      orderBy: { createdAt: 'desc' },
    });
    if (!order?.payment) { console.log('(no order awaiting payment)\n'); continue; }
    const before = gateway.sent.length;
    fake.markPaid(order.payment.reference, order.totalKobo);
    console.log('(payment result)', await confirmation.confirm({ merchantId: merchant.id, reference: order.payment.reference }));
    for (const s of gateway.sent.slice(before)) {
      console.log(`bot> ${s.kind === 'text' ? s.text : `[${s.kind}] ${s.fileName ?? ''} (${s.size} bytes) ${s.text ?? ''}`}`);
    }
    console.log();
    continue;
  }
  await say(text);
}
await app.close();
