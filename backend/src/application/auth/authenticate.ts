import { toSessionUser, type SessionUser } from '@/domain/session-user';
import { findSessionUser } from '@/infrastructure/session-repository';

/** Resolves a session cookie value to the signed-in user, or null when it names no live session. */
export async function authenticate(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  const user = await findSessionUser(token);
  return user ? toSessionUser(user) : null;
}
