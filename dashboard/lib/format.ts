export const naira = (n: number) => `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** "₦12,000" or "₦12,000 – ₦18,000" when sizes are priced differently. */
export function priceRange(prices: number[]): string {
  if (prices.length === 0) return "No price yet";
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  return lo === hi ? naira(lo) : `${naira(lo)} – ${naira(hi)}`;
}
