import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

export interface MatchCriteria {
  readonly styleSlug: string | null;
  readonly search?: string;
  readonly maxPrice?: number;
  readonly distanceKm?: number;
}

export interface MatchRow {
  readonly slug: string;
  readonly name: string;
  readonly area: string;
  readonly photoSrc: string | null;
  readonly photoAlt: string | null;
  readonly serviceId: string;
  readonly serviceName: string;
  readonly startingPrice: number;
  readonly typicalHours: number;
  readonly ratingAverage: Prisma.Decimal | null;
  readonly ratingCount: bigint;
  readonly nextAvailable: Date | null;
}

const escapeLike = (term: string) => term.replace(/[\\%_]/g, (c) => `\\${c}`);

/**
 * Every published braider with a published service for a published style that meets the
 * criteria — one row per braider, carrying their cheapest eligible service — best rated first.
 */
export function findMatches(criteria: MatchCriteria): Promise<MatchRow[]> {
  const conditions = [Prisma.sql`b.published`];
  if (criteria.styleSlug !== null) {
    conditions.push(Prisma.sql`s."styleSlug" = ${criteria.styleSlug}`);
  }
  if (criteria.maxPrice !== undefined) {
    conditions.push(Prisma.sql`s."startingPrice" <= ${criteria.maxPrice}`);
  }
  if (criteria.distanceKm !== undefined) {
    conditions.push(Prisma.sql`b."distanceKm" <= ${criteria.distanceKm}`);
  }
  if (criteria.search) {
    const pattern = `%${escapeLike(criteria.search)}%`;
    conditions.push(Prisma.sql`(b.name ILIKE ${pattern} OR b.area ILIKE ${pattern})`);
  }

  return prisma.$queryRaw<MatchRow[]>`
    WITH eligible AS (
      SELECT DISTINCT ON (b.id)
        b.id, b.slug, b.name, b.area, b."photoSrc", b."photoAlt",
        s.id AS "serviceId", s.name AS "serviceName", s."startingPrice", s."typicalHours"
      FROM "Braider" b
      JOIN "BraiderService" s ON s."braiderId" = b.id AND s.published
      JOIN "Style" st ON st.slug = s."styleSlug" AND st.published
      WHERE ${Prisma.join(conditions, ' AND ')}
      ORDER BY b.id, s."startingPrice", s.id
    )
    SELECT e.slug, e.name, e.area, e."photoSrc", e."photoAlt",
      e."serviceId", e."serviceName", e."startingPrice", e."typicalHours",
      r.average AS "ratingAverage", r.count AS "ratingCount", slot.next AS "nextAvailable"
    FROM eligible e
    LEFT JOIN LATERAL (
      SELECT round(avg(rating)::numeric, 1) AS average, count(*) AS count
      FROM "Review" WHERE "braiderId" = e.id AND status = 'published'
    ) r ON true
    LEFT JOIN LATERAL (
      SELECT min(start) AS next FROM "OfferedSlot" WHERE "braiderId" = e.id AND start > now()
    ) slot ON true
    ORDER BY r.average DESC NULLS LAST, r.count DESC, e.name ASC, e.slug ASC`;
}
