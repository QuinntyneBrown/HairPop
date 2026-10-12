import { image, range, type Image, type Range } from './common';

export const STYLE_CATEGORIES = ['braids', 'twists', 'locs'] as const;
export type StyleCategory = (typeof STYLE_CATEGORIES)[number];

export interface StyleSummary {
  readonly slug: string;
  readonly name: string;
  readonly category: StyleCategory;
  readonly eyebrow: string;
  readonly image: Image | null;
  readonly typicalHours: Range | null;
  readonly typicalPrice: Range | null;
}

interface StyleRecord {
  readonly slug: string;
  readonly name: string;
  readonly category: StyleCategory;
  readonly eyebrow: string;
  readonly imageSrc: string | null;
  readonly imageAlt: string | null;
  readonly typicalHoursMin: number | null;
  readonly typicalHoursMax: number | null;
  readonly typicalPriceMin: number | null;
  readonly typicalPriceMax: number | null;
}

export function toStyleSummary(style: StyleRecord): StyleSummary {
  return {
    slug: style.slug,
    name: style.name,
    category: style.category,
    eyebrow: style.eyebrow,
    image: image(style.imageSrc, style.imageAlt),
    typicalHours: range(style.typicalHoursMin, style.typicalHoursMax),
    typicalPrice: range(style.typicalPriceMin, style.typicalPriceMax),
  };
}

export interface StyleVariation {
  readonly name: string;
  readonly description: string;
}

export type StyleOptionalFact = 'typicalWear' | 'variations' | 'quoteFactors';

export interface StyleDetail extends StyleSummary {
  readonly intro: string;
  readonly typicalWear: Range | null;
  readonly variations: readonly StyleVariation[];
  readonly quoteFactors: readonly string[];
  /** Optional facts that failed to load; every fact comes from one row, so this is always empty. */
  readonly unavailable: readonly StyleOptionalFact[];
}

interface StyleDetailRecord extends StyleRecord {
  readonly intro: string;
  readonly typicalWearMin: number | null;
  readonly typicalWearMax: number | null;
  readonly variations: unknown;
  readonly quoteFactors: readonly string[];
}

export function toStyleDetail(style: StyleDetailRecord): StyleDetail {
  return {
    ...toStyleSummary(style),
    intro: style.intro,
    typicalWear: range(style.typicalWearMin, style.typicalWearMax),
    variations: style.variations as StyleVariation[],
    quoteFactors: style.quoteFactors,
    unavailable: [],
  };
}
