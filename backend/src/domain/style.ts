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
