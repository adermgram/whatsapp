import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { z } from 'zod';
import { AuthGuard, CurrentMerchant } from '../auth/auth.guard.js';
import type { AuthedMerchant } from '../auth/auth.guard.js';
import { parse } from '../auth/auth.controller.js';
import { MAX_IMAGE_UPLOAD_BYTES } from './product-image.processor.js';
import { ProductsAdminService, productInput, productPatch, variantInput } from './products.service.js';

const variantPatch = z.object({
  size: z.string().trim().max(20).nullish(),
  color: z.string().trim().max(30).nullish(),
  price: z.number().positive().max(100_000_000).optional(),
  minPrice: z.number().positive().max(100_000_000).optional(),
  stock: z.number().int().min(0).max(100_000).optional(),
});
const imagePatch = z.object({ color: z.string().trim().max(30).nullish() });
const orderBody = z.object({ order: z.array(z.string().uuid()).max(50) });
const listQuery = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.string().max(20).optional(),
  active: z.enum(['true', 'false']).optional(),
});

/** Every route here needs a valid login, and the shop always comes from that login. */
@Controller('api')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly products: ProductsAdminService) {}

  @Get('products')
  list(@CurrentMerchant() m: AuthedMerchant, @Query() query: unknown) {
    const q = parse(listQuery, query);
    return this.products.list(m.id, { q: q.q, category: q.category, active: q.active === undefined ? undefined : q.active === 'true' });
  }

  @Post('products')
  create(@CurrentMerchant() m: AuthedMerchant, @Body() body: unknown) {
    return this.products.create(m.id, parse(productInput, body));
  }

  @Get('products/:id')
  get(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string) {
    return this.products.get(m.id, id);
  }

  @Patch('products/:id')
  update(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string, @Body() body: unknown) {
    return this.products.update(m.id, id, parse(productPatch, body));
  }

  // ---- size options ----

  @Post('products/:id/variants')
  addVariant(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string, @Body() body: unknown) {
    return this.products.addVariant(m.id, id, parse(variantInput, body));
  }

  @Patch('variants/:id')
  updateVariant(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string, @Body() body: unknown) {
    return this.products.updateVariant(m.id, id, parse(variantPatch, body));
  }

  @Delete('variants/:id')
  deleteVariant(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string) {
    return this.products.deleteVariant(m.id, id);
  }

  // ---- photos ----

  /** multipart/form-data, field "files" (up to 5 per request); an optional "color" field tags them. */
  @Post('products/:id/images')
  @UseInterceptors(FilesInterceptor('files', 5, { limits: { fileSize: MAX_IMAGE_UPLOAD_BYTES, files: 5, fields: 4 } }))
  addImages(
    @CurrentMerchant() m: AuthedMerchant,
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { color?: string },
  ) {
    if (!files?.length) throw new BadRequestException('Choose at least one picture');
    const color = typeof body?.color === 'string' ? body.color.trim().slice(0, 30) : null;
    return this.products.addImages(m.id, id, files, color);
  }

  @Put('products/:id/images/order')
  reorder(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string, @Body() body: unknown) {
    return this.products.reorderImages(m.id, id, parse(orderBody, body).order);
  }

  /** The picture itself, for the dashboard's <img> tags. Login required, and only your own shop's pictures. */
  @Get('images/:id')
  async image(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const data = await this.products.readImage(m.id, id);
    res
      .set({
        'Content-Type': 'image/jpeg',
        'Content-Length': String(data.length),
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
      })
      .send(data);
  }

  @Patch('images/:id')
  updateImage(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string, @Body() body: unknown) {
    return this.products.updateImage(m.id, id, parse(imagePatch, body));
  }

  @Delete('images/:id')
  @HttpCode(200)
  deleteImage(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string) {
    return this.products.deleteImage(m.id, id);
  }
}
