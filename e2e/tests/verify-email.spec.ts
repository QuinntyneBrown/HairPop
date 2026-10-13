// Acceptance Test
// Traces to: L2-013, L2-035, L2-036
// Given a verification link, when it is opened, then the account is verified once or an expired
// link is explained; without a link the customer can request another message.

import { expect, test } from '../fixtures/api';
import { VerifyEmailPage } from '../pages/verify-email.page';

test('a valid link verifies the address automatically', async ({ page, api }) => {
  await api.given({
    method: 'POST',
    path: '/api/email/verify',
    body: { email: 'maya.chen@example.com' },
  });
  const verify = new VerifyEmailPage(page);
  await verify.open('valid-token');

  await expect(verify.status).toContainText('Your email is verified');
  expect(api.requests('POST', '/api/email/verify').map((request) => request.body)).toEqual([
    { token: 'valid-token' },
  ]);
});

test('an expired link offers a resend path', async ({ page, api }) => {
  await api.given({
    method: 'POST',
    path: '/api/email/verify',
    status: 422,
    body: { code: 'invalid_token', message: 'This link has expired or was already used.' },
  });
  const verify = new VerifyEmailPage(page);
  await verify.open('expired-token');

  await expect(verify.status).toContainText('expired');
  await expect(verify.resend).toBeVisible();
});

test('a resend request gives a neutral confirmation', async ({ page, api }) => {
  await api.given({ method: 'POST', path: '/api/email/verification-notification', status: 202 });
  const verify = new VerifyEmailPage(page);
  await verify.open();
  await verify.email.fill('maya.chen@example.com');
  await verify.resend.click();

  await expect(verify.status).toContainText('email is on its way');
  expect(
    api.requests('POST', '/api/email/verification-notification').map((request) => request.body),
  ).toEqual([{ email: 'maya.chen@example.com' }]);
});
