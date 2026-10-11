// Acceptance Test
// Traces to: L2-004, L2-006, L2-008, L2-041
// Description: Matching results list braiders who offer the style, with honest ratings and availability.

import { expect, test } from '../fixtures/api';
import { amaraMatch, findBraiders, knotlessMatches, niaMatch } from '../fixtures/braiders';
import { MatchingBraidersPage } from '../pages/matching-braiders.page';

test.describe('Matching braiders', () => {
  test('each result names the matching service, area, rating and links to the profile', async ({
    page,
    api,
  }) => {
    await api.given(findBraiders(knotlessMatches));
    const matching = new MatchingBraidersPage(page);

    await matching.open();

    await expect(matching.heading).toHaveText('Braiders for knotless braids');
    expect(await matching.cardTitles()).toEqual(['Nia Okafor', 'Aisha Mensah', 'Jules Baptiste']);
    const nia = matching.card('Nia Okafor');
    await expect(nia.service).toHaveText('Toronto West · knotless braids from $180');
    await expect(nia.rating).toContainText('4.9');
    await expect(nia.rating).toContainText('· 86 reviews');
    await expect(nia.link).toHaveAttribute('href', '/braiders/nia-okafor');
    await expect(nia.link).toHaveAccessibleName('View Nia’s profile');
    await expect(matching.shell.navLink('Braiders')).toHaveAttribute('aria-current', 'page');
  });

  test('availability reflects an offered slot or says none is offered', async ({ page, api }) => {
    await api.given(findBraiders(knotlessMatches));
    const matching = new MatchingBraidersPage(page);

    await matching.open();

    await expect(matching.card('Nia Okafor').availability).toHaveText('Available Sat 24 Oct');
    await expect(matching.card('Aisha Mensah').availability).toHaveText('No times offered yet');
  });

  test('a braider without published reviews shows no rating number', async ({ page, api }) => {
    await api.given(findBraiders(knotlessMatches));
    const matching = new MatchingBraidersPage(page);

    await matching.open();

    const jules = matching.card('Jules Baptiste');
    await expect(jules.rating).toHaveText('Not yet rated');
    await expect(jules.rating).toHaveClass(/rating--unrated/);
  });

  test('screen readers hear the rating as one sentence', async ({ page, api }) => {
    await api.given(findBraiders([niaMatch, amaraMatch]));
    const matching = new MatchingBraidersPage(page);

    await matching.open();

    await expect(matching.card('Nia Okafor').ratingSpoken).toHaveText(
      'Rated 4.9 out of 5 from 86 reviews',
    );
    await expect(matching.card('Amara Nkiruka Adeyemi-Williams').rating).toContainText(
      '· 1,284 reviews',
    );
  });

  test('a single published review reads as one review', async ({ page, api }) => {
    await api.given(findBraiders([{ ...niaMatch, rating: { average: 5, count: 1 } }]));
    const matching = new MatchingBraidersPage(page);

    await matching.open();

    await expect(matching.card('Nia Okafor').rating).toContainText('5.0');
    await expect(matching.card('Nia Okafor').rating).toContainText('· 1 review');
  });

  test('with no eligible braiders the empty state explains that none offer the style', async ({
    page,
    api,
  }) => {
    await api.given(findBraiders([]));
    const matching = new MatchingBraidersPage(page);

    await matching.open();

    await expect(matching.emptyHeading()).toHaveText('No braiders offer this style yet');
    await expect(matching.emptyAction('Explore styles')).toHaveAttribute('href', '/');
  });

  test('the Braiders destination lists braiders without a style', async ({ page, api }) => {
    await api.given(findBraiders(knotlessMatches, { style: null }));
    const matching = new MatchingBraidersPage(page);

    await matching.open('/braiders');

    await expect(matching.heading).toHaveText('Braiders near Toronto');
    await expect(matching.cards).toHaveCount(3);
  });
});
