import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service.js';
import { StoragePort } from '../storage/storage.port.js';
import { InvalidImageError, processProductImage } from './product-image.processor.js';
import type { Prisma } from '../generated/prisma/client.js';

export const MAX_IMAGES_PER_PRODUCT = 10;
const CATEGORIES = ['CLOTHES', 'SHOES', 'JERSEY', 'ACCESSORIES'] as const;

const attributes = z
  .record(z.string().min(1).max(40), z.union([z.string().max(120), z.number(), z.boolean()]))
  .refine((a) => Object.keys(a).length <= 20, 'Too many attributes');

export const productInput = z.object({
  name: z.string().trim().min(1, 'Give the product a name').max(120),
  category: z.enum(CATEGORIES),
  description: z.string().trim().max(1000).nullish(),
  attributes: attributes.optional(),
  active: z.boolean().optional(),
});
export const productPatch = productInput.partial();

const naira = z.number().positive('Must be more than 0').max(100_000_000);
export const variantInput = z
  .object({
    size: z.string().trim().max(20).nullish(),
    color: z.string().trim().max(30).nullish(),
    price: naira,
    minPrice: naira,
    stock: z.number().int().min(0).max(100_000),
  })
  .refine((v) => v.minPrice <= v.price, { message: 'The lowest price cannot be higher than the selling price', path: ['minPrice'] });

const kobo = (n: number) => Math.round(n * 100);
const toNaira = (k: number) => k / 100;
const blank = (v: string | null | undefined) => (v && v.trim() ? v.trim() : null);

/** A file as it arrives from the upload (multer memory storage). */
export interface UploadedFile {
  buffer: Buffer;
  originalname?: string;
}

export interface UploadResult {
  name: string;
  ok: boolean;
  imageId?: string;
  error?: string;
}

const IMAGE_ERRORS: Record<string, string> = {
  unsupported: 'Only JPG, PNG or WebP pictures are accepted',
  too_large: 'That picture is too big (limit 8 MB)',
  too_many_pixels: 'That picture has too many pixels; please resize it',
  corrupt: 'That file is damaged or not a real picture',
};

/**
 * Everything the owner does to the catalog from the dashboard. EVERY method takes the merchant id first and every
 * query is scoped by it. A product, size option or photo belonging to another shop is simply "not found".
 */
@Injectable()
export class ProductsAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StoragePort,
  ) {}

  // ---- products ----------------------------------------------------------------------------------

  async list(merchantId: string, filter: { q?: string; category?: string; active?: boolean } = {}) {
    const products = await this.prisma.product.findMany({
      where: {
        merchantId,
        ...(filter.category && (CATEGORIES as readonly string[]).includes(filter.category) ? { category: filter.category as (typeof CATEGORIES)[number] } : {}),
        ...(filter.active !== undefined ? { active: filter.active } : {}),
        ...(filter.q ? { name: { contains: filter.q, mode: 'insensitive' as const } } : {}),
      },
      include: { variants: { orderBy: { size: 'asc' } }, images: { orderBy: { position: 'asc' }, select: { id: true } } },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    return products.map((p) => this.view(p));
  }

  async get(merchantId: string, id: string) {
    const p = await this.prisma.product.findFirst({
      where: { id, merchantId },
      include: { variants: { orderBy: { size: 'asc' } }, images: { orderBy: { position: 'asc' } } },
    });
    if (!p) throw new NotFoundException('Product not found');
    return this.view(p);
  }

  async create(merchantId: string, input: z.infer<typeof productInput>) {
    const p = await this.prisma.product.create({
      data: {
        merchantId,
        name: input.name,
        category: input.category,
        description: blank(input.description),
        attributes: input.attributes ?? {},
        active: input.active ?? true,
      },
    });
    return this.get(merchantId, p.id);
  }

  async update(merchantId: string, id: string, input: z.infer<typeof productPatch>) {
    const { count } = await this.prisma.product.updateMany({
      where: { id, merchantId },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.description !== undefined ? { description: blank(input.description) } : {}),
        ...(input.attributes !== undefined ? { attributes: input.attributes } : {}),
        ...(input.active !== undefined ? { active: input.active } : {}),
      },
    });
    if (count === 0) throw new NotFoundException('Product not found');
    return this.get(merchantId, id);
  }

  // ---- size options (variants) -------------------------------------------------------------------

  async addVariant(merchantId: string, productId: string, input: z.infer<typeof variantInput>) {
    const product = await this.prisma.product.findFirst({ where: { id: productId, merchantId }, select: { id: true } });
    if (!product) throw new NotFoundException('Product not found');
    await this.prisma.variant.create({
      data: {
        productId,
        merchantId,
        size: blank(input.size),
        color: blank(input.color),
        priceKobo: kobo(input.price),
        minPriceKobo: kobo(input.minPrice),
        stock: input.stock,
      },
    });
    return this.get(merchantId, productId);
  }

  async updateVariant(merchantId: string, variantId: string, input: Partial<z.infer<typeof variantInput>>) {
    const v = await this.prisma.variant.findFirst({ where: { id: variantId, merchantId } });
    if (!v) throw new NotFoundException('Size option not found');

    // Validate the RESULT: changing only the selling price must not leave it below the lowest price.
    const price = input.price ?? toNaira(v.priceKobo);
    const minPrice = input.minPrice ?? toNaira(v.minPriceKobo);
    if (minPrice > price) throw new BadRequestException('minPrice: The lowest price cannot be higher than the selling price');

    if (input.stock !== undefined) await this.setStock(merchantId, variantId, input.stock);
    await this.prisma.variant.updateMany({
      where: { id: variantId, merchantId },
      data: {
        ...(input.size !== undefined ? { size: blank(input.size) } : {}),
        ...(input.color !== undefined ? { color: blank(input.color) } : {}),
        priceKobo: kobo(price),
        minPriceKobo: kobo(minPrice),
      },
    });
    return this.get(merchantId, v.productId);
  }

  /**
   * Sets the units on the shelf. Atomic: refused if customers are holding more than that right now
   * (unpaid orders reserve stock), judged at the moment of the update rather than from an earlier read.
   */
  async setStock(merchantId: string, variantId: string, stock: number) {
    const { count } = await this.prisma.variant.updateMany({
      where: { id: variantId, merchantId, reserved: { lte: stock } },
      data: { stock },
    });
    if (count === 1) return;
    const v = await this.prisma.variant.findFirst({ where: { id: variantId, merchantId }, select: { reserved: true } });
    if (!v) throw new NotFoundException('Size option not found');
    throw new ConflictException(`${v.reserved} unit(s) are reserved for customers who have not paid yet, so stock cannot go below ${v.reserved}`);
  }

  async deleteVariant(merchantId: string, variantId: string) {
    const v = await this.prisma.variant.findFirst({ where: { id: variantId, merchantId } });
    if (!v) throw new NotFoundException('Size option not found');
    if ((await this.prisma.orderItem.count({ where: { variantId } })) > 0) {
      throw new ConflictException('This size option has been ordered before, so it cannot be deleted. Set its stock to 0 instead.');
    }
    await this.prisma.variant.delete({ where: { id: variantId } });
    return this.get(merchantId, v.productId);
  }

  // ---- photos ------------------------------------------------------------------------------------

  /** Processes and stores each file independently, so one bad picture does not lose the others. */
  async addImages(merchantId: string, productId: string, files: UploadedFile[], color?: string | null) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, merchantId },
      select: { id: true, _count: { select: { images: true } } },
    });
    if (!product) throw new NotFoundException('Product not found');

    let position = await this.nextPosition(productId);
    let count = product._count.images;
    const results: UploadResult[] = [];

    for (const file of files) {
      const name = (file.originalname ?? 'picture').replace(/[^\w.\- ]/g, '').slice(0, 60) || 'picture';
      if (count >= MAX_IMAGES_PER_PRODUCT) {
        results.push({ name, ok: false, error: `A product can have at most ${MAX_IMAGES_PER_PRODUCT} pictures` });
        continue;
      }
      try {
        const processed = await processProductImage(file.buffer);
        const id = randomUUID();
        const key = `products/${merchantId}/${id}.jpg`;
        await this.storage.put(key, processed.data, 'image/jpeg');
        try {
          await this.prisma.productImage.create({
            data: { id, productId, merchantId, key, color: blank(color), position: position++, bytes: processed.data.length },
          });
        } catch (err) {
          await this.storage.delete(key).catch(() => undefined); // do not leave an orphan file behind
          throw err;
        }
        count++;
        results.push({ name, ok: true, imageId: id });
      } catch (err) {
        results.push({ name, ok: false, error: err instanceof InvalidImageError ? (IMAGE_ERRORS[err.reason] ?? 'Invalid picture') : 'Could not save that picture' });
      }
    }
    return { results, product: await this.get(merchantId, productId) };
  }

  /** The bytes of one photo, only if it belongs to this shop. */
  async readImage(merchantId: string, imageId: string): Promise<Buffer> {
    const img = await this.prisma.productImage.findFirst({ where: { id: imageId, merchantId } });
    const data = img ? await this.storage.get(img.key) : null;
    if (!data) throw new NotFoundException('Picture not found');
    return data;
  }

  async updateImage(merchantId: string, imageId: string, patch: { color?: string | null }) {
    const img = await this.prisma.productImage.findFirst({ where: { id: imageId, merchantId } });
    if (!img) throw new NotFoundException('Picture not found');
    await this.prisma.productImage.update({ where: { id: imageId }, data: { color: blank(patch.color) } });
    return this.get(merchantId, img.productId);
  }

  async deleteImage(merchantId: string, imageId: string) {
    const img = await this.prisma.productImage.findFirst({ where: { id: imageId, merchantId } });
    if (!img) throw new NotFoundException('Picture not found');
    await this.prisma.productImage.delete({ where: { id: imageId } });
    await this.storage.delete(img.key).catch(() => undefined);
    return this.get(merchantId, img.productId);
  }

  /** Puts the pictures in the order given (first = main photo). Ids that are not this product's are ignored. */
  async reorderImages(merchantId: string, productId: string, orderedIds: string[]) {
    const images = await this.prisma.productImage.findMany({ where: { productId, merchantId }, select: { id: true } });
    if (images.length === 0 && !(await this.prisma.product.findFirst({ where: { id: productId, merchantId }, select: { id: true } }))) {
      throw new NotFoundException('Product not found');
    }
    const mine = new Set(images.map((i) => i.id));
    const ordered = [...new Set(orderedIds)].filter((id) => mine.has(id));
    const rest = images.map((i) => i.id).filter((id) => !ordered.includes(id));
    await this.prisma.tx(async (tx) => {
      let position = 0;
      for (const id of [...ordered, ...rest]) await tx.productImage.update({ where: { id }, data: { position: position++ } });
    });
    return this.get(merchantId, productId);
  }

  private async nextPosition(productId: string) {
    const last = await this.prisma.productImage.findFirst({ where: { productId }, orderBy: { position: 'desc' }, select: { position: true } });
    return (last?.position ?? -1) + 1;
  }

  // ---- shape sent to the dashboard (naira, not kobo) ---------------------------------------------

  private view(
    p: Prisma.ProductGetPayload<{ include: { variants: true; images: true } }> | { id: string; merchantId: string; name: string; category: string; description: string | null; attributes: Prisma.JsonValue; active: boolean; createdAt: Date; variants: Prisma.VariantGetPayload<object>[]; images: { id: string }[] },
  ) {
    const images = p.images as { id: string; color?: string | null; position?: number }[];
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      attributes: p.attributes as Record<string, string | number | boolean>,
      active: p.active,
      createdAt: p.createdAt,
      variants: p.variants.map((v) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        price: toNaira(v.priceKobo),
        minPrice: toNaira(v.minPriceKobo),
        stock: v.stock,
        reserved: v.reserved,
        available: Math.max(v.stock - v.reserved, 0),
      })),
      images: images.map((i) => ({ id: i.id, color: i.color ?? null, position: i.position ?? 0 })),
      mainImageId: images[0]?.id ?? null,
      totalAvailable: p.variants.reduce((sum, v) => sum + Math.max(v.stock - v.reserved, 0), 0),
    };
  }
}
