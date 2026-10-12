import { lifecycle, referenceNumber } from '@/domain/appointment';
import { bookableServices } from '@/infrastructure/booking-repository';
import { prisma } from '@/infrastructure/prisma';

export type RepeatBookingResult =
  | { readonly outcome: 'ready'; readonly braiderSlug: string; readonly serviceId: string }
  | { readonly outcome: 'not_found' | 'not_completed' | 'service_unavailable' };

/**
 * Preselects a completed visit's braider and service for a new request when both are still
 * offered (L2-023). No time is carried over; the customer chooses a current one.
 */
export async function prepareRepeatBooking(
  customerId: string,
  ref: string,
): Promise<RepeatBookingResult> {
  const number = referenceNumber(ref);
  if (number === null) return { outcome: 'not_found' };
  const visit = await prisma.appointment.findFirst({ where: { number, customerId } });
  if (!visit) return { outcome: 'not_found' };
  if (lifecycle(visit) !== 'completed') return { outcome: 'not_completed' };

  const service = await prisma.braiderService.findFirst({
    where: { id: visit.serviceId, ...bookableServices, braider: { published: true } },
    include: { braider: { select: { slug: true } } },
  });
  if (!service) return { outcome: 'service_unavailable' };
  return { outcome: 'ready', braiderSlug: service.braider.slug, serviceId: service.id };
}
