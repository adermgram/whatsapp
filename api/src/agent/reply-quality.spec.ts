import { describe, expect, it } from 'vitest';
import { cleanReply, looksBroken } from './reply-quality.js';

describe('looksBroken', () => {
  it('flags empty replies', () => {
    expect(looksBroken('')).toBe(true);
    expect(looksBroken('   ')).toBe(true);
    expect(looksBroken(null)).toBe(true);
  });

  it('flags the garbage seen in real chats', () => {
    expect(looksBroken('We dey ****? **...** We fit ****... Sorry, glitch? Let’s try again')).toBe(true);
  });

  it('flags leaked tool syntax', () => {
    expect(looksBroken('Sure <|channel|> {"ref":"abcd1234"}')).toBe(true);
    expect(looksBroken('assistant to=functions.search_catalog')).toBe(true);
  });

  it('accepts normal replies, including Pidgin repetition and cart summaries that repeat a product name', () => {
    expect(looksBroken('Cart: Arsenal Home Jersey M ₦18,000, Arsenal Home Jersey L ₦18,000. Total ₦36,000. Which one you wan keep?')).toBe(false);
    expect(looksBroken('We fit drop am small small, ₦39,800. Make we confirm?')).toBe(false);
    expect(looksBroken('Yes o! We get Nike Air Force 1 White for size 43. Price na ₦45,000.')).toBe(false);
    expect(
      looksBroken(
        'Order ORD-000001 total ₦39,800. Pay here: https://pay.example/abc. The link is valid for 30 minutes, so abeg pay before then.',
      ),
    ).toBe(false);
  });
});

describe('cleanReply', () => {
  it('converts markdown bold to WhatsApp bold and drops headings', () => {
    expect(cleanReply('## Your order\nTotal **₦18,000** only')).toBe('Your order\nTotal *₦18,000* only');
  });

  it('replaces look-alike hyphens so URLs keep working', () => {
    expect(cleanReply('https://fake‑pay.local/pay/x')).toBe('https://fake-pay.local/pay/x');
  });

  it('collapses blank-line runs and strips zero-width characters', () => {
    expect(cleanReply('a\n\n\n\nb​')).toBe('a\n\nb');
  });

  it('keeps payment links tappable: no asterisks stuck to the URL', () => {
    expect(cleanReply('*Pay here:* *https://pay.example/abc*')).toBe('*Pay here:* https://pay.example/abc');
    expect(cleanReply('Pay: **https://pay.example/abc**')).toBe('Pay: https://pay.example/abc');
  });

  it('unwraps a message the model made entirely bold, and drops unbalanced asterisks', () => {
    expect(cleanReply('*Yes, we get it. Price is ₦15,000. You wan add am?*')).toBe('Yes, we get it. Price is ₦15,000. You wan add am?');
    expect(cleanReply('*Your order number is *ORD-000003*. Total ₦13,800')).toBe('Your order number is ORD-000003. Total ₦13,800');
    expect(cleanReply('Small *bold* word stays')).toBe('Small *bold* word stays');
  });
});
