import { describe, expect, it } from 'vitest';
import { isChatAllowed, normalizePhone, parseAllowlist } from './reply-policy.js';

describe('reply policy', () => {
  it('answers nobody by default', () => {
    expect(isChatAllowed('2348012345678', { allowlist: new Set(), replyToAll: false })).toBe(false);
  });

  it('answers only allowlisted chats', () => {
    const policy = { allowlist: parseAllowlist('2348012345678, 08098765432'), replyToAll: false };
    expect(isChatAllowed('2348012345678', policy)).toBe(true);
    expect(isChatAllowed('2348098765432', policy)).toBe(true); // local 0809... format is normalised
    expect(isChatAllowed('2347000000000', policy)).toBe(false);
  });

  it('answers everyone only when explicitly told to', () => {
    expect(isChatAllowed('2347000000000', { allowlist: new Set(), replyToAll: true })).toBe(true);
  });

  it('normalises numbers and keeps lid ids as written', () => {
    expect(normalizePhone('+234 801 234 5678')).toBe('2348012345678');
    expect(normalizePhone('08012345678')).toBe('2348012345678');
    expect(normalizePhone('lid:98765')).toBe('lid:98765');
    expect(parseAllowlist(' , ')).toEqual(new Set());
  });

  it('allows a LID chat once its id is on the list', () => {
    const policy = { allowlist: parseAllowlist('lid:98765'), replyToAll: false };
    expect(isChatAllowed('lid:98765', policy)).toBe(true);
  });
});
