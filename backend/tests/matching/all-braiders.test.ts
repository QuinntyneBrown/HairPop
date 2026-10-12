import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import {
  createBraider,
  createReview,
  createService,
  createStyle,
  passionTwists,
} from '../support/factories';

interface MatchPage {
  data: { braider: { slug: string }; service: { id: string } }[];
  meta: Record<string, unknown>;
}

const slugs = (body: unknown) => (body as MatchPage).data.map((match) => match.braider.slug);

async function castAcrossStyles() {
  await createStyle();
  await createStyle(passionTwists);
  const nia = await createBraider();
  const niaKnotless = await createService(nia.id, { id: 'svc-nia-knotless-m' });
  await createService(nia.id, {
    id: 'svc-nia-passion',
    styleSlug: 'passion-twists',
    name: 'Passion twists',
    startingPrice: 160,
    typicalHours: 4,
  });
  await createReview(niaKnotless, { rating: 5 });
  const twister = await createBraider({
    slug: 'kemi-twists',
    name: 'Kemi Twists',
    area: 'Scarborough',
    distanceKm: 22,
  });
  await createService(twister.id, {
    id: 'svc-kemi-passion',
    styleSlug: 'passion-twists',
    name: 'Passion twists',
    startingPrice: 140,
  });
  const hidden = await createBraider({ slug: 'hidden', name: 'Hidden', published: false });
  await createService(hidden.id);
}

describe('GET /api/braiders', () => {
  it('Given braiders offering different styles, when every braider is listed, then each appears once with their cheapest service and no style', async () => {
    await castAcrossStyles();

    const response = await new Api().get('/api/braiders');

    expect(response.status).toBe(200);
    const body = response.body as MatchPage;
    expect(slugs(body)).toEqual(['nia-okafor', 'kemi-twists']);
    expect(body.data.map((match) => match.service.id)).toEqual([
      'svc-nia-passion',
      'svc-kemi-passion',
    ]);
    expect(body.meta).toEqual({ page: 1, perPage: 12, total: 2, lastPage: 1 });
  });

  it('Given filters without a style, when they are applied, then any whole-dollar price is accepted', async () => {
    await castAcrossStyles();

    const response = await new Api().get('/api/braiders?maxPrice=150&distanceKm=25');

    expect(slugs(response.body)).toEqual(['kemi-twists']);
  });

  it('Given an invalid distance, when every braider is listed, then the API names the field', async () => {
    const response = await new Api().get('/api/braiders?distanceKm=50');

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ errors: { distanceKm: ['Choose 5, 10 or 25 km.'] } });
  });
});
