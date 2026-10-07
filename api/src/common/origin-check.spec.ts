import { describe, expect, it } from 'vitest';
import { originCheck } from './origin-check.js';

function run(method: string, origin?: string) {
  let status: number | undefined;
  let called = false;
  const mw = originCheck(['http://localhost:3001', 'https://shop.example.com/']);
  mw(
    { method, headers: origin ? { origin } : {} } as never,
    { status: (s: number) => ((status = s), { json: () => undefined }) } as never,
    () => void (called = true),
  );
  return { status, called };
}

describe('originCheck (cross-site request forgery guard)', () => {
  it('lets the dashboard change things', () => {
    expect(run('POST', 'http://localhost:3001')).toEqual({ status: undefined, called: true });
    expect(run('DELETE', 'https://shop.example.com')).toEqual({ status: undefined, called: true }); // trailing slash in config is fine
  });

  it('refuses another website making a state-changing request', () => {
    expect(run('POST', 'https://evil.example')).toEqual({ status: 403, called: false });
    expect(run('PATCH', 'http://localhost:3002')).toEqual({ status: 403, called: false });
    expect(run('DELETE', 'http://localhost:3001.evil.example')).toEqual({ status: 403, called: false }); // look-alike host
  });

  it('does not restrict reading', () => {
    expect(run('GET', 'https://evil.example').called).toBe(true);
  });

  it('does not affect requests with no Origin (Paystack webhooks, scripts)', () => {
    expect(run('POST', undefined).called).toBe(true);
  });
});
