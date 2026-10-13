import { normalizeEmail } from '@/domain/email';
import { passwordResetEmail } from '@/domain/emails';
import { queueEmail } from '@/infrastructure/outbox';
import { prisma } from '@/infrastructure/prisma';
import { recordHit, retryAfterSeconds } from '@/infrastructure/rate-limiter';
import { newToken } from '@/infrastructure/token';
import { findUserByEmail } from '@/infrastructure/user-repository';

/** Reset links last 60 minutes. */
export const RESET_TTL_MS = 60 * 60 * 1000;
/** Reset requests allowed per email in the window (L2-040). */
export const RESET_MAX_REQUESTS = 3;
export const RESET_WINDOW_SECONDS = 60 * 60;

export type RequestResetResult =
  | { readonly outcome: 'accepted' }
  | { readonly outcome: 'rate_limited'; readonly retryAfter: number };

/**
 * Emails a time-limited, single-use link when the address has an account. Every request gets
 * the same answer and counts against the limit, so it reveals no account (L2-012 AC1).
 */
export async function requestPasswordReset(rawEmail: string): Promise<RequestResetResult> {
  const email = normalizeEmail(rawEmail);
  const limitKey = `password-reset:${email}`;
  const retryAfter = await retryAfterSeconds(limitKey, RESET_MAX_REQUESTS);
  if (retryAfter !== null) return { outcome: 'rate_limited', retryAfter };
  await recordHit(limitKey, RESET_WINDOW_SECONDS);

  const user = await findUserByEmail(email);
  if (user) {
    const { token, hash } = newToken();
    await prisma.$transaction(async (tx) => {
      await tx.passwordReset.create({
        data: { id: hash, userId: user.id, expiresAt: new Date(Date.now() + RESET_TTL_MS) },
      });
      await queueEmail(tx, passwordResetEmail(email, token));
    });
  }
  return { outcome: 'accepted' };
}
