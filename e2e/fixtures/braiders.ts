import type {
  BraiderMatch,
  BraiderMatchPage,
  BraiderProfile,
  Review,
} from '../../frontend/projects/api/src/public-api';

import type { ApiRule } from './api';
import { page } from './styles';
import { MEDIA_ORIGIN } from './urls';

/** Braiders from the cast (docs/mocks/README.md), as knotless-braids matches. */
export const niaMatch: BraiderMatch = {
  braider: {
    slug: 'nia-okafor',
    name: 'Nia Okafor',
    area: 'Toronto West',
    photo: { src: `${MEDIA_ORIGIN}/braiders/nia.jpg`, alt: 'Nia Okafor smiling in her studio' },
  },
  rating: { average: 4.9, count: 86 },
  service: {
    id: 'svc-nia-knotless-m',
    name: 'Knotless braids',
    startingPrice: 180,
    typicalHours: 5,
  },
  nextAvailable: '2026-10-24T10:00:00-04:00',
};

export const aishaMatch: BraiderMatch = {
  braider: { slug: 'aisha-mensah', name: 'Aisha Mensah', area: 'North York', photo: null },
  rating: { average: 4.8, count: 64 },
  service: {
    id: 'svc-aisha-knotless',
    name: 'Knotless braids',
    startingPrice: 195,
    typicalHours: 6,
  },
  nextAvailable: null,
};

export const julesMatch: BraiderMatch = {
  braider: { slug: 'jules-baptiste', name: 'Jules Baptiste', area: 'Scarborough', photo: null },
  rating: null,
  service: {
    id: 'svc-jules-knotless',
    name: 'Knotless braids',
    startingPrice: 170,
    typicalHours: 5,
  },
  nextAvailable: '2026-10-25T11:00:00-04:00',
};

export const amaraMatch: BraiderMatch = {
  braider: {
    slug: 'amara-adeyemi-williams',
    name: 'Amara Nkiruka Adeyemi-Williams',
    area: 'Etobicoke, North York and Scarborough',
    photo: null,
  },
  rating: { average: 4.7, count: 1284 },
  service: {
    id: 'svc-amara-knotless',
    name: 'Knotless braids',
    startingPrice: 210,
    typicalHours: 6,
  },
  nextAvailable: null,
};

export const knotlessMatches = [niaMatch, aishaMatch, julesMatch];

export const knotlessStyle = { slug: 'knotless-braids', name: 'Knotless braids', minPrice: 160 };

export function matchPage(
  matches: readonly BraiderMatch[],
  meta: Partial<BraiderMatchPage['meta']> = {},
): BraiderMatchPage {
  const perPage = meta.perPage ?? 12;
  const total = meta.total ?? matches.length;
  return {
    data: matches,
    meta: {
      page: meta.page ?? 1,
      perPage,
      total,
      lastPage: meta.lastPage ?? Math.max(1, Math.ceil(total / perPage)),
      style: knotlessStyle,
      ...meta,
    },
  };
}

/** GET /api/styles/knotless-braids/braiders. */
export function findBraiders(
  matches: readonly BraiderMatch[],
  options: {
    style?: string | null;
    query?: ApiRule['query'];
    meta?: Partial<BraiderMatchPage['meta']>;
    delayMs?: number;
  } = {},
): ApiRule {
  const style = options.style === undefined ? 'knotless-braids' : options.style;
  return {
    method: 'GET',
    path: style ? `/api/styles/${style}/braiders` : '/api/braiders',
    query: options.query,
    body: matchPage(matches, style ? options.meta : { ...options.meta, style: undefined }),
    delayMs: options.delayMs,
  };
}

/** Nia's public profile as published, with no portfolio or reviews yet. */
export const niaProfile: BraiderProfile = {
  slug: 'nia-okafor',
  name: 'Nia Okafor',
  initials: 'NO',
  photo: null,
  area: 'Toronto West',
  travelKm: 10,
  bio: 'I specialize in comfortable, neat braids. Bring inspiration photos and we’ll confirm the details together.',
  rating: { average: 4.9, count: 86 },
  services: [
    {
      id: 'svc-nia-knotless-m',
      name: 'Medium knotless braids',
      styleSlug: 'knotless-braids',
      startingPrice: 180,
      typicalHours: 5,
    },
    {
      id: 'svc-nia-passion',
      name: 'Passion twists',
      styleSlug: 'passion-twists',
      startingPrice: 160,
      typicalHours: 4,
    },
  ],
  portfolio: [],
  policies: {
    preparation: 'Arrive with washed, detangled hair.',
    changes: 'Request a change at least 48 hours before.',
    cancellation: 'Free up to 48 hours before; later cancellations may be charged $40.',
  },
};

/** GET /api/braiders/{slug}. */
export function getBraider(profile: BraiderProfile, extra: Partial<ApiRule> = {}): ApiRule {
  return { method: 'GET', path: `/api/braiders/${profile.slug}`, body: profile, ...extra };
}

/** Nia's published portfolio: two photos and one item whose photo is missing. */
export const niaPortfolio: BraiderProfile['portfolio'] = [
  {
    id: 'work-1',
    image: {
      src: `${MEDIA_ORIGIN}/styles/knotless-braids.png`,
      alt: 'Medium knotless braids shown from the back, with neat square parts',
    },
    caption: 'Medium knotless braids · Oct 2026',
  },
  {
    id: 'work-2',
    image: { src: `${MEDIA_ORIGIN}/braiders/nia.jpg`, alt: 'Nia Okafor smiling in her studio' },
    caption: 'Nia at the studio · Sep 2026',
  },
  { id: 'work-3', image: null, caption: 'Passion twists · Sep 2026' },
];

/** Published reviews of Nia (docs/mocks/pages/braider-profile). */
export const niaReviews: Review[] = [
  {
    id: 'review-1',
    rating: 5,
    date: '2026-10-03',
    text: 'The parts were so neat and Nia checked that nothing felt too tight.',
    author: 'Maya Chen',
    service: 'Medium knotless braids',
  },
  {
    id: 'review-2',
    rating: 5,
    date: '2026-09-26',
    text: 'Quick, gentle and my braids lasted seven weeks.',
    author: 'Kemi Adebayo',
    service: 'Passion twists',
  },
];

/** GET /api/braiders/{slug}/reviews. */
export function getReviews(
  slug: string,
  reviews: readonly Review[],
  extra: Partial<ApiRule> = {},
): ApiRule {
  return { method: 'GET', path: `/api/braiders/${slug}/reviews`, body: page(reviews), ...extra };
}
