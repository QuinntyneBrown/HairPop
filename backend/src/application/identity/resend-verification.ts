import { normalizeEmail } from '@/domain/email';
import { verificationEmail } from '@/domain/emails';
import { queueEmail } from '@/infrastructure/outbox';
import { prisma } from '@/infrastructure/prisma';
import { recordHit, retryAfterSeconds } from '@/infrastructure/rate-limiter';
import { createVerification } from '@/infrastructure/verification-repository';

/** Resends allowed per email in the window (L2-013 AC3, L2-040). */
export const RESEND_MAX_ATTEMPTS = 3;
export const RESEND_WINDOW_SECONDS = 15 * 60;

export type ResendResult =
  | { readonly outcome: 'accepted' }
  | { readonly outcome: 'rate_limited'; readonly retryAfter: number };

/**
 * Issues a fresh link when the address is unverified or pending on an account. Every request
 * counts against the limit and gets the same answer, so it reveals no account (L2-040 AC1).
 */
export async function resendVerification(rawEmail: string): Promise<ResendResult> {
  const email = normalizeEmail(rawEmail);
  const limitKey = `verify-resend:${email}`;
  const retryAfter = await retryAfterSeconds(limitKey, RESEND_MAX_ATTEMPTS);
  if (retryAfter !== null) return { outcome: 'rate_limited', retryAfter };
  await recordHit(limitKey, RESEND_WINDOW_SECONDS);

  const user = await prisma.user.findFirst({
    where: { OR: [{ email, emailVerifiedAt: null }, { pendingEmail: email }] },
  });
  if (user) {
    await prisma.$transaction(async (tx) => {
      const token = await createVerification(tx, user.id, email);
      await queueEmail(tx, verificationEmail(email, token));
    });
  }
  return { outcome: 'accepted' };
}
