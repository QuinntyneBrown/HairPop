import { toAccount, type Account } from '@/domain/account';
import { normalizeEmail } from '@/domain/email';
import { accountExistsEmail, verificationEmail } from '@/domain/emails';
import { recordNotification } from '@/infrastructure/notification-repository';
import { queueEmail } from '@/infrastructure/outbox';
import { prisma } from '@/infrastructure/prisma';
import { createVerification } from '@/infrastructure/verification-repository';

export async function getAccount(userId: string): Promise<Account> {
  return toAccount(await prisma.user.findUniqueOrThrow({ where: { id: userId } }));
}

export interface UpdateAccountCommand {
  readonly name: string;
  readonly email: string;
  readonly phone: string | null;
}

/**
 * Saves the customer's own details (L2-014). A new email becomes `pendingEmail` and is emailed a
 * link; the verified email stays in use until the link is opened (AC3). An address that belongs
 * to another account gets a sign-in reminder instead, so the answer reveals nothing.
 */
export async function updateAccount(
  userId: string,
  command: UpdateAccountCommand,
): Promise<Account> {
  const email = normalizeEmail(command.email);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    let pendingEmail = user.pendingEmail;
    let newPending = false;
    if (email === user.email) {
      pendingEmail = null;
    } else if (email !== user.pendingEmail) {
      pendingEmail = email;
      newPending = true;
      const owner = await tx.user.findUnique({ where: { email } });
      await queueEmail(
        tx,
        owner
          ? accountExistsEmail(email)
          : verificationEmail(email, await createVerification(tx, userId, email)),
      );
    }

    const saved = await tx.user.update({
      where: { id: userId },
      data: { name: command.name, phone: command.phone, pendingEmail },
    });
    await recordNotification(
      tx,
      newPending
        ? {
            userId,
            title: 'Verify your new email',
            body: 'Updates go to your old address until you do.',
            link: '/settings',
          }
        : {
            userId,
            title: 'Details updated',
            body: 'Braiders will use your new details for upcoming appointments.',
            link: '/settings',
          },
    );
    return toAccount(saved);
  });
}
