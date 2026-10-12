import { normalizeEmail } from '@/domain/email';
import { toSessionUser, type SessionUser } from '@/domain/session-user';
import { verifyAgainstDummy, verifyPassword } from '@/infrastructure/password';
import { createSession } from '@/infrastructure/session-repository';
import { findUserByEmail } from '@/infrastructure/user-repository';

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
  | { readonly outcome: 'not_braider' };

/** Checks credentials and starts a session. A customer never gets a braider-app session (L2-046). */
export async function signIn(command: SignInCommand): Promise<SignInResult> {
  const user = await findUserByEmail(normalizeEmail(command.email));
  const valid = user
    ? await verifyPassword(user.passwordHash, command.password)
    : await verifyAgainstDummy(command.password);
  if (!user || !valid) return { outcome: 'invalid_credentials' };
  if (command.audience === 'braider' && user.role !== 'braider') return { outcome: 'not_braider' };

  const { token, expiresAt } = await createSession(user.id);
  return { outcome: 'signed_in', user: toSessionUser(user), token, expiresAt };
}
