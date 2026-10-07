import { extractAmountsNaira } from './amounts.js';

const MIN_PRICE = 500; // below this a number is a size, a quantity or minutes, not a price
const MAX_PRICE = 10_000_000; // above this it is a phone number or an id

/**
 * Finds naira amounts in an AI reply that nothing backs up.
 *
 * `sources` is everything the AI legitimately knew when it wrote the reply: this turn's tool results (catalog
 * prices, negotiated prices, cart and order totals), the conversation so far (including amounts the customer
 * wrote and prices already quoted), and the current cart. An amount in the reply that appears in none of them
 * was made up, or taken from the wrong item. Whole-number multiples (2 items x a known price) are allowed.
 *
 * It cannot tell a real price of the WRONG product from the right one, but it stops invented numbers, which is
 * the common failure; and the order total itself is always computed by the server, never by the AI.
 */
export function findUnverifiedAmounts(reply: string, sources: string[]): number[] {
  const known = new Set<number>();
  for (const s of sources) for (const a of extractAmountsNaira(s)) known.add(a);

  const isKnown = (a: number) => known.has(a) || [2, 3, 4, 5].some((k) => Number.isInteger(a / k) && known.has(a / k));

  return extractAmountsNaira(reply).filter((a) => a >= MIN_PRICE && a <= MAX_PRICE && !isKnown(a));
}
