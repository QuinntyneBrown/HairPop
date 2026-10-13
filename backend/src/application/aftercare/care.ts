import { lifecycle, reference, referenceNumber } from '@/domain/appointment';
import { localDate } from '@/domain/review';
import { prisma } from '@/infrastructure/prisma';

export interface CareDetail {
  readonly reference: string;
  readonly service: string;
  readonly braider: { readonly slug: string; readonly name: string };
  /** The visit's calendar date in Toronto, `YYYY-MM-DD`. */
  readonly date: string;
  readonly guidance: { readonly items: readonly string[]; readonly source: string } | null;
  readonly review: 'open' | 'submitted' | 'not_allowed';
}

/**
 * The booked service's care guidance from its braider after a completed visit, and whether the
 * visit can still be reviewed (L2-024 AC2, AC3). Null for anything but the owner's reference.
 */
export async function getVisitCare(customerId: string, ref: string): Promise<CareDetail | null> {
  const number = referenceNumber(ref);
  if (number === null) return null;
  const visit = await prisma.appointment.findFirst({
    where: { number, customerId },
    include: {
      braider: { select: { slug: true, name: true } },
      service: { select: { careGuidance: true } },
      review: { select: { id: true } },
    },
  });
  if (!visit) return null;

  const completed = lifecycle(visit) === 'completed';
  const items = visit.service.careGuidance;
  return {
    reference: reference(visit.number),
    service: visit.serviceName,
    braider: visit.braider,
    date: localDate(visit.start),
    guidance:
      completed && items.length > 0
        ? { items, source: `${visit.braider.name}, for ${lowerFirst(visit.serviceName)}` }
        : null,
    review: visit.review ? 'submitted' : completed ? 'open' : 'not_allowed',
  };
}

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}
