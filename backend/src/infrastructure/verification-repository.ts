import type { Db } from './db';
import { prisma } from './prisma';
import { newToken } from './token';

/** Verification links last 24 hours. */
export const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;

/** Stores a new link for `email` and returns its token. */
export async function createVerification(db: Db, userId: string, email: string): Promise<string> {
  const { token, hash } = newToken();
  await db.emailVerification.create({
    data: { id: hash, userId, email, expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS) },
  });
  return token;
}

export function findVerification(hash: string) {
  return prisma.emailVerification.findUnique({ where: { id: hash }, include: { user: true } });
}

/** Marks a link used unless it already was; false when another request used it first. */
export async function consumeVerification(db: Db, hash: string): Promise<boolean> {
  const { count } = await db.emailVerification.updateMany({
    where: { id: hash, usedAt: null, expiresAt: { gt: new Date() } },
    data: { usedAt: new Date() },
  });
  return count === 1;
}
