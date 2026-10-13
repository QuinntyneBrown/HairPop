// Acceptance Test: L2-020 AC1, AC3 and L2-047 AC4.
// Given a request assigned to Nia, accepting sends its current version and agreed amount.
// A stale response keeps the dialog open with input intact and offers a refresh.

import { expect, test } from '../fixtures/api';
import { mayaRequest, braiderRequests } from '../fixtures/braider-requests';
import { signedIn } from '../fixtures/session';
import { BraiderRequestsPage } from '../pages/braider-requests.page';

const nia = {
  id: 'braider-nia',
  name: 'Nia Okafor',
  firstName: 'Nia',
  email: 'nia.okafor@example.com',
  emailVerified: true,
  role: 'braider' as const,
};

test('accepting a request sends its current version and agreed amount', async ({ page, api }) => {
  await api.given(signedIn(nia), braiderRequests(), {
    method: 'POST',
    path: '/api/braider/requests/HP-1048/responses',
    body: { status: 'confirmed' },
  });
  const requests = new BraiderRequestsPage(page);
  await requests.open();
  await expect(requests.main).toContainText(mayaRequest.hairDetails);
  await requests.respond.click();
  await expect(requests.dialog).toContainText('Maya Chen');
  await api.given(braiderRequests([]));
  await requests.accept('210');
  await expect(requests.dialog).toBeHidden();
  await expect(requests.main).toContainText('No requests to reply to');
  expect(
    api.requests('POST', '/api/braider/requests/HP-1048/responses').map((r) => r.body),
  ).toEqual([
    {
      decision: 'accept',
      agreedAmount: 210,
      version: 3,
    },
  ]);
});

test('a stale response retains the reply and asks the braider to refresh', async ({
  page,
  api,
}) => {
  await api.given(signedIn(nia), braiderRequests(), {
    method: 'POST',
    path: '/api/braider/requests/HP-1048/responses',
    status: 409,
    body: { code: 'stale', message: 'Request changed.' },
  });
  const requests = new BraiderRequestsPage(page);
  await requests.open();
  await requests.respond.click();
  await requests.accept('215');
  await expect(requests.dialog).toContainText('This request has changed');
  await expect(requests.amount).toHaveValue('215');
  await expect(requests.refresh).toBeVisible();
});

test('the phone layout keeps management navigation usable without horizontal scrolling', async ({
  page,
  api,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await api.given(signedIn(nia), braiderRequests());
  const requests = new BraiderRequestsPage(page);
  await requests.open();
  await expect(requests.heading).toBeVisible();
  expect(await requests.horizontalOverflow()).toBe(false);
  await requests.menu.click();
  await expect(requests.managementNav.getByRole('link', { name: 'Services' })).toBeVisible();
});
