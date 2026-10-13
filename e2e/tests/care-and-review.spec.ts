// Acceptance Test
// Traces to: L2-024, L2-025
// Given a completed owned visit, when the customer reads care guidance and posts a valid review,
// then one review is saved; missing guidance and failed sends leave the form usable.

import { expect, test } from '../fixtures/api';
import { maya, signedIn } from '../fixtures/session';
import { CareAndReviewPage } from '../pages/care-and-review.page';

const care = {
  reference: 'HP-0992',
  service: 'Medium knotless braids',
  braider: { slug: 'nia-okafor', name: 'Nia Okafor' },
  date: '2026-10-03',
  guidance: {
    items: ['Wrap your braids in a satin scarf at night.'],
    source: 'Nia Okafor, for Medium knotless braids',
  },
  review: 'open',
};

test('care guidance names its source and a review is posted once', async ({ page, api }) => {
  await api.given(
    signedIn(maya),
    { method: 'GET', path: '/api/appointments/HP-0992/care', body: care },
    {
      method: 'POST',
      path: '/api/appointments/HP-0992/review',
      status: 201,
      body: { reviewId: 'review-1', status: 'published' },
    },
  );
  const screen = new CareAndReviewPage(page);
  await screen.open();
  await expect(page.getByRole('main')).toContainText('Wrap your braids in a satin scarf at night.');
  await expect(page.getByRole('main')).toContainText('Nia Okafor, for Medium knotless braids');
  await screen.rating.check();
  await screen.review.fill('Lovely braids and careful service.');
  await screen.submit.click();

  await expect(screen.success).toBeVisible();
  const requests = api.requests('POST', '/api/appointments/HP-0992/review');
  expect(requests).toHaveLength(1);
  expect(requests[0].body).toEqual({ rating: 5, text: 'Lovely braids and careful service.' });
  expect(requests[0].headers['idempotency-key']).toBeTruthy();
});

test('missing guidance does not block the review form', async ({ page, api }) => {
  await api.given(signedIn(maya), {
    method: 'GET',
    path: '/api/appointments/HP-0992/care',
    body: { ...care, guidance: null },
  });
  const screen = new CareAndReviewPage(page);
  await screen.open();
  await expect(page.getByRole('main')).toContainText('guidance isn’t available');
  await expect(screen.submit).toBeVisible();
});
