// Acceptance Test
// Traces to: L2-002, L2-035, L2-036
// Description: Searching, categories, no-results, pagination, loading, failure and offline in the gallery.

import { expect, test } from '../fixtures/api';
import { serverError } from '../fixtures/errors';
import {
  cornrows,
  gallery,
  knotlessBraids,
  listStyles,
  passionTwists,
  starterLocs,
} from '../fixtures/styles';
import { StyleGalleryPage } from '../pages/style-gallery.page';

test.describe('Style gallery criteria', () => {
  test('choosing a category shows only its styles and marks it selected', async ({ page, api }) => {
    await api.given(
      listStyles([...gallery, starterLocs]),
      listStyles([knotlessBraids, cornrows], { query: { category: 'braids' } }),
    );
    const galleryPage = new StyleGalleryPage(page);
    await galleryPage.open();
    await expect(galleryPage.category('All styles')).toHaveAttribute('aria-pressed', 'true');

    await galleryPage.chooseCategory('Braids');

    await expect(galleryPage.cards).toHaveCount(2);
    expect(await galleryPage.cardTitles()).toEqual(['Knotless braids', 'Cornrows']);
    await expect(galleryPage.category('Braids')).toHaveAttribute('aria-pressed', 'true');
    await expect(galleryPage.category('All styles')).toHaveAttribute('aria-pressed', 'false');
    await expect(page).toHaveURL(/category=braids/);
  });

  test('searching by name shows only matching styles', async ({ page, api }) => {
    await api.given(
      listStyles(gallery),
      listStyles([knotlessBraids], { query: { search: 'knotless' } }),
    );
    const galleryPage = new StyleGalleryPage(page);
    await galleryPage.open();

    await galleryPage.search('knotless');

    await expect(galleryPage.cards).toHaveCount(1);
    expect(await galleryPage.cardTitles()).toEqual(['Knotless braids']);
    await expect(galleryPage.resultsStatus).toHaveText('1 style');
  });

  test('criteria with no matches offer a way to clear them', async ({ page, api }) => {
    await api.given(
      listStyles(gallery),
      listStyles([], { query: { search: 'twisted locs', category: 'locs' } }),
    );
    const galleryPage = new StyleGalleryPage(page);
    await galleryPage.open('?category=locs');
    await galleryPage.search('twisted locs');

    await expect(galleryPage.emptyHeading()).toHaveText('No matches');
    await expect(galleryPage.emptyState).toContainText('No styles match “twisted locs” in Locs.');

    await galleryPage.emptyAction('Clear filters').click();

    expect(await galleryPage.cardTitles()).toEqual([
      'Knotless braids',
      'Passion twists',
      'Cornrows',
    ]);
    await expect(galleryPage.searchBox).toHaveValue('');
    await expect(galleryPage.category('All styles')).toHaveAttribute('aria-pressed', 'true');
  });

  test('the next page keeps the category and does not repeat earlier cards', async ({
    page,
    api,
  }) => {
    const firstPage = [knotlessBraids, cornrows];
    const secondPage = [{ ...knotlessBraids, slug: 'box-braids', name: 'Box braids' }];
    await api.given(
      listStyles(firstPage, { query: { category: 'braids' }, meta: { total: 3, perPage: 2 } }),
      listStyles(secondPage, {
        query: { category: 'braids', page: '2' },
        meta: { total: 3, perPage: 2, page: 2 },
      }),
    );
    const galleryPage = new StyleGalleryPage(page);
    await galleryPage.open('?category=braids');
    await expect(galleryPage.pagination).toContainText('Showing 1–2 of 3');

    await galleryPage.goToPage('Next');

    expect(await galleryPage.cardTitles()).toEqual(['Box braids']);
    await expect(galleryPage.category('Braids')).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(/category=braids/);
    await expect(page).toHaveURL(/page=2/);
  });

  test('a pending request shows the loading region for styles', async ({ page, api }) => {
    await api.given(
      listStyles(gallery),
      listStyles([passionTwists], { query: { category: 'twists' }, delayMs: 1500 }),
    );
    const galleryPage = new StyleGalleryPage(page);
    await galleryPage.open();

    await galleryPage.chooseCategory('Twists');

    await expect(galleryPage.loading).toBeVisible();
    await expect(galleryPage.loading).toContainText('Loading styles');
    await expect(galleryPage.cards).toHaveCount(1);
    await expect(galleryPage.loading).toHaveCount(0);
  });

  test('a failed load explains the problem and retries without losing the criteria', async ({
    page,
    api,
  }) => {
    await api.given(
      listStyles(gallery),
      listStyles([passionTwists], { query: { category: 'twists' } }),
      serverError('GET', '/api/styles', { query: { category: 'twists' }, times: 1 }),
    );
    const galleryPage = new StyleGalleryPage(page);
    await galleryPage.open();

    await galleryPage.chooseCategory('Twists');
    await expect(galleryPage.emptyHeading()).toHaveText('We couldn’t load styles');

    await galleryPage.emptyAction('Try again').click();

    expect(await galleryPage.cardTitles()).toEqual(['Passion twists']);
    await expect(galleryPage.category('Twists')).toHaveAttribute('aria-pressed', 'true');
  });

  test('offline, the gallery says a connection is needed and recovers when back online', async ({
    page,
    api,
  }) => {
    await api.given(
      listStyles(gallery),
      listStyles([knotlessBraids, cornrows], { query: { category: 'braids' } }),
    );
    const galleryPage = new StyleGalleryPage(page);
    await galleryPage.open();

    await api.setOffline(true);
    await galleryPage.chooseCategory('Braids');
    await expect(galleryPage.offline).toBeVisible();

    await api.setOffline(false);
    await galleryPage.offline.getByRole('button', { name: 'Try again' }).click();

    expect(await galleryPage.cardTitles()).toEqual(['Knotless braids', 'Cornrows']);
  });
});
