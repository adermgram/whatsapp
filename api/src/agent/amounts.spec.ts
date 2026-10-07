import { describe, expect, it } from 'vitest';
import { customerStatedAmount, extractAmountsNaira } from './amounts.js';

const amounts = (t: string) => extractAmountsNaira(t).sort((a, b) => a - b);

describe('extractAmountsNaira', () => {
  it('reads plain and comma-separated numbers', () => {
    expect(amounts('I fit pay 13000')).toEqual([13000]);
    expect(amounts('ok 16,000 then')).toEqual([16000]);
    expect(amounts('1,300,000')).toEqual([1300000]);
  });

  it('reads the naira sign and a leading N', () => {
    expect(amounts('₦12,500 last')).toEqual([12500]);
    expect(amounts('N15000 abeg')).toEqual([15000]);
  });

  it('reads k, thousand and grand, with decimals', () => {
    expect(amounts('30k')).toEqual([30000]);
    expect(amounts('I go pay 13.5k')).toEqual([13500]);
    expect(amounts('20 K na my last')).toEqual([20000]);
    expect(amounts('18 thousand')).toEqual([18000]);
    expect(amounts('25 grand')).toEqual([25000]);
  });

  it('finds several amounts in one message', () => {
    expect(amounts('not 15k, 14000 final')).toEqual([14000, 15000]);
  });

  it('reads an amount followed by ordinary punctuation, including a comma', () => {
    expect(amounts('₦25,000, but I can do ₦19,000')).toEqual([19000, 25000]);
    expect(amounts('20,000, abeg')).toEqual([20000]);
    expect(amounts('I fit pay 13000. Last')).toEqual([13000]);
    expect(amounts('(18000)')).toEqual([18000]);
    expect(amounts('15,000; 16,000')).toEqual([15000, 16000]);
  });

  it('does not split a longer number at a comma', () => {
    expect(amounts('1,300,000')).toEqual([1300000]);
  });

  it('finds nothing in a plain price question', () => {
    expect(amounts('how much be am')).toEqual([]);
    expect(amounts('what is the last price?')).toEqual([]);
    expect(amounts('abeg send picture')).toEqual([]);
  });

  it('does not misread digits glued inside other tokens', () => {
    expect(amounts('order ORD-000012')).toEqual([12]); // plain digits are amounts; the AI picks an offer from them, harmless
    expect(amounts('call 0801-234-5678')).not.toContain(801234);
  });
});

describe('customerStatedAmount', () => {
  it('accepts an offer the customer wrote, in any of their recent messages', () => {
    expect(customerStatedAmount(30000, ['hi', 'last price? I fit pay 30k'])).toBe(true);
    expect(customerStatedAmount(13000, ['13,000 abeg'])).toBe(true);
  });

  it('rejects an offer the customer never made (the AI made it up)', () => {
    expect(customerStatedAmount(20000, ['how much be am', 'size L'])).toBe(false);
    expect(customerStatedAmount(22000, ['hi'])).toBe(false);
    expect(customerStatedAmount(18000, [])).toBe(false);
  });

  it('is not fooled by a nearby but different amount', () => {
    expect(customerStatedAmount(14000, ['I fit pay 13000'])).toBe(false);
  });
});
