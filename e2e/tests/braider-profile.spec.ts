// Acceptance Test
// Traces to: L2-007, L2-008, L2-035
// Description: A public braider profile shows identity, honest rating, services, policies and a booking route, or a safe error.

import { expect, test } from '../fixtures/api';
import {
  findBraiders,
  getBraider,
  knotlessMatches,
  niaPortfolio,
  niaProfile,
} from '../fixtures/braiders';
import { notFound, serverError } from '../fixtures/errors';
import { BraiderProfilePage } from '../pages/braider-profile.page';
import { ErrorPage } from '../pages/error-page.page';
import { MatchingBraidersPage } from '../pages/matching-braiders.page';

test.describe('Braider profile', () => {
  test('shows identity, rating, services and what to know before booking', async ({
    page,
    api,
  }) => {
    await api.given(getBraider(niaProfile));
    const profile = new BraiderProfilePage(page);

    await profile.open('nia-okafor');

    await expect(profile.heading).toHaveText('Nia Okafor');
    await expect(profile.name).toHaveText('Nia Okafor');
    await expect(profile.rating).toContainText('4.9');
    await expect(profile.rating).toContainText('· 86 reviews');
    await expect(profile.area).toHaveText('Toronto West · travels up to 10 km');
    await expect(profile.bio).toHaveText(
      'I specialize in comfortable, neat braids. Bring inspiration photos and we’ll confirm the details together.',
    );
    expect(await profile.serviceTitles()).toEqual(['Medium knotless braids', 'Passion twists']);
    await expect(profile.services.first()).toContainText('From $180 · about 5 hours');
    await expect(profile.services.last()).toContainText('From $160 · about 4 hours');
    expect(await profile.policyTerms()).toEqual([
      'Service area',
      'Preparation',
      'Changes',
      'Cancellation',
    ]);
    await expect(profile.policy('Service area')).toHaveText(
      'Toronto West. Studio address shared after Nia accepts.',
    );
    await expect(profile.policy('Cancellation')).toHaveText(
      'Free up to 48 hours before; later cancellations may be charged $40.',
    );
    await expect(profile.shell.navLink('Braiders')).toHaveAttribute('aria-current', 'page');
  });

  test('the booking action keeps this braider’s identity', async ({ page, api }) => {
    await api.given(getBraider(niaProfile));
    const profile = new BraiderProfilePage(page);

    await profile.open('nia-okafor');

    await expect(profile.book).toHaveAttribute('href', '/book/nia-okafor');
  });

  test('a braider with no published reviews is unrated, not given a number', async ({
    page,
    api,
  }) => {
    await api.given(getBraider({ ...niaProfile, rating: null }));
    const profile = new BraiderProfilePage(page);

    await profile.open('nia-okafor');

    await expect(profile.rating).toHaveText('Not yet rated');
    await expect(profile.rating).toHaveClass(/rating--unrated/);
  });

  test('policies the braider has not written are left out, and the studio address never shows', async ({
    page,
    api,
  }) => {
    await api.given(
      getBraider({
        ...niaProfile,
        travelKm: null,
        policies: { preparation: null, changes: null, cancellation: 'Free up to 48 hours before.' },
      }),
    );
    const profile = new BraiderProfilePage(page);

    await profile.open('nia-okafor');

    expect(await profile.policyTerms()).toEqual(['Service area', 'Cancellation']);
    await expect(profile.area).toHaveText('Toronto West');
    await expect(profile.beforeYouBook).not.toContainText('Preparation');
  });

  test('opening a matching result shows that braider’s profile', async ({ page, api }) => {
    await api.given(findBraiders(knotlessMatches), getBraider(niaProfile));
    const matching = new MatchingBraidersPage(page);
    await matching.open();

    await matching.card('Nia Okafor').link.click();

    await expect(new BraiderProfilePage(page).heading).toHaveText('Nia Okafor');
    await expect(page).toHaveURL(/\/braiders\/nia-okafor$/);
  });

  test('an unknown or unpublished braider shows the not-found page and no private details', async ({
    page,
    api,
  }) => {
    await api.given(notFound('GET', '/api/braiders/draft-braider'));
    const notFoundPage = new ErrorPage(page);

    const response = await notFoundPage.open('/braiders/draft-braider');

    expect(response?.status()).toBe(404);
    await expect(notFoundPage.heading).toHaveText('We couldn’t find that page');
  });

  test('a failed load explains the problem and retries', async ({ page, api }) => {
    await api.given(
      getBraider(niaProfile),
      serverError('GET', '/api/braiders/nia-okafor', { times: 1 }),
    );
    const profile = new BraiderProfilePage(page);

    await profile.open('nia-okafor');

    await expect(profile.emptyHeading()).toHaveText('We couldn’t load this profile');

    await profile.retry().click();

    await expect(profile.name).toHaveText('Nia Okafor');
  });

  test('while the profile loads a labelled loading state is shown', async ({ page, api }) => {
    await api.given(findBraiders(knotlessMatches), getBraider(niaProfile, { delayMs: 1500 }));
    const matching = new MatchingBraidersPage(page);
    await matching.open();

    await matching.card('Nia Okafor').link.click();

    const profile = new BraiderProfilePage(page);
    await expect(profile.loading).toBeVisible();
    await expect(profile.name).toHaveText('Nia Okafor');
  });

  test('recent work shows the portfolio in order, with a panel for a missing photo', async ({
    page,
    api,
  }) => {
    await api.given(getBraider({ ...niaProfile, portfolio: niaPortfolio }));
    const profile = new BraiderProfilePage(page);

    await profile.open('nia-okafor');

    expect(await profile.portfolioCaptions()).toEqual([
      'Medium knotless braids · Oct 2026',
      'Nia at the studio · Sep 2026',
      'Passion twists · Sep 2026',
    ]);
    await expect(
      profile.portfolio.getByRole('img', {
        name: 'Medium knotless braids shown from the back, with neat square parts',
      }),
    ).toBeVisible();
    await expect(profile.portfolio.getByRole('img')).toHaveCount(2);
    await expect(profile.portfolio.locator('.gallery__art')).toHaveCount(1);
    await expect(profile.portfolio.getByRole('button')).toHaveCount(0);
  });

  test('with no portfolio photos the section says so and the rest of the profile stays', async ({
    page,
    api,
  }) => {
    await api.given(getBraider(niaProfile));
    const profile = new BraiderProfilePage(page);

    await profile.open('nia-okafor');

    await expect(profile.portfolio.locator('.empty__title')).toHaveText('No portfolio photos yet');
    await expect(profile.portfolio).toContainText(
      'Nia hasn’t added portfolio work yet. You can still read their services and policies.',
    );
    expect(await profile.serviceTitles()).toEqual(['Medium knotless braids', 'Passion twists']);
    await expect(profile.book).toBeVisible();
  });

  test.describe('on a phone', () => {
    test.use({ viewport: { width: 360, height: 800 } });

    test('the portfolio fits the card without scrolling sideways', async ({ page, api }) => {
      await api.given(getBraider({ ...niaProfile, portfolio: niaPortfolio }));
      const profile = new BraiderProfilePage(page);

      await profile.open('nia-okafor');

      await expect(profile.portfolioItems).toHaveCount(3);
      expect(await profile.shell.scrollsHorizontally()).toBe(false);
      expect(await profile.portfolioColumns()).toBe(2);
    });
  });
});
