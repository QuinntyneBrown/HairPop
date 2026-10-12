import { Prisma } from '@prisma/client';
import { recordNotification } from '@/infrastructure/notification-repository';
import { prisma } from '@/infrastructure/prisma';
import { hashToken } from '@/infrastructure/token';
import { consumeVerification, findVerification } from '@/infrastructure/verification-repository';

export type VerifyEmailResult =
  { readonly outcome: 'verified'; readonly email: string } | { readonly outcome: 'invalid_token' };

const INVALID = { outcome: 'invalid_token' } as const;

/**
 * Consumes a single-use, time-limited link (L2-013). A link for a pending email moves it to the
 * account email (L2-014 AC3). An expired, altered, used or superseded link changes nothing.
 */
export async function verifyEmail(token: string): Promise<VerifyEmailResult> {
  const hash = hashToken(token);
  const link = await findVerification(hash);
  if (!link || link.usedAt || link.expiresAt <= new Date()) return INVALID;
  const { user } = link;
  const pending = link.email === user.pendingEmail;
  if (link.email !== user.email && !pending) return INVALID;

  try {
    return await prisma.$transaction(async (tx) => {
      if (!(await consumeVerification(tx, hash))) return INVALID;
      await tx.user.update({
        where: { id: user.id },
        data: pending
          ? { email: link.email, pendingEmail: null, emailVerifiedAt: new Date() }
          : { emailVerifiedAt: new Date() },
      });
      await recordNotification(tx, {
        userId: user.id,
        title: 'Your email is verified',
        body: `${link.email} is confirmed for appointment updates.`,
        link: '/settings',
      });
      return { outcome: 'verified', email: link.email } as const;
    });
  } catch (error) {
    // Another account took the pending address after the link was sent.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return INVALID;
    }
    throw error;
  }
}
