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

/** WhatsApp formatting: *bold* uses single asterisks, there are no headings, and look-alike hyphens break URLs. */
export function cleanReply(text: string): string {
  let t = text
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
