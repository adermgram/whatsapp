import { BadRequestException, Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { z } from 'zod';
import { AuthService } from './auth.service.js';
import { LoginThrottlerGuard } from './login-throttler.guard.js';
import { AuthGuard, CurrentMerchant, SESSION_COOKIE } from './auth.guard.js';
import type { AuthedMerchant } from './auth.guard.js';
import { env } from '../config/env.js';

const loginBody = z.object({ email: z.string().email().max(200), password: z.string().min(1).max(200) });
const passwordBody = z.object({ current: z.string().min(1).max(200), next: z.string().min(10, 'Use at least 10 characters').max(200) });

export function parse<T>(schema: z.ZodType<T>, body: unknown): T {
  const r = schema.safeParse(body);
  if (!r.success) throw new BadRequestException(r.error.issues.map((i) => `${i.path.join('.') || 'value'}: ${i.message}`).join('; '));
  return r.data;
}

/** httpOnly: scripts on the page (including injected ones) cannot read the login. */
const cookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: env.DASHBOARD_ORIGIN.startsWith('https://'),
  path: '/',
  maxAge: env.SESSION_DAYS * 24 * 3600 * 1000,
});

@Controller('api/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /** 5 tries a minute per account, so a password cannot be guessed by brute force. */
  @Post('login')
  @HttpCode(200)
  @UseGuards(LoginThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(@Body() body: unknown, @Res({ passthrough: true }) res: Response) {
    const { email, password } = parse(loginBody, body);
    const { token, merchant } = await this.auth.login(email, password);
    res.cookie(SESSION_COOKIE, token, cookieOptions());
    return merchant;
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(SESSION_COOKIE, { ...cookieOptions(), maxAge: undefined });
    return { ok: true };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentMerchant() merchant: AuthedMerchant) {
    return this.auth.me(merchant.id);
  }

  @Post('password')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async changePassword(@CurrentMerchant() merchant: AuthedMerchant, @Body() body: unknown) {
    const { current, next } = parse(passwordBody, body);
    await this.auth.changePassword(merchant.id, current, next);
    return { ok: true };
  }
}
