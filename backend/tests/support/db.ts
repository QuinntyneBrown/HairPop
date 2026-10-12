import { PrismaClient } from '@prisma/client';
import { testDatabaseUrl } from './env';

let client: PrismaClient | undefined;

/** Prisma client on the test database, for arranging and inspecting state. */
export function db(): PrismaClient {
  client ??= new PrismaClient({ datasourceUrl: testDatabaseUrl() });
  return client;
}

export async function resetDatabase(): Promise<void> {
  const tables = await db().$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`;
  if (tables.length === 0) return;
  const list = tables.map((t) => `"public"."${t.tablename}"`).join(', ');
  await db().$executeRawUnsafe(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`);
}
