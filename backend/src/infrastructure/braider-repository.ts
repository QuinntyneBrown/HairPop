import { prisma } from './prisma';

/** A published braider with their published services (for published styles) and portfolio. */
export function findPublishedBraider(slug: string) {
  return prisma.braider.findFirst({
    where: { slug, published: true },
    include: {
      services: {
        where: { published: true, style: { published: true } },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      },
      portfolio: { orderBy: [{ createdAt: 'desc' }, { id: 'asc' }] },
    },
  });
}

/** Sum and count of the braider's published review ratings (L2-008). */
export async function publishedRatingTotals(braiderId: string) {
  const totals = await prisma.review.aggregate({
    where: { braiderId, status: 'published' },
    _sum: { rating: true },
    _count: true,
  });
  return { sum: totals._sum.rating ?? 0, count: totals._count };
}

export function findPublishedBraiderId(slug: string) {
  return prisma.braider.findFirst({ where: { slug, published: true }, select: { id: true } });
}

/** A page of the braider's published reviews, newest first, and how many there are. */
export async function findPublishedReviews(braiderId: string, skip: number, take: number) {
  const where = { braiderId, status: 'published' as const };
  const [reviews, total] = await prisma.$transaction([
    prisma.review.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      skip,
      take,
      include: { author: { select: { name: true } }, service: { select: { name: true } } },
    }),
    prisma.review.count({ where }),
  ]);
  return { reviews, total };
}
