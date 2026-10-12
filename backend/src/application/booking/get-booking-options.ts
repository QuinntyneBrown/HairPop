import { policyVersion, TIME_ZONE, toBookableService, type BookingOptions } from '@/domain/booking';
import { findBookableBraider, findContact } from '@/infrastructure/booking-repository';
import { prisma } from '@/infrastructure/prisma';

/**
 * What the customer can request from a published braider right now: published services, free
 * future slots and the current terms with their version (L2-015, L2-016). Null when the braider
 * is unknown or unpublished.
 */
export async function getBookingOptions(
  slug: string,
  customerId: string,
): Promise<BookingOptions | null> {
  const braider = await findBookableBraider(prisma, slug);
  if (!braider) return null;
  const contact = await findContact(customerId);

  return {
    braider: { slug: braider.slug, name: braider.name, area: braider.area },
    services: braider.services.map(toBookableService),
    slots: braider.slots.map((slot) => ({ id: slot.id, start: slot.start.toISOString() })),
    policy: {
      version: policyVersion(braider),
      changes: braider.changePolicy ?? '',
      cancellation: braider.cancellationPolicy ?? '',
    },
    contact,
    timeZone: TIME_ZONE,
  };
}
