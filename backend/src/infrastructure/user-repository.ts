import { prisma } from './prisma';

export function findUserByEmail(normalizedEmail: string) {
  return prisma.user.findUnique({ where: { email: normalizedEmail } });
}
