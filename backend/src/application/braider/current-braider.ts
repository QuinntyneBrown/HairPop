import { prisma } from '@/infrastructure/prisma';

/** The braider profile behind a braider account, or null when it has none (L2-046). */
export function findBraiderForUser(userId: string) {
  return prisma.braider.findUnique({ where: { userId } });
}
