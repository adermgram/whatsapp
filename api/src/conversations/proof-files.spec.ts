import { describe, expect, it } from 'vitest';
import { MAX_PROOF_BYTES, ProofRateLimiter, checkProof, cleanCaption, detectFileType, proofFileName } from './proof-files.js';

const bytes = (...b: number[]) => new Uint8Array([...b, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
const text = (s: string) => new TextEncoder().encode(s + ' padding to be long enough');

describe('detectFileType (trusts the bytes, never the name)', () => {
  it('recognises the file types customers legitimately send as proof', () => {
    expect(detectFileType(bytes(0xff, 0xd8, 0xff, 0xe0))).toMatchObject({ kind: 'image', mimeType: 'image/jpeg', extension: 'jpg' });
    expect(detectFileType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toMatchObject({ kind: 'image', extension: 'png' });
    expect(detectFileType(text('%PDF-1.7'))).toMatchObject({ kind: 'pdf', mimeType: 'application/pdf', extension: 'pdf' });
    const webp = new Uint8Array([...text('RIFF').slice(0, 4), 1, 2, 3, 4, ...text('WEBP').slice(0, 4), 0, 0]);
    expect(detectFileType(webp)).toMatchObject({ kind: 'image', mimeType: 'image/webp' });
  });

  it('rejects things that are not a payment screenshot or PDF, whatever they are called', () => {
    expect(detectFileType(text('MZ\u0090 this is a Windows executable'))).toBeNull(); // .exe
    expect(detectFileType(bytes(0x50, 0x4b, 0x03, 0x04))).toBeNull(); // zip / apk / docx
    expect(detectFileType(text('<html><script>alert(1)</script>'))).toBeNull();
    expect(detectFileType(text('#!/bin/sh rm -rf'))).toBeNull();
    expect(detectFileType(text('GIF89a'))).toBeNull(); // not on the allow-list
    expect(detectFileType(new Uint8Array([]))).toBeNull();
  });

  it('does not accept a PDF header buried after other bytes', () => {
    expect(detectFileType(text('MZ junk then %PDF-1.4'))).toBeNull();
  });
});

describe('checkProof', () => {
  it('accepts a normal screenshot and a normal PDF', () => {
    expect(checkProof(bytes(0xff, 0xd8, 0xff))).toMatchObject({ ok: true, kind: 'image' });
    expect(checkProof(text('%PDF-1.4'))).toMatchObject({ ok: true, kind: 'pdf' });
  });

  it('rejects empty, oversized and unsupported files', () => {
    expect(checkProof(new Uint8Array([]))).toEqual({ ok: false, reason: 'empty' });
    const big = new Uint8Array(MAX_PROOF_BYTES + 1);
    big.set([0xff, 0xd8, 0xff]);
    expect(checkProof(big)).toEqual({ ok: false, reason: 'too_large' }); // right type, still too big
    expect(checkProof(text('MZ not allowed'))).toEqual({ ok: false, reason: 'unsupported' });
  });
});

describe('names and captions that reach the owner', () => {
  it('builds our own file name from the detected type, never the customer\'s', () => {
    expect(proofFileName('ORD-000012', 'pdf')).toBe('payment-proof-ORD-000012.pdf');
  });

  it('strips control characters and direction overrides, flattens whitespace, and caps the length', () => {
    expect(cleanCaption('paid‮fdp.exe\n\n  thanks\u0007')).toBe('paid fdp.exe thanks');
    expect(cleanCaption('a'.repeat(500))).toHaveLength(200);
    expect(cleanCaption(undefined)).toBe('');
    expect(cleanCaption('   ')).toBe('');
  });
});

describe('ProofRateLimiter', () => {
  it('lets a customer forward a few files, then stops the flood', () => {
    const limiter = new ProofRateLimiter(3, 10 * 60_000);
    const t = 1_000_000;
    expect([1, 2, 3, 4, 5].map((i) => limiter.allow('chat', t + i))).toEqual([true, true, true, false, false]);
  });

  it('lets them try again after the window, and keeps customers separate', () => {
    const limiter = new ProofRateLimiter(1, 60_000);
    expect(limiter.allow('a', 0)).toBe(true);
    expect(limiter.allow('a', 30_000)).toBe(false);
    expect(limiter.allow('b', 30_000)).toBe(true);
    expect(limiter.allow('a', 61_000)).toBe(true);
  });
});
