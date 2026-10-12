import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { env } from '../config/env.js';
import { normalizePhone, parseAllowlist } from './reply-policy.js';

export interface AccessRules {
  mode: 'ALLOWLIST' | 'EVERYONE';
  allowed: ReadonlySet<string>;
  ownerPhone: string;
}

/**
 * Should the assistant answer this chat? Default is no: only approved numbers, unless the owner switched the shop
 * to answer everyone. The owner's own slash commands (/paid, /resume ...) always work, even from a number that is
 * not on the list, but the owner's ordinary messages from that number are treated like anyone else's.
 */
export function decideAccess(rules: AccessRules, chatId: string, text?: string): boolean {
  if (rules.mode === 'EVERYONE') return true;
  if (rules.allowed.has(chatId)) return true;
  return !!text && text.trim().startsWith('/') && normalizePhone(rules.ownerPhone) === chatId;
}

const CACHE_MS = 15_000;
const NOTE_EVERY_MS = 60_000;
export const IGNORED_CAP = 100;

const NOBODY: AccessRules = { mode: 'ALLOWLIST', allowed: new Set(), ownerPhone: '' };

/** The shop's access rules (kept in the database, edited from the dashboard), with a short cache so a busy chat is not a database query per message. */
@Injectable()
export class ChatAccess {
  private readonly log = new Logger(ChatAccess.name);
  private readonly cache = new Map<string, { rules: AccessRules; at: number }>();
  private readonly noted = new Map<string, number>();

  constructor(private readonly prisma: PrismaService) {}

  async rules(merchantId: string): Promise<AccessRules> {
    const hit = this.cache.get(merchantId);
    if (hit && Date.now() - hit.at < CACHE_MS) return hit.rules;
    try {
      const m = await this.prisma.merchant.findUnique({
        where: { id: merchantId },
        select: { replyMode: true, ownerPhone: true, allowedNumbers: { select: { phone: true } } },
      });
      const rules: AccessRules = m
        ? { mode: m.replyMode, allowed: new Set(m.allowedNumbers.map((a) => a.phone)), ownerPhone: m.ownerPhone }
        : NOBODY;
      this.cache.set(merchantId, { rules, at: Date.now() });
      return rules;
    } catch (err) {
      // The database is unreachable: keep using the last rules we knew, or answer nobody. Never answer by accident.
      this.log.error(`Could not load access rules for ${merchantId}: ${err instanceof Error ? err.message : String(err)}`);
      return hit?.rules ?? NOBODY;
    }
  }

  async isAllowed(merchantId: string, chatId: string, text?: string): Promise<boolean> {
    return decideAccess(await this.rules(merchantId), chatId, text);
  }

  /** Called by the dashboard after every change, so it takes effect at once. */
  invalidate(merchantId: string) {
    this.cache.delete(merchantId);
  }

  /** Remembers that someone not on the list messaged, so the owner can approve them with one tap. No message text is stored. */
  noteIgnored(merchantId: string, chatId: string, pushName?: string) {
    const key = `${merchantId}:${chatId}`;
    if (Date.now() - (this.noted.get(key) ?? 0) < NOTE_EVERY_MS) return;
    this.noted.set(key, Date.now());
    if (this.noted.size > 5_000) this.noted.clear();
    void this.writeIgnored(merchantId, chatId, pushName?.slice(0, 60)).catch((e) => this.log.warn(`Could not note ignored number: ${String(e)}`));
  }

  private async writeIgnored(merchantId: string, phone: string, pushName?: string) {
    await this.prisma.ignoredNumber.upsert({
      where: { merchantId_phone: { merchantId, phone } },
      create: { merchantId, phone, pushName },
      update: { count: { increment: 1 }, lastSeenAt: new Date(), ...(pushName ? { pushName } : {}) },
    });
    // A stranger who floods the number must not be able to fill the database: keep only the newest few.
    const total = await this.prisma.ignoredNumber.count({ where: { merchantId } });
    if (total > IGNORED_CAP) {
      const old = await this.prisma.ignoredNumber.findMany({
        where: { merchantId },
        orderBy: { lastSeenAt: 'asc' },
        take: total - IGNORED_CAP,
        select: { id: true },
      });
      await this.prisma.ignoredNumber.deleteMany({ where: { id: { in: old.map((o) => o.id) } } });
    }
  }

  /**
   * One time only: copy the old WHATSAPP_ALLOWLIST / WHATSAPP_REPLY_TO_ALL settings from .env into the shop's own list,
   * so switching to dashboard-managed numbers changes nothing for the people already approved.
   */
  async importEnvOnce(): Promise<void> {
    const m = await this.prisma.merchant.findFirst({
      where: { ownerEmail: env.WHATSAPP_CONNECT_EMAIL, accessImportedAt: null },
      select: { id: true },
    });
    if (!m) return;
    const numbers = [...parseAllowlist(env.WHATSAPP_ALLOWLIST)];
    const everyone = env.WHATSAPP_REPLY_TO_ALL === 'true';
    await this.prisma.tx(async (tx) => {
      if (numbers.length) await tx.allowedNumber.createMany({ data: numbers.map((phone) => ({ merchantId: m.id, phone })), skipDuplicates: true });
      await tx.merchant.update({ where: { id: m.id }, data: { accessImportedAt: new Date(), replyMode: everyone ? 'EVERYONE' : 'ALLOWLIST' } });
    });
    this.invalidate(m.id);
    this.log.log(`Copied ${numbers.length} approved number(s) from .env into the dashboard list${everyone ? ' (answering everyone)' : ''}. From now on, manage them on the WhatsApp page.`);
  }
}
