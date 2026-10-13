import { reference } from '@/domain/appointment';
import { prisma } from '@/infrastructure/prisma';
import type { EditResult } from './services';

export interface ManagedSlot {
  readonly id: string;
  readonly start: string;
  readonly maxHours: number;
  /** The request or pending change holding this time, which can't then be withdrawn. */
  readonly requestReference: string | null;
}

const HOUR_MS = 60 * 60 * 1000;

const holders = {
  appointments: { where: { heldSlotId: { not: null } }, select: { number: true } },
  changes: {
    where: { heldSlotId: { not: null } },
    select: { appointment: { select: { number: true } } },
  },
} as const;

type SlotRecord = Awaited<ReturnType<typeof findSlots>>[number];

function findSlots(braiderId: string) {
  return prisma.offeredSlot.findMany({
    where: { braiderId, start: { gt: new Date() } },
    include: holders,
    orderBy: [{ start: 'asc' }, { id: 'asc' }],
  });
}

function toManaged(slot: SlotRecord): ManagedSlot {
  const number = slot.appointments[0]?.number ?? slot.changes[0]?.appointment.number;
  return {
    id: slot.id,
    start: slot.start.toISOString(),
    maxHours: slot.maxHours,
    requestReference: number === undefined ? null : reference(number),
  };
}

/** The braider's own future offered times (L2-028). */
export async function listManagedSlots(braiderId: string): Promise<ManagedSlot[]> {
  return (await findSlots(braiderId)).map(toManaged);
}

export type AddSlotResult =
  { readonly outcome: 'added'; readonly slot: ManagedSlot } | { readonly outcome: 'overlap' };

/** Offers a future time unless it overlaps one of the braider's other future times. */
export async function addSlot(
  braiderId: string,
  start: Date,
  maxHours: number,
): Promise<AddSlotResult> {
  const end = start.getTime() + maxHours * HOUR_MS;
  return prisma.$transaction(async (tx) => {
    // Serializes this braider's additions, so two overlapping times can't both be saved.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${braiderId}))`;
    const nearby = await tx.offeredSlot.findMany({
      where: {
        braiderId,
        start: { lt: new Date(end), gt: new Date(start.getTime() - 24 * HOUR_MS) },
      },
    });
    const overlaps = nearby.some(
      (slot) => slot.start.getTime() + slot.maxHours * HOUR_MS > start.getTime(),
    );
    if (overlaps) return { outcome: 'overlap' } as const;
    const slot = await tx.offeredSlot.create({ data: { braiderId, start, maxHours } });
    return {
      outcome: 'added',
      slot: { id: slot.id, start: slot.start.toISOString(), maxHours, requestReference: null },
    } as const;
  });
}

/** Withdraws the braider's own time unless a request or pending change holds it (L2-028). */
export async function withdrawSlot(
  braiderId: string,
  id: string,
): Promise<EditResult<null> | { readonly outcome: 'requested' }> {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "OfferedSlot" WHERE "id" = ${id} FOR UPDATE`;
    const slot = await tx.offeredSlot.findUnique({ where: { id }, include: holders });
    if (!slot) return { outcome: 'not_found' } as const;
    if (slot.braiderId !== braiderId) return { outcome: 'forbidden' } as const;
    if (slot.appointments.length > 0 || slot.changes.length > 0) {
      return { outcome: 'requested' } as const;
    }
    await tx.offeredSlot.delete({ where: { id } });
    return { outcome: 'saved', value: null } as const;
  });
}
