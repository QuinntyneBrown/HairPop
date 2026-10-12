import type { Db } from './db';
import { prisma } from './prisma';

/** Published services for published styles: the ones customers can request (L2-015). */
export const bookableServices = { published: true, style: { published: true } } as const;

/** Future offered slots that no active request, appointment or pending change holds. */
export function freeSlots(now = new Date()) {
  return {
    start: { gt: now },
    appointments: { none: { heldSlotId: { not: null } } },
  } as const;
}

/** A published braider with what a customer can book now. */
export function findBookableBraider(db: Db, slug: string) {
  return db.braider.findFirst({
    where: { slug, published: true },
    include: {
      services: { where: bookableServices, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] },
      slots: { where: freeSlots(), orderBy: [{ start: 'asc' }, { id: 'asc' }] },
    },
  });
}

export function findContact(userId: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { email: true, phone: true },
  });
}
