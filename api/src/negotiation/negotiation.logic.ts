/** Prices are in kobo. 1 naira = 100 kobo. */
const NAIRA = 100;
const ROUND_TO = 100 * NAIRA; // counters are rounded up to the nearest ₦100

export interface OfferInput {
  listKobo: number;
  /** Per-variant minimum the owner accepts. */
  floorKobo: number;
  /** Merchant-wide cap on discount off list price (0 = no haggling). */
  maxDiscountPercent: number;
  offerKobo: number;
  /** How many offers the customer has already made for this item (0 on the first). */
  priorRounds: number;
}

export type OfferResult =
  | { decision: 'accept'; priceKobo: number }
  | { decision: 'counter'; priceKobo: number; final: boolean }
  | { decision: 'decline'; priceKobo: number; final: true; suggestHandoff: boolean };

/** Lowest price we will ever agree to: the stricter of the per-item floor and the merchant discount cap. */
export function effectiveFloor(listKobo: number, floorKobo: number, maxDiscountPercent: number): number {
  const pct = Math.min(Math.max(maxDiscountPercent, 0), 100);
  const discountFloor = Math.ceil((listKobo * (100 - pct)) / 100);
  return Math.min(listKobo, Math.max(floorKobo, discountFloor));
}

const roundUp = (kobo: number) => Math.ceil(kobo / ROUND_TO) * ROUND_TO;

/**
 * Deterministic haggling. The LLM only ever sees this result, never the floor.
 * Each round has a target price we concede to (40%, then 75% of the room, then the floor).
 * An offer at or above that round's target is accepted; below it we counter AT the target,
 * so a customer cannot undercut our own counter-offer or jump straight to the floor.
 */
export function evaluateOffer(input: OfferInput): OfferResult {
  const { listKobo, floorKobo, maxDiscountPercent, offerKobo, priorRounds } = input;
  const floor = effectiveFloor(listKobo, floorKobo, maxDiscountPercent);

  if (offerKobo >= listKobo) return { decision: 'accept', priceKobo: listKobo };

  // Nothing to give: the owner allows no discount on this item.
  if (floor >= listKobo) {
    return { decision: 'decline', priceKobo: listKobo, final: true, suggestHandoff: false };
  }

  const room = listKobo - floor;
  const round = priorRounds + 1; // this offer's round number, 1-based
  const targetFor = (r: number) => {
    const concession = r === 1 ? 0.4 : r === 2 ? 0.75 : 1;
    return Math.min(listKobo, Math.max(floor, roundUp(listKobo - room * concession)));
  };
  const target = targetFor(round);
  // The price we quoted last round. A customer offering more than that just pays what we quoted.
  const standing = priorRounds > 0 ? targetFor(round - 1) : listKobo;

  if (offerKobo >= standing) return { decision: 'accept', priceKobo: standing };
  if (offerKobo >= target) return { decision: 'accept', priceKobo: offerKobo };

  // The customer keeps pushing past the last step: final answer at the floor, and flag the owner.
  // (A low-ball early on is NOT answered with the floor: that would hand the owner's minimum to anyone
  // who types a silly number. It gets the normal step-by-step counter instead.)
  if (round >= 5) {
    return { decision: 'decline', priceKobo: floor, final: true, suggestHandoff: true };
  }

  return { decision: 'counter', priceKobo: target, final: target === floor };
}
