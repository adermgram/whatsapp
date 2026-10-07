import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';

export const SESSION_COOKIE = 'shop_session';

export interface AuthedMerchant {
  id: string;
  email: string;
}
export type AuthedRequest = Request & { merchant?: AuthedMerchant };

/** Pulls the signed login token from the httpOnly cookie (the dashboard) or a Bearer header (scripts, tests). */
export function tokenFrom(req: Request): string | undefined {
  const cookie = (req.cookies as Record<string, string> | undefined)?.[SESSION_COOKIE];
  if (cookie) return cookie;
  const header = req.headers.authorization;
  return header?.startsWith('Bearer ') ? header.slice(7) : undefined;
}

/**
 * Every dashboard route sits behind this. It sets req.merchant from the SIGNED token only; controllers must take
 * the merchant id from there and never from the URL or body, which is what keeps one shop out of another's data.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const token = tokenFrom(req);
    if (!token) throw new UnauthorizedException();
    try {
      const claims = await this.auth.verify(token);
      req.merchant = { id: claims.sub, email: claims.email };
      return true;
    } catch {
      throw new UnauthorizedException(); // expired, tampered with, or signed with another key
    }
  }
}

/** The logged-in shop. Use this, never an id from the request. */
export const CurrentMerchant = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthedMerchant => {
  const req = ctx.switchToHttp().getRequest<AuthedRequest>();
  if (!req.merchant) throw new UnauthorizedException();
  return req.merchant;
});
