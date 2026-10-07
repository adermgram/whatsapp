/**
 * Reads the naira amounts a customer actually wrote. Used to make sure a price offer reaching the haggling logic
 * is one the CUSTOMER made, not one the AI made up ("how much be am" is a question, not an offer).
 *
 * Understands: 13000, 13,000, ₦13,000, N13000, 13k, 13.5k, 13 k, 13 thousand, 13 grand.
 */
export function extractAmountsNaira(text: string): number[] {
  const found = new Set<number>();
  const clean = text.replace(/[₦]/g, ' ').toLowerCase();

  // 13k, 13.5k, 13 k, 13 thousand, 13 grand
  for (const m of clean.matchAll(/(\d+(?:[.,]\d+)?)\s*(k|thousand|grand)\b/g)) {
    const n = Number(m[1]!.replace(',', '.'));
    if (Number.isFinite(n)) found.add(Math.round(n * 1000));
  }
  // 13,000 / 13000 / 1,300,000 / N13000 (a leading "n" as the naira sign)
  // (a number followed by k/thousand/grand was already read above, so it is skipped here)
  for (const m of clean.matchAll(/(?<![\d.,])n?(\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?(?!\.\d|\d|,\d|\s*(?:k|thousand|grand)\b)/g)) {
    const n = Number(m[1]!.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) found.add(n);
  }
  return [...found];
}

/** True when `offer` (naira) matches an amount the customer wrote, allowing for rounding. */
export function customerStatedAmount(offerNaira: number, recentCustomerMessages: string[]): boolean {
  return recentCustomerMessages.some((m) => extractAmountsNaira(m).some((a) => Math.abs(a - offerNaira) < 1));
}
