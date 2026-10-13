// Acceptance Test
// Traces to: L2-012, L2-035, L2-036
// Given a customer needs to recover access, when they request and use a valid link, then the
// confirmation is neutral and the new password is saved; invalid entries and links stay actionable.

import { expect, test } from '../fixtures/api';
import { PasswordRecoveryPage } from '../pages/password-recovery.page';

test('a valid email gets the same neutral reset confirmation', async ({ page, api }) => {
  await api.given({ method: 'POST', path: '/api/auth/forgot-password', status: 202 });
  const recovery = new PasswordRecoveryPage(page);
  await recovery.openForgot();
  await recovery.email.fill('maya.chen@example.com');
  await recovery.submit.click();

  await expect(recovery.done).toBeVisible();
  expect(api.requests('POST', '/api/auth/forgot-password').map((request) => request.body)).toEqual([
    { email: 'maya.chen@example.com' },
  ]);
});

test('a valid single-use link changes the password', async ({ page, api }) => {
  await api.given({
    method: 'POST',
    path: '/api/auth/reset-password',
    body: { email: 'maya.chen@example.com' },
  });
  const recovery = new PasswordRecoveryPage(page);
  await recovery.openReset();
  await recovery.password.fill('a long new password');
  await recovery.confirmation.fill('a long new password');
  await recovery.submit.click();

  await expect(recovery.done).toBeVisible();
  expect(api.requests('POST', '/api/auth/reset-password').map((request) => request.body)).toEqual([
    {
      token: 'valid-token',
      email: 'maya.chen@example.com',
      password: 'a long new password',
      passwordConfirmation: 'a long new password',
    },
  ]);
});

test('an expired link keeps the password unchanged and offers another request', async ({
  page,
  api,
}) => {
  await api.given({
    method: 'POST',
    path: '/api/auth/reset-password',
    status: 422,
    body: { code: 'invalid_token', message: 'This reset link has expired or was already used.' },
  });
  const recovery = new PasswordRecoveryPage(page);
  await recovery.openReset('expired-token');
  await recovery.password.fill('a long new password');
  await recovery.confirmation.fill('a long new password');
  await recovery.submit.click();

  await expect(recovery.error).toContainText('expired');
  await expect(
    page.getByRole('main').getByRole('link', { name: /new reset link/i }),
  ).toHaveAttribute('href', '/forgot-password');
});
