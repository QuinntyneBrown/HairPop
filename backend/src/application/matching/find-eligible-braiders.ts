import { image, pageMeta, PER_PAGE, type Page } from '@/domain/common';
import type { BraiderMatch, MatchingStyle } from '@/domain/matching';
import { findMatches, type MatchRow } from '@/infrastructure/matching-repository';
import { findPublishedStyle } from '@/infrastructure/style-repository';

export interface MatchQuery {
  readonly search?: string;
  readonly maxPrice?: number;
  readonly distanceKm?: number;
  readonly page: number;
}

export type StyleMatchResult =
  | { readonly outcome: 'found'; readonly page: Page<BraiderMatch, { style: MatchingStyle }> }
  | { readonly outcome: 'unknown_style' }
  | { readonly outcome: 'price_below_minimum'; readonly minPrice: number };

/** Braiders eligible for a published style under the price, distance and search filters (L2-004 – L2-006). */
export async function findEligibleBraidersForStyle(
  styleSlug: string,
  query: MatchQuery,
): Promise<StyleMatchResult> {
  const style = await findPublishedStyle(styleSlug);
  if (!style) return { outcome: 'unknown_style' };
  const minPrice = style.typicalPriceMin ?? 0;
  if (query.maxPrice !== undefined && query.maxPrice < minPrice) {
    return { outcome: 'price_below_minimum', minPrice };
  }

  const rows = await findMatches({ ...query, styleSlug });
  const page = toPage(rows, query.page);
  return {
    outcome: 'found',
    page: {
      ...page,
      meta: { ...page.meta, style: { slug: style.slug, name: style.name, minPrice } },
    },
  };
}

function toPage(rows: readonly MatchRow[], page: number): Page<BraiderMatch> {
  const start = (page - 1) * PER_PAGE;
  return {
    data: rows.slice(start, start + PER_PAGE).map(toMatch),
    meta: pageMeta(page, rows.length),
  };
}

function toMatch(row: MatchRow): BraiderMatch {
  return {
    braider: {
      slug: row.slug,
      name: row.name,
      area: row.area,
      photo: image(row.photoSrc, row.photoAlt),
    },
    rating:
      row.ratingAverage === null
        ? null
        : { average: row.ratingAverage.toNumber(), count: Number(row.ratingCount) },
    service: {
      id: row.serviceId,
      name: row.serviceName,
      startingPrice: row.startingPrice,
      typicalHours: row.typicalHours,
    },
    nextAvailable: row.nextAvailable?.toISOString() ?? null,
  };
}
