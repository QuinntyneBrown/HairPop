// Acceptance Test
// Traces to: L2-009
// Given a published review, when a signed-in customer reports it with a reason, then the report
// is recorded while the public review remains visible.

import { expect, test } from '../fixtures/api';
import { getBraider, getReviews, niaProfile, niaReviews } from '../fixtures/braiders';
import { maya, signedIn } from '../fixtures/session';
import { BraiderProfilePage } from '../pages/braider-profile.page';

test('a signed-in customer can report a published review', async ({ page, api }) => {
  await api.given(signedIn(maya), getBraider(niaProfile), getReviews('nia-okafor', niaReviews), {
    method: 'POST',
    path: '/api/reviews/review-1/reports',
    status: 201,
    body: { reportId: 'report-1' },
  });
  const profile = new BraiderProfilePage(page);
  await profile.open('nia-okafor');
  await profile.reportReview(0).click();
  await profile.reportDialog.getByRole('radio', { name: /Not a real visit/i }).check();
  await profile.reportDialog.getByRole('button', { name: 'Send report' }).click();

  await expect(profile.reportDialog).toHaveCount(0);
  await expect(profile.reviewItems).toHaveCount(2);
  expect(
    api.requests('POST', '/api/reviews/review-1/reports').map((request) => request.body),
  ).toEqual([{ reason: 'not_real_visit', details: null }]);
});
