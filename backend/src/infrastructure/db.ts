import type { Prisma, PrismaClient } from '@prisma/client';

/** The Prisma client or an open transaction; repositories that write accept either. */
export type Db = PrismaClient | Prisma.TransactionClient;
