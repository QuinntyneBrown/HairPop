// Acceptance Test
// Traces to: L2-041
// Description: After a client-side navigation focus moves to the new page heading and the title is announced.

import { expect, test } from '../fixtures/api';
import {
  gallery,
  getStyle,
  knotlessBraidsDetail,
  listStyles,
  knotlessBraids,
} from '../fixtures/styles';
import { StyleDetailPage } from '../pages/style-detail.page';
import { StyleGalleryPage } from '../pages/style-gallery.page';

test.describe('Route focus', () => {
  test('navigating to another page focuses its heading and announces the page title', async ({
    page,
    api,
  }) => {
    await api.given(listStyles(gallery), getStyle(knotlessBraidsDetail));
    const galleryPage = new StyleGalleryPage(page);
    await galleryPage.open();

    await galleryPage.card('Knotless braids').link.click();

    const detail = new StyleDetailPage(page);
    await expect(detail.heading).toHaveText('Knotless braids');
    await expect(detail.heading).toBeFocused();
    await expect(galleryPage.shell.announcements).toHaveText('Style · HairPop');
  });

  test('the first page load leaves focus alone so the skip link is first in tab order', async ({
    page,
    api,
  }) => {
    await api.given(listStyles(gallery));
    const galleryPage = new StyleGalleryPage(page);

    await galleryPage.open();

    await expect(galleryPage.heading).not.toBeFocused();
    await page.keyboard.press('Tab');
    await expect(galleryPage.shell.skipLink).toBeFocused();
  });

  test('changing only the search leaves focus in the search box', async ({ page, api }) => {
    await api.given(
      listStyles(gallery),
      listStyles([knotlessBraids], { query: { search: 'knotless' } }),
    );
    const galleryPage = new StyleGalleryPage(page);
    await galleryPage.open();

    await galleryPage.search('knotless');

    await expect(galleryPage.cards).toHaveCount(1);
    await expect(galleryPage.searchBox).toBeFocused();
  });
});
