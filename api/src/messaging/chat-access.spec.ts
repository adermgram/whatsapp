import { describe, expect, it } from 'vitest';
import { decideAccess } from './chat-access.js';
import type { AccessRules } from './chat-access.js';
import { parseTypedNumber } from './reply-policy.js';

const rules = (over: Partial<AccessRules> = {}): AccessRules => ({
  mode: 'ALLOWLIST',
  allowed: new Set(['2348012345678']),
  ownerPhone: '2349166909486',
  ...over,
});

describe('decideAccess', () => {
  it('answers approved numbers only', () => {
    expect(decideAccess(rules(), '2348012345678', 'hi')).toBe(true);
    expect(decideAccess(rules(), '2347000000000', 'hi')).toBe(false);
  });

  it('answers nobody when the list is empty', () => {
    expect(decideAccess(rules({ allowed: new Set() }), '2348012345678', 'hi')).toBe(false);
  });

  it('answers everyone when the shop is switched to everyone', () => {
    expect(decideAccess(rules({ mode: 'EVERYONE', allowed: new Set() }), '2347000000000', 'hi')).toBe(true);
  });

  it("lets the owner's slash commands through even when their number is not approved", () => {
    expect(decideAccess(rules(), '2349166909486', '/paid ORD-000012')).toBe(true);
    expect(decideAccess(rules(), '2349166909486', '  /chats')).toBe(true);
  });

  it("does not answer the owner's ordinary messages from an unapproved number, or a stranger's slash command", () => {
    expect(decideAccess(rules(), '2349166909486', 'hello')).toBe(false);
    expect(decideAccess(rules(), '2347000000000', '/paid ORD-000012')).toBe(false);
    expect(decideAccess(rules(), '2349166909486', undefined)).toBe(false);
  });

  it('matches a WhatsApp privacy id exactly', () => {
    expect(decideAccess(rules({ allowed: new Set(['lid:98765']) }), 'lid:98765', 'hi')).toBe(true);
    expect(decideAccess(rules({ allowed: new Set(['lid:98765']) }), 'lid:98766', 'hi')).toBe(false);
  });
});

describe('parseTypedNumber', () => {
  it('accepts the ways people write a Nigerian number', () => {
    for (const raw of ['08012345678', '0801 234 5678', '+234 801 234 5678', '2348012345678', '234-801-234-5678']) {
      expect(parseTypedNumber(raw)).toBe('2348012345678');
    }
  });

  it('accepts other countries when the country code is included', () => {
    expect(parseTypedNumber('+44 7911 123456')).toBe('447911123456');
  });

  it('rejects things that are not phone numbers', () => {
    for (const raw of ['', 'hello', '12345', '0801234', 'lid:98765', '080123456789012345', '+', 'abc08012345678']) {
      expect(parseTypedNumber(raw)).toBeNull();
    }
  });
});
