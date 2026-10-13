// Acceptance Test: L2-027 AC1–3, L2-046 AC4 and L2-047 AC4.
// Given Nia's management profile, an edit sends its version and preserves private address;
// sign-out requires confirmation and returns to the management sign-in screen.

import { expect, test } from '../fixtures/api';
import { signedIn } from '../fixtures/session';
import { BRAIDER_URL } from '../fixtures/urls';
import { BraiderProfileContentPage } from '../pages/braider-profile-content.page';
import { resolve } from 'node:path';

const nia = {
  id: 'braider-nia',
  name: 'Nia Okafor',
  firstName: 'Nia',
  email: 'nia.okafor@example.com',
  emailVerified: true,
  role: 'braider' as const,
};
const profile = {
  bio: 'I specialize in comfortable, neat braids.',
  area: 'Toronto West',
  studioAddress: '1246 Bloor Street West, Toronto',
  preparation: 'Arrive with washed, detangled hair.',
  changePolicy: 'Request changes at least 48 hours before.',
  cancellationPolicy: 'Free up to 48 hours before.',
  version: 4,
  portfolio: [],
  styles: [{ slug: 'knotless-braids', name: 'Knotless braids' }],
};

test('a versioned profile edit saves without making the studio address public', async ({
  page,
  api,
}) => {
  await api.given(
    signedIn(nia),
    { method: 'GET', path: '/api/braider/profile', body: profile },
    {
      method: 'PATCH',
      path: '/api/braider/profile',
      body: { ...profile, area: 'Toronto West and Junction', version: 5 },
    },
  );
  const editor = new BraiderProfileContentPage(page);
  await editor.open();
  await expect(editor.address).toHaveValue(profile.studioAddress);
  await editor.area.fill('Toronto West and Junction');
  await editor.save.click();
  await expect(editor.main).toContainText('Profile changes saved');
  expect(api.requests('PATCH', '/api/braider/profile').map((r) => r.body)).toEqual([
    {
      bio: profile.bio,
      area: 'Toronto West and Junction',
      studioAddress: profile.studioAddress,
      preparation: profile.preparation,
      changePolicy: profile.changePolicy,
      cancellationPolicy: profile.cancellationPolicy,
      version: 4,
    },
  ]);
});

test('a stale save keeps the entered area and offers a refresh', async ({ page, api }) => {
  await api.given(
    signedIn(nia),
    { method: 'GET', path: '/api/braider/profile', body: profile },
    {
      method: 'PATCH',
      path: '/api/braider/profile',
      status: 409,
      body: { code: 'stale', message: 'Profile changed.' },
    },
  );
  const editor = new BraiderProfileContentPage(page);
  await editor.open();
  await editor.area.fill('Etobicoke');
  await editor.save.click();
  await expect(editor.main).toContainText('Your profile has changed');
  await expect(editor.area).toHaveValue('Etobicoke');
});

test('confirmed braider sign-out closes the session and protects management routes', async ({
  page,
  api,
}) => {
  await api.given(
    signedIn(nia),
    { method: 'GET', path: '/api/braider/profile', body: profile },
    {
      method: 'POST',
      path: '/api/auth/sign-out',
      status: 204,
    },
  );
  const editor = new BraiderProfileContentPage(page);
  await editor.open();
  await editor.signOut.click();
  await expect(editor.signOutDialog).toBeVisible();
  await editor.signOutDialog.getByRole('button', { name: 'Stay signed in' }).click();
  expect(api.requests('POST', '/api/auth/sign-out')).toHaveLength(0);
  await editor.signOut.click();
  await editor.signOutDialog.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(`${BRAIDER_URL}/manage/sign-in`);
  expect(api.requests('POST', '/api/auth/sign-out')).toHaveLength(1);
});

test('a valid portfolio photo is published with its caption', async ({ page, api }) => {
  const item = {
    id: 'portfolio-1',
    image: {
      src: 'https://media.hairpop.example/knotless-braids.png',
      alt: 'Medium knotless braids',
    },
    caption: 'Medium knotless braids',
    styleSlug: 'knotless-braids',
  };
  await api.given(
    signedIn(nia),
    { method: 'GET', path: '/api/braider/profile', body: profile },
    {
      method: 'POST',
      path: '/api/braider/portfolio',
      status: 201,
      body: item,
    },
  );
  const editor = new BraiderProfileContentPage(page);
  await editor.open();
  await api.given({
    method: 'GET',
    path: '/api/braider/profile',
    body: { ...profile, portfolio: [item] },
  });
  await editor.uploadPhoto(
    resolve('../docs/mocks/assets/photos/knotless-braids.png'),
    item.caption,
    'Knotless braids',
  );
  await expect(editor.uploadDialog).toBeHidden();
  await expect(editor.main).toContainText(item.caption);
  const uploads = api.requests('POST', '/api/braider/portfolio');
  expect(uploads).toHaveLength(1);
  expect(uploads[0].body).toMatch(/name="styleSlug"\r?\n\r?\nknotless-braids/);
});

test('an owned portfolio photo can be removed from the public gallery', async ({ page, api }) => {
  const item = {
    id: 'portfolio-1',
    image: {
      src: 'https://media.hairpop.example/knotless-braids.png',
      alt: 'Medium knotless braids',
    },
    caption: 'Medium knotless braids',
    styleSlug: 'knotless-braids',
  };
  await api.given(
    signedIn(nia),
    { method: 'GET', path: '/api/braider/profile', body: { ...profile, portfolio: [item] } },
    {
      method: 'DELETE',
      path: '/api/braider/portfolio/portfolio-1',
      status: 204,
    },
  );
  const editor = new BraiderProfileContentPage(page);
  await editor.open();
  await expect(editor.main).toContainText(item.caption);
  await api.given({ method: 'GET', path: '/api/braider/profile', body: profile });
  await editor.removePhoto.click();
  await expect(editor.main).toContainText('No portfolio photos yet');
  expect(api.requests('DELETE', '/api/braider/portfolio/portfolio-1')).toHaveLength(1);
});
