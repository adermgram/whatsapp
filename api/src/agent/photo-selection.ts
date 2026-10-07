/** Pure rules for which product photos the assistant may send, and how many. */

export interface PhotoCandidate {
  id: string;
  color: string | null;
  position: number;
}

export const MAX_PHOTOS_PER_REQUEST = 3;
export const DEFAULT_PHOTOS_PER_REQUEST = 2;

const same = (a: string | null | undefined, b: string | null | undefined) =>
  !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * Picks the photos to send: the ones tagged with the colour the customer wants (when any exist), otherwise the
 * product's photos in the owner's order. The main photo comes first. Never more than MAX_PHOTOS_PER_REQUEST.
 */
export function choosePhotos(
  images: PhotoCandidate[],
  opts: { wantedColor?: string | null; count?: number },
): { ids: string[]; colorMatched: boolean } {
  const count = Math.min(Math.max(opts.count ?? DEFAULT_PHOTOS_PER_REQUEST, 1), MAX_PHOTOS_PER_REQUEST);
  const ordered = [...images].sort((a, b) => a.position - b.position);
  const matching = opts.wantedColor ? ordered.filter((i) => same(i.color, opts.wantedColor)) : [];
  const pool = matching.length > 0 ? matching : ordered;
  return { ids: pool.slice(0, count).map((i) => i.id), colorMatched: matching.length > 0 };
}

/**
 * A cap on how many photos one customer can be sent in a window. Photos are the heaviest thing the bot sends,
 * and a burst of media is what WhatsApp's spam detection looks for, so one chatty (or malicious) customer must
 * not be able to make the shop's number send dozens.
 */
export class PhotoRateLimiter {
  private readonly sent = new Map<string, number[]>();

  constructor(
    private readonly maxPhotos = 6,
    private readonly windowMs = 10 * 60_000,
  ) {}

  /** Reserves up to `want` photos for this chat and returns how many are allowed right now (0 to `want`). */
  take(key: string, want: number, now = Date.now()): number {
    const recent = (this.sent.get(key) ?? []).filter((t) => now - t < this.windowMs);
    const granted = Math.max(0, Math.min(want, this.maxPhotos - recent.length));
    for (let i = 0; i < granted; i++) recent.push(now);
    this.sent.set(key, recent);
    return granted;
  }
}
