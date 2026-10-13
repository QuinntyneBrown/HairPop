import { normalizeEmail } from '@/domain/email';
import { recordNotification } from '@/infrastructure/notification-repository';
import { hashPassword } from '@/infrastructure/password';
import { prisma } from '@/infrastructure/prisma';
import { hashToken } from '@/infrastructure/token';

export interface ResetPasswordCommand {
  readonly token: string;
  readonly email: string;
  readonly password: string;
}

export type ResetPasswordResult =
  { readonly outcome: 'reset'; readonly email: string } | { readonly outcome: 'invalid_token' };

const INVALID = { outcome: 'invalid_token' } as const;

/**
 * Sets a new password with an unexpired, unused link for that email (L2-012 AC2). The link and
 * every other open link for the account stop working, and every session is signed out.
 */
export async function resetPassword(command: ResetPasswordCommand): Promise<ResetPasswordResult> {
  const hash = hashToken(command.token);
  const email = normalizeEmail(command.email);
  const link = await prisma.passwordReset.findUnique({
    where: { id: hash },
    include: { user: true },
  });
  if (!link || link.user.email !== email) return INVALID;

  const passwordHash = await hashPassword(command.password);
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.passwordReset.updateMany({
      where: { id: hash, usedAt: null, expiresAt: { gt: new Date() } },
      data: { usedAt: new Date() },
    });
    if (count !== 1) return INVALID;
    await tx.passwordReset.updateMany({
      where: { userId: link.userId, usedAt: null },
      data: { usedAt: new Date() },
    });
    await tx.user.update({ where: { id: link.userId }, data: { passwordHash } });
    await tx.session.deleteMany({ where: { userId: link.userId } });
    await recordNotification(tx, {
      userId: link.userId,
      title: 'Your password was changed',
      body: 'You can now sign in with your new password.',
      link: '/settings',
    });
    return { outcome: 'reset', email } as const;
  });
}
