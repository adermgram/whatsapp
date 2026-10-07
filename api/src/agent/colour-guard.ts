/**
 * Stops the assistant describing an item with colours the catalog never stated. It cannot see the pictures, and
 * models happily add details from general knowledge ("the Arsenal home shirt is red with white sleeves") that may
 * be wrong for THIS product, which leads to disputes ("you said it had white").
 *
 * Every colour word in a reply must appear in something the assistant legitimately had: the catalog entry returned
 * by a tool, the conversation so far (including what the customer said), or the cart.
 */

const COLOURS = [
  'red', 'white', 'black', 'blue', 'green', 'yellow', 'gold', 'golden', 'navy', 'grey', 'gray', 'orange', 'purple',
  'pink', 'brown', 'silver', 'maroon', 'cream', 'beige', 'ash', 'sky blue', 'light blue', 'dark blue', 'wine',
];

const wordRe = (c: string) => new RegExp(`(?<![a-z])${c}(?![a-z])`, 'i');

const coloursIn = (text: string): Set<string> => new Set(COLOURS.filter((c) => wordRe(c).test(text)));

// Colour words that are also ordinary words in a sentence about something else
const NOT_A_COLOUR_HERE = [/\bash\s+(tray|wednesday)\b/i, /\bgold\s+(standard|member)\b/i];

/** Colours named in the reply that appear in none of the sources. Empty when the reply says nothing unbacked. */
export function findUnverifiedColours(reply: string, sources: string[]): string[] {
  const cleaned = NOT_A_COLOUR_HERE.reduce((t, re) => t.replace(re, ' '), reply);
  const known = new Set<string>();
  for (const s of sources) for (const c of coloursIn(s)) known.add(c);

  const unverified: string[] = [];
  for (const c of coloursIn(cleaned)) {
    // "sky blue" is backed by "blue" appearing in the catalog; "gold"/"golden" are the same colour
    const base = c.split(' ').at(-1)!;
    const alias = c === 'golden' ? 'gold' : c === 'gold' ? 'golden' : c === 'gray' ? 'grey' : c === 'grey' ? 'gray' : null;
    if (known.has(c) || known.has(base) || (alias && known.has(alias))) continue;
    unverified.push(c);
  }
  return unverified;
}
