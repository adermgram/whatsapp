import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import type { Prisma } from '../generated/prisma/client.js';
import { env } from '../config/env.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({ adapter: new PrismaPg({ connectionString: env.DATABASE_URL }) });
  }

  /**
   * An interactive transaction with room to breathe. Prisma's defaults (2s to start, 5s to finish) are tuned for a
   * database next door; ours is across the internet and a query can take a second, so the default would abort
   * a payment confirmation halfway. Use this for every multi-step write.
   */
  tx<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.$transaction(fn, { maxWait: 15_000, timeout: 60_000 });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
