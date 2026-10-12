import { firstName, localWhen, reference, referenceNumber } from '@/domain/appointment';
import type { Range } from '@/domain/common';
import { recordNotification } from '@/infrastructure/notification-repository';
import { prisma } from '@/infrastructure/prisma';

/** A booking or change request waiting for the braider (L2-020, L2-021). */
export interface BraiderRequest {
  readonly reference: string;
  readonly kind: 'booking' | 'change';
  readonly customer: { readonly name: string };
  readonly service: string;
  readonly start: string;
  readonly previousStart: string | null;
  readonly durationHours: number;
  readonly estimate: Range | null;
  readonly agreedAmount: number | null;
  readonly hairDetails: string;
  readonly version: number;
}

/** The braider's own requests and pending changes still awaiting a reply, soonest first. */
export async function listBraiderRequests(braiderId: string): Promise<BraiderRequest[]> {
  const requests = await prisma.appointment.findMany({
    where: {
      braiderId,
      status: { in: ['awaiting_reply', 'confirmed'] },
      start: { gt: new Date() },
      OR: [{ status: 'awaiting_reply' }, { changes: { some: { status: 'pending' } } }],
    },
    include: {
      customer: { select: { name: true } },
      changes: { where: { status: 'pending' }, take: 1 },
    },
  });
  return requests
    .map((request): BraiderRequest => {
      const change = request.changes[0];
      return {
        reference: reference(request.number),
        kind: change ? 'change' : 'booking',
        customer: { name: request.customer.name },
        service: request.serviceName,
        start: (change?.start ?? request.start).toISOString(),
        previousStart: change ? request.start.toISOString() : null,
        durationHours: request.durationHours,
        estimate: { min: request.estimateMin, max: request.estimateMax },
        agreedAmount: request.agreedAmount,
        hairDetails: request.hairDetails,
        version: request.version,
      };
    })
    .sort((a, b) => a.start.localeCompare(b.start) || a.reference.localeCompare(b.reference));
}

export interface RespondCommand {
  readonly braiderId: string;
  readonly braiderName: string;
  readonly ref: string;
  readonly decision: 'accept' | 'decline';
  readonly agreedAmount: number | null;
  readonly version: number;
}

export type RespondResult =
  | { readonly outcome: 'responded'; readonly status: 'confirmed' | 'declined' | 'awaiting_reply' }
  | { readonly outcome: 'not_found' | 'forbidden' | 'stale' };

/**
 * Accepts or declines a pending request, or its pending change, against the version the braider
 * saw (L2-020, L2-021 AC3). Anything answered, cancelled, changed or past since is stale and stays
 * as it is (L2-020 AC3). Declining a request frees its slot; accepting a change moves the
 * appointment to the proposed slot and frees the old one. Every answer records the customer's
 * update (L2-029).
 */
export async function respondToRequest(command: RespondCommand): Promise<RespondResult> {
  const number = referenceNumber(command.ref);
  if (number === null) return { outcome: 'not_found' };
  const request = await prisma.appointment.findUnique({
    where: { number },
    include: { changes: { where: { status: 'pending' }, take: 1 } },
  });
  if (!request) return { outcome: 'not_found' };
  if (request.braiderId !== command.braiderId) return { outcome: 'forbidden' };

  const change = request.changes[0];
  return change ? respondToChange(command, request, change) : respondToBooking(command, request);
}

type Request = NonNullable<Awaited<ReturnType<typeof prisma.appointment.findUnique>>>;
type Change = Awaited<ReturnType<typeof prisma.appointmentChange.findFirstOrThrow>>;

const STALE = { outcome: 'stale' } as const;

function respondToBooking(command: RespondCommand, request: Request): Promise<RespondResult> {
  const accept = command.decision === 'accept';
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.appointment.updateMany({
      where: {
        id: request.id,
        version: command.version,
        status: 'awaiting_reply',
        start: { gt: new Date() },
        slotId: { not: null },
      },
      data: accept
        ? { status: 'confirmed', agreedAmount: command.agreedAmount, version: { increment: 1 } }
        : { status: 'declined', heldSlotId: null, version: { increment: 1 } },
    });
    if (count === 0) return STALE;

    const ref = reference(request.number);
    const name = firstName(command.braiderName);
    await recordNotification(tx, {
      userId: request.customerId,
      title: accept ? 'Time confirmed' : 'Request declined',
      body: accept
        ? `${name} confirmed ${ref} for ${localWhen(request.start)}.`
        : `${name} can’t take ${ref}. You can request another time or braider.`,
      link: `/appointments/${ref}`,
    });
    return { outcome: 'responded', status: accept ? 'confirmed' : 'declined' } as const;
  });
}

function respondToChange(
  command: RespondCommand,
  request: Request,
  change: Change,
): Promise<RespondResult> {
  const accept = command.decision === 'accept';
  if (accept && change.slotId === null) return Promise.resolve(STALE);
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.appointment.updateMany({
      where: {
        id: request.id,
        version: command.version,
        status: { in: ['awaiting_reply', 'confirmed'] },
        start: { gt: new Date() },
      },
      data: { version: { increment: 1 } },
    });
    if (count === 0) return STALE;

    await tx.appointmentChange.update({
      where: { id: change.id },
      data: { status: accept ? 'accepted' : 'declined', heldSlotId: null, decidedAt: new Date() },
    });
    if (accept) {
      await tx.appointment.update({
        where: { id: request.id },
        data: { start: change.start, slotId: change.slotId, heldSlotId: change.slotId },
      });
    }

    const ref = reference(request.number);
    const name = firstName(command.braiderName);
    await recordNotification(tx, {
      userId: request.customerId,
      title: accept ? 'New time confirmed' : 'Change declined',
      body: accept
        ? `${name} moved ${ref} to ${localWhen(change.start)}.`
        : `${name} can’t move ${ref}. Your time stays ${localWhen(request.start)}.`,
      link: `/appointments/${ref}`,
    });
    return {
      outcome: 'responded',
      status: request.status === 'confirmed' ? 'confirmed' : 'awaiting_reply',
    } as const;
  });
}
