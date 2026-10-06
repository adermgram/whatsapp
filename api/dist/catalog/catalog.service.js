var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let CatalogService = class CatalogService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(params) {
        const products = await this.prisma.product.findMany({
            where: {
                merchantId: params.merchantId,
                active: true,
                ...(params.category ? { category: params.category } : {}),
            },
            include: { variants: true },
            take: 300,
        });
        const tokens = (params.query ?? '')
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter((t) => t.length > 1);
        const hits = [];
        for (const p of products) {
            const haystack = `${p.name} ${p.description ?? ''} ${JSON.stringify(p.attributes)}`.toLowerCase();
            const matched = tokens.filter((t) => haystack.includes(t)).length;
            if (tokens.length > 0 && matched === 0)
                continue;
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
            if (variants.length === 0)
                continue;
            hits.push({
                score: matched,
                hit: {
                    productId: p.id,
                    name: p.name,
                    category: p.category,
                    description: p.description,
                    attributes: p.attributes,
                    imageKeys: p.imageKeys,
                    variants,
                },
            });
        }
        return hits
            .sort((a, b) => b.score - a.score)
            .slice(0, params.limit ?? 5)
            .map((h) => h.hit);
    }
    async getVariant(merchantId, variantId) {
        const v = await this.prisma.variant.findFirst({
            where: { id: variantId, merchantId },
            include: { product: true },
        });
        if (!v)
            return null;
        return { ...v, available: Math.max(v.stock - v.reserved, 0) };
    }
};
CatalogService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CatalogService);
export { CatalogService };
//# sourceMappingURL=catalog.service.js.map