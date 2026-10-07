/**
 * Spots statements in an AI reply that claim something has HAPPENED ("I don add am to your cart", "I've saved
 * your address"). The pipeline then checks them against the real records: a customer must never be told an
 * item is in their cart when it is not, or that details are saved when they are not.
 *
 * Deliberately narrow: questions and offers ("You want make I add am to your cart?") are not claims.
 */

export interface Claims {
  addedToCart: boolean;
  savedDetails: boolean;
}

// "I don add X to your cart", "I've added X to your cart", "X added to your cart", "just added"
const ADDED = /\b(don\s+add|have\s+added|'ve\s+added|just\s+added|has\s+been\s+added|is\s+now\s+in\s+your|added)\b[^.?!]{0,80}\bcart\b/i;
// "I don save your name", "I've saved your address", "your details are saved"
const SAVED = /\b(don\s+save|have\s+saved|'ve\s+saved|just\s+saved|saved)\b[^.?!]{0,40}\b(name|address|details)\b/i;

/** Sentences that are a QUESTION or an offer do not count: "Do you want me to add it to your cart?" */
const sentences = (text: string) => text.split(/(?<=[.!?])\s+/);

export function findClaims(reply: string): Claims {
  const statements = sentences(reply).filter((s) => !s.trim().endsWith('?'));
  return {
    addedToCart: statements.some((s) => ADDED.test(s)),
    savedDetails: statements.some((s) => SAVED.test(s)),
  };
}

export interface RecordState {
  hasCart: boolean;
  hasUnpaidOrder: boolean;
  hasName: boolean;
  hasAddress: boolean;
}

/** What the reply claims that the records do not support. Empty when everything it says is true. */
export function contradictions(claims: Claims, state: RecordState): string[] {
  const out: string[] = [];
  if (claims.addedToCart && !state.hasCart && !state.hasUnpaidOrder) {
    out.push('You said an item was added to the cart, but the cart is empty. Call set_cart_item first (any size ref of that item works), or do not say it was added.');
  }
  if (claims.savedDetails && !(state.hasName && state.hasAddress) && !state.hasUnpaidOrder) {
    out.push('You said the name/address were saved, but they are not. Call save_customer_details with what the customer wrote, or ask for what is missing.');
  }
  return out;
}
