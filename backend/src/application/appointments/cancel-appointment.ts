import { canCancel, firstName, reference, referenceNumber } from '@/domain/appointment';
import { recordNotification } from '@/infrastructure/notification-repository';
import { prisma } from '@/infrastructure/prisma';

export type CancelResult = { readonly outcome: 'cancelled' | 'not_found' | 'not_cancellable' };

/**
 * Cancels the owner's active item before its time, once (L2-022). A repeat answers the same.
 * The slot and any pending change's slot are released, and the braider's view no longer lists
 * the request; the version moves on so an answer in flight is stale.
 */
export async function cancelAppointment(customerId: string, ref: string): Promise<CancelResult> {
  const number = referenceNumber(ref);
  if (number === null) return { outcome: 'not_found' };
  const appointment = await prisma.appointment.findFirst({
    where: { number, customerId },
    include: { braider: { select: { name: true } } },
  });
  if (!appointment) return { outcome: 'not_found' };
  if (appointment.status === 'cancelled') return { outcome: 'cancelled' };
  if (!canCancel(appointment)) return { outcome: 'not_cancellable' };

  return prisma.$transaction(async (tx) => {
    const { count } = await tx.appointment.updateMany({
      where: {
        id: appointment.id,
        status: { in: ['awaiting_reply', 'confirmed'] },
        start: { gt: new Date() },
      },
      data: { status: 'cancelled', heldSlotId: null, version: { increment: 1 } },
    });
    if (count === 0) {
      const now = await tx.appointment.findUniqueOrThrow({ where: { id: appointment.id } });
      return { outcome: now.status === 'cancelled' ? 'cancelled' : 'not_cancellable' } as const;
    }
    await tx.appointmentChange.updateMany({
      where: { appointmentId: appointment.id, status: 'pending' },
      data: { status: 'withdrawn', heldSlotId: null, decidedAt: new Date() },
    });
    const refText = reference(appointment.number);
    await recordNotification(tx, {
      userId: customerId,
      title: appointment.status === 'confirmed' ? 'Appointment cancelled' : 'Request cancelled',
      body: `${refText} is cancelled. ${firstName(appointment.braider.name)} can see that you no longer need this time.`,
      link: `/appointments/${refText}`,
    });
    return { outcome: 'cancelled' } as const;
  });
}
