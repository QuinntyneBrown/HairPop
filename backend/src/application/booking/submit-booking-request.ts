import { Prisma } from '@prisma/client';
import { firstName, reference } from '@/domain/appointment';
import { policyVersion } from '@/domain/booking';
import { normalizeEmail } from '@/domain/email';
import { findBookableBraider } from '@/infrastructure/booking-repository';
import { recordNotification } from '@/infrastructure/notification-repository';
import { prisma } from '@/infrastructure/prisma';
import { recordHit, retryAfterSeconds } from '@/infrastructure/rate-limiter';
import { lockSlot } from '@/infrastructure/slot-lock';

/** New booking requests allowed per customer in the window (L2-040 AC2). */
export const BOOKING_MAX = 10;
export const BOOKING_WINDOW_SECONDS = 60 * 60;

export interface SubmitBookingCommand {
  readonly customerId: string;
  readonly idempotencyKey: string;
  readonly braiderSlug: string;
  readonly serviceId: string;
  readonly slotId: string;
  readonly email: string;
  readonly phone: string | null;
  readonly hairDetails: string;
  readonly policyVersion: string;
}

export type SubmitBookingResult =
  | { readonly outcome: 'submitted'; readonly reference: string }
  | { readonly outcome: 'not_found' }
  | { readonly outcome: 'service_unavailable' | 'slot_unavailable' | 'terms_changed' }
  | { readonly outcome: 'rate_limited'; readonly retryAfter: number };

/**
 * Creates one awaiting-reply request for a reviewed attempt (L2-017). The same idempotency key
 * returns the first request. The service must still be published, the slot still offered, free,
 * in the future and long enough, and the terms unchanged since review (L2-015, L2-016, L2-028).
 */
export async function submitBookingRequest(
  command: SubmitBookingCommand,
): Promise<SubmitBookingResult> {
  const earlier = await findAttempt(command.customerId, command.idempotencyKey);
  if (earlier) return earlier;

  const limitKey = `booking:${command.customerId}`;
  const retryAfter = await retryAfterSeconds(limitKey, BOOKING_MAX);
  if (retryAfter !== null) return { outcome: 'rate_limited', retryAfter };

  try {
    const result = await prisma.$transaction(async (tx) => {
      await lockSlot(tx, command.slotId);
      // A concurrent retry of this attempt may have committed while we waited for the lock.
      const raced = await findAttempt(command.customerId, command.idempotencyKey, tx);
      if (raced) return raced;

      const braider = await findBookableBraider(tx, command.braiderSlug);
      if (!braider) return { outcome: 'not_found' } as const;
      const service = braider.services.find((s) => s.id === command.serviceId);
      if (!service) return { outcome: 'service_unavailable' } as const;
      const slot = braider.slots.find((s) => s.id === command.slotId);
      if (!slot || slot.maxHours < service.typicalHours) {
        return { outcome: 'slot_unavailable' } as const;
      }
      if (command.policyVersion !== policyVersion(braider)) {
        return { outcome: 'terms_changed' } as const;
      }

      const created = await tx.appointment.create({
        data: {
          customerId: command.customerId,
          braiderId: braider.id,
          serviceId: service.id,
          slotId: slot.id,
          heldSlotId: slot.id,
          serviceName: service.name,
          start: slot.start,
          durationHours: service.typicalHours,
          estimateMin: service.startingPrice,
          email: normalizeEmail(command.email),
          phone: command.phone,
          hairDetails: command.hairDetails,
          policyVersion: command.policyVersion,
          changePolicy: braider.changePolicy ?? '',
          cancellationPolicy: braider.cancellationPolicy ?? '',
          idempotencyKey: command.idempotencyKey,
        },
      });
      const ref = reference(created.number);
      const name = firstName(braider.name);
      await recordNotification(tx, {
        userId: command.customerId,
        title: `${name} received your request`,
        body: `${ref} · ${name} will confirm the time and final price.`,
        link: `/appointments/${ref}`,
      });
      return { outcome: 'submitted', reference: ref } as const;
    });
    if (result.outcome === 'submitted') await recordHit(limitKey, BOOKING_WINDOW_SECONDS);
    return result;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const raced = await findAttempt(command.customerId, command.idempotencyKey);
      return raced ?? { outcome: 'slot_unavailable' };
    }
    throw error;
  }
}

async function findAttempt(
  customerId: string,
  idempotencyKey: string,
  db: Prisma.TransactionClient = prisma,
): Promise<SubmitBookingResult | null> {
  const found = await db.appointment.findUnique({
    where: { customerId_idempotencyKey: { customerId, idempotencyKey } },
    select: { number: true },
  });
  return found ? { outcome: 'submitted', reference: reference(found.number) } : null;
}
