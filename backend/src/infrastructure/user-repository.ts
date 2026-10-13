import type { Db } from './db';
import { prisma } from './prisma';

export function findUserByEmail(normalizedEmail: string) {
  return prisma.user.findUnique({ where: { email: normalizedEmail } });
}

/**
 * Inserts an unverified customer unless the email exists; concurrent attempts cannot duplicate
 * it. Returns the new account's id, or null when the email was already registered.
 */
export async function createCustomerIfNew(
  db: Db,
  account: { name: string; email: string; passwordHash: string },
): Promise<string | null> {
  const { count } = await db.user.createMany({
    data: [{ ...account, role: 'customer' }],
    skipDuplicates: true,
  });
  if (count === 0) return null;
  const created = await db.user.findUniqueOrThrow({ where: { email: account.email } });
  return created.id;
}
