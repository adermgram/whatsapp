import { PrismaService } from '../prisma/prisma.service.js';
import type { ProductCategory } from '../generated/prisma/client.js';
export interface CatalogHit {
    productId: string;
    name: string;
    category: ProductCategory;
    description: string | null;
    attributes: Record<string, unknown>;
    photoCount: number;
    variants: {
        variantId: string;
        size: string | null;
        color: string | null;
        priceKobo: number;
        available: number;
    }[];
}
export interface SearchParams {
    merchantId: string;
    query?: string;
    category?: ProductCategory;
    size?: string;
    maxPriceKobo?: number;
    limit?: number;
}
export declare class CatalogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    search(params: SearchParams): Promise<CatalogHit[]>;
    getVariant(merchantId: string, variantId: string): Promise<{
        available: number;
        product: {
            id: string;
            createdAt: Date;
            merchantId: string;
            name: string;
            description: string | null;
            category: ProductCategory;
            attributes: import("@prisma/client/runtime/client").JsonValue;
            active: boolean;
        };
        id: string;
        createdAt: Date;
        merchantId: string;
        productId: string;
        color: string | null;
        sku: string | null;
        size: string | null;
        priceKobo: number;
        minPriceKobo: number;
        stock: number;
        reserved: number;
    } | null>;
}
