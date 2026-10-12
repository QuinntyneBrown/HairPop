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

/** The braider's own requests still awaiting a reply, soonest first. */
export async function listBraiderRequests(braiderId: string): Promise<BraiderRequest[]> {
  const requests = await prisma.appointment.findMany({
    where: { braiderId, status: 'awaiting_reply', start: { gt: new Date() } },
    include: { customer: { select: { name: true } } },
    orderBy: [{ start: 'asc' }, { number: 'asc' }],
  });
  return requests.map((request) => ({
    reference: reference(request.number),
    kind: 'booking',
    customer: { name: request.customer.name },
    service: request.serviceName,
    start: request.start.toISOString(),
    previousStart: null,
    durationHours: request.durationHours,
    estimate: { min: request.estimateMin, max: request.estimateMax },
    agreedAmount: request.agreedAmount,
    hairDetails: request.hairDetails,
    version: request.version,
  }));
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
  | { readonly outcome: 'responded'; readonly status: 'confirmed' | 'declined' }
  | { readonly outcome: 'not_found' | 'forbidden' | 'stale' };

/**
 * Accepts or declines a pending request against the version the braider saw (L2-020). A request
 * already answered, cancelled, changed or past is stale and stays as it is (AC3). Declining
 * frees the slot; either answer records the customer's update (L2-029).
 */
export async function respondToRequest(command: RespondCommand): Promise<RespondResult> {
  const number = referenceNumber(command.ref);
  if (number === null) return { outcome: 'not_found' };
  const request = await prisma.appointment.findUnique({ where: { number } });
  if (!request) return { outcome: 'not_found' };
  if (request.braiderId !== command.braiderId) return { outcome: 'forbidden' };

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
    if (count === 0) return { outcome: 'stale' } as const;

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
