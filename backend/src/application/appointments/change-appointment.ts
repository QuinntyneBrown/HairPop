import { canChange, referenceNumber } from '@/domain/appointment';
import { freeSlots } from '@/infrastructure/booking-repository';
import { prisma } from '@/infrastructure/prisma';
import { lockSlot } from '@/infrastructure/slot-lock';

async function findOwned(customerId: string, ref: string) {
  const number = referenceNumber(ref);
  if (number === null) return null;
  return prisma.appointment.findFirst({
    where: { number, customerId },
    include: { changes: { where: { status: 'pending' }, take: 1 } },
  });
}

type Slot = { id: string; start: string };

export type ChangeOptionsResult =
  | { readonly outcome: 'options'; readonly slots: readonly Slot[] }
  | { readonly outcome: 'not_found' | 'not_changeable' };

/** The braider's free future slots long enough for the appointment (L2-021). */
export async function getChangeOptions(
  customerId: string,
  ref: string,
): Promise<ChangeOptionsResult> {
  const appointment = await findOwned(customerId, ref);
  if (!appointment) return { outcome: 'not_found' };
  if (!canChange(appointment, appointment.changes.length > 0)) return { outcome: 'not_changeable' };

  const slots = await prisma.offeredSlot.findMany({
    where: {
      braiderId: appointment.braiderId,
      maxHours: { gte: appointment.durationHours },
      ...freeSlots(),
    },
    orderBy: [{ start: 'asc' }, { id: 'asc' }],
  });
  return {
    outcome: 'options',
    slots: slots.map((slot) => ({ id: slot.id, start: slot.start.toISOString() })),
  };
}

export type ProposeChangeResult =
  | { readonly outcome: 'proposed'; readonly start: string }
  | { readonly outcome: 'not_found' | 'not_changeable' | 'slot_unavailable' };

/**
 * Records a pending change to a free offered slot; the agreed time stays authoritative until
 * the braider accepts (L2-021 AC1). The appointment's version moves on, so a braider's answer
 * to the earlier state is stale.
 */
export async function proposeChange(command: {
  customerId: string;
  ref: string;
  slotId: string;
  note: string | null;
}): Promise<ProposeChangeResult> {
  const appointment = await findOwned(command.customerId, command.ref);
  if (!appointment) return { outcome: 'not_found' };

  return prisma.$transaction(async (tx) => {
    await lockSlot(tx, command.slotId);
    const pending = await tx.appointmentChange.count({
      where: { appointmentId: appointment.id, status: 'pending' },
    });
    const current = await tx.appointment.findUniqueOrThrow({ where: { id: appointment.id } });
    if (!canChange(current, pending > 0)) return { outcome: 'not_changeable' } as const;

    const slot = await tx.offeredSlot.findFirst({
      where: {
        id: command.slotId,
        braiderId: current.braiderId,
        maxHours: { gte: current.durationHours },
        ...freeSlots(),
      },
    });
    if (!slot) return { outcome: 'slot_unavailable' } as const;

    await tx.appointmentChange.create({
      data: {
        appointmentId: current.id,
        slotId: slot.id,
        heldSlotId: slot.id,
        start: slot.start,
        note: command.note,
      },
    });
    await tx.appointment.update({
      where: { id: current.id },
      data: { version: { increment: 1 } },
    });
    return { outcome: 'proposed', start: slot.start.toISOString() } as const;
  });
}
