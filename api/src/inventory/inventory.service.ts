import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';

export type Tx = Prisma.TransactionClient;

/**
 * Stock bookkeeping. Every method is a single conditional UPDATE, so two customers
 * ordering the last item at the same instant cannot both succeed (row lock + WHERE guard).
 *   available = stock - reserved
 */
@Injectable()
export class InventoryService {
  /** Hold units for an unpaid order. Returns false if not enough are available. */
  async reserve(tx: Tx, variantId: string, qty: number): Promise<boolean> {
    const rows = await tx.$executeRaw`
      UPDATE "Variant" SET reserved = reserved + ${qty}
      WHERE id = ${variantId} AND stock - reserved >= ${qty}`;
    return rows === 1;
  }

  /** Give held units back (order expired or cancelled). */
  async release(tx: Tx, variantId: string, qty: number): Promise<void> {
    await tx.$executeRaw`
      UPDATE "Variant" SET reserved = GREATEST(reserved - ${qty}, 0)
      WHERE id = ${variantId}`;
  }

  /** Payment confirmed: turn a reservation into a real stock decrease. */
  async commit(tx: Tx, variantId: string, qty: number): Promise<void> {
    await tx.$executeRaw`
      UPDATE "Variant"
      SET stock = GREATEST(stock - ${qty}, 0), reserved = GREATEST(reserved - ${qty}, 0)
      WHERE id = ${variantId}`;
  }

  /**
   * Late payment for an order whose reservation already expired: take stock directly if any is left.
   * Returns false when oversold (money received but nothing to ship, so the owner must be told).
   */
  async takeUnreserved(tx: Tx, variantId: string, qty: number): Promise<boolean> {
    const rows = await tx.$executeRaw`
      UPDATE "Variant" SET stock = stock - ${qty}
      WHERE id = ${variantId} AND stock - reserved >= ${qty}`;
    return rows === 1;
  }
}
