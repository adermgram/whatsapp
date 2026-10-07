/**
 * Intents clear enough that the system, not the AI's judgement, should act on them. Used only together with a
 * ready cart (items + name + address), so a false match costs nothing more than an early payment link.
 */

const PAYMENT_LINK = [
  /\b(send|give|share|drop|create|generate|make)\b[^.?!]{0,30}\b(payment\s*)?(link|account|acct)\b/i, // "send me the payment link", "give me account number"
  /\bpayment\s*link\b/i,
  /\b(account|acct)\s*(number|no\b|details)\b/i,
  /\bhow\s+(do|can|will|should)\s+i\s+pay\b/i,
  /\bwhere\s+(do|can|should)\s+i\s+pay\b/i,
  /\b(i('m| am)?|am)\s+(ready|set)\s+(to|for)\s+pay/i, // "I'm ready to pay"
  // "I wan pay", "I go pay now": but not "I go pay 20k" / "I want to pay 15000", which are price offers
  /\b(i\s+)?(wan|want|go|dey\s+ready\s+to)\s+(to\s+)?pay\b(?!\s*[₦n]?\s*\d)/i,
  /\bmake\s+i\s+pay\b/i, // Pidgin
  /\b(proceed|continue)\s+(to|with)\s+(payment|checkout|pay)\b/i,
  /\bcheckout\b/i,
];

/** True when the customer is asking for the way to pay. */
export function wantsPaymentLink(text: string): boolean {
  return PAYMENT_LINK.some((re) => re.test(text));
}
