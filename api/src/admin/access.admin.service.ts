import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ChatAccess, IGNORED_CAP } from '../messaging/chat-access.js';
import { parseTypedNumber } from '../messaging/reply-policy.js';

export const MAX_ALLOWED_NUMBERS = 200;
const IGNORED_KEEP_DAYS = 30;

/** Who the assistant answers: the approved numbers, the "everyone" switch, and the people who were ignored. */
@Injectable()
export class AccessAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: ChatAccess,
  ) {}

  async view(merchantId: string) {
    // anyone who has not messaged for a month is no longer interesting: tidy them away
    await this.prisma.ignoredNumber.deleteMany({ where: { merchantId, lastSeenAt: { lt: new Date(Date.now() - IGNORED_KEEP_DAYS * 86_400_000) } } });
    const [merchant, allowed, ignored] = await Promise.all([
      this.prisma.merchant.findUnique({ where: { id: merchantId }, select: { replyMode: true, ownerPhone: true } }),
      this.prisma.allowedNumber.findMany({ where: { merchantId }, orderBy: { createdAt: 'desc' }, take: MAX_ALLOWED_NUMBERS }),
      this.prisma.ignoredNumber.findMany({ where: { merchantId }, orderBy: { lastSeenAt: 'desc' }, take: IGNORED_CAP }),
    ]);
    return {
      mode: merchant?.replyMode ?? ('ALLOWLIST' as const),
      allowed: allowed.map((a) => ({ id: a.id, phone: a.phone, label: a.label, createdAt: a.createdAt })),
      ignored: ignored.map((i) => ({ id: i.id, phone: i.phone, name: i.pushName, count: i.count, lastSeenAt: i.lastSeenAt })),
    };
  }

  async setMode(merchantId: string, mode: 'ALLOWLIST' | 'EVERYONE') {
    await this.prisma.merchant.update({ where: { id: merchantId }, data: { replyMode: mode } });
    this.access.invalidate(merchantId);
    return this.view(merchantId);
  }

  async add(merchantId: string, rawPhone: string, label: string | null | undefined) {
    const phone = parseTypedNumber(rawPhone);
    if (!phone) throw new BadRequestException('That does not look like a phone number. Include the country code, for example 2348012345678 or 0801 234 5678.');
    await this.save(merchantId, phone, label?.trim() || null);
    return this.view(merchantId);
  }

  /** Approves someone from the "ignored" list. The id is looked up for THIS shop, so nobody else's list is ever touched. */
  async allowIgnored(merchantId: string, ignoredId: string) {
    const row = await this.prisma.ignoredNumber.findFirst({ where: { id: ignoredId, merchantId } });
    if (!row) throw new NotFoundException('That number is no longer on the list');
    await this.save(merchantId, row.phone, row.pushName);
    return this.view(merchantId);
  }

  async remove(merchantId: string, id: string) {
    const { count } = await this.prisma.allowedNumber.deleteMany({ where: { id, merchantId } });
    if (count === 0) throw new NotFoundException('That number is not on your list');
    this.access.invalidate(merchantId);
    return this.view(merchantId);
  }

  async dismissIgnored(merchantId: string, id: string) {
    const { count } = await this.prisma.ignoredNumber.deleteMany({ where: { id, merchantId } });
    if (count === 0) throw new NotFoundException('That number is no longer on the list');
    return this.view(merchantId);
  }

  private async save(merchantId: string, phone: string, label: string | null) {
    const existing = await this.prisma.allowedNumber.findUnique({ where: { merchantId_phone: { merchantId, phone } } });
    if (!existing && (await this.prisma.allowedNumber.count({ where: { merchantId } })) >= MAX_ALLOWED_NUMBERS) {
      throw new BadRequestException(`You can approve up to ${MAX_ALLOWED_NUMBERS} numbers. Remove some first, or switch to answering everyone.`);
    }
    await this.prisma.allowedNumber.upsert({
      where: { merchantId_phone: { merchantId, phone } },
      create: { merchantId, phone, label },
      update: label ? { label } : {},
    });
    await this.prisma.ignoredNumber.deleteMany({ where: { merchantId, phone } });
    this.access.invalidate(merchantId);
  }
}
