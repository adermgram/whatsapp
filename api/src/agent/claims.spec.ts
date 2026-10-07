import { describe, expect, it } from 'vitest';
import { contradictions, findClaims } from './claims.js';

describe('findClaims', () => {
  it('spots claims that something was added to the cart, in English and Pidgin', () => {
    for (const reply of [
      'I don add the Super Eagles Home Jersey size M to your cart for ₦15,000.',
      "I've added the jersey to your cart.",
      'Thanks Seun! I don add the Super Eagles jersey size M to your cart. If you want to buy more, tell me.',
      'The Arsenal jersey added to your cart.',
      'Great, I just added it to your cart. Anything else?',
    ]) {
      expect(findClaims(reply).addedToCart, reply).toBe(true);
    }
  });

  it('does not treat a question or an offer as a claim', () => {
    for (const reply of [
      'You want make I add am to your cart?',
      'Do you want me to add it to your cart?',
      'Before I add the Super Eagles jersey size M to your cart, I need your confirmation on the price.',
      'I go add am to your cart once you pick a size.',
      'Which size do you want? We have M, L and XL.',
    ]) {
      expect(findClaims(reply).addedToCart, reply).toBe(false);
    }
  });

  it('spots claims that details were saved', () => {
    expect(findClaims('Thanks Seun! I don save your name and address.').savedDetails).toBe(true);
    expect(findClaims("I've saved your details.").savedDetails).toBe(true);
    expect(findClaims('Can you share your name and address?').savedDetails).toBe(false);
    expect(findClaims('Your name and address na Seun Adebayo, Surulere. Correct?').savedDetails).toBe(false);
  });
});

describe('contradictions', () => {
  const empty = { hasCart: false, hasUnpaidOrder: false, hasName: false, hasAddress: false };

  it('flags "added to cart" when the cart is empty', () => {
    const c = contradictions({ addedToCart: true, savedDetails: false }, empty);
    expect(c).toHaveLength(1);
    expect(c[0]).toContain('set_cart_item');
  });

  it('flags "saved" when the name or address is missing', () => {
    const c = contradictions({ addedToCart: false, savedDetails: true }, { ...empty, hasName: true });
    expect(c[0]).toContain('save_customer_details');
  });

  it('accepts the claims when the records back them up', () => {
    expect(contradictions({ addedToCart: true, savedDetails: true }, { hasCart: true, hasUnpaidOrder: false, hasName: true, hasAddress: true })).toEqual([]);
  });

  it('does not misfire once an order exists (the cart became the order)', () => {
    expect(contradictions({ addedToCart: true, savedDetails: true }, { ...empty, hasUnpaidOrder: true })).toEqual([]);
  });

  it('says nothing about replies that claim nothing', () => {
    expect(contradictions({ addedToCart: false, savedDetails: false }, empty)).toEqual([]);
  });
});
