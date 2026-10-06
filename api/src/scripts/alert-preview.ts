import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env } from '../config/env.js';
import { NodemailerMailer } from '../handoff/mailer.js';
import { SimulatorGateway } from '../messaging/simulator.gateway.js';
import { WhatsAppOwnerNotifier } from '../handoff/whatsapp-owner-notifier.js';
import type { PrismaService } from '../prisma/prisma.service.js';

// Sends sample alert emails to the demo store's alert address, so you can see exactly what the owner receives.
// The WhatsApp half goes to a throwaway in-memory gateway, so nobody gets a WhatsApp message from this.
//   npm run alerts:preview
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: env.DATABASE_URL }) });
try {
  const m = await prisma.merchant.findUniqueOrThrow({ where: { ownerEmail: 'demo@shopbot.local' } });
  console.log(`Sending sample alerts for "${m.businessName}" to ${m.alertEmail ?? m.ownerEmail} ...`);

  const gateway = new SimulatorGateway();
  const notifier = new WhatsAppOwnerNotifier(prisma as unknown as PrismaService, gateway, new NodemailerMailer());

  await notifier.notifyHandoff({
    merchantId: m.id,
    conversationId: 'preview',
    customerName: 'Tunde Bakare',
    customerPhone: '2348011112222',
    reason: 'Customer says the jersey arrived torn and wants a refund',
    recent: ['My last order arrived torn', 'I want my money back right now!'],
  });
  await notifier.notifyPayment(m.id, { orderNumber: 'ORD-000012', totalKobo: 3980000, customerName: 'Chidi Okafor' });
  await notifier.notifyPayment(m.id, {
    orderNumber: 'ORD-000013',
    totalKobo: 4500000,
    customerName: 'Ada Obi',
    problem: 'OVERSOLD: payment received but the item is no longer in stock. Contact the customer for an alternative or refund.',
  });

  console.log('\nThe WhatsApp versions of these alerts would read:\n');
  for (const s of gateway.sent) console.log(`${s.text}\n${'-'.repeat(40)}`);
  console.log('Done. Check the inbox (and spam) for 3 emails.');
} finally {
  await prisma.$disconnect();
}
