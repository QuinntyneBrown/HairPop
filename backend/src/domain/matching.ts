import type { Image } from './common';

export interface Rating {
  readonly average: number;
  readonly count: number;
}

/** One braider who offers the style, with the service that made them eligible (L2-004, L2-006). */
export interface BraiderMatch {
  readonly braider: {
    readonly slug: string;
    readonly name: string;
    readonly area: string;
    readonly photo: Image | null;
  };
  /** From published reviews only (L2-008); null before the first one. */
  readonly rating: Rating | null;
  readonly service: {
    readonly id: string;
    readonly name: string;
    readonly startingPrice: number;
    readonly typicalHours: number;
  };
  /** The earliest future offered slot; null when none is offered (L2-004 AC2). */
  readonly nextAvailable: string | null;
}

export interface MatchingStyle {
  readonly slug: string;
  readonly name: string;
  /** The lowest price for the style; a maximum-price filter below it is refused. */
  readonly minPrice: number;
}

/** Travel distances the filter offers, in km (L2-005). */
export const DISTANCES_KM = [5, 10, 25] as const;
