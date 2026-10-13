import {
  canCancel,
  canChange,
  lifecycle,
  preparationChecklist,
  price,
  reference,
  referenceNumber,
  type AppointmentDetail,
  type AppointmentSummary,
} from '@/domain/appointment';
import { TIME_ZONE } from '@/domain/booking';
import { pageMeta, PER_PAGE, type Page } from '@/domain/common';
import {
  findOwnedAppointment,
  findOwnedAppointments,
} from '@/infrastructure/appointment-repository';

type Record = NonNullable<Awaited<ReturnType<typeof findOwnedAppointment>>>;

function toSummary(record: Record, now: Date): AppointmentSummary {
  return {
    reference: reference(record.number),
    status: lifecycle(record, now),
    service: record.serviceName,
    braider: { slug: record.braider.slug, name: record.braider.name },
    start: record.start.toISOString(),
    timeZone: TIME_ZONE,
    price: price(record),
  };
}

export interface ListQuery {
  readonly filter: 'all' | 'upcoming' | 'past';
  readonly search?: string;
  readonly page: number;
}

/** Only the customer's own requests and appointments (L2-018). */
export async function listOwnedAppointments(
  customerId: string,
  query: ListQuery,
): Promise<Page<AppointmentSummary>> {
  const { appointments, total } = await findOwnedAppointments({
    customerId,
    filter: query.filter,
    search: query.search,
    referenceNumber: query.search ? referenceNumber(query.search.replace(/^(hp-)?/i, 'HP-')) : null,
    skip: (query.page - 1) * PER_PAGE,
    take: PER_PAGE,
  });
  const now = new Date();
  return { data: appointments.map((a) => toSummary(a, now)), meta: pageMeta(query.page, total) };
}

/** The owner's detail with state-dependent disclosure, or null for any other reference (L2-019). */
export async function getOwnedAppointment(
  customerId: string,
  ref: string,
): Promise<AppointmentDetail | null> {
  const number = referenceNumber(ref);
  if (number === null) return null;
  const record = await findOwnedAppointment(customerId, number);
  if (!record) return null;

  const now = new Date();
  const status = lifecycle(record, now);
  const pending = record.changes[0] ?? null;
  const accepted = status === 'confirmed' || status === 'completed';
  return {
    ...toSummary(record, now),
    durationHours: record.durationHours,
    location: {
      area: record.braider.area,
      address: accepted ? record.braider.studioAddress : null,
    },
    contact: { email: record.email, phone: record.phone },
    policy: { changes: record.changePolicy, cancellation: record.cancellationPolicy },
    preparation: preparationChecklist(record.braider.preparationPolicy, record.service.preparation),
    pendingChange: pending ? { start: pending.start.toISOString() } : null,
    allowed: {
      change: canChange(record, pending !== null, now),
      cancel: canCancel(record, now),
      rebook: status === 'completed',
      review: status === 'completed' && record.review === null,
    },
    unavailable: [],
    updatedAt: record.updatedAt.toISOString(),
  };
}
