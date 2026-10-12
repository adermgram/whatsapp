import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { StoragePort } from '../storage/storage.port.js';
import { PaymentConfirmationService } from '../payments/payment-confirmation.service.js';
import { koboToNaira } from '../common/money.js';
import type { Prisma } from '../generated/prisma/client.js';

export const ORDER_STATUSES = ['AWAITING_PAYMENT', 'PAID', 'FULFILLED', 'CANCELLED', 'EXPIRED'] as const;
export type ListedStatus = (typeof ORDER_STATUSES)[number];

const include = {
  customer: true,
  payment: true,
  receipt: true,
  items: { include: { variant: { include: { product: true } } } },
} satisfies Prisma.OrderInclude;

type OrderRow = Prisma.OrderGetPayload<{ include: typeof include }>;

/** What the dashboard shows. Money is in naira; the floor price is never part of an order view. */
function view(o: OrderRow) {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    subtotal: koboToNaira(o.subtotalKobo),
    deliveryFee: koboToNaira(o.deliveryFeeKobo),
    total: koboToNaira(o.totalKobo),
    deliveryAddress: o.deliveryAddress,
    createdAt: o.createdAt,
    paidAt: o.paidAt,
    expiresAt: o.expiresAt,
    conversationId: o.conversationId,
    customer: { name: o.customer.name, phone: o.customer.phone },
    items: o.items.map((i) => ({
      name: i.variant.product.name,
      size: i.variant.size,
      color: i.variant.color,
      quantity: i.quantity,
      unitPrice: koboToNaira(i.unitPriceKobo),
      listPrice: koboToNaira(i.listPriceKobo),
    })),
    payment: o.payment
      ? {
          status: o.payment.status,
          reference: o.payment.reference,
          // "manual" = the owner confirmed it (bank transfer), not Paystack
          manual: (o.payment.rawEvent as { manual?: boolean } | null)?.manual === true,
        }
      : null,
    receipt: o.receipt ? { number: o.receipt.number, sent: !!o.receipt.sentAt } : null,
  };
}

export type MarkPaidOutcome = 'paid' | 'already_paid' | 'oversold';

@Injectable()
export class OrdersAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StoragePort,
    private readonly confirmation: PaymentConfirmationService,
  ) {}

  /** Newest first. Carts that never reached checkout (DRAFT) are not orders yet, so they are never listed. */
  async list(merchantId: string, opts: { status?: ListedStatus; q?: string }) {
    const q = opts.q?.trim();
    const where: Prisma.OrderWhereInput = {
      merchantId,
      status: opts.status ?? { not: 'DRAFT' },
      ...(q
        ? {
            OR: [
              { orderNumber: { contains: q, mode: 'insensitive' } },
              { customer: { name: { contains: q, mode: 'insensitive' } } },
              { customer: { phone: { contains: q.replace(/\D/g, '') || q } } },
            ],
          }
        : {}),
    };
    const [rows, grouped] = await Promise.all([
      this.prisma.order.findMany({ where, include, orderBy: { createdAt: 'desc' }, take: 100 }),
      this.prisma.order.groupBy({ by: ['status'], where: { merchantId, status: { not: 'DRAFT' } }, _count: true }),
    ]);
    const counts = Object.fromEntries(ORDER_STATUSES.map((s) => [s, grouped.find((g) => g.status === s)?._count ?? 0]));
    return { orders: rows.map(view), counts };
  }

  async get(merchantId: string, id: string) {
    const o = await this.prisma.order.findFirst({ where: { id, merchantId, status: { not: 'DRAFT' } }, include });
    if (!o) throw new NotFoundException('Order not found');
    return view(o);
  }

  /**
   * The owner confirms money that reached them outside Paystack (bank transfer). Same path as the /paid command:
   * stock is committed and the customer gets their confirmation and receipt, exactly once.
   */
  async markPaid(merchantId: string, id: string): Promise<{ outcome: MarkPaidOutcome; order: ReturnType<typeof view> }> {
    const found = await this.prisma.order.findFirst({ where: { id, merchantId }, select: { orderNumber: true } });
    if (!found) throw new NotFoundException('Order not found');

    const result = await this.confirmation.markPaidManually(merchantId, found.orderNumber);
    if (result === 'not_found') throw new NotFoundException('Order not found');
    if (result === 'not_awaiting') throw new ConflictException('This order has not reached payment yet, so there is nothing to confirm.');
    return { outcome: result, order: await this.get(merchantId, id) };
  }

  /** The receipt PDF, only for an order of this shop that already has one. */
  async receiptFile(merchantId: string, id: string): Promise<{ data: Buffer; fileName: string }> {
    const o = await this.prisma.order.findFirst({ where: { id, merchantId }, include: { receipt: true } });
    if (!o?.receipt) throw new NotFoundException('There is no receipt for this order yet');
    const data = await this.storage.get(o.receipt.fileKey);
    if (!data) throw new NotFoundException('The receipt file is missing');
    return { data, fileName: `${o.receipt.number}.pdf` };
  }
}
