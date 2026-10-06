import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { StoragePort } from '../storage/storage.port.js';
import { ReceiptData, renderReceiptPdf } from './receipt.document.js';

export interface IssuedReceipt {
  receiptId: string;
  number: string;
  fileName: string;
  pdf: Buffer;
}

@Injectable()
export class ReceiptService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StoragePort,
  ) {}

  /**
   * One receipt per order. The number is allocated once (race-safe via the merchant counter), and the PDF
   * is rebuilt from the order each time, so a crash between "number allocated" and "file stored" self-heals.
   */
  async issue(orderId: string): Promise<IssuedReceipt> {
    const order = await this.prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      include: {
        merchant: true,
        customer: true,
        payment: true,
        receipt: true,
        items: { include: { variant: { include: { product: true } } } },
      },
    });
    if (order.status !== 'PAID' && order.status !== 'FULFILLED') {
      throw new Error(`Cannot issue a receipt for unpaid order ${order.orderNumber}`);
    }

    let receipt = order.receipt;
    if (!receipt) {
      try {
        receipt = await this.prisma.$transaction(async (tx) => {
          const m = await tx.merchant.update({
            where: { id: order.merchantId },
            data: { receiptCounter: { increment: 1 } },
            select: { receiptCounter: true },
          });
          const number = `RCP-${String(m.receiptCounter).padStart(6, '0')}`;
          return tx.receipt.create({
            data: { orderId, number, fileKey: `receipts/${order.merchantId}/${number}.pdf` },
          });
        });
      } catch (err) {
        // Another worker issued it first (webhook vs reconciler). Their transaction won, ours rolled back
        // (so no receipt number was burned): just use theirs.
        if ((err as { code?: string }).code !== 'P2002') throw err;
        receipt = await this.prisma.receipt.findUniqueOrThrow({ where: { orderId } });
      }
    }

    const data: ReceiptData = {
      businessName: order.merchant.businessName,
      receiptNumber: receipt.number,
      orderNumber: order.orderNumber,
      paidAt: order.paidAt ?? new Date(),
      customerName: order.customer.name,
      customerPhone: order.customer.phone,
      deliveryAddress: order.deliveryAddress,
      paymentReference: order.payment?.reference ?? '-',
      items: order.items.map((i) => ({
        name: i.variant.product.name,
        size: i.variant.size,
        color: i.variant.color,
        quantity: i.quantity,
        unitPriceKobo: i.unitPriceKobo,
      })),
      subtotalKobo: order.subtotalKobo,
      deliveryFeeKobo: order.deliveryFeeKobo,
      totalKobo: order.totalKobo,
    };
    const pdf = await renderReceiptPdf(data);
    await this.storage.put(receipt.fileKey, pdf, 'application/pdf');

    return { receiptId: receipt.id, number: receipt.number, fileName: `${receipt.number}.pdf`, pdf };
  }
}
