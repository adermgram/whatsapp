import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { SimulatorGateway } from '../messaging/simulator.gateway.js';
import { Mailer } from './mailer.js';
import { WhatsAppOwnerNotifier } from './whatsapp-owner-notifier.js';

class RecordingMailer extends Mailer {
  readonly sent: { to: string; subject: string; text: string }[] = [];
  async send(to: string, subject: string, text: string) {
    this.sent.push({ to, subject, text });
    return true;
  }
}

class BrokenMailer extends Mailer {
  async send(): Promise<boolean> {
    throw new Error('smtp down');
  }
}

class BrokenGateway extends SimulatorGateway {
  override async sendText(): Promise<void> {
    throw new Error('whatsapp not connected');
  }
}

const prisma = new PrismaService();
let withAlert: string;
let withoutAlert: string;

const makeMerchant = async (alertEmail: string | null, ownerPhone: string) =>
  (
    await prisma.merchant.create({
      data: {
        businessName: 'Alert Test Store',
        ownerName: 'Owner',
        ownerPhone,
        ownerEmail: `login-${randomUUID()}@shopbot.local`,
        alertEmail,
        passwordHash: 'x',
      },
    })
  ).id;

beforeAll(async () => {
  await prisma.$connect();
  withAlert = await makeMerchant('alerts@example.com', '08012345678');
  withoutAlert = await makeMerchant(null, '2348099999999');
});

afterAll(async () => {
  await prisma.merchant.deleteMany({ where: { id: { in: [withAlert, withoutAlert] } } });
  await prisma.$disconnect();
});

const handoff = (merchantId: string) => ({
  merchantId,
  conversationId: 'c1',
  customerName: 'Tunde Bakare',
  customerPhone: '2348011112222',
  reason: 'Customer wants a refund for a torn jersey',
  recent: ['My order arrived torn', 'I want my money back'],
});

describe('owner alerts', () => {
  it('sends a handoff alert to the owner on WhatsApp and to the alert email, not the login email', async () => {
    const gateway = new SimulatorGateway();
    const mailer = new RecordingMailer();
    await new WhatsAppOwnerNotifier(prisma, gateway, mailer).notifyHandoff(handoff(withAlert));

    expect(gateway.sent).toHaveLength(1);
    expect(gateway.sent[0]).toMatchObject({ chatId: '2348012345678', kind: 'text' }); // 0801... normalised
    expect(gateway.sent[0]!.text).toContain('Tunde Bakare');
    expect(gateway.sent[0]!.text).toContain('torn jersey');
    expect(gateway.sent[0]!.text).toContain('https://wa.me/2348011112222');

    expect(mailer.sent).toHaveLength(1);
    expect(mailer.sent[0]!.to).toBe('alerts@example.com');
    expect(mailer.sent[0]!.subject).toContain('Alert Test Store');
    expect(mailer.sent[0]!.text).not.toContain('*'); // WhatsApp bold markers are stripped from emails
  });

  it('falls back to the login email when no alert email is set', async () => {
    const mailer = new RecordingMailer();
    await new WhatsAppOwnerNotifier(prisma, new SimulatorGateway(), mailer).notifyPayment(withoutAlert, {
      orderNumber: 'ORD-000007',
      totalKobo: 3980000,
      customerName: 'Chidi',
    });
    expect(mailer.sent[0]!.to).toMatch(/^login-.*@shopbot\.local$/);
    expect(mailer.sent[0]!.text).toContain('Payment received');
    expect(mailer.sent[0]!.text).toContain('₦39,800');
  });

  it('marks a payment problem clearly', async () => {
    const gateway = new SimulatorGateway();
    await new WhatsAppOwnerNotifier(prisma, gateway, new RecordingMailer()).notifyPayment(withAlert, {
      orderNumber: 'ORD-000008',
      totalKobo: 1500000,
      customerName: null,
      problem: 'OVERSOLD: payment received but the item is no longer in stock.',
    });
    expect(gateway.sent[0]!.text).toContain('needs your attention');
    expect(gateway.sent[0]!.text).toContain('OVERSOLD');
  });

  it('never throws when WhatsApp or email is down, and still tries the other channel', async () => {
    const mailer = new RecordingMailer();
    const notifier = new WhatsAppOwnerNotifier(prisma, new BrokenGateway(), mailer);
    await expect(notifier.notifyHandoff(handoff(withAlert))).resolves.toBeUndefined();
    expect(mailer.sent).toHaveLength(1); // email still went out although WhatsApp failed

    const gateway = new SimulatorGateway();
    await expect(
      new WhatsAppOwnerNotifier(prisma, gateway, new BrokenMailer()).notifyHandoff(handoff(withAlert)),
    ).resolves.toBeUndefined();
    expect(gateway.sent).toHaveLength(1); // WhatsApp still went out although email failed
  });

  it('does not message the owner for every customer message while a chat is with a human', async () => {
    const gateway = new SimulatorGateway();
    const mailer = new RecordingMailer();
    await new WhatsAppOwnerNotifier(prisma, gateway, mailer).notifyMessageWhileHuman();
    expect(gateway.sent).toHaveLength(0);
    expect(mailer.sent).toHaveLength(0);
  });
});
