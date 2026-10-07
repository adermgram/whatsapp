import { Injectable } from '@nestjs/common';
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

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Keyword search over name, description and attributes (club, season, brand...).
   * MVP catalogs are small, so we filter in memory. Never returns the owner's floor price.
   */
  async search(params: SearchParams): Promise<CatalogHit[]> {
    const products = await this.prisma.product.findMany({
      where: {
        merchantId: params.merchantId,
        active: true,
        ...(params.category ? { category: params.category } : {}),
      },
      include: { variants: true, _count: { select: { images: true } } },
      take: 300,
    });

    const tokens = (params.query ?? '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 1);

    const hits: { score: number; hit: CatalogHit }[] = [];
    for (const p of products) {
      const haystack = `${p.name} ${p.description ?? ''} ${JSON.stringify(p.attributes)}`.toLowerCase();
      const matched = tokens.filter((t) => haystack.includes(t)).length;
      if (tokens.length > 0 && matched === 0) continue;

      const variants = p.variants
        .filter((v) => (params.size ? v.size?.toLowerCase() === params.size.toLowerCase() : true))
        .filter((v) => (params.maxPriceKobo ? v.priceKobo <= params.maxPriceKobo : true))
        .map((v) => ({
          variantId: v.id,
          size: v.size,
          color: v.color,
          priceKobo: v.priceKobo,
          available: Math.max(v.stock - v.reserved, 0),
        }));
      if (variants.length === 0) continue;

      hits.push({
        score: matched,
        hit: {
          productId: p.id,
          name: p.name,
          category: p.category,
          description: p.description,
          attributes: p.attributes as Record<string, unknown>,
          photoCount: p._count.images,
          variants,
        },
      });
    }

    return hits
      .sort((a, b) => b.score - a.score)
      .slice(0, params.limit ?? 5)
      .map((h) => h.hit);
  }

  /** Fresh price and availability for one variant, scoped to the merchant. */
  async getVariant(merchantId: string, variantId: string) {
    const v = await this.prisma.variant.findFirst({
      where: { id: variantId, merchantId },
      include: { product: true },
    });
    if (!v) return null;
    return { ...v, available: Math.max(v.stock - v.reserved, 0) };
  }
}
