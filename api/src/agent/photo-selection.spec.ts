import { describe, expect, it } from 'vitest';
import { PhotoRateLimiter, choosePhotos } from './photo-selection.js';

const img = (id: string, position: number, color: string | null = null) => ({ id, position, color });

describe('choosePhotos', () => {
  const photos = [img('c', 2), img('a', 0), img('b', 1)]; // deliberately out of order

  it('sends the main photo first, in the owner\'s order', () => {
    expect(choosePhotos(photos, { count: 3 }).ids).toEqual(['a', 'b', 'c']);
  });

  it('sends two photos by default and never more than three', () => {
    expect(choosePhotos(photos, {}).ids).toEqual(['a', 'b']);
    expect(choosePhotos([...photos, img('d', 3), img('e', 4)], { count: 99 }).ids).toHaveLength(3);
    expect(choosePhotos(photos, { count: 0 }).ids).toHaveLength(1); // at least one
  });

  it('prefers photos tagged with the colour the customer asked for', () => {
    const coloured = [img('r1', 0, 'Red'), img('b1', 1, 'Blue'), img('r2', 2, 'red ')];
    const r = choosePhotos(coloured, { wantedColor: 'RED', count: 3 });
    expect(r).toEqual({ ids: ['r1', 'r2'], colorMatched: true }); // case and spacing do not matter
  });

  it('falls back to all photos when none is tagged with that colour, and says so', () => {
    const r = choosePhotos([img('a', 0, 'Red'), img('b', 1, null)], { wantedColor: 'Green', count: 3 });
    expect(r).toEqual({ ids: ['a', 'b'], colorMatched: false });
  });

  it('returns nothing for a product with no photos', () => {
    expect(choosePhotos([], { count: 2 })).toEqual({ ids: [], colorMatched: false });
  });
});

describe('PhotoRateLimiter', () => {
  it('lets a customer have a few photos, then stops, and reports a partial grant', () => {
    const limiter = new PhotoRateLimiter(6, 10 * 60_000);
    expect(limiter.take('chat', 3, 0)).toBe(3);
    expect(limiter.take('chat', 3, 1000)).toBe(3);
    expect(limiter.take('chat', 3, 2000)).toBe(0); // 6 already sent
    const small = new PhotoRateLimiter(4, 60_000);
    expect(small.take('chat', 3, 0)).toBe(3);
    expect(small.take('chat', 3, 1)).toBe(1); // only one left in the allowance
  });

  it('frees the allowance as the window passes, and keeps customers separate', () => {
    const limiter = new PhotoRateLimiter(3, 60_000);
    expect(limiter.take('a', 3, 0)).toBe(3);
    expect(limiter.take('a', 1, 30_000)).toBe(0);
    expect(limiter.take('b', 3, 30_000)).toBe(3); // another customer is unaffected
    expect(limiter.take('a', 3, 61_000)).toBe(3);
  });
});
