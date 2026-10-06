import type { Prisma } from '../generated/prisma/client.js';
export type Tx = Prisma.TransactionClient;
export declare class InventoryService {
    reserve(tx: Tx, variantId: string, qty: number): Promise<boolean>;
    release(tx: Tx, variantId: string, qty: number): Promise<void>;
    commit(tx: Tx, variantId: string, qty: number): Promise<void>;
    takeUnreserved(tx: Tx, variantId: string, qty: number): Promise<boolean>;
}
