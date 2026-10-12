import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import {
  createBraider,
  createReview,
  createService,
  createSlot,
  createStyle,
  passionTwists,
} from '../support/factories';

interface MatchPage {
  data: { braider: { slug: string }; service: { id: string } }[];
  meta: Record<string, unknown>;
}

const DAY = 24 * 60 * 60 * 1000;
const slugs = (body: unknown) => (body as MatchPage).data.map((match) => match.braider.slug);

/** Nia (rated 4.7 from three published reviews), Aisha (rated 4.0) and Jules (no reviews). */
async function castMatches() {
  await createStyle();
  const nia = await createBraider();
  const niaKnotless = await createService(nia.id, { id: 'svc-nia-knotless-m' });
  await createReview(niaKnotless, { rating: 5 });
  await createReview(niaKnotless, { rating: 5 });
  await createReview(niaKnotless, { rating: 4 });
  await createReview(niaKnotless, { rating: 1, status: 'pending' });
  const nextWeek = new Date(Date.now() + 7 * DAY);
  await createSlot(nia.id, new Date(Date.now() + 14 * DAY));
  await createSlot(nia.id, nextWeek);
  await createSlot(nia.id, new Date(Date.now() - DAY));

  const aisha = await createBraider({
    slug: 'aisha-mensah',
    name: 'Aisha Mensah',
    area: 'North York',
    distanceKm: 18,
    photoSrc: null,
    photoAlt: null,
  });
  const aishaKnotless = await createService(aisha.id, {
    id: 'svc-aisha-knotless',
    name: 'Knotless braids',
    startingPrice: 195,
    typicalHours: 6,
  });
  await createReview(aishaKnotless, { rating: 4 });
  await createReview(aishaKnotless, { rating: 4 });

  const jules = await createBraider({
    slug: 'jules-baptiste',
    name: 'Jules Baptiste',
    area: 'Scarborough',
    distanceKm: 24,
    photoSrc: null,
    photoAlt: null,
  });
  await createService(jules.id, {
    id: 'svc-jules-knotless',
    name: 'Knotless braids',
    startingPrice: 170,
  });
  return { nextWeek };
}

describe('GET /api/styles/{slug}/braiders', () => {
  it('Given braiders offering the style, when a visitor opens matches, then each match shows the eligible service, rating and next availability', async () => {
    const { nextWeek } = await castMatches();

    const response = await new Api().get('/api/styles/knotless-braids/braiders');

    expect(response.status).toBe(200);
    const body = response.body as MatchPage;
    expect(slugs(body)).toEqual(['nia-okafor', 'aisha-mensah', 'jules-baptiste']);
    expect(body.data[0]).toEqual({
      braider: {
        slug: 'nia-okafor',
        name: 'Nia Okafor',
        area: 'Toronto West',
        photo: {
          src: 'https://media.hairpop.example/braiders/nia.jpg',
          alt: 'Nia Okafor smiling in her studio',
        },
      },
      rating: { average: 4.7, count: 3 },
      service: {
        id: 'svc-nia-knotless-m',
        name: 'Medium knotless braids',
        startingPrice: 180,
        typicalHours: 5,
      },
      nextAvailable: nextWeek.toISOString(),
    });
    expect(body.data[2]).toMatchObject({
      braider: { slug: 'jules-baptiste', photo: null },
      rating: null,
      nextAvailable: null,
    });
    expect(body.meta).toEqual({
      page: 1,
      perPage: 12,
      total: 3,
      lastPage: 1,
      style: { slug: 'knotless-braids', name: 'Knotless braids', minPrice: 160 },
    });
  });

  it('Given braiders who are unpublished, unpublished for the style or offer another style, when matches load, then they are left out', async () => {
    await createStyle();
    await createStyle(passionTwists);
    const hidden = await createBraider({
      slug: 'hidden',
      name: 'Hidden Braider',
      published: false,
    });
    await createService(hidden.id);
    const draft = await createBraider({ slug: 'draft', name: 'Draft Service' });
    await createService(draft.id, { published: false });
    const twister = await createBraider({ slug: 'twister', name: 'Only Twists' });
    await createService(twister.id, { styleSlug: 'passion-twists', name: 'Passion twists' });
    const nia = await createBraider();
    await createService(nia.id);

    const response = await new Api().get('/api/styles/knotless-braids/braiders');

    expect(slugs(response.body)).toEqual(['nia-okafor']);
  });

  it('Given a braider with two services for the style, when matches load, then they appear once with the lower starting price', async () => {
    await createStyle();
    const nia = await createBraider();
    await createService(nia.id, { id: 'svc-large', name: 'Large knotless', startingPrice: 220 });
    await createService(nia.id, { id: 'svc-small', name: 'Small knotless', startingPrice: 175 });

    const response = await new Api().get('/api/styles/knotless-braids/braiders');

    const body = response.body as MatchPage;
    expect(body.data).toHaveLength(1);
    expect(body.data[0]?.service.id).toBe('svc-small');
  });

  it('Given a maximum price and distance, when they are applied, then every match satisfies both', async () => {
    await castMatches();

    const byPrice = await new Api().get('/api/styles/knotless-braids/braiders?maxPrice=180');
    const byDistance = await new Api().get('/api/styles/knotless-braids/braiders?distanceKm=10');
    const byBoth = await new Api().get(
      '/api/styles/knotless-braids/braiders?maxPrice=190&distanceKm=25',
    );

    expect(slugs(byPrice.body)).toEqual(['nia-okafor', 'jules-baptiste']);
    expect(slugs(byDistance.body)).toEqual(['nia-okafor']);
    expect(slugs(byBoth.body)).toEqual(['nia-okafor', 'jules-baptiste']);
  });

  it('Given a search term, when matches are searched, then braiders whose name or area contains it are listed', async () => {
    await castMatches();

    const byArea = await new Api().get('/api/styles/knotless-braids/braiders?search=north%20york');
    const byName = await new Api().get('/api/styles/knotless-braids/braiders?search=JULES');

    expect(slugs(byArea.body)).toEqual(['aisha-mensah']);
    expect(slugs(byName.body)).toEqual(['jules-baptiste']);
  });

  it('Given more matches than fit on a page, when the next page is requested, then it holds the rest', async () => {
    await createStyle();
    for (let i = 1; i <= 13; i++) {
      const braider = await createBraider({
        slug: `braider-${String(i).padStart(2, '0')}`,
        name: `Braider ${String(i).padStart(2, '0')}`,
      });
      await createService(braider.id);
    }

    const response = await new Api().get('/api/styles/knotless-braids/braiders?page=2');

    expect(slugs(response.body)).toEqual(['braider-13']);
    expect((response.body as MatchPage).meta).toMatchObject({ page: 2, total: 13, lastPage: 2 });
  });

  it('Given an unknown or unpublished style, when matches are requested, then the API answers 404', async () => {
    await createStyle({ published: false });

    expect((await new Api().get('/api/styles/knotless-braids/braiders')).status).toBe(404);
    expect((await new Api().get('/api/styles/goddess-locs/braiders')).status).toBe(404);
  });

  it('Given a maximum price below the style’s lowest price, when it is applied, then the API names the price field', async () => {
    await createStyle();

    const response = await new Api().get('/api/styles/knotless-braids/braiders?maxPrice=120');

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: 'The given data was invalid.',
      errors: {
        maxPrice: ['Enter a maximum price of at least $160, the lowest price for this style.'],
      },
    });
  });

  it('Given a distance that is not offered or a price that is not a whole number, when applied, then the API names each field', async () => {
    await createStyle();

    const response = await new Api().get(
      '/api/styles/knotless-braids/braiders?maxPrice=abc&distanceKm=7',
    );

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: 'The given data was invalid.',
      errors: {
        maxPrice: ['Enter a whole dollar amount.'],
        distanceKm: ['Choose 5, 10 or 25 km.'],
      },
    });
  });
});
