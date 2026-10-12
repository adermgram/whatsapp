import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { z } from 'zod';
import { AuthGuard, CurrentMerchant } from '../auth/auth.guard.js';
import type { AuthedMerchant } from '../auth/auth.guard.js';
import { parse } from '../auth/auth.controller.js';
import { AccessAdminService } from './access.admin.service.js';
import { ChatsAdminService } from './chats.admin.service.js';
import { ORDER_STATUSES, OrdersAdminService } from './orders.admin.service.js';
import { WhatsAppAdminService } from './whatsapp.admin.service.js';

const orderQuery = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  q: z.string().trim().max(60).optional(),
});
const chatQuery = z.object({ waiting: z.enum(['true', 'false']).optional() });
const addNumber = z.object({ phone: z.string().trim().min(5).max(30), label: z.string().trim().max(40).nullish() });
const replyMode = z.object({ mode: z.enum(['ALLOWLIST', 'EVERYONE']) });

/** Orders, chats and the WhatsApp link. Same rule as the product routes: the shop always comes from the login. */
@Controller('api')
@UseGuards(AuthGuard)
export class OperationsController {
  constructor(
    private readonly orders: OrdersAdminService,
    private readonly chats: ChatsAdminService,
    private readonly whatsapp: WhatsAppAdminService,
    private readonly access: AccessAdminService,
  ) {}

  // ---- home ----

  @Get('overview')
  overview(@CurrentMerchant() m: AuthedMerchant) {
    return this.whatsapp.overview(m.id);
  }

  // ---- orders ----

  @Get('orders')
  listOrders(@CurrentMerchant() m: AuthedMerchant, @Query() query: unknown) {
    return this.orders.list(m.id, parse(orderQuery, query));
  }

  @Get('orders/:id')
  getOrder(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string) {
    return this.orders.get(m.id, id);
  }

  /** Confirms a bank-transfer payment. Safe to press twice: the customer is only told once. */
  @Post('orders/:id/mark-paid')
  @HttpCode(200)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  markPaid(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string) {
    return this.orders.markPaid(m.id, id);
  }

  @Get('orders/:id/receipt')
  async receipt(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const { data, fileName } = await this.orders.receiptFile(m.id, id);
    res
      .set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Content-Length': String(data.length),
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
      })
      .send(data);
  }

  // ---- chats ----

  @Get('chats')
  listChats(@CurrentMerchant() m: AuthedMerchant, @Query() query: unknown) {
    return this.chats.list(m.id, parse(chatQuery, query).waiting === 'true');
  }

  @Get('chats/:id')
  getChat(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string) {
    return this.chats.get(m.id, id);
  }

  @Post('chats/:id/resume')
  @HttpCode(200)
  resume(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string) {
    return this.chats.resume(m.id, id);
  }

  @Post('chats/:id/take-over')
  @HttpCode(200)
  takeOver(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string) {
    return this.chats.takeOver(m.id, id);
  }

  // ---- WhatsApp link ----

  @Get('whatsapp')
  whatsappStatus(@CurrentMerchant() m: AuthedMerchant) {
    return this.whatsapp.status(m.id);
  }

  // ---- who the assistant answers ----

  /** Switch between "only approved numbers" and "everyone". */
  @Put('whatsapp/reply-mode')
  setReplyMode(@CurrentMerchant() m: AuthedMerchant, @Body() body: unknown) {
    return this.access.setMode(m.id, parse(replyMode, body).mode);
  }

  @Post('whatsapp/allowed')
  @HttpCode(200)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  addAllowed(@CurrentMerchant() m: AuthedMerchant, @Body() body: unknown) {
    const b = parse(addNumber, body);
    return this.access.add(m.id, b.phone, b.label);
  }

  @Delete('whatsapp/allowed/:id')
  removeAllowed(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string) {
    return this.access.remove(m.id, id);
  }

  /** One tap to approve someone who messaged while they were not on the list. */
  @Post('whatsapp/ignored/:id/allow')
  @HttpCode(200)
  allowIgnored(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string) {
    return this.access.allowIgnored(m.id, id);
  }

  @Delete('whatsapp/ignored/:id')
  dismissIgnored(@CurrentMerchant() m: AuthedMerchant, @Param('id', ParseUUIDPipe) id: string) {
    return this.access.dismissIgnored(m.id, id);
  }
}
