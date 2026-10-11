// Acceptance Test
// Traces to: L2-037, L2-035
// Description: Forbidden, server-error and offline destinations show an honest message and a safe next action.

import { expect, test } from '../fixtures/api';
import { gallery, listStyles } from '../fixtures/styles';
import { ErrorPage } from '../pages/error-page.page';
import { StyleGalleryPage } from '../pages/style-gallery.page';

test.describe('Forbidden page', () => {
  test('a forbidden resource shows access-unavailable with a way to sign in', async ({ page }) => {
    const forbidden = new ErrorPage(page);

    const response = await forbidden.open('/403');

    expect(response?.status()).toBe(403);
    await expect(forbidden.heading).toHaveText('You can’t open this page');
    await expect(forbidden.text).toHaveText(
      'Sign in with the account you use for your appointments.',
    );
    await expect(forbidden.action('Sign in')).toHaveAttribute('href', '/sign-in');
  });
});

test.describe('Server error page', () => {
  test('shows the support reference with when it happened and a way to contact support', async ({
    page,
  }) => {
    const serverError = new ErrorPage(page);

    const response = await serverError.open(
      '/500?reference=HP-ERR-7F3K2Q&at=2026-10-10T09:42:00-04:00',
    );

    expect(response?.status()).toBe(500);
    await expect(serverError.heading).toHaveText('HairPop needs a moment');
    await expect(serverError.text).toHaveText(
      'We couldn’t load this page. Your booking request has not been resent.',
    );
    await expect(serverError.reference).toHaveText(
      'Reference: HP-ERR-7F3K2Q · Sat 10 Oct, 9:42 am',
    );
    await expect(serverError.action('Contact support')).toHaveAttribute(
      'href',
      'mailto:support@hairpop.example',
    );
  });

  test('without a reference no reference line is shown', async ({ page }) => {
    const serverError = new ErrorPage(page);

    await serverError.open('/500');

    await expect(serverError.heading).toHaveText('HairPop needs a moment');
    await expect(serverError.reference).toHaveCount(0);
  });

  test('Try again returns to the previous page without resending anything', async ({
    page,
    api,
  }) => {
    await api.given(listStyles(gallery));
    await new StyleGalleryPage(page).open();
    const serverError = new ErrorPage(page);
    await serverError.open('/500?reference=HP-ERR-7F3K2Q');

    await serverError.action('Try again').click();

    await expect(page).toHaveURL('/');
    expect(await api.requests('POST', '/api/booking-requests')).toEqual([]);
  });
});

test.describe('Offline page', () => {
  test('explains what still works and offers saved appointments', async ({ page }) => {
    const offline = new ErrorPage(page);

    const response = await offline.open('/offline');

    expect(response?.status()).toBe(200);
    await expect(offline.heading).toHaveText('You’re offline');
    await expect(offline.text).toHaveText(
      'Saved appointment details remain available. Requests need a connection.',
    );
    await expect(offline.action('View saved appointments')).toHaveAttribute(
      'href',
      '/appointments',
    );
  });
});
