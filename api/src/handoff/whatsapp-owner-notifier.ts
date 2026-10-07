import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MessagingGateway } from '../messaging/messaging.types.js';
import { normalizePhone } from '../messaging/reply-policy.js';
import { formatNaira } from '../common/money.js';
import { Mailer } from './mailer.js';
import { HandoffAlert, OwnerNotifier, PaymentAlert, PaymentProofAlert } from './owner-notifier.js';
import { cleanCaption } from '../conversations/proof-files.js';

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

  /**
   * Sends the customer's file to the owner's WhatsApp, captioned with everything needed to act on it.
   * The caption (and email, which carries text only: no attachment leaves WhatsApp) never says the
   * payment IS confirmed; the owner decides that with /paid after checking their bank.
   */
  async notifyPaymentProof(merchantId: string, alert: PaymentProofAlert): Promise<boolean> {
    const m = await this.prisma.merchant.findUnique({ where: { id: merchantId } });
    if (!m) return false;

    const said = cleanCaption(alert.caption); // cleaned again here, whoever calls us
    const caption = [
      `💳 *Payment proof* for ${alert.orderNumber} · ${formatNaira(alert.totalKobo)}`,
      `From: ${alert.customerName ?? 'a customer'} (+${alert.customerPhone.replace(/\D/g, '')})`,
      ...(said ? [`They wrote: "${said}"`] : []),
      '',
      `Check your bank. If the money arrived, reply: /paid ${alert.orderNumber}`,
      'The customer is only waiting; nothing is confirmed until you reply.',
    ].join('\n');

    let forwarded = false;
    const ownerChat = normalizePhone(m.ownerPhone); // always from our database, never from anything the customer sent
    try {
      if (alert.file?.kind === 'image') {
        await this.gateway.sendImageBuffer(merchantId, ownerChat, alert.file.data, alert.file.mimeType, caption);
        forwarded = true;
      } else if (alert.file) {
        await this.gateway.sendDocument(merchantId, ownerChat, alert.file.data, alert.file.fileName, alert.file.mimeType, caption);
        forwarded = true;
      } else {
        await this.gateway.sendText(merchantId, ownerChat, caption);
      }
    } catch (err) {
      this.log.warn(`Could not forward payment proof for ${alert.orderNumber}: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Email is the backup channel and is text only: the screenshot (bank details) stays inside WhatsApp.
    await this.mailer.send(
      m.alertEmail ?? m.ownerEmail,
      `[${m.businessName}] Payment proof for ${alert.orderNumber}`,
      caption.replace(/\*/g, '') +
        (forwarded
          ? '\n\nThe file was sent to your WhatsApp.'
          : '\n\nThe file could NOT be forwarded: open the chat on WhatsApp to see it.'),
    );
    return forwarded;
  }

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
