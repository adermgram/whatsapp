import { Injectable } from '@nestjs/common';
import QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service.js';
import { MessagingGateway } from '../messaging/messaging.types.js';
import { AccessAdminService } from './access.admin.service.js';
import { env } from '../config/env.js';

/** Where the shop's WhatsApp link stands, plus the small overview numbers the home page shows. */
@Injectable()
export class WhatsAppAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: MessagingGateway,
    private readonly access: AccessAdminService,
  ) {}

  async status(merchantId: string) {
    const [row, merchant, access] = await Promise.all([
      this.prisma.whatsAppSession.findUnique({ where: { merchantId } }),
      this.prisma.merchant.findUnique({ where: { id: merchantId }, select: { ownerPhone: true, alertEmail: true, aiEnabled: true } }),
      this.access.view(merchantId),
    ]);

    const { live, state } = this.linkState(merchantId);

    // The QR is only handed out while the phone still has to scan it, and only to the logged-in owner.
    const qr = live && state === 'QR_PENDING' && row?.qr ? await QRCode.toDataURL(row.qr, { width: 320, margin: 2 }) : null;

    return {
      live,
      state,
      phone: state === 'CONNECTED' ? row?.phone ?? null : null,
      qr,
      updatedAt: row?.updatedAt ?? null,
      ownerPhone: merchant?.ownerPhone ?? null,
      alertEmail: merchant?.alertEmail ?? null,
      aiEnabled: merchant?.aiEnabled ?? true,
      access,
    };
  }

  /** Real WhatsApp only runs in the bot process. Anywhere else (dev, tests) the answer is "not connected". */
  private linkState(merchantId: string) {
    const live = env.WHATSAPP_ADAPTER === 'baileys';
    return { live, state: live ? this.gateway.sessionState(merchantId) : ('DISCONNECTED' as const) };
  }

  async overview(merchantId: string) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 3_600_000);
    const [waitingChats, awaitingPayment, paid] = await Promise.all([
      this.prisma.conversation.count({ where: { merchantId, mode: 'HUMAN' } }),
      this.prisma.order.count({ where: { merchantId, status: 'AWAITING_PAYMENT' } }),
      this.prisma.order.aggregate({
        where: { merchantId, status: { in: ['PAID', 'FULFILLED'] }, paidAt: { gte: weekAgo } },
        _count: true,
        _sum: { totalKobo: true },
      }),
    ]);
    return {
      waitingChats,
      awaitingPayment,
      paidLast7Days: { count: paid._count, total: (paid._sum.totalKobo ?? 0) / 100 },
      whatsapp: this.linkState(merchantId),
    };
  }
}
