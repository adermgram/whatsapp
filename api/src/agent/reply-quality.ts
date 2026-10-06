/** Checks and clean-up applied to every model reply before a customer sees it. Pure, so it is unit tested. */

// Runs of asterisks, "glitch" apologies, leaked tool/channel syntax or JSON fragments.
const BROKEN_PATTERNS = [
  /\*{4,}/,
  /\*\*\.\.\.\*\*/,
  /\bglitch\b/i,
  /<\|[a-z_]+\|>/i,
  /"(ref|variant_id|offer_naira|price_naira)"\s*:/,
  /\bto=functions\./i,
];

export function looksBroken(text: string | null | undefined): boolean {
  const t = (text ?? '').trim();
  if (!t) return true;
  return BROKEN_PATTERNS.some((re) => re.test(t));
}

const LINK_PLACEHOLDER = '[LINK]';

/**
 * Final step for every AI reply: put the exact payment URL in FIRST (models mangle URLs), then clean.
 * Order matters: cleaning must see the real URL so it can strip asterisks stuck to it.
 */
export function finalizeReply(reply: string, paymentLink?: string): string {
  const withLink = paymentLink
    ? reply.includes(LINK_PLACEHOLDER)
      ? reply.split(LINK_PLACEHOLDER).join(paymentLink)
      : `${reply}\n\n${paymentLink}`
    : reply.split(LINK_PLACEHOLDER).join('');
  return cleanReply(withLink);
}

/** WhatsApp formatting: *bold* uses single asterisks, there are no headings, and look-alike hyphens break URLs. */
export function cleanReply(text: string): string {
  let t = text
    // Internal item ids are for tools only: "(ref d82bd519)", "[ref: d82bd519]", "ref d82bd519".
    .replace(/\s*[(\[]?\s*\bref\b[:=\s]*[0-9a-f]{8}\b[)\]]?/gi, '')
    .replace(/\*\*(.+?)\*\*/g, '*$1*')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[‐‑‒–]/g, '-') // look-alike hyphens
    .replace(/[​-‍⁠﻿]/g, '') // zero-width characters
    // Asterisks stuck to a URL stop WhatsApp from making it tappable.
    .replace(/\*+(?=https?:\/\/)/g, '')
    .replace(/(https?:\/\/[^\s*]+)\*+/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  // Smaller models sometimes wrap the whole message in *...* (everything bold) or leave asterisks
  // unbalanced. Unbalanced asterisks render as literal junk, so drop them all.
  const stars = (t.match(/\*/g) ?? []).length;
  if (stars % 2 === 1) t = t.replace(/\*/g, '');
  else if (/^\*[^*]+\*$/s.test(t)) t = t.slice(1, -1).trim();
  return t;
}
