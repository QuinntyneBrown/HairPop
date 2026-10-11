// Acceptance Test
// Traces to: L2-034, L2-031
// Description: A first-time visitor chooses optional usage storage on a banner, the choice is saved and remembered, and failures are reported honestly.

import { expect, test } from '../fixtures/api';
import { saveConsent } from '../fixtures/consent';
import { serverError } from '../fixtures/errors';
import { gallery, listStyles } from '../fixtures/styles';
import { ConsentBanner } from '../pages/consent';
import { StyleGalleryPage } from '../pages/style-gallery.page';
import { Toasts } from '../pages/toasts';

test.describe('Cookie consent banner', () => {
  test.use({ consent: null });

  test('a first visit offers the choice and stores nothing optional beforehand', async ({
    page,
    api,
  }) => {
    await api.given(listStyles(gallery));
    const banner = new ConsentBanner(page);

    await new StyleGalleryPage(page).open();

    await expect(banner.root).toContainText('Your privacy choices');
    await expect(banner.root).toContainText('Choose whether optional usage data may be stored.');
    await expect(banner.allow).toBeVisible();
    await expect(banner.essentialOnly).toBeVisible();
    expect(await banner.savedChoice()).toBeNull();
    expect(api.requests('PUT', '/api/consent')).toEqual([]);
  });

  test('choosing essential only saves the choice, confirms it and stays away on return', async ({
    page,
    api,
  }) => {
    await api.given(listStyles(gallery), saveConsent(false));
    const banner = new ConsentBanner(page);
    const toasts = new Toasts(page);
    const galleryPage = new StyleGalleryPage(page);
    await galleryPage.open();

    await banner.essentialOnly.click();

    await expect(banner.root).toBeHidden();
    await expect(toasts.toast('Preferences saved')).toContainText(
      'Essential only. You can change this in Cookie preferences.',
    );
    expect(api.requests('PUT', '/api/consent').map((request) => request.body)).toEqual([
      { optionalUsage: false },
    ]);
    expect(await banner.savedChoice()).toBe('essential');

    await page.reload();

    await expect(banner.root).toBeHidden();
    await expect(galleryPage.cards).toHaveCount(3);
  });

  test('allowing optional data saves that choice', async ({ page, api }) => {
    await api.given(listStyles(gallery), saveConsent(true));
    const banner = new ConsentBanner(page);
    const toasts = new Toasts(page);
    await new StyleGalleryPage(page).open();

    await banner.allow.click();

    await expect(banner.root).toBeHidden();
    await expect(toasts.toast('Preferences saved')).toContainText(
      'Optional usage data allowed. You can change this in Cookie preferences.',
    );
    expect(api.requests('PUT', '/api/consent').map((request) => request.body)).toEqual([
      { optionalUsage: true },
    ]);
    expect(await banner.savedChoice()).toBe('allow');
  });

  test('a failed save does not claim success, keeps the banner and retries', async ({
    page,
    api,
  }) => {
    await api.given(
      listStyles(gallery),
      saveConsent(false),
      serverError('PUT', '/api/consent', { times: 1 }),
    );
    const banner = new ConsentBanner(page);
    const toasts = new Toasts(page);
    await new StyleGalleryPage(page).open();

    await banner.essentialOnly.click();

    await expect(toasts.toast('Preferences not saved')).toContainText(
      'Your choice wasn’t stored. Please try again.',
    );
    await expect(banner.root).toBeVisible();
    await expect(toasts.toast('Preferences saved')).toHaveCount(0);
    expect(await banner.savedChoice()).toBeNull();

    await toasts.action('Preferences not saved', 'Retry').click();

    await expect(banner.root).toBeHidden();
    await expect(toasts.toast('Preferences saved')).toBeVisible();
    expect(await banner.savedChoice()).toBe('essential');
  });
});

test.describe('Returning visitor', () => {
  test('with a saved choice no banner is shown', async ({ page, api }) => {
    await api.given(listStyles(gallery));

    await new StyleGalleryPage(page).open();

    await expect(new ConsentBanner(page).root).toBeHidden();
  });
});
