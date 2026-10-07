import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import type { Prisma } from '../generated/prisma/client.js';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    tx<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
