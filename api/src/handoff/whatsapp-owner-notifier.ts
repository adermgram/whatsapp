import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MessagingGateway } from '../messaging/messaging.types.js';
import { normalizePhone } from '../messaging/reply-policy.js';
import { formatNaira } from '../common/money.js';
import { Mailer } from './mailer.js';
import { HandoffAlert, OwnerNotifier, PaymentAlert } from './owner-notifier.js';

/**
 * Tells the shop owner what needs them, on WhatsApp and (when SMTP is set up) by email.
 * Every method swallows its own errors: a failed alert must never break a customer's sale.
 */
@Injectable()
export class WhatsAppOwnerNotifier extends OwnerNotifier {
  private readonly log = new Logger(WhatsAppOwnerNotifier.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: MessagingGateway,
    private readonly mailer: Mailer,
  ) {
    super();
  }

  async notifyHandoff(alert: HandoffAlert) {
    const soft = alert.kind === 'attention';
    const text = [
      soft ? '👀 *Heads up about a customer*' : '🔔 *A customer needs you*',
      `${alert.customerName ?? 'A customer'} (+${alert.customerPhone.replace(/\D/g, '')})`,
      `${soft ? 'About' : 'Why'}: ${alert.reason}`,
      ...(alert.recent.length ? ['', 'Their last messages:', ...alert.recent.map((m) => `• ${m.slice(0, 160)}`)] : []),
      '',
      soft
        ? 'The AI is still chatting with them. You do not need to reply unless you want to.'
        : 'The AI has stopped replying in this chat. Reply to them yourself, or send /resume to give the chat back to the AI.',
      ...(alert.customerPhone.startsWith('lid:') ? [] : [`Open the chat: https://wa.me/${alert.customerPhone}`]),
    ].join('\n');
    await this.tell(alert.merchantId, `${soft ? 'Heads up' : 'Customer needs you'}: ${alert.reason}`.slice(0, 120), text);
  }

  /** The owner's own phone already shows the customer's messages, so there is nothing to add. */
  async notifyMessageWhileHuman() {}

  async notifyPayment(merchantId: string, info: PaymentAlert) {
    const who = info.customerName ?? 'a customer';
    const text = info.problem
      ? `⚠️ *Payment needs your attention*\nOrder ${info.orderNumber} · ${formatNaira(info.totalKobo)} from ${who}\n${info.problem}`
      : `💰 *Payment received*\nOrder ${info.orderNumber} · ${formatNaira(info.totalKobo)} from ${who}`;
    await this.tell(merchantId, `${info.problem ? 'Payment problem' : 'Payment received'}: ${info.orderNumber}`, text);
  }

  private async tell(merchantId: string, subject: string, text: string) {
    try {
      const m = await this.prisma.merchant.findUnique({ where: { id: merchantId } });
      if (!m) return;
      const results = await Promise.allSettled([
        this.gateway.sendText(merchantId, normalizePhone(m.ownerPhone), text),
        this.mailer.send(m.alertEmail ?? m.ownerEmail, `[${m.businessName}] ${subject}`, text.replace(/\*/g, '')),
      ]);
      for (const r of results) if (r.status === 'rejected') this.log.warn(`Owner alert part failed: ${String(r.reason)}`);
    } catch (err) {
      this.log.error(`Owner alert failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
