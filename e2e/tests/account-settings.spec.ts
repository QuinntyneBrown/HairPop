// Acceptance Test
// Traces to: L2-011, L2-014, L2-037, L2-045
// Given a customer session, when account details change or sign-out is confirmed, then only
// persisted details are reported and locally held customer data is cleared.

import { expect, test } from '../fixtures/api';
import { maya, signedIn } from '../fixtures/session';
import { gallery, listStyles } from '../fixtures/styles';
import { AccountSettingsPage } from '../pages/account-settings.page';

const account = {
  name: 'Maya Chen',
  email: 'maya.chen@example.com',
  emailVerified: true,
  pendingEmail: null,
  phone: '416-555-0148',
};

test('an anonymous visitor is sent to sign-in with a safe return path', async ({ page }) => {
  const settings = new AccountSettingsPage(page);
  await settings.open();
  await expect(page).toHaveURL(/\/sign-in\?returnUrl=%2Fsettings/);
});

test('saving a new email shows that it still needs verification', async ({ page, api }) => {
  await api.given(
    signedIn(maya),
    { method: 'GET', path: '/api/account', body: account },
    {
      method: 'PATCH',
      path: '/api/account',
      body: { ...account, pendingEmail: 'maya.new@example.com' },
    },
  );
  const settings = new AccountSettingsPage(page);
  await settings.open();
  await settings.email.fill('maya.new@example.com');
  await settings.save.click();

  await expect(settings.success).toBeVisible();
  await expect(page.getByRole('main')).toContainText('maya.new@example.com');
  await expect(page.getByRole('main')).toContainText('verify');
  expect(api.requests('PATCH', '/api/account').map((request) => request.body)).toEqual([
    { name: 'Maya Chen', email: 'maya.new@example.com', phone: '416-555-0148' },
  ]);
});

test('sign-out can be dismissed, then confirmed and clears saved customer data', async ({
  page,
  api,
}) => {
  await api.given(
    signedIn(maya),
    { method: 'GET', path: '/api/account', body: account },
    { method: 'POST', path: '/api/auth/sign-out', status: 204 },
    listStyles(gallery),
  );
  const settings = new AccountSettingsPage(page);
  await settings.open();
  await page.evaluate(() => sessionStorage.setItem('hp-appointment-test', 'private'));
  await settings.signOut.click();
  await settings.dialog.getByRole('button', { name: 'Stay signed in' }).click();
  await expect(settings.name).toHaveValue('Maya Chen');

  await settings.signOut.click();
  await settings.dialog.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL('/');
  expect(await page.evaluate(() => sessionStorage.getItem('hp-appointment-test'))).toBeNull();
  expect(api.requests('POST', '/api/auth/sign-out')).toHaveLength(1);
});
