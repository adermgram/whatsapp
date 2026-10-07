import { describe, expect, it } from 'vitest';
import { findUnverifiedColours } from './colour-guard.js';

const catalog = JSON.stringify({ results: [{ name: 'Arsenal Home Jersey 24/25', about: 'Red fan version, breathable, Arsenal, 24/25, fan' }] });

describe('findUnverifiedColours', () => {
  it('passes colours the catalog states', () => {
    expect(findUnverifiedColours('The Arsenal Home Jersey na red colour.', [catalog])).toEqual([]);
    expect(findUnverifiedColours('E be red fan version.', [catalog])).toEqual([]);
  });

  it('catches colour details the catalog never gave (the invented "white details")', () => {
    expect(findUnverifiedColours('The Arsenal jersey na red with white details.', [catalog])).toEqual(['white']);
    expect(findUnverifiedColours('Red with white sleeves and a blue badge', [catalog]).sort()).toEqual(['blue', 'white']);
  });

  it('allows colours the customer or earlier messages mentioned', () => {
    expect(findUnverifiedColours('Yes, we get the black one.', [catalog, 'you get am in black?'])).toEqual([]);
  });

  it('treats a colour as backed when a related word is (sky blue / blue, gold / golden, gray / grey)', () => {
    expect(findUnverifiedColours('E be sky blue', ['Blue jersey'])).toEqual([]);
    expect(findUnverifiedColours('Na gold colour', ['Golden edition'])).toEqual([]);
    expect(findUnverifiedColours('Na gray', ['Grey hoodie'])).toEqual([]);
  });

  it('does not mistake words that merely contain a colour for the colour', () => {
    expect(findUnverifiedColours('Bred, rededicated, whitest, blackmail, orangery, dashing', [])).toEqual([]);
  });

  it('ignores replies that name no colours', () => {
    expect(findUnverifiedColours('Which size you want? We get S, M, L.', [])).toEqual([]);
  });

  it('does not flag a colour in a sentence about something else', () => {
    expect(findUnverifiedColours('Put it in the ash tray.', [])).toEqual([]);
  });
});
