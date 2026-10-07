import { describe, expect, it } from 'vitest';
import { wantsPaymentLink } from './intents.js';

describe('wantsPaymentLink', () => {
  it('recognises the many ways people ask for the link', () => {
    for (const text of [
      'send me the payment link',
      'abeg send link',
      'Send the link make I pay',
      'give me your account number',
      'send me the account number or link make I pay',
      'payment link please',
      'how do I pay?',
      'how can i pay for this',
      'where do I pay',
      "I'm ready to pay",
      'i am ready to pay now',
      'I wan pay',
      'I go pay now',
      'make I pay',
      'proceed to payment',
      'checkout',
      'create the payment link',
    ]) {
      expect(wantsPaymentLink(text), text).toBe(true);
    }
  });

  it('does not fire on ordinary shopping talk', () => {
    for (const text of [
      'hi',
      'you get Arsenal jersey?',
      'how much be am',
      'size L',
      'I fit pay 13000',
      'last price? I fit pay 30k', // an offer, not a request for the link
      'Na Chidi Okafor, 12 Allen Avenue, Ikeja',
      'add am to my cart',
      'send me the picture',
      'I don pay', // a claim of payment is handled elsewhere
      'is the link working?',
    ]) {
      expect(wantsPaymentLink(text), text).toBe(false);
    }
  });
});
