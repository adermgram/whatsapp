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
  return text
    .replace(/\*\*(.+?)\*\*/g, '*$1*')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[‐‑‒–]/g, '-') // look-alike hyphens
    .replace(/[​-‍⁠﻿]/g, '') // zero-width characters
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
