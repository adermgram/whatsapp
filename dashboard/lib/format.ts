export const naira = (n: number) => `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** "₦12,000" or "₦12,000 – ₦18,000" when sizes are priced differently. */
export function priceRange(prices: number[]): string {
  if (prices.length === 0) return "No price yet";
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  return lo === hi ? naira(lo) : `${naira(lo)} – ${naira(hi)}`;
}

/** "+2348012345678" for a WhatsApp number (digits only). */
export const phoneLabel = (phone: string) => (/^\d+$/.test(phone) ? `+${phone}` : phone);

/** A link that opens the customer's chat in WhatsApp itself. */
export const whatsappLink = (phone: string) => (/^\d{8,15}$/.test(phone) ? `https://wa.me/${phone}` : null);

/** "just now", "5 min ago", "3 hours ago", "yesterday", or a short date. */
export function timeAgo(iso: string, now = Date.now()): string {
  const secs = Math.round((now - new Date(iso).getTime()) / 1000);
  if (secs < 45) return "just now";
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
