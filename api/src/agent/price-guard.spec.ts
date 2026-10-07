import { describe, expect, it } from 'vitest';
import { findUnverifiedAmounts } from './price-guard.js';

const tool = (obj: object) => JSON.stringify(obj);

describe('findUnverifiedAmounts', () => {
  const searchResult = tool({ results: [{ name: 'Man United Away', options: [{ ref: 'abcd1234', size: 'L', price_naira: 22000 }] }] });

  it('passes a reply whose prices all came from a tool', () => {
    expect(findUnverifiedAmounts('The Manchester United Away Jersey size L na ₦22,000.', [searchResult])).toEqual([]);
    expect(findUnverifiedAmounts('Price na 22k', [searchResult])).toEqual([]); // written another way
  });

  it('catches a price nothing backs up (the invented ₦18,000)', () => {
    expect(findUnverifiedAmounts('The Manchester United Away Jersey size L is ₦18,000.', [searchResult])).toEqual([18000]);
    expect(findUnverifiedAmounts('Na ₦18,000 only', [])).toEqual([18000]);
  });

  it('allows prices from negotiation results, cart totals and what the customer wrote', () => {
    const negotiate = tool({ decision: 'counter', price_naira: 20400 });
    const cart = 'cart: 1x Super Eagles Home Jersey M @ ₦13,800 (total ₦13,800)';
    expect(findUnverifiedAmounts('We fit do ₦20,400', [negotiate])).toEqual([]);
    expect(findUnverifiedAmounts('Your total na ₦13,800', [cart])).toEqual([]);
    expect(findUnverifiedAmounts('₦13,000 is too low o', ['I fit pay 13000'])).toEqual([]);
  });

  it('allows a simple multiple of a known price (two of the same item)', () => {
    expect(findUnverifiedAmounts('Two na ₦44,000', [searchResult])).toEqual([]);
    expect(findUnverifiedAmounts('Three na ₦66,000', [searchResult])).toEqual([]);
    expect(findUnverifiedAmounts('Two na ₦43,000', [searchResult])).toEqual([43000]); // not a multiple: wrong
  });

  it('ignores numbers that are not prices: sizes, minutes, order numbers, phone numbers, years', () => {
    const reply = 'Size 43 or 44? Pay within 30 minutes. Order ORD-000012 for +2348012345678, delivered by 12 Allen Avenue.';
    expect(findUnverifiedAmounts(reply, [])).toEqual([]);
  });

  it('catches several wrong amounts at once', () => {
    expect(findUnverifiedAmounts('Normal price ₦25,000, but I can do ₦19,000', [searchResult]).sort()).toEqual([19000, 25000]);
  });

  it('never needs a price in a reply that has none', () => {
    expect(findUnverifiedAmounts('Which size do you want? We get M, L and XL.', [])).toEqual([]);
  });
});
