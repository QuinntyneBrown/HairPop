// Acceptance Test
// Traces to: L2-034, L2-031
// Description: A first-time visitor chooses optional usage storage on a banner, the choice is saved and remembered, and failures are reported honestly.

import { expect, test } from '../fixtures/api';
import { saveConsent } from '../fixtures/consent';
import { serverError } from '../fixtures/errors';
import { gallery, listStyles } from '../fixtures/styles';
import { ConsentBanner, CookiePreferencesDialog } from '../pages/consent';
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

test.describe('Cookie preferences dialog', () => {
  test.describe('on a first visit', () => {
    test.use({ consent: null });

    test('opens from the banner with nothing chosen and asks for an answer before saving', async ({
      page,
      api,
    }) => {
      await api.given(listStyles(gallery), saveConsent(true));
      const banner = new ConsentBanner(page);
      const dialog = new CookiePreferencesDialog(page);
      await new StyleGalleryPage(page).open();

      await banner.preferences.click();

      await expect(dialog.root).toBeVisible();
      await expect(dialog.allow).not.toBeChecked();
      await expect(dialog.essentialOnly).not.toBeChecked();

      await dialog.save.click();

      await expect(dialog.summary).toContainText('Check 1 answer');
      await expect(dialog.summary).toContainText('Choose whether to allow optional usage data');
      await expect(dialog.fieldError).toHaveText('Choose whether to allow optional usage data.');
      expect(api.requests('PUT', '/api/consent')).toEqual([]);

      await dialog.allow.check();
      await dialog.save.click();

      await expect(dialog.root).toBeHidden();
      await expect(banner.root).toBeHidden();
      expect(api.requests('PUT', '/api/consent').map((request) => request.body)).toEqual([
        { optionalUsage: true },
      ]);
      expect(await banner.savedChoice()).toBe('allow');
    });

    test('the Change action on the saved toast reopens the preferences', async ({ page, api }) => {
      await api.given(listStyles(gallery), saveConsent(false));
      const banner = new ConsentBanner(page);
      const toasts = new Toasts(page);
      const dialog = new CookiePreferencesDialog(page);
      await new StyleGalleryPage(page).open();
      await banner.essentialOnly.click();

      await toasts.action('Preferences saved', 'Change').click();

      await expect(dialog.root).toBeVisible();
      await expect(dialog.essentialOnly).toBeChecked();
    });
  });

  test('a returning visitor revises the choice from the footer', async ({ page, api }) => {
    await api.given(listStyles(gallery), saveConsent(true));
    const galleryPage = new StyleGalleryPage(page);
    const banner = new ConsentBanner(page);
    const dialog = new CookiePreferencesDialog(page);
    await galleryPage.open();

    await galleryPage.shell.footerLink('Cookie preferences').click();

    await expect(dialog.essentialOnly).toBeChecked();

    await dialog.allow.check();
    await dialog.save.click();

    await expect(dialog.root).toBeHidden();
    expect(await banner.savedChoice()).toBe('allow');
    await expect(galleryPage.shell.footerLink('Cookie preferences')).toBeFocused();
  });

  test('a failed save keeps the selection and the saved choice and does not claim success', async ({
    page,
    api,
  }) => {
    await api.given(
      listStyles(gallery),
      saveConsent(true),
      serverError('PUT', '/api/consent', { times: 1 }),
    );
    const galleryPage = new StyleGalleryPage(page);
    const banner = new ConsentBanner(page);
    const toasts = new Toasts(page);
    const dialog = new CookiePreferencesDialog(page);
    await galleryPage.open();
    await galleryPage.shell.footerLink('Cookie preferences').click();
    await dialog.allow.check();

    await dialog.save.click();

    await expect(dialog.failure).toContainText('Your entries are still here');
    await expect(dialog.allow).toBeChecked();
    await expect(toasts.toast('Preferences saved')).toHaveCount(0);
    expect(await banner.savedChoice()).toBe('essential');

    await dialog.save.click();

    await expect(dialog.root).toBeHidden();
    expect(await banner.savedChoice()).toBe('allow');
  });

  test('a busy save sends the choice once however it is submitted again', async ({ page, api }) => {
    await api.given(listStyles(gallery), saveConsent(true));
    const galleryPage = new StyleGalleryPage(page);
    const dialog = new CookiePreferencesDialog(page);
    await galleryPage.open();
    await galleryPage.shell.footerLink('Cookie preferences').click();
    await dialog.allow.check();
    const release = api.hold('PUT', '/api/consent');

    await dialog.save.click();
    await expect(dialog.save).toHaveAttribute('aria-busy', 'true');
    await dialog.save.press('Enter');

    await expect(dialog.root).toBeVisible();
    expect(api.requests('PUT', '/api/consent')).toHaveLength(1);

    release();

    await expect(dialog.root).toBeHidden();
  });
});
