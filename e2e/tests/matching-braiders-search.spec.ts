// Acceptance Test
// Traces to: L2-005, L2-035
// Description: Visitors search matching braiders without losing the selected style, and clear a search that finds nothing.

import { expect, test } from '../fixtures/api';
import { findBraiders, knotlessMatches, niaMatch } from '../fixtures/braiders';
import { MatchingBraidersPage } from '../pages/matching-braiders.page';

test.describe('Matching braiders search', () => {
  test('searching narrows the braiders and keeps the selected style', async ({ page, api }) => {
    await api.given(
      findBraiders(knotlessMatches),
      findBraiders([niaMatch], { query: { search: 'nia' } }),
    );
    const matching = new MatchingBraidersPage(page);
    await matching.open();

    await matching.search('nia');

    await expect(matching.cards).toHaveCount(1);
    expect(await matching.cardTitles()).toEqual(['Nia Okafor']);
    await expect(matching.heading).toHaveText('Braiders for knotless braids');
    await expect(page).toHaveURL(/\/styles\/knotless-braids\/braiders\?q=nia$/);
  });

  test('the search box shows the term from the address', async ({ page, api }) => {
    await api.given(
      findBraiders(knotlessMatches),
      findBraiders([niaMatch], { query: { search: 'nia' } }),
    );
    const matching = new MatchingBraidersPage(page);

    await matching.open('/styles/knotless-braids/braiders?q=nia');

    await expect(matching.searchBox).toHaveValue('nia');
    expect(await matching.cardTitles()).toEqual(['Nia Okafor']);
  });

  test('a search with no matches says so and Clear filters restores the style’s braiders', async ({
    page,
    api,
  }) => {
    await api.given(findBraiders(knotlessMatches), findBraiders([], { query: { search: 'zzz' } }));
    const matching = new MatchingBraidersPage(page);
    await matching.open();
    await matching.search('zzz');

    await expect(matching.emptyHeading()).toHaveText('No matches');
    await expect(matching.emptyState).toContainText('No braiders match “zzz”.');

    await matching.emptyAction('Clear filters').click();

    await expect(matching.titles).toHaveText(['Nia Okafor', 'Aisha Mensah', 'Jules Baptiste']);
    await expect(matching.searchBox).toHaveValue('');
    await expect(page).toHaveURL(/\/styles\/knotless-braids\/braiders$/);
  });

  test('without a published braider the page keeps its empty state, not no-results', async ({
    page,
    api,
  }) => {
    await api.given(findBraiders([]));
    const matching = new MatchingBraidersPage(page);

    await matching.open();

    await expect(matching.emptyHeading()).toHaveText('No braiders offer this style yet');
  });
});
