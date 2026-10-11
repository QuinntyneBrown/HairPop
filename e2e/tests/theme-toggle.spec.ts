// Acceptance Test
// Traces to: L2-041, L2-042, L2-048
// Description: The theme toggle follows the system preference, switches every surface and remembers the choice.

import { expect, test } from '../fixtures/api';
import { gallery, listStyles } from '../fixtures/styles';
import { StyleGalleryPage } from '../pages/style-gallery.page';

test.describe('Theme toggle', () => {
  test.describe('with a dark system preference', () => {
    test.use({ colorScheme: 'dark' });

    test('with no saved choice the dark theme is applied and the toggle is pressed', async ({
      page,
      api,
    }) => {
      await api.given(listStyles(gallery));
      const galleryPage = new StyleGalleryPage(page);

      await galleryPage.open();

      await expect(galleryPage.shell.themeToggle).toHaveText('Dark theme');
      await expect(galleryPage.shell.themeToggle).toHaveAttribute('aria-pressed', 'true');
    });
  });

  test.describe('with a light system preference', () => {
    test.use({ colorScheme: 'light' });

    test('with no saved choice the light theme is applied and the toggle is not pressed', async ({
      page,
      api,
    }) => {
      await api.given(listStyles(gallery));
      const galleryPage = new StyleGalleryPage(page);

      await galleryPage.open();

      await expect(galleryPage.shell.themeToggle).toHaveAttribute('aria-pressed', 'false');
    });

    test('activating the toggle switches every surface to dark', async ({ page, api }) => {
      await api.given(listStyles(gallery));
      const galleryPage = new StyleGalleryPage(page);
      await galleryPage.open();
      const lightBackground = await galleryPage.shell.pageBackground();

      await galleryPage.shell.themeToggle.click();

      await expect(galleryPage.shell.themeToggle).toHaveAttribute('aria-pressed', 'true');
      await expect(galleryPage.shell.root).toHaveAttribute('data-theme', 'dark');
      expect(await galleryPage.shell.pageBackground()).not.toBe(lightBackground);
    });

    test('a dark choice survives navigation and a reload', async ({ page, api }) => {
      await api.given(listStyles(gallery));
      const galleryPage = new StyleGalleryPage(page);
      await galleryPage.open();
      await galleryPage.shell.themeToggle.click();

      await page.goto('/404');
      await page.reload();

      await expect(galleryPage.shell.root).toHaveAttribute('data-theme', 'dark');
      await expect(galleryPage.shell.themeToggle).toHaveAttribute('aria-pressed', 'true');
    });

    test('Space on the toggle switches the theme and focus stays on it', async ({ page, api }) => {
      await api.given(listStyles(gallery));
      const galleryPage = new StyleGalleryPage(page);
      await galleryPage.open();
      await galleryPage.shell.themeToggle.focus();

      await page.keyboard.press('Space');

      await expect(galleryPage.shell.themeToggle).toHaveAttribute('aria-pressed', 'true');
      await expect(galleryPage.shell.themeToggle).toBeFocused();
    });
  });
});
