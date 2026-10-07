import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Counts login attempts PER ACCOUNT instead of per IP address. The dashboard talks to this API through its own
 * server, so every browser would share one address and an IP limit would either do nothing or lock everyone out;
 * and an attacker rotating IPs would sail past it anyway. Per account, five wrong guesses a minute is all anyone gets.
 */
@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected override async getTracker(req: Record<string, unknown>): Promise<string> {
    const email = (req.body as { email?: unknown } | undefined)?.email;
    return `login:${typeof email === 'string' ? email.trim().toLowerCase() : 'unknown'}`;
  }
}
