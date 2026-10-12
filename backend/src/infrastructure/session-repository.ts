import { createHash, randomBytes } from 'node:crypto';
import { prisma } from './prisma';

/** Sessions last 14 days from sign-in. */
export const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000;

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

/** Creates a session and returns the opaque token for the cookie. */
export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.session.create({ data: { id: hash(token), userId, expiresAt } });
  return { token, expiresAt };
}
