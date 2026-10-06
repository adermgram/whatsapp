/**
 * Who is the bot allowed to answer? Default: nobody. This protects people who link a personal WhatsApp
 * number for testing (the bot would otherwise reply to friends and family), and limits the blast radius.
 */

/** Digits only; a Nigerian local number 0801... becomes 234801... */
export function normalizePhone(raw: string): string {
  const t = raw.trim();
  if (t.startsWith('lid:')) return t; // WhatsApp privacy ids, copied from the log
  const digits = t.replace(/\D/g, '');
  return /^0\d{10}$/.test(digits) ? `234${digits.slice(1)}` : digits;
}

export function parseAllowlist(raw: string): Set<string> {
  return new Set(
    raw
      .split(',')
      .map(normalizePhone)
      .filter((p) => p.length > 0),
  );
}

export interface ReplyPolicy {
  allowlist: Set<string>;
  replyToAll: boolean;
}

export function isChatAllowed(chatId: string, policy: ReplyPolicy): boolean {
  return policy.replyToAll || policy.allowlist.has(chatId);
}
