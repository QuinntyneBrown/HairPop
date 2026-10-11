// Acceptance Test
// Traces to: L2-010, L2-040, L2-041
// Description: A visitor creates an account with a name, email and a password of at least 12 characters, and is told the next step without anything about existing accounts being revealed.

import { expect, test } from '../fixtures/api';
import { serverError } from '../fixtures/errors';
import { registerAccepted, registerRateLimited, registerRejected } from '../fixtures/session';
import { SignUpPage } from '../pages/sign-up.page';

const MAYA = {
  name: 'Maya Chen',
  email: 'maya.chen@example.com',
  password: 'correct horse battery',
};

test.describe('Create account', () => {
  test('valid details create one account and explain the next step', async ({ page, api }) => {
    await api.given(registerAccepted(MAYA.email));
    const signUp = new SignUpPage(page);
    await signUp.open();
    await expect(signUp.heading).toHaveText('Join HairPop');
    await signUp.fill(MAYA);

    await signUp.submit.click();

    await expect(signUp.done).toContainText(
      'We sent a verification link to maya.chen@example.com.',
    );
    await expect(signUp.verifyEmail).toHaveAttribute('href', '/verify-email');
    const requests = api.requests('POST', '/api/auth/register');
    expect(requests).toHaveLength(1);
    expect(requests[0].body).toEqual(MAYA);
    expect(requests[0].headers['idempotency-key']).toMatch(/^[0-9a-f-]{36}$/);
    expect(requests[0].headers['x-xsrf-token']).toBe('e2e-xsrf-token');
  });

  test('a short password and a malformed email are named on their fields and nothing is sent', async ({
    page,
    api,
  }) => {
    const signUp = new SignUpPage(page);
    await signUp.open();
    await signUp.fill({ name: 'Maya Chen', email: 'maya.chen@', password: 'short' });

    await signUp.submit.click();

    await expect(signUp.summary).toContainText('Check 2 answers');
    await expect(signUp.fieldErrors).toHaveText([
      'Enter a full email address, like name@example.com.',
      'Use at least 12 characters.',
    ]);
    expect(api.requests('POST', '/api/auth/register')).toEqual([]);
  });

  test('a missing name is asked for', async ({ page, api }) => {
    const signUp = new SignUpPage(page);
    await signUp.open();
    await signUp.fill({ name: '', email: MAYA.email, password: MAYA.password });

    await signUp.submit.click();

    await expect(signUp.fieldErrors).toHaveText(['Enter your name.']);
    expect(api.requests('POST', '/api/auth/register')).toEqual([]);
  });

  test('a field the server rejects is named and the entries stay', async ({ page, api }) => {
    await api.given(registerRejected({ email: ['Enter a different email address.'] }));
    const signUp = new SignUpPage(page);
    await signUp.open();
    await signUp.fill(MAYA);

    await signUp.submit.click();

    await expect(signUp.fieldErrors).toHaveText(['Enter a different email address.']);
    await expect(signUp.email).toHaveValue(MAYA.email);
    await expect(signUp.name).toHaveValue(MAYA.name);
  });

  test('a retry after a failure reuses the same request key so no second account is made', async ({
    page,
    api,
  }) => {
    await api.given(
      registerAccepted(MAYA.email),
      serverError('POST', '/api/auth/register', { times: 1 }),
    );
    const signUp = new SignUpPage(page);
    await signUp.open();
    await signUp.fill(MAYA);

    await signUp.submit.click();

    await expect(signUp.failure).toContainText('Nothing you entered was lost.');
    await expect(signUp.password).toHaveValue(MAYA.password);

    await signUp.submit.click();

    await expect(signUp.done).toBeVisible();
    const keys = api
      .requests('POST', '/api/auth/register')
      .map((request) => request.headers['idempotency-key']);
    expect(keys).toHaveLength(2);
    expect(keys[0]).toBe(keys[1]);
  });

  test('changing an entry after a failure starts a new request key', async ({ page, api }) => {
    await api.given(
      registerAccepted(MAYA.email),
      serverError('POST', '/api/auth/register', { times: 1 }),
    );
    const signUp = new SignUpPage(page);
    await signUp.open();
    await signUp.fill(MAYA);
    await signUp.submit.click();
    await expect(signUp.failure).toBeVisible();

    await signUp.name.fill('Maya Chen-Lee');
    await signUp.submit.click();

    await expect(signUp.done).toBeVisible();
    const keys = api
      .requests('POST', '/api/auth/register')
      .map((request) => request.headers['idempotency-key']);
    expect(keys[0]).not.toBe(keys[1]);
  });

  test('a busy submission is sent once however it is submitted again', async ({ page, api }) => {
    await api.given(registerAccepted(MAYA.email));
    const signUp = new SignUpPage(page);
    await signUp.open();
    await signUp.fill(MAYA);
    const release = api.hold('POST', '/api/auth/register');

    await signUp.submit.click();
    await expect(signUp.submit).toHaveAttribute('aria-busy', 'true');
    await signUp.submit.press('Enter');
    await signUp.password.press('Enter');

    expect(api.requests('POST', '/api/auth/register')).toHaveLength(1);

    release();

    await expect(signUp.done).toBeVisible();
  });

  test('too many attempts say when to try again', async ({ page, api }) => {
    await api.given(registerRateLimited(60));
    const signUp = new SignUpPage(page);
    await signUp.open();
    await signUp.fill(MAYA);

    await signUp.submit.click();

    await expect(signUp.rateLimited).toContainText('Try again in 1 minute.');
    await expect(signUp.email).toHaveValue(MAYA.email);
  });

  test('links to sign in, the terms and the privacy information', async ({ page }) => {
    const signUp = new SignUpPage(page);

    await signUp.open();

    await expect(signUp.signIn).toHaveAttribute('href', '/sign-in');
    await expect(signUp.terms).toHaveAttribute('href', '/terms');
    await expect(signUp.privacy).toHaveAttribute('href', '/privacy');
  });
});
