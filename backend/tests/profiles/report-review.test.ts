// Acceptance Test
// Traces to: L2-009, L2-038, L2-039, L2-040
import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { signedIn } from '../support/auth';
import { db } from '../support/db';
import {
  createBraider,
  createCustomer,
  createReview,
  createService,
  createStyle,
} from '../support/factories';

const MAYA = 'maya.chen@example.com';

async function publishedReview(status: 'published' | 'pending' | 'removed' = 'published') {
  await createStyle();
  const nia = await createBraider();
  const service = await createService(nia.id);
  return createReview(service, { status, authorName: 'Kemi Adebayo' });
}

describe('POST /api/reviews/{id}/reports', () => {
  it('Given a published review, when a signed-in customer reports it with a reason, then a report is recorded and the review stays public', async () => {
    const maya = await createCustomer();
    const review = await publishedReview();
    const api = await signedIn(MAYA);

    const response = await api.post(`/api/reviews/${review.id}/reports`, {
      reason: 'not_real_visit',
      details: '  I don’t think this visit happened. ',
    });

    expect(response.status).toBe(201);
    const reports = await db().reviewReport.findMany();
    expect(reports).toMatchObject([
      {
        reviewId: review.id,
        reporterId: maya.id,
        reason: 'not_real_visit',
        details: 'I don’t think this visit happened.',
        status: 'open',
      },
    ]);
    expect(response.body).toEqual({ reportId: reports[0]?.id });
    expect((await db().review.findUniqueOrThrow({ where: { id: review.id } })).status).toBe(
      'published',
    );
    const publicReviews = await new Api().get<{ data: unknown[] }>(
      '/api/braiders/nia-okafor/reviews',
    );
    expect(publicReviews.body.data).toHaveLength(1);
  });

  it('Given the same customer reports a review again, when it is sent, then the first report is returned and none is duplicated', async () => {
    await createCustomer();
    const review = await publishedReview();
    const api = await signedIn(MAYA);

    const first = await api.post(`/api/reviews/${review.id}/reports`, {
      reason: 'offensive',
      details: null,
    });
    const again = await api.post(`/api/reviews/${review.id}/reports`, {
      reason: 'other',
      details: null,
    });

    expect(again.status).toBe(201);
    expect(again.body).toEqual(first.body);
    expect(await db().reviewReport.count()).toBe(1);
  });

  it('Given a missing or unknown reason, when the customer reports, then the reason is refused and nothing is recorded', async () => {
    await createCustomer();
    const review = await publishedReview();
    const api = await signedIn(MAYA);

    const missing = await api.post(`/api/reviews/${review.id}/reports`, { details: 'Rude' });
    const unknown = await api.post(`/api/reviews/${review.id}/reports`, {
      reason: 'boring',
      details: null,
    });

    for (const response of [missing, unknown]) {
      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({
        errors: { reason: ['Choose why this review needs a closer look.'] },
      });
    }
    expect(await db().reviewReport.count()).toBe(0);
  });

  it('Given details longer than allowed, when the customer reports, then the details are refused', async () => {
    await createCustomer();
    const review = await publishedReview();
    const api = await signedIn(MAYA);

    const response = await api.post(`/api/reviews/${review.id}/reports`, {
      reason: 'other',
      details: 'x'.repeat(1001),
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ errors: { details: expect.any(Array) } });
  });

  it('Given a pending, removed or unknown review, when it is reported, then it is not found', async () => {
    await createCustomer();
    const pending = await publishedReview('pending');
    const api = await signedIn(MAYA);

    expect(
      (await api.post(`/api/reviews/${pending.id}/reports`, { reason: 'other', details: null }))
        .status,
    ).toBe(404);
    expect(
      (await api.post('/api/reviews/nope/reports', { reason: 'other', details: null })).status,
    ).toBe(404);
    expect(await db().reviewReport.count()).toBe(0);
  });

  it('Given a visitor who is not signed in, when they report, then they must sign in and no report is created', async () => {
    const review = await publishedReview();
    const api = new Api();
    await api.csrf();

    const response = await api.post(`/api/reviews/${review.id}/reports`, {
      reason: 'other',
      details: null,
    });

    expect(response.status).toBe(401);
    expect(await db().reviewReport.count()).toBe(0);
  });

  it('Given repeated reports above the limit, when another is sent, then it is refused with a retry indication', async () => {
    await createCustomer();
    await createStyle();
    const nia = await createBraider();
    const service = await createService(nia.id);
    const api = await signedIn(MAYA);
    for (let i = 0; i < 10; i++) {
      const review = await createReview(service);
      expect(
        (await api.post(`/api/reviews/${review.id}/reports`, { reason: 'other', details: null }))
          .status,
      ).toBe(201);
    }
    const review = await createReview(service);

    const limited = await api.post(`/api/reviews/${review.id}/reports`, {
      reason: 'other',
      details: null,
    });

    expect(limited.status).toBe(429);
    expect(limited.body).toMatchObject({ retryAfter: expect.any(Number) });
    expect(await db().reviewReport.count()).toBe(10);
  });
});
