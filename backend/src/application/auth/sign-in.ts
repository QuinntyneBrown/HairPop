import { normalizeEmail } from '@/domain/email';
import { toSessionUser, type SessionUser } from '@/domain/session-user';
import { verifyAgainstDummy, verifyPassword } from '@/infrastructure/password';
import { clearHits, recordHit, retryAfterSeconds } from '@/infrastructure/rate-limiter';
import { createSession } from '@/infrastructure/session-repository';
import { findUserByEmail } from '@/infrastructure/user-repository';

/** Failed sign-ins allowed per email before it is limited, and the window they count in (L2-040). */
export const SIGN_IN_MAX_FAILURES = 5;
export const SIGN_IN_WINDOW_SECONDS = 15 * 60;

export interface SignInCommand {
  readonly email: string;
  readonly password: string;
  readonly audience: 'customer' | 'braider';
}

export type SignInResult =
  | {
      readonly outcome: 'signed_in';
      readonly user: SessionUser;
      readonly token: string;
      readonly expiresAt: Date;
    }
  | { readonly outcome: 'invalid_credentials' }
  | { readonly outcome: 'not_braider' }
  | { readonly outcome: 'rate_limited'; readonly retryAfter: number };

/** Checks credentials and starts a session. A customer never gets a braider-app session (L2-046). */
export async function signIn(command: SignInCommand): Promise<SignInResult> {
  const email = normalizeEmail(command.email);
  // Keyed by email only: a client-supplied address could be rotated to dodge a per-IP key.
  const limitKey = `sign-in:${email}`;
  const retryAfter = await retryAfterSeconds(limitKey, SIGN_IN_MAX_FAILURES);
  if (retryAfter !== null) return { outcome: 'rate_limited', retryAfter };

  const user = await findUserByEmail(email);
  const valid = user
    ? await verifyPassword(user.passwordHash, command.password)
    : await verifyAgainstDummy(command.password);
  if (!user || !valid) {
    await recordHit(limitKey, SIGN_IN_WINDOW_SECONDS);
    return { outcome: 'invalid_credentials' };
  }
  await clearHits(limitKey);
  if (command.audience === 'braider' && user.role !== 'braider') return { outcome: 'not_braider' };

  const { token, expiresAt } = await createSession(user.id);
  return { outcome: 'signed_in', user: toSessionUser(user), token, expiresAt };
}
