import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrdersService } from '../orders/orders.service.js';
import { PaymentProvider } from './payment.provider.js';
import { ReceiptService } from '../receipts/receipt.service.js';
import { MessagingGateway } from '../messaging/messaging.types.js';
import { OwnerNotifier } from '../handoff/owner-notifier.js';
import { HandoffService } from '../handoff/handoff.service.js';
import { decryptSecret } from '../config/secrets.js';
import { formatNaira } from '../common/money.js';

export type ConfirmStatus =
  | 'paid'
  | 'already_paid'
  | 'not_paid'
  | 'unknown_reference'
  | 'amount_mismatch'
  | 'currency_mismatch';

/**
 * The single place a payment becomes "real". Called by the Paystack webhook AND by the reconciler,
 * so it must be safe to run any number of times for the same reference, in any order, even concurrently.
 * It never trusts the caller: it re-verifies with the provider before changing anything.
 */
@Injectable()
export class PaymentConfirmationService {
  private readonly log = new Logger(PaymentConfirmationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly orders: OrdersService,
    private readonly provider: PaymentProvider,
    private readonly receipts: ReceiptService,
    private readonly gateway: MessagingGateway,
    private readonly notifier: OwnerNotifier,
    private readonly handoffs: HandoffService,
  ) {}

  async confirm(args: { merchantId: string; reference: string; rawEvent?: unknown }): Promise<ConfirmStatus> {
    const payment = await this.prisma.payment.findUnique({
      where: { reference: args.reference },
      include: { order: { include: { customer: true, merchant: true, conversation: true } } },
    });
    // A reference that is not ours (or belongs to another merchant) is ignored, never an error to the caller.
    if (!payment || payment.order.merchantId !== args.merchantId) return 'unknown_reference';
    const { order } = payment;

    const secret = order.merchant.paystackSecretEnc ? decryptSecret(order.merchant.paystackSecretEnc) : null;
    const verified = await this.provider.verify(secret, args.reference);
    if (!verified.paid) return 'not_paid';
    if (verified.currency !== 'NGN') {
      await this.alertOwner(order.merchantId, order, `Payment arrived in ${verified.currency}, not NGN. Check Paystack.`);
      return 'currency_mismatch';
    }

    const res = await this.orders.markPaid(order.id, verified.amountKobo, args.rawEvent);
    if (res.status === 'not_found') return 'unknown_reference';
    if (res.status === 'amount_mismatch') {
      await this.alertOwner(
        order.merchantId,
        order,
        `Customer paid ${formatNaira(verified.amountKobo)} but the order total is ${formatNaira(order.totalKobo)}.`,
      );
      return 'amount_mismatch';
    }

    if (res.status === 'paid') {
      if (res.oversold) {
        await this.say(
          order,
          `Your payment of ${formatNaira(order.totalKobo)} for order ${order.orderNumber} has been received. The item just sold out, so ${order.merchant.businessName} will contact you shortly to sort this out with you.`,
        );
        await this.alertOwner(
          order.merchantId,
          order,
          'OVERSOLD: payment received but the item is no longer in stock. Contact the customer for an alternative or refund.',
        );
        await this.handoffs
          .handoff(order.conversationId, `Paid order ${order.orderNumber} is oversold`)
          .catch((e) => this.log.error(`handoff failed: ${String(e)}`));
      } else {
        await this.notifier.notifyPayment(order.merchantId, {
          orderNumber: order.orderNumber,
          totalKobo: order.totalKobo,
          customerName: order.customer.name,
        });
      }
    }

    // Runs for 'already_paid' too: if a previous attempt crashed before the receipt went out, this finishes the job.
    if (!(res.status === 'paid' && res.oversold)) await this.deliverReceipt(order.id);
    return res.status === 'paid' ? 'paid' : 'already_paid';
  }

  /** Sends the receipt at most once, even if the webhook and the reconciler race. */
  private async deliverReceipt(orderId: string) {
    const existing = await this.prisma.receipt.findUnique({ where: { orderId } });
    if (existing?.sentAt) return;

    const issued = await this.receipts.issue(orderId);
    const claimed = await this.prisma.receipt.updateMany({
      where: { id: issued.receiptId, sentAt: null },
      data: { sentAt: new Date() },
    });
    if (claimed.count === 0) return; // another worker is sending it

    const order = await this.prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      include: { customer: true, merchant: true, conversation: true },
    });
    const first = order.customer.name?.split(/\s+/)[0] ?? 'there';
    try {
      await this.say(
        order,
        `Payment received, thank you ${first}! ✅\nOrder ${order.orderNumber} · ${formatNaira(order.totalKobo)}\nYour receipt is attached. ${order.merchant.businessName} will confirm your delivery details shortly.`,
      );
      await this.gateway.sendDocument(
        order.merchantId,
        order.conversation.chatId,
        issued.pdf,
        issued.fileName,
        'application/pdf',
        `Receipt ${issued.number}`,
      );
    } catch (err) {
      // Let the next attempt (reconciler / webhook retry) send it.
      await this.prisma.receipt.update({ where: { id: issued.receiptId }, data: { sentAt: null } });
      throw err;
    }
  }

  /** Sends a system message and records it, so the AI knows what the customer has been told. */
  private async say(
    order: { merchantId: string; conversationId: string; conversation: { chatId: string } },
    text: string,
  ) {
    await this.gateway.sendText(order.merchantId, order.conversation.chatId, text);
    await this.prisma.message.create({
      data: {
        merchantId: order.merchantId,
        conversationId: order.conversationId,
        direction: 'OUTBOUND',
        sender: 'AI',
        type: 'text',
        text,
      },
    });
  }

  private alertOwner(
    merchantId: string,
    order: { orderNumber: string; totalKobo: number; customer: { name: string | null } },
    problem: string,
  ) {
    return this.notifier.notifyPayment(merchantId, {
      orderNumber: order.orderNumber,
      totalKobo: order.totalKobo,
      customerName: order.customer.name,
      problem,
    });
  }
}
