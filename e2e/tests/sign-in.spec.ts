// Acceptance Test
// Traces to: L2-011, L2-040, L2-041
// Description: A customer signs in with valid credentials, learns nothing about which credential was wrong, and the session shows in the shell.

import { expect, test } from '../fixtures/api';
import { getContent, helpContent } from '../fixtures/content';
import {
  maya,
  signInAccepted,
  signInRateLimited,
  signInRefused,
  signedIn,
} from '../fixtures/session';
import { gallery, listStyles } from '../fixtures/styles';
import { SignInPage } from '../pages/sign-in.page';
import { StyleGalleryPage } from '../pages/style-gallery.page';

test.describe('Sign in', () => {
  test('valid credentials sign the customer in and the top bar shows her name', async ({
    page,
    api,
  }) => {
    await api.given(signInAccepted(maya), listStyles(gallery));
    const signIn = new SignInPage(page);
    await signIn.open();
    await expect(signIn.heading).toHaveText('Welcome back');

    await signIn.signIn('maya.chen@example.com', 'correct horse battery');

    await expect(page).toHaveURL('/');
    await expect(signIn.shell.accountLink).toHaveText('Maya');
    await expect(signIn.shell.accountLink).toHaveAttribute('href', '/settings');
    expect(api.requests('GET', '/sanctum/csrf-cookie')).toHaveLength(1);
    expect(api.requests('POST', '/api/auth/sign-in')[0].headers['x-xsrf-token']).toBe(
      'e2e-xsrf-token',
    );
    expect(api.requests('POST', '/api/auth/sign-in').map((request) => request.body)).toEqual([
      {
        email: 'maya.chen@example.com',
        password: 'correct horse battery',
        audience: 'customer',
      },
    ]);
  });

  test('an existing session shows the customer’s name on any page', async ({ page, api }) => {
    await api.given(signedIn(maya), listStyles(gallery));
    const galleryPage = new StyleGalleryPage(page);

    await galleryPage.open();

    await expect(galleryPage.shell.accountLink).toHaveText('Maya');
  });

  test('signing in returns to the page the customer came from', async ({ page, api }) => {
    await api.given(signInAccepted(maya), getContent(helpContent));
    const signIn = new SignInPage(page);
    await signIn.open('/help');

    await signIn.signIn('maya.chen@example.com', 'correct horse battery');

    await expect(page).toHaveURL('/help');
  });

  test('a return address that leaves the site is ignored', async ({ page, api }) => {
    await api.given(signInAccepted(maya), listStyles(gallery));
    const signIn = new SignInPage(page);
    await signIn.open('https://evil.example/phish');

    await signIn.signIn('maya.chen@example.com', 'correct horse battery');

    await expect(page).toHaveURL('/');
  });

  test('refused credentials create no session and do not say which one was wrong', async ({
    page,
    api,
  }) => {
    await api.given(signInRefused());
    const signIn = new SignInPage(page);
    await signIn.open();

    await signIn.signIn('maya.chen@example.com', 'wrong password');

    await expect(signIn.failure).toContainText('Check your email and password and try again.');
    await expect(signIn.failure).not.toContainText('does not match');
    await expect(signIn.shell.accountLink).toHaveText('Sign in');
    await expect(signIn.email).toHaveValue('maya.chen@example.com');
    await expect(signIn.password).toHaveValue('');
  });

  test('empty or malformed entries are named on their fields and nothing is sent', async ({
    page,
    api,
  }) => {
    const signIn = new SignInPage(page);
    await signIn.open();

    await signIn.signIn('maya.chen@', '');

    await expect(signIn.summary).toContainText('Check 2 answers');
    await expect(signIn.summary).toContainText('Enter a full email address');
    await expect(signIn.summary).toContainText('Enter your password');
    await expect(signIn.fieldErrors).toHaveText([
      'Enter a full email address, like name@example.com.',
      'Enter your password.',
    ]);
    expect(api.requests('POST', '/api/auth/sign-in')).toEqual([]);
  });

  test('too many attempts say when to try again', async ({ page, api }) => {
    await api.given(signInRateLimited(120));
    const signIn = new SignInPage(page);
    await signIn.open();

    await signIn.signIn('maya.chen@example.com', 'whatever it was');

    await expect(
      page.getByRole('alert').filter({ hasText: 'Too many sign-in attempts' }),
    ).toContainText('Try again in 2 minutes.');
    await expect(signIn.email).toHaveValue('maya.chen@example.com');
  });

  test('a busy sign-in is sent once however it is submitted again', async ({ page, api }) => {
    await api.given(signInAccepted(maya), listStyles(gallery));
    const signIn = new SignInPage(page);
    await signIn.open();
    await signIn.email.fill('maya.chen@example.com');
    await signIn.password.fill('correct horse battery');
    const release = api.hold('POST', '/api/auth/sign-in');

    await signIn.submit.click();
    await expect(signIn.submit).toHaveAttribute('aria-busy', 'true');
    await signIn.submit.press('Enter');
    await signIn.password.press('Enter');

    expect(api.requests('POST', '/api/auth/sign-in')).toHaveLength(1);

    release();

    await expect(page).toHaveURL('/');
  });

  test('offers recovery and account creation', async ({ page }) => {
    const signIn = new SignInPage(page);

    await signIn.open();

    await expect(signIn.forgotPassword).toHaveAttribute('href', '/forgot-password');
    await expect(signIn.createAccount).toHaveAttribute('href', '/sign-up');
  });
});
