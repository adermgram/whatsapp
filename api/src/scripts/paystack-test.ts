import 'dotenv/config';

// Real Paystack end-to-end test (use a TEST secret key). It:
//   1. creates a real order in the demo store and a real Paystack payment link
//   2. waits while YOU pay it in the browser (test card)
//   3. confirms the payment arrives (via webhook if a tunnel is set up, otherwise via the 2-minute reconciler)
//   4. shows the receipt that was sent and where the PDF is saved
process.env.PAYMENT_DRIVER = 'paystack'; // must be set before the app modules load
const { NestFactory } = await import('@nestjs/core');
const { AppModule } = await import('../app.module.js');
const { PrismaService } = await import('../prisma/prisma.service.js');
const { SimulatorGateway } = await import('../messaging/simulator.gateway.js');
const { OrdersService } = await import('../orders/orders.service.js');
const { PaymentJobs } = await import('../payments/payment.jobs.js');
const { env } = await import('../config/env.js');
const { resolve } = await import('node:path');

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const app = await NestFactory.create(AppModule, { rawBody: true, logger: ['error', 'warn'] });
await app.listen(env.PORT);
const prisma = app.get(PrismaService);
const gateway = app.get(SimulatorGateway);
const orders = app.get(OrdersService);
const jobs = app.get(PaymentJobs);

const merchant = await prisma.merchant.findFirstOrThrow({ where: { ownerEmail: 'demo@shopbot.local' } });
if (!merchant.paystackSecretEnc) {
  console.error('This merchant has no Paystack key yet. Run: npm run paystack:set-key');
  process.exit(1);
}
const variant = await prisma.variant.findFirstOrThrow({
  where: { merchantId: merchant.id, stock: { gt: 0 }, product: { name: { contains: 'Super Eagles' } }, size: 'M' },
});

const phone = `234800${String(Date.now()).slice(-7)}`;
const customer = await prisma.customer.create({
  data: { merchantId: merchant.id, phone, name: 'Paystack Tester', address: '1 Test Street, Ikeja, Lagos' },
});
const conv = await prisma.conversation.create({ data: { merchantId: merchant.id, customerId: customer.id, chatId: phone } });
await orders.setItem(merchant.id, customer.id, conv.id, variant.id, 1);

console.log('\nCreating a real Paystack payment link...');
const { order, checkoutUrl, reference } = await orders.checkout(merchant.id, conv.id);
console.log(`\nOrder ${order.orderNumber}  total ₦${(order.totalKobo / 100).toLocaleString()}  reference ${reference}`);
console.log(`\n>>> OPEN THIS LINK AND PAY WITH THE TEST CARD <<<\n${checkoutUrl}\n`);
console.log('Test card: 4084 0840 8408 4081 | any future expiry | CVV 408 | PIN 0000 | OTP 123456');
console.log(`Webhook URL (if using a tunnel): ${env.PUBLIC_BASE_URL}/webhooks/paystack/${merchant.id}`);
console.log('\nWaiting up to 10 minutes for payment... (checking Paystack every 20s as well)\n');

const deadline = Date.now() + 10 * 60_000;
let status = 'AWAITING_PAYMENT';
let lastPoll = 0;
while (Date.now() < deadline && status !== 'PAID') {
  await sleep(2000);
  status = (await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status;
  if (status !== 'PAID' && Date.now() - lastPoll > 20_000) {
    lastPoll = Date.now();
    await jobs.reconcile(); // same safety net the app runs every 2 minutes, just faster for this test
    status = (await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status;
  }
}

if (status !== 'PAID') {
  console.log(`\nNot paid within 10 minutes (status ${status}). Nothing was lost: run the script again.`);
} else {
  const receipt = await prisma.receipt.findUniqueOrThrow({ where: { orderId: order.id } });
  const payment = await prisma.payment.findUniqueOrThrow({ where: { orderId: order.id } });
  console.log(`\n✅ PAID. Payment status ${payment.status}, receipt ${receipt.number}`);
  for (const s of gateway.sent.filter((x) => x.chatId === phone)) {
    console.log(`  customer got: ${s.kind === 'document' ? `[PDF ${s.fileName}, ${s.size} bytes]` : s.text}`);
  }
  console.log(`\nReceipt file: ${resolve(env.STORAGE_DIR, receipt.fileKey)}`);
}

await app.close();
process.exit(status === 'PAID' ? 0 : 1);
