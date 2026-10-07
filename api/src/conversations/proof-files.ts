/**
 * Safety checks for files customers send as "proof of payment". The bot only ever PASSES these along to the
 * owner; it never opens, parses or stores them. Everything here exists so the bot cannot be used to push
 * arbitrary files (malware, huge files, spam) onto the owner's phone.
 */

export const MAX_PROOF_BYTES = 10 * 1024 * 1024; // 10 MB

export type ProofKind = 'image' | 'pdf';

export interface DetectedFile {
  kind: ProofKind;
  mimeType: string;
  extension: string;
}

const startsWith = (data: Uint8Array, bytes: number[], offset = 0) =>
  data.length >= offset + bytes.length && bytes.every((b, i) => data[offset + i] === b);

const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));

/**
 * What the file REALLY is, from its first bytes. A customer-supplied filename or mimetype proves nothing
 * (an .exe can be named receipt.pdf), so those are never trusted.
 */
export function detectFileType(data: Uint8Array): DetectedFile | null {
  if (startsWith(data, [0xff, 0xd8, 0xff])) return { kind: 'image', mimeType: 'image/jpeg', extension: 'jpg' };
  if (startsWith(data, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { kind: 'image', mimeType: 'image/png', extension: 'png' };
  if (startsWith(data, ascii('RIFF')) && startsWith(data, ascii('WEBP'), 8)) return { kind: 'image', mimeType: 'image/webp', extension: 'webp' };
  if (startsWith(data, ascii('%PDF-'))) return { kind: 'pdf', mimeType: 'application/pdf', extension: 'pdf' };
  return null;
}

export type ProofCheck = ({ ok: true } & DetectedFile) | { ok: false; reason: 'too_large' | 'unsupported' | 'empty' };

export function checkProof(data: Uint8Array): ProofCheck {
  if (data.length === 0) return { ok: false, reason: 'empty' };
  if (data.length > MAX_PROOF_BYTES) return { ok: false, reason: 'too_large' };
  const type = detectFileType(data);
  return type ? { ok: true, ...type } : { ok: false, reason: 'unsupported' };
}

/** Our own filename. The customer's is never used. */
export function proofFileName(orderNumber: string, extension: string): string {
  return `payment-proof-${orderNumber}.${extension}`;
}

/**
 * Customer text that will be shown to the owner: remove control characters and the Unicode direction overrides
 * used to disguise text ("exe.fdp" shown as "pdf.exe"), flatten whitespace, and cap the length.
 */
export function cleanCaption(raw: string | undefined | null, max = 200): string {
  return (raw ?? '')
    .replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁦-⁩﻿]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** At most `limit` accepted files per customer per window, so nobody can flood the owner. */
export class ProofRateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly limit = 3,
    private readonly windowMs = 10 * 60_000,
  ) {}

  /** Returns true (and counts it) if this customer may forward another file right now. */
  allow(key: string, now = Date.now()): boolean {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }
}
