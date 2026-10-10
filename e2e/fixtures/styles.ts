import type {
  Page as ApiPage,
  StyleDetail,
  StyleSummary,
} from '../../frontend/projects/api/src/public-api';

import type { ApiRule } from './api';

/** Styles from the cast (docs/mocks/README.md). */
export const knotlessBraids: StyleSummary = {
  slug: 'knotless-braids',
  name: 'Knotless braids',
  category: 'braids',
  eyebrow: 'Most explored',
  image: {
    src: 'https://media.hairpop.example/styles/knotless-braids.png',
    alt: 'Medium knotless braids shown from the back and side',
  },
  typicalHours: { min: 4, max: 7 },
  typicalPrice: { min: 160, max: 300 },
};

export const passionTwists: StyleSummary = {
  slug: 'passion-twists',
  name: 'Passion twists',
  category: 'twists',
  eyebrow: 'Twists',
  image: null,
  typicalHours: { min: 3, max: 6 },
  typicalPrice: { min: 140, max: 260 },
};

export const cornrows: StyleSummary = {
  slug: 'cornrows',
  name: 'Cornrows',
  category: 'braids',
  eyebrow: 'Classic',
  image: null,
  typicalHours: { min: 2, max: 4 },
  typicalPrice: null,
};

export const starterLocs: StyleSummary = {
  slug: 'starter-locs',
  name: 'Starter locs',
  category: 'locs',
  eyebrow: 'Locs',
  image: null,
  typicalHours: { min: 3, max: 5 },
  typicalPrice: { min: 150, max: 250 },
};

export const gallery = [knotlessBraids, passionTwists, cornrows];

export const knotlessBraidsDetail: StyleDetail = {
  ...knotlessBraids,
  intro:
    'Knotless braids start with your natural hair, then extensions are fed in gradually. The finish is flexible and usually feels lighter at the roots.',
  typicalWear: { min: 4, max: 8 },
  variations: [
    { name: 'Small', description: 'Finer braids, about 6–7 hours' },
    { name: 'Medium', description: 'The most requested size, about 5 hours' },
    { name: 'Large', description: 'Quicker install, about 4 hours' },
  ],
  quoteFactors: [
    'Length and braid size',
    'Hair density and current length',
    'Whether you bring extensions',
    'Add-ons such as curly ends or colour',
  ],
  unavailable: [],
};

export function page<T>(data: readonly T[], meta: Partial<ApiPage<T>['meta']> = {}): ApiPage<T> {
  const perPage = meta.perPage ?? 12;
  const total = meta.total ?? data.length;
  return {
    data,
    meta: {
      page: meta.page ?? 1,
      perPage,
      total,
      lastPage: meta.lastPage ?? Math.max(1, Math.ceil(total / perPage)),
    },
  };
}

/** GET /api/styles answering with the given styles (optionally only for a query). */
export function listStyles(
  styles: readonly StyleSummary[],
  options: {
    query?: ApiRule['query'];
    meta?: Partial<ApiPage<StyleSummary>['meta']>;
    delayMs?: number;
  } = {},
): ApiRule {
  return {
    method: 'GET',
    path: '/api/styles',
    query: options.query,
    body: page(styles, options.meta),
    delayMs: options.delayMs,
  };
}

export function getStyle(style: StyleDetail): ApiRule {
  return { method: 'GET', path: `/api/styles/${style.slug}`, body: style };
}
