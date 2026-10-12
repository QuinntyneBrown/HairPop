import { Prisma } from '@prisma/client';
import type { Image } from './common';
import type { Rating } from './matching';

export interface BraiderService {
  readonly id: string;
  readonly name: string;
  readonly styleSlug: string;
  readonly startingPrice: number;
  readonly typicalHours: number;
}

export interface PortfolioItem {
  readonly id: string;
  readonly image: Image | null;
  readonly caption: string;
}

export interface BraiderPolicies {
  readonly preparation: string | null;
  readonly changes: string | null;
  readonly cancellation: string | null;
}

/** The public profile. It never carries the studio address or contact details (L2-039). */
export interface BraiderProfile {
  readonly slug: string;
  readonly name: string;
  readonly initials: string;
  readonly photo: Image | null;
  readonly area: string;
  readonly travelKm: number | null;
  readonly bio: string;
  readonly rating: Rating | null;
  readonly services: readonly BraiderService[];
  readonly portfolio: readonly PortfolioItem[];
  readonly policies: BraiderPolicies;
}

/** First letters of the first and last names: "Amara Nkiruka Adeyemi-Williams" → "AA". */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

/** Average to one decimal, rounding halves up as the matching query does; null before any review. */
export function rating(sum: number, count: number): Rating | null {
  if (count === 0) return null;
  const average = new Prisma.Decimal(sum)
    .div(count)
    .toDecimalPlaces(1, Prisma.Decimal.ROUND_HALF_UP);
  return { average: average.toNumber(), count };
}
