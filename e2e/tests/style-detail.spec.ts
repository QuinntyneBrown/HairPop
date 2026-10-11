// Acceptance Test
// Traces to: L2-001, L2-003, L2-036
// Description: A published style explains variations, typical time, price and wear, and quote factors.

import { expect, test } from '../fixtures/api';
import { notFound } from '../fixtures/errors';
import { gallery, getStyle, knotlessBraidsDetail, listStyles } from '../fixtures/styles';
import { ErrorPage } from '../pages/error-page.page';
import { StyleDetailPage } from '../pages/style-detail.page';
import { StyleGalleryPage } from '../pages/style-gallery.page';

test.describe('Style detail', () => {
  test('opening a gallery card shows the detail of that style', async ({ page, api }) => {
    await api.given(listStyles(gallery), getStyle(knotlessBraidsDetail));
    const galleryPage = new StyleGalleryPage(page);
    await galleryPage.open();

    await galleryPage.card('Knotless braids').link.click();

    const detail = new StyleDetailPage(page);
    await expect(detail.heading).toHaveText('Knotless braids');
    await expect(page).toHaveURL(/\/styles\/knotless-braids$/);
  });

  test('a complete style explains variations, time, price, wear and quote factors', async ({
    page,
    api,
  }) => {
    await api.given(getStyle(knotlessBraidsDetail));
    const detail = new StyleDetailPage(page);

    await detail.open('knotless-braids');

    await expect(detail.heading).toHaveText('Knotless braids');
    await expect(detail.intro).toContainText('extensions are fed in gradually');
    await expect(detail.fact('Typical time')).toHaveText('4–7 hours');
    await expect(detail.fact('Typical price')).toHaveText('$160–$300');
    await expect(detail.fact('Typical wear')).toHaveText('4–8 weeks');
    await expect(detail.variations).toHaveText([
      /Small.*Finer braids, about 6–7 hours/,
      /Medium.*The most requested size, about 5 hours/,
      /Large.*Quicker install, about 4 hours/,
    ]);
    await expect(detail.quoteFactors).toHaveCount(4);
    await expect(detail.estimateNote).toHaveText(
      'Prices are typical ranges. Your braider confirms the final price when they accept your request.',
    );
    await expect(detail.findBraider).toHaveAttribute('href', '/styles/knotless-braids/braiders');
  });

  test('an unavailable optional fact is left out without inventing a value', async ({
    page,
    api,
  }) => {
    await api.given(getStyle({ ...knotlessBraidsDetail, typicalWear: null, typicalPrice: null }));
    const detail = new StyleDetailPage(page);

    await detail.open('knotless-braids');

    expect(await detail.factLabels()).toEqual(['Typical time']);
    await expect(detail.findBraider).toBeVisible();
  });

  test('facts that failed to load show a partial-data warning with a retry', async ({
    page,
    api,
  }) => {
    await api.given(
      getStyle({ ...knotlessBraidsDetail, typicalWear: null, unavailable: ['typicalWear'] }),
    );
    const detail = new StyleDetailPage(page);

    await detail.open('knotless-braids');

    await expect(detail.partialWarning).toContainText('Typical wear couldn’t load');
    await expect(detail.partialWarning.getByRole('button', { name: 'Retry' })).toBeVisible();
    await expect(detail.fact('Typical time')).toHaveText('4–7 hours');
  });

  test('an unknown or unpublished style shows the not-found page and no draft content', async ({
    page,
    api,
  }) => {
    await api.given(notFound('GET', '/api/styles/draft-goddess-locs'));
    const notFoundPage = new ErrorPage(page);

    const response = await notFoundPage.open('/styles/draft-goddess-locs');

    expect(response?.status()).toBe(404);
    await expect(notFoundPage.heading).toHaveText('We couldn’t find that page');
  });
});
