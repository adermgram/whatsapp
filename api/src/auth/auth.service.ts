import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';

export interface SessionClaims {
  sub: string; // merchant id
  email: string;
}

// Checked against when the email is unknown, so "no such account" and "wrong password" take the same time.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /** The same generic failure for every reason, so a login form can't be used to discover which emails exist. */
  async login(email: string, password: string) {
    const merchant = await this.prisma.merchant.findFirst({
      where: { ownerEmail: { equals: email.trim(), mode: 'insensitive' } },
    });
    const ok = await bcrypt.compare(password, merchant?.passwordHash ?? DUMMY_HASH);
    if (!merchant || !ok) throw new UnauthorizedException('Wrong email or password');

    const claims: SessionClaims = { sub: merchant.id, email: merchant.ownerEmail };
    return {
      token: await this.jwt.signAsync(claims),
      merchant: { id: merchant.id, businessName: merchant.businessName, email: merchant.ownerEmail },
    };
  }

  verify(token: string): Promise<SessionClaims> {
    return this.jwt.verifyAsync<SessionClaims>(token, { algorithms: ['HS256'] });
  }

  async me(merchantId: string) {
    const m = await this.prisma.merchant.findUnique({ where: { id: merchantId } });
    if (!m) throw new UnauthorizedException();
    return { id: m.id, businessName: m.businessName, email: m.ownerEmail };
  }

  async changePassword(merchantId: string, current: string, next: string) {
    const m = await this.prisma.merchant.findUnique({ where: { id: merchantId } });
    if (!m || !(await bcrypt.compare(current, m.passwordHash))) throw new UnauthorizedException('Current password is wrong');
    await this.prisma.merchant.update({ where: { id: merchantId }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  }
}
