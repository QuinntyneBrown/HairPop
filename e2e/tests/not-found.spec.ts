// Acceptance Test
// Traces to: L2-037, L2-041
// Description: Unknown routes render the not-found destination inside the customer shell.

import { expect, test } from '../fixtures/api';
import { ErrorPage } from '../pages/error-page.page';

test.describe('Page not found', () => {
  test('an unknown route shows the not-found page with a way back to style discovery', async ({
    page,
    api,
  }) => {
    const notFound = new ErrorPage(page);

    const response = await notFound.open('/styles-that-do-not-exist');

    expect(response?.status()).toBe(404);
    await expect(notFound.heading).toHaveText('We couldn’t find that page');
    await expect(notFound.text).toHaveText('The link may be old, or the address may have changed.');
    await expect(notFound.action('Explore styles')).toHaveAttribute('href', '/');
    expect(api.missing).toEqual([]);
  });

  test('the shell offers a skip link, the primary destinations and the footer links', async ({
    page,
  }) => {
    const notFound = new ErrorPage(page);

    await notFound.open('/404');

    await expect(notFound.shell.skipLink).toHaveAttribute('href', '#main');
    expect(await notFound.shell.navLabels()).toEqual([
      'Styles',
      'Braiders',
      'Appointments',
      'Help',
    ]);
    await expect(notFound.shell.accountLink).toHaveText('Sign in');
    await expect(notFound.shell.footerLink('Terms')).toHaveAttribute('href', '/terms');
    await expect(notFound.shell.footerLink('Privacy')).toHaveAttribute('href', '/privacy');
    await expect(notFound.shell.footerLink('Help')).toHaveAttribute('href', '/help');
  });

  test('keyboard users reach the main content first through the skip link', async ({ page }) => {
    const notFound = new ErrorPage(page);
    await notFound.open('/404');

    await page.keyboard.press('Tab');
    await expect(notFound.shell.skipLink).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(notFound.shell.main).toBeFocused();
  });
});
