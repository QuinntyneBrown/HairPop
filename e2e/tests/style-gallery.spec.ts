// Acceptance Test
// Traces to: L2-001, L2-035, L2-041
// Description: The style gallery lists published styles with typical time and price, or its empty state.

import { expect, test } from '../fixtures/api';
import { gallery, listStyles } from '../fixtures/styles';
import { StyleGalleryPage } from '../pages/style-gallery.page';

test.describe('Style gallery', () => {
  test('each card shows its name, image and typical time and price', async ({ page, api }) => {
    await api.given(listStyles(gallery));
    const galleryPage = new StyleGalleryPage(page);

    await galleryPage.open();

    await expect(galleryPage.heading).toHaveText('Find a style that feels like you');
    expect(await galleryPage.cardTitles()).toEqual([
      'Knotless braids',
      'Passion twists',
      'Cornrows',
    ]);

    const knotless = galleryPage.card('Knotless braids');
    await expect(knotless.photo).toHaveAttribute(
      'alt',
      'Medium knotless braids shown from the back and side',
    );
    await expect(knotless.facts).toHaveText('4–7 hours typical · typically $160–$300');
    await expect(knotless.link).toHaveAttribute('href', '/styles/knotless-braids');
    await expect(knotless.link).toHaveAccessibleName('Explore Knotless braids');

    await expect(galleryPage.card('Passion twists').art).toBeVisible();
    await expect(galleryPage.card('Cornrows').facts).toHaveText('2–4 hours typical');
  });

  test('with no published styles the gallery shows its empty state and no sample cards', async ({
    page,
    api,
  }) => {
    await api.given(listStyles([]));
    const galleryPage = new StyleGalleryPage(page);

    await galleryPage.open();

    await expect(galleryPage.emptyHeading()).toHaveText('No styles to show yet');
    await expect(galleryPage.emptyAction('Browse braiders')).toHaveAttribute('href', '/braiders');
    await expect(galleryPage.cards).toHaveCount(0);
  });

  test('the gallery marks Styles as the current destination', async ({ page, api }) => {
    await api.given(listStyles(gallery));
    const galleryPage = new StyleGalleryPage(page);

    await galleryPage.open();

    await expect(galleryPage.shell.navLink('Styles')).toHaveAttribute('aria-current', 'page');
    await expect(galleryPage.findBraiders).toHaveAttribute('href', '/braiders');
  });
});
