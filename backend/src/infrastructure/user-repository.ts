import { prisma } from './prisma';

export function findUserByEmail(normalizedEmail: string) {
  return prisma.user.findUnique({ where: { email: normalizedEmail } });
}

/** Inserts an unverified customer unless the email exists; concurrent attempts cannot duplicate it. */
export async function createCustomerIfNew(account: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<void> {
  await prisma.user.createMany({
    data: [{ ...account, role: 'customer' }],
    skipDuplicates: true,
  });
}
