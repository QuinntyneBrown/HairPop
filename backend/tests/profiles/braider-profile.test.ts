import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { db } from '../support/db';
import {
  createBraider,
  createReview,
  createService,
  createStyle,
  passionTwists,
} from '../support/factories';

async function nia() {
  await createStyle();
  await createStyle(passionTwists);
  const braider = await createBraider();
  const knotless = await createService(braider.id, { id: 'svc-nia-knotless-m' });
  await createService(braider.id, {
    id: 'svc-nia-passion',
    styleSlug: 'passion-twists',
    name: 'Passion twists',
    startingPrice: 160,
    typicalHours: 4,
  });
  return { braider, knotless };
}

describe('GET /api/braiders/{slug}', () => {
  it('Given a published braider, when a visitor opens their profile, then identity, services, portfolio, rating and policies are returned', async () => {
    const { braider, knotless } = await nia();
    await db().portfolioItem.create({
      data: {
        id: 'work-2',
        braiderId: braider.id,
        imageSrc: 'https://media.hairpop.example/braiders/nia.jpg',
        imageAlt: 'Nia Okafor smiling in her studio',
        caption: 'Nia at the studio · Sep 2026',
        createdAt: new Date('2026-09-20T12:00:00Z'),
      },
    });
    await db().portfolioItem.create({
      data: {
        id: 'work-1',
        braiderId: braider.id,
        imageSrc: 'https://media.hairpop.example/styles/knotless-braids.png',
        imageAlt: 'Medium knotless braids shown from the back, with neat square parts',
        caption: 'Medium knotless braids · Oct 2026',
        createdAt: new Date('2026-10-02T12:00:00Z'),
      },
    });
    await createReview(knotless, { rating: 5 });
    await createReview(knotless, { rating: 4 });
    await createReview(knotless, { rating: 1, status: 'removed' });

    const response = await new Api().get('/api/braiders/nia-okafor');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      slug: 'nia-okafor',
      name: 'Nia Okafor',
      initials: 'NO',
      photo: {
        src: 'https://media.hairpop.example/braiders/nia.jpg',
        alt: 'Nia Okafor smiling in her studio',
      },
      area: 'Toronto West',
      travelKm: 10,
      bio: 'I specialize in comfortable, neat braids. Bring inspiration photos and we’ll confirm the details together.',
      rating: { average: 4.5, count: 2 },
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
      portfolio: [
        {
          id: 'work-1',
          image: {
            src: 'https://media.hairpop.example/styles/knotless-braids.png',
            alt: 'Medium knotless braids shown from the back, with neat square parts',
          },
          caption: 'Medium knotless braids · Oct 2026',
        },
        {
          id: 'work-2',
          image: {
            src: 'https://media.hairpop.example/braiders/nia.jpg',
            alt: 'Nia Okafor smiling in her studio',
          },
          caption: 'Nia at the studio · Sep 2026',
        },
      ],
      policies: {
        preparation: 'Arrive with washed, detangled hair.',
        changes: 'Request a change at least 48 hours before.',
        cancellation: 'Free up to 48 hours before; later cancellations may be charged $40.',
      },
    });
  });

  it('Given a braider with a private studio address, when the public profile is read, then the address is nowhere in the response', async () => {
    await nia();

    const response = await new Api().get('/api/braiders/nia-okafor');

    expect(JSON.stringify(response.body)).not.toContain('Ossington');
  });

  it('Given an unpublished service and no published reviews, when the profile is read, then the service is left out and there is no rating', async () => {
    await createStyle();
    const braider = await createBraider({
      slug: 'amara-adeyemi-williams',
      name: 'Amara Nkiruka Adeyemi-Williams',
      photoSrc: null,
      photoAlt: null,
      travelKm: null,
    });
    const service = await createService(braider.id, { id: 'svc-amara-knotless' });
    await createService(braider.id, { id: 'svc-amara-draft', published: false });
    await createReview(service, { status: 'pending' });

    const response = await new Api().get('/api/braiders/amara-adeyemi-williams');

    expect(response.body).toMatchObject({
      initials: 'AA',
      photo: null,
      travelKm: null,
      rating: null,
      portfolio: [],
    });
    const body = response.body as { services: { id: string }[] };
    expect(body.services.map((s) => s.id)).toEqual(['svc-amara-knotless']);
  });

  it('Given an unpublished or unknown braider, when the profile is opened, then the API answers 404', async () => {
    await createBraider({ published: false });

    expect((await new Api().get('/api/braiders/nia-okafor')).status).toBe(404);
    expect((await new Api().get('/api/braiders/nobody')).status).toBe(404);
  });
});
