import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrdersService } from '../orders/orders.service.js';
import { PaymentConfirmationService } from './payment-confirmation.service.js';

@Injectable()
export class PaymentJobs {
  private readonly log = new Logger(PaymentJobs.name);
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly orders: OrdersService,
    private readonly confirmation: PaymentConfirmationService,
  ) {}

  /**
   * Safety net for missed webhooks (tunnel down, deploy, Paystack retries exhausted):
   * ask Paystack about every recent unpaid payment. Runs before expiry so a customer who
   * paid at minute 29 is not expired at minute 30.
   */
  @Cron('*/2 * * * *')
  async reconcileAndExpire() {
    if (this.running) return; // never overlap with a slow run
    this.running = true;
    try {
      await this.reconcile();
      const expired = await this.orders.expireStale();
      if (expired) this.log.log(`Expired ${expired} unpaid order(s), stock released`);
    } catch (err) {
      this.log.error(`Payment job failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      this.running = false;
    }
  }

  async reconcile(): Promise<number> {
    const pending = await this.prisma.payment.findMany({
      where: {
        status: 'PENDING',
        createdAt: { gt: new Date(Date.now() - 24 * 3600_000) },
        order: { status: { in: ['AWAITING_PAYMENT', 'EXPIRED', 'CANCELLED'] } }, // a link can still be paid after expiry/cancel
      },
      include: { order: { select: { merchantId: true } } },
      take: 50,
    });
    let paid = 0;
    for (const p of pending) {
      try {
        const status = await this.confirmation.confirm({ merchantId: p.order.merchantId, reference: p.reference });
        if (status === 'paid') paid++;
      } catch (err) {
        this.log.warn(`Reconcile ${p.reference} failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    return paid;
  }
}
