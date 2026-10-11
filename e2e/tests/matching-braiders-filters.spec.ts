// Acceptance Test
// Traces to: L2-005, L2-041
// Description: Visitors narrow matching braiders by price and distance in a dialog, without losing the selected style.

import { expect, test } from '../fixtures/api';
import { findBraiders, julesMatch, knotlessMatches, niaMatch } from '../fixtures/braiders';
import { serverError, validation } from '../fixtures/errors';
import { FilterBraidersDialog } from '../pages/filter-braiders.dialog';
import { MatchingBraidersPage } from '../pages/matching-braiders.page';

const BRAIDERS = '/api/styles/knotless-braids/braiders';

test.describe('Matching braiders filters', () => {
  test('applying a valid price and distance narrows the braiders and shows the active filters', async ({
    page,
    api,
  }) => {
    await api.given(
      findBraiders(knotlessMatches),
      findBraiders([niaMatch, julesMatch], { query: { maxPrice: '200', distanceKm: '10' } }),
    );
    const matching = new MatchingBraidersPage(page);
    const dialog = new FilterBraidersDialog(page);
    await matching.open();
    await matching.filtersButton.click();
    await dialog.fill({ maxPrice: '200', distance: '10' });

    await dialog.apply.click();

    await expect(dialog.root).toBeHidden();
    expect(await matching.cardTitles()).toEqual(['Nia Okafor', 'Jules Baptiste']);
    await expect(matching.heading).toHaveText('Braiders for knotless braids');
    await expect(page).toHaveURL(
      /\/styles\/knotless-braids\/braiders\?maxPrice=200&distanceKm=10$/,
    );
    expect(await matching.activeFilterLabels()).toEqual([
      'Knotless braids',
      'Under $200 · within 10 km',
    ]);
  });

  test('reopening the dialog shows the criteria already applied', async ({ page, api }) => {
    await api.given(
      findBraiders(knotlessMatches),
      findBraiders([niaMatch], { query: { maxPrice: '200', distanceKm: '10' } }),
    );
    const matching = new MatchingBraidersPage(page);
    const dialog = new FilterBraidersDialog(page);
    await matching.open('/styles/knotless-braids/braiders?maxPrice=200&distanceKm=10');

    await matching.filtersButton.click();

    await expect(dialog.maxPrice).toHaveValue('200');
    await expect(dialog.distance).toHaveValue('10');
  });

  test('a price below the style’s lowest names the field, keeps the entry and changes nothing', async ({
    page,
    api,
  }) => {
    await api.given(findBraiders(knotlessMatches));
    const matching = new MatchingBraidersPage(page);
    const dialog = new FilterBraidersDialog(page);
    await matching.open();
    await matching.filtersButton.click();
    await dialog.fill({ maxPrice: '120', distance: '10' });

    await dialog.apply.click();

    await expect(dialog.root).toBeVisible();
    await expect(dialog.summary).toContainText('Check 1 answer');
    await expect(dialog.summary).toContainText('Enter a maximum price of at least $160');
    await expect(dialog.fieldErrors).toHaveText(
      'Enter a maximum price of at least $160, the lowest price for this style.',
    );
    await expect(dialog.maxPrice).toHaveValue('120');
    await expect(dialog.distance).toHaveValue('10');
    await expect(matching.cards).toHaveCount(3);
    expect(api.requests('GET', BRAIDERS).filter((r) => r.query.has('maxPrice'))).toEqual([]);
  });

  test('a distance the server rejects is shown on its field and the entries stay', async ({
    page,
    api,
  }) => {
    await api.given(findBraiders(knotlessMatches), {
      ...validation('GET', BRAIDERS, { distanceKm: ['Choose within 5, 10 or 25 km.'] }),
      query: { distanceKm: '25' },
    });
    const matching = new MatchingBraidersPage(page);
    const dialog = new FilterBraidersDialog(page);
    await matching.open();
    await matching.filtersButton.click();
    await dialog.fill({ maxPrice: '250', distance: '25' });

    await dialog.apply.click();

    await expect(dialog.fieldErrors).toHaveText('Choose within 5, 10 or 25 km.');
    await expect(dialog.root).toBeVisible();
    await expect(dialog.maxPrice).toHaveValue('250');
    await expect(matching.cards).toHaveCount(3);
  });

  test('a busy dialog sends the request once however it is submitted again', async ({
    page,
    api,
  }) => {
    await api.given(
      findBraiders(knotlessMatches),
      findBraiders([niaMatch], { query: { maxPrice: '200' } }),
    );
    const matching = new MatchingBraidersPage(page);
    const dialog = new FilterBraidersDialog(page);
    await matching.open();
    await matching.filtersButton.click();
    await dialog.fill({ maxPrice: '200' });
    const release = api.hold('GET', BRAIDERS);

    await dialog.apply.click();
    await expect(dialog.apply).toHaveAttribute('aria-busy', 'true');
    await dialog.apply.press('Enter');
    await dialog.maxPrice.press('Enter');

    await expect(dialog.root).toBeVisible();
    expect(api.requests('GET', BRAIDERS).filter((r) => r.query.has('maxPrice'))).toHaveLength(1);

    release();

    await expect(dialog.root).toBeHidden();
    await expect(matching.cards).toHaveCount(1);
  });

  test('a failed request keeps the entries and applies on retry', async ({ page, api }) => {
    await api.given(
      findBraiders(knotlessMatches),
      findBraiders([niaMatch], { query: { maxPrice: '200' } }),
      serverError('GET', BRAIDERS, { query: { maxPrice: '200' }, times: 1 }),
    );
    const matching = new MatchingBraidersPage(page);
    const dialog = new FilterBraidersDialog(page);
    await matching.open();
    await matching.filtersButton.click();
    await dialog.fill({ maxPrice: '200', distance: '10' });

    await dialog.apply.click();

    await expect(dialog.failure).toContainText('Your entries are still here');
    await expect(dialog.maxPrice).toHaveValue('200');
    await expect(dialog.distance).toHaveValue('10');
    await expect(matching.cards).toHaveCount(3);

    await dialog.apply.click();

    await expect(dialog.root).toBeHidden();
    expect(await matching.cardTitles()).toEqual(['Nia Okafor']);
  });

  test('valid filters with no braiders show no-results and Clear filters restores the style', async ({
    page,
    api,
  }) => {
    await api.given(
      findBraiders(knotlessMatches),
      findBraiders([], { query: { maxPrice: '165', distanceKm: '5' } }),
    );
    const matching = new MatchingBraidersPage(page);
    const dialog = new FilterBraidersDialog(page);
    await matching.open();
    await matching.filtersButton.click();
    await dialog.fill({ maxPrice: '165', distance: '5' });

    await dialog.apply.click();

    await expect(matching.emptyHeading()).toHaveText('No matches');
    await expect(matching.emptyState).toContainText(
      'No braiders match these filters. Try a wider price range or distance.',
    );
    expect(await matching.activeFilterLabels()).toEqual([
      'Knotless braids',
      'Under $165 · within 5 km',
    ]);

    await matching.emptyAction('Clear filters').click();

    await expect(matching.titles).toHaveText(['Nia Okafor', 'Aisha Mensah', 'Jules Baptiste']);
    expect(await matching.activeFilterLabels()).toEqual(['Knotless braids']);
    await expect(page).toHaveURL(/\/styles\/knotless-braids\/braiders$/);
  });

  test('Cancel closes the dialog without changing results and returns focus to Filters', async ({
    page,
    api,
  }) => {
    await api.given(findBraiders(knotlessMatches));
    const matching = new MatchingBraidersPage(page);
    const dialog = new FilterBraidersDialog(page);
    await matching.open();
    await matching.filtersButton.click();
    await dialog.fill({ maxPrice: '200' });

    await dialog.cancel.click();

    await expect(dialog.root).toBeHidden();
    await expect(matching.filtersButton).toBeFocused();
    await expect(matching.cards).toHaveCount(3);
  });
});
