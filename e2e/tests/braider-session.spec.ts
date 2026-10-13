// Acceptance Test: L2-046 AC1–3.
// Given a braider session, management opens only that braider's requests. Anonymous and
// customer sessions reach the management sign-in surface without a private data request.

import { expect, test } from '../fixtures/api';
import { maya, signedIn } from '../fixtures/session';
import { BraiderSignInPage } from '../pages/braider-sign-in.page';
import { BRAIDER_URL } from '../fixtures/urls';

const nia = {
  id: 'braider-nia',
  name: 'Nia Okafor',
  firstName: 'Nia',
  email: 'nia.okafor@example.com',
  emailVerified: true,
  role: 'braider' as const,
};

test('an anonymous visitor is sent to braider sign-in before requests load', async ({
  page,
  api,
}) => {
  const signIn = new BraiderSignInPage(page);
  await signIn.openRequests();
  await expect(page).toHaveURL(/\/manage\/sign-in/);
  await expect(signIn.heading).toBeVisible();
  expect(api.requests('GET', '/api/braider/requests')).toEqual([]);
});

test('a customer session cannot load braider requests', async ({ page, api }) => {
  await api.given(signedIn(maya));
  const signIn = new BraiderSignInPage(page);
  await signIn.openRequests();
  await expect(page.getByRole('main')).toContainText('for braider accounts');
  expect(api.requests('GET', '/api/braider/requests')).toEqual([]);
});

test('braider credentials open the assigned requests screen', async ({ page, api }) => {
  await api.given(
    { method: 'POST', path: '/api/auth/sign-in', body: { user: nia } },
    {
      method: 'GET',
      path: '/api/braider/requests',
      body: { data: [] },
    },
  );
  const signIn = new BraiderSignInPage(page);
  await signIn.open();
  await signIn.signIn('nia.okafor@example.com', 'correct-horse-battery-staple');
  await expect(page).toHaveURL(`${BRAIDER_URL}/manage/requests`);
  await expect(signIn.requestsHeading).toBeVisible();
  expect(api.requests('POST', '/api/auth/sign-in').map((request) => request.body)).toEqual([
    {
      email: 'nia.okafor@example.com',
      password: 'correct-horse-battery-staple',
      audience: 'braider',
    },
  ]);
});
