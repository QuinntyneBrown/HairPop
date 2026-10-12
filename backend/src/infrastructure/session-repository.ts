import { createHash } from 'node:crypto';
import { prisma } from './prisma';

const hash = (token: string) => createHash('sha256').update(token).digest('hex');

/** The user behind an unexpired session token, or null. */
export async function findSessionUser(token: string) {
  const session = await prisma.session.findUnique({
    where: { id: hash(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt <= new Date()) return null;
  return session.user;
}
