import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import {
  createBraider,
  createReview,
  createService,
  createStyle,
  passionTwists,
} from '../support/factories';

interface ReviewPage {
  data: { id: string; text: string }[];
  meta: Record<string, unknown>;
}

describe('GET /api/braiders/{slug}/reviews', () => {
  it('Given published reviews, when a visitor reads them, then they are newest first with author, service and Toronto date', async () => {
    await createStyle();
    await createStyle(passionTwists);
    const nia = await createBraider();
    const knotless = await createService(nia.id);
    const passion = await createService(nia.id, {
      styleSlug: 'passion-twists',
      name: 'Passion twists',
    });
    const older = await createReview(passion, {
      rating: 5,
      text: 'Quick, gentle and my braids lasted seven weeks.',
      authorName: 'Kemi Adebayo',
      createdAt: new Date('2026-09-26T15:00:00Z'),
    });
    const newer = await createReview(knotless, {
      rating: 5,
      text: 'The parts were so neat and Nia checked that nothing felt too tight.',
      authorName: 'Maya Chen',
      // 22:30 on 3 Oct in Toronto.
      createdAt: new Date('2026-10-04T02:30:00Z'),
    });
    await createReview(knotless, { status: 'pending', text: 'Awaiting moderation.' });
    await createReview(knotless, { status: 'removed', text: 'Removed by moderation.' });

    const response = await new Api().get('/api/braiders/nia-okafor/reviews');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [
        {
          id: newer.id,
          rating: 5,
          date: '2026-10-03',
          text: 'The parts were so neat and Nia checked that nothing felt too tight.',
          author: 'Maya Chen',
          service: 'Medium knotless braids',
        },
        {
          id: older.id,
          rating: 5,
          date: '2026-09-26',
          text: 'Quick, gentle and my braids lasted seven weeks.',
          author: 'Kemi Adebayo',
          service: 'Passion twists',
        },
      ],
      meta: { page: 1, perPage: 12, total: 2, lastPage: 1 },
    });
  });

  it('Given more reviews than fit on a page, when the next page is requested, then it holds the oldest', async () => {
    await createStyle();
    const nia = await createBraider();
    const service = await createService(nia.id);
    for (let day = 1; day <= 13; day++) {
      await createReview(service, {
        text: `Visit ${day}`,
        createdAt: new Date(Date.UTC(2026, 8, day, 15)),
      });
    }

    const response = await new Api().get('/api/braiders/nia-okafor/reviews?page=2');

    const body = response.body as ReviewPage;
    expect(body.data.map((review) => review.text)).toEqual(['Visit 1']);
    expect(body.meta).toEqual({ page: 2, perPage: 12, total: 13, lastPage: 2 });
  });

  it('Given an unpublished or unknown braider, when reviews are requested, then the API answers 404', async () => {
    await createStyle();
    const hidden = await createBraider({ published: false });
    const service = await createService(hidden.id);
    await createReview(service);

    expect((await new Api().get('/api/braiders/nia-okafor/reviews')).status).toBe(404);
    expect((await new Api().get('/api/braiders/nobody/reviews')).status).toBe(404);
  });

  it('Given an invalid page, when reviews are requested, then the API answers 422', async () => {
    await createBraider();

    const response = await new Api().get('/api/braiders/nia-okafor/reviews?page=-1');

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ errors: { page: expect.any(Array) } });
  });
});
