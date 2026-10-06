import { PrismaService } from '../prisma/prisma.service.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { NegotiationService } from '../negotiation/negotiation.service.js';
import { PaymentProvider } from '../payments/payment.provider.js';
export declare class OrderError extends Error {
    readonly code: 'VARIANT_NOT_FOUND' | 'OUT_OF_STOCK' | 'EMPTY_CART' | 'MISSING_DETAILS' | 'NOT_FOUND' | 'PAYMENT_INIT_FAILED';
    constructor(code: 'VARIANT_NOT_FOUND' | 'OUT_OF_STOCK' | 'EMPTY_CART' | 'MISSING_DETAILS' | 'NOT_FOUND' | 'PAYMENT_INIT_FAILED', message: string);
}
export interface MarkPaidResult {
    status: 'paid' | 'already_paid' | 'amount_mismatch' | 'not_found';
    oversold?: boolean;
    orderId?: string;
}
export declare class OrdersService {
    private readonly prisma;
    private readonly inventory;
    private readonly negotiation;
    private readonly payments;
    constructor(prisma: PrismaService, inventory: InventoryService, negotiation: NegotiationService, payments: PaymentProvider);
    getOrCreateDraft(merchantId: string, customerId: string, conversationId: string): Promise<{
        items: {
            id: string;
            variantId: string;
            orderId: string;
            quantity: number;
            listPriceKobo: number;
            unitPriceKobo: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        status: import("../generated/prisma/enums.js").OrderStatus;
        customerId: string;
        conversationId: string;
        orderNumber: string;
        subtotalKobo: number;
        deliveryFeeKobo: number;
        totalKobo: number;
        deliveryAddress: string | null;
        expiresAt: Date | null;
        paidAt: Date | null;
    }>;
    setItem(merchantId: string, customerId: string, conversationId: string, variantId: string, quantity: number): Promise<{
        id: string;
        orderNumber: string;
        status: import("../generated/prisma/enums.js").OrderStatus;
        subtotalKobo: number;
        deliveryFeeKobo: number;
        totalKobo: number;
        deliveryAddress: string | null;
        customerName: string | null;
        items: {
            variantId: string;
            name: string;
            size: string | null;
            color: string | null;
            quantity: number;
            unitPriceKobo: number;
        }[];
    } | null>;
    removeItem(merchantId: string, conversationId: string, variantId: string): Promise<{
        id: string;
        orderNumber: string;
        status: import("../generated/prisma/enums.js").OrderStatus;
        subtotalKobo: number;
        deliveryFeeKobo: number;
        totalKobo: number;
        deliveryAddress: string | null;
        customerName: string | null;
        items: {
            variantId: string;
            name: string;
            size: string | null;
            color: string | null;
            quantity: number;
            unitPriceKobo: number;
        }[];
    } | null>;
    saveCustomerDetails(customerId: string, details: {
        name?: string;
        address?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        merchantId: string;
        phone: string;
        name: string | null;
        address: string | null;
    }>;
    summary(orderId: string): Promise<{
        id: string;
        orderNumber: string;
        status: import("../generated/prisma/enums.js").OrderStatus;
        subtotalKobo: number;
        deliveryFeeKobo: number;
        totalKobo: number;
        deliveryAddress: string | null;
        customerName: string | null;
        items: {
            variantId: string;
            name: string;
            size: string | null;
            color: string | null;
            quantity: number;
            unitPriceKobo: number;
        }[];
    } | null>;
    checkout(merchantId: string, conversationId: string, opts?: {
        deliveryFeeKobo?: number;
    }): Promise<{
        order: {
            id: string;
            orderNumber: string;
            status: import("../generated/prisma/enums.js").OrderStatus;
            subtotalKobo: number;
            deliveryFeeKobo: number;
            totalKobo: number;
            deliveryAddress: string | null;
            customerName: string | null;
            items: {
                variantId: string;
                name: string;
                size: string | null;
                color: string | null;
                quantity: number;
                unitPriceKobo: number;
            }[];
        };
        checkoutUrl: string;
        expiresAt: Date | null;
        reference: string;
        reused: boolean;
    }>;
    cancelAwaiting(orderId: string): Promise<void>;
    private revertToDraft;
    markPaid(orderId: string, paidAmountKobo: number, rawEvent?: unknown): Promise<MarkPaidResult>;
    expireStale(now?: Date, merchantId?: string): Promise<number>;
}
