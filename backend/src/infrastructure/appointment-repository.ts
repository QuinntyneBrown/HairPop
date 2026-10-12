import type { Prisma } from '@prisma/client';
import { prisma } from './prisma';

export const appointmentInclude = {
  braider: {
    select: { slug: true, name: true, area: true, studioAddress: true, preparationPolicy: true },
  },
  service: { select: { preparation: true, styleSlug: true, published: true } },
  changes: { where: { status: 'pending' }, take: 1 },
} satisfies Prisma.AppointmentInclude;

/** The customer's own appointment by reference number, or null (no disclosure, L2-019 AC4). */
export function findOwnedAppointment(customerId: string, number: number) {
  return prisma.appointment.findFirst({
    where: { number, customerId },
    include: appointmentInclude,
  });
}

export interface OwnedQuery {
  readonly customerId: string;
  readonly filter: 'all' | 'upcoming' | 'past';
  readonly search?: string;
  readonly referenceNumber: number | null;
  readonly skip: number;
  readonly take: number;
}

export async function findOwnedAppointments(query: OwnedQuery) {
  const now = new Date();
  const where: Prisma.AppointmentWhereInput = {
    customerId: query.customerId,
    ...(query.filter === 'upcoming' ? { start: { gte: now } } : {}),
    ...(query.filter === 'past' ? { start: { lt: now } } : {}),
    ...(query.search
      ? {
          OR: [
            { serviceName: { contains: query.search, mode: 'insensitive' } },
            { braider: { name: { contains: query.search, mode: 'insensitive' } } },
            ...(query.referenceNumber === null ? [] : [{ number: query.referenceNumber }]),
          ],
        }
      : {}),
  };
  const direction = query.filter === 'upcoming' ? 'asc' : 'desc';
  const [appointments, total] = await prisma.$transaction([
    prisma.appointment.findMany({
      where,
      include: appointmentInclude,
      orderBy: [{ start: direction }, { number: direction }],
      skip: query.skip,
      take: query.take,
    }),
    prisma.appointment.count({ where }),
  ]);
  return { appointments, total };
}
