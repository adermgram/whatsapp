import { describe, expect, it } from 'vitest';
import { effectiveFloor, evaluateOffer } from './negotiation.logic.js';

const naira = (n: number) => n * 100;
const base = {
  listKobo: naira(20000),
  floorKobo: naira(15000),
  maxDiscountPercent: 30,
  priorRounds: 0,
};

describe('effectiveFloor', () => {
  it('uses the stricter of item floor and merchant discount cap', () => {
    expect(effectiveFloor(naira(20000), naira(15000), 30)).toBe(naira(15000)); // cap would allow 14k
    expect(effectiveFloor(naira(20000), naira(15000), 10)).toBe(naira(18000)); // cap is stricter
  });

  it('never exceeds list price', () => {
    expect(effectiveFloor(naira(20000), naira(25000), 50)).toBe(naira(20000));
  });
});

describe('evaluateOffer', () => {
  it('accepts at or above list at list price', () => {
    expect(evaluateOffer({ ...base, offerKobo: naira(25000) })).toEqual({
      decision: 'accept',
      priceKobo: naira(20000),
    });
  });

  it('accepts an offer at or above the current round target, at the offered price', () => {
    // round 1 target = 18,000 (40% of the 5,000 room)
    expect(evaluateOffer({ ...base, offerKobo: naira(18500) })).toEqual({
      decision: 'accept',
      priceKobo: naira(18500),
    });
    expect(evaluateOffer({ ...base, offerKobo: naira(18000) }).decision).toBe('accept');
  });

  it('does not let the customer undercut our counter-offer', () => {
    // 16,000 is above the 15,000 floor but below the round-1 target, so we counter at 18,000
    expect(evaluateOffer({ ...base, offerKobo: naira(16000) })).toEqual({
      decision: 'counter',
      priceKobo: naira(18000),
      final: false,
    });
    // the same offer is only accepted once the concession schedule has reached it (round 3)
    expect(evaluateOffer({ ...base, offerKobo: naira(15000), priorRounds: 2 }).decision).toBe('accept');
  });

  it('charges our standing quote when the customer offers more than we asked', () => {
    // round 2: we quoted 18,000 in round 1; a customer offering 19,000 pays 18,000
    expect(evaluateOffer({ ...base, offerKobo: naira(19000), priorRounds: 1 })).toEqual({
      decision: 'accept',
      priceKobo: naira(18000),
    });
  });

  it('concedes in steps and never goes below the floor', () => {
    const r1 = evaluateOffer({ ...base, offerKobo: naira(12000), priorRounds: 0 });
    const r2 = evaluateOffer({ ...base, offerKobo: naira(13000), priorRounds: 1 });
    const r3 = evaluateOffer({ ...base, offerKobo: naira(14000), priorRounds: 2 });
    expect(r1).toEqual({ decision: 'counter', priceKobo: naira(18000), final: false });
    expect(r2).toEqual({ decision: 'counter', priceKobo: naira(16300), final: false });
    expect(r3).toEqual({ decision: 'counter', priceKobo: naira(15000), final: true });
    for (const r of [r1, r2, r3]) expect(r.priceKobo).toBeGreaterThanOrEqual(naira(15000));
  });

  it('each counter is lower than the previous one', () => {
    const prices = [0, 1, 2].map(
      (priorRounds) => evaluateOffer({ ...base, offerKobo: naira(13000), priorRounds }).priceKobo,
    );
    expect(prices[0]).toBeGreaterThan(prices[1]);
    expect(prices[1]).toBeGreaterThan(prices[2]);
  });

  it('answers a low-ball with the normal counter, never the floor', () => {
    const r = evaluateOffer({ ...base, offerKobo: naira(500) });
    expect(r).toEqual({ decision: 'counter', priceKobo: naira(18000), final: false });
  });

  it('suggests handoff when the customer keeps pushing', () => {
    const r = evaluateOffer({ ...base, offerKobo: naira(14000), priorRounds: 4 });
    expect(r.decision).toBe('decline');
    expect(r).toMatchObject({ suggestHandoff: true, priceKobo: naira(15000) });
  });

  it('declines at list when the owner allows no discount', () => {
    const r = evaluateOffer({ ...base, maxDiscountPercent: 0, offerKobo: naira(19000) });
    expect(r).toEqual({ decision: 'decline', priceKobo: naira(20000), final: true, suggestHandoff: false });
  });

  it('never reveals the floor through accepted prices below it', () => {
    for (let offer = 1000; offer < 15000; offer += 500) {
      const r = evaluateOffer({ ...base, offerKobo: naira(offer) });
      expect(r.decision === 'accept').toBe(false);
    }
  });
});
