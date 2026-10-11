// Screen captures for video 02, recorded with tools/video-record/record-clips.mjs.
// Each clip drives the built customer app against the e2e stub API, so the cast and copy
// come from e2e/fixtures (docs/mocks/README.md).

const BRAIDERS = '/api/styles/knotless-braids/braiders';

/** Nia's profile as published, with her portfolio and reviews. */
function niaRules({ braiders }) {
  const { getBraider, getReviews, niaProfile, niaPortfolio, niaReviews } = braiders;
  return [
    getBraider({ ...niaProfile, portfolio: niaPortfolio }),
    getReviews('nia-okafor', niaReviews),
  ];
}

export default [
  {
    name: 'matching-overview',
    pace: 2.85,
    async setup({ page, api, fixtures, pages }) {
      const { findBraiders, knotlessMatches } = fixtures.braiders;
      await api.given(findBraiders(knotlessMatches));
      await new pages.MatchingBraidersPage(page).open();
    },
    async run({ page, act, pages }) {
      const matching = new pages.MatchingBraidersPage(page);
      await act.wait(1000);
      await act.moveTo(matching.heading);
      await act.wait(1200);
      await act.moveTo(matching.subtitle);
      await act.wait(1200);
      await act.moveTo(matching.activeFilterChips.first());
      await act.wait(1200);
      const nia = matching.card('Nia Okafor');
      await act.scrollTo(nia.title, 600);
      await act.moveTo(nia.availability);
      await act.wait(1500);
      await act.moveTo(nia.rating);
      await act.wait(1500);
      await act.moveTo(nia.service);
      await act.wait(1500);
      await act.moveTo(matching.card('Aisha Mensah').availability);
      await act.wait(1500);
      await act.moveTo(matching.card('Jules Baptiste').rating);
      await act.wait(1800);
      await act.moveTo(nia.link);
      await act.wait(1200);
    },
  },
  {
    name: 'matching-search',
    pace: 1.47,
    async setup({ page, api, fixtures, pages }) {
      const { findBraiders, knotlessMatches, niaMatch } = fixtures.braiders;
      await api.given(
        findBraiders(knotlessMatches),
        findBraiders([niaMatch], { query: { search: 'nia' } }),
        findBraiders([], { query: { search: 'zzz' } }),
      );
      await new pages.MatchingBraidersPage(page).open();
    },
    async run({ page, act, pages }) {
      const matching = new pages.MatchingBraidersPage(page);
      await act.wait(800);
      await act.type(matching.searchBox, 'nia');
      await act.press('Enter', 2200);
      await act.moveTo(matching.heading);
      await act.wait(1200);
      await matching.searchBox.fill('');
      await act.type(matching.searchBox, 'zzz');
      await act.press('Enter', 2200);
      await act.click(matching.emptyAction('Clear filters'), 2200);
    },
  },
  {
    name: 'filters-apply',
    pace: 1.69,
    async setup({ page, api, fixtures, pages }) {
      const { findBraiders, knotlessMatches, niaMatch, julesMatch } = fixtures.braiders;
      await api.given(
        findBraiders(knotlessMatches),
        findBraiders([niaMatch, julesMatch], { query: { maxPrice: '200', distanceKm: '10' } }),
      );
      await new pages.MatchingBraidersPage(page).open();
    },
    async run({ page, act, pages }) {
      const matching = new pages.MatchingBraidersPage(page);
      const dialog = new pages.FilterBraidersDialog(page);
      await act.wait(800);
      await act.click(matching.filtersButton, 1200);
      await act.type(dialog.maxPrice, '200');
      await act.select(dialog.distance, '10', 900);
      await act.click(dialog.apply, 2000);
      await act.moveTo(matching.activeFilters);
      await act.wait(1800);
      await act.click(matching.filtersButton, 1800);
      await act.moveTo(dialog.maxPrice);
      await act.wait(900);
      await act.click(dialog.cancel, 1500);
    },
  },
  {
    name: 'filters-validation',
    pace: 1.73,
    async setup({ page, api, fixtures, pages }) {
      const { findBraiders, knotlessMatches, niaMatch, julesMatch } = fixtures.braiders;
      const query = { maxPrice: '200', distanceKm: '10' };
      await api.given(
        findBraiders(knotlessMatches),
        findBraiders([niaMatch, julesMatch], { query }),
        fixtures.errors.serverError('GET', BRAIDERS, { query, times: 1 }),
      );
      await new pages.MatchingBraidersPage(page).open();
    },
    async run({ page, act, pages }) {
      const matching = new pages.MatchingBraidersPage(page);
      const dialog = new pages.FilterBraidersDialog(page);
      await act.wait(700);
      await act.click(matching.filtersButton, 1000);
      await act.type(dialog.maxPrice, '120');
      await act.select(dialog.distance, '10', 700);
      await act.click(dialog.apply, 2000);
      await act.moveTo(dialog.summary);
      await act.wait(1500);
      await act.moveTo(dialog.fieldErrors.first());
      await act.wait(1500);
      await dialog.maxPrice.fill('');
      await act.type(dialog.maxPrice, '200');
      await act.click(dialog.apply, 2000);
      await act.moveTo(dialog.failure);
      await act.wait(1800);
      await act.click(dialog.apply, 2200);
    },
  },
  {
    name: 'filters-no-results',
    pace: 1.0,
    async setup({ page, api, fixtures, pages }) {
      const { findBraiders, knotlessMatches } = fixtures.braiders;
      await api.given(
        findBraiders(knotlessMatches),
        findBraiders([], { query: { maxPrice: '165', distanceKm: '5' } }),
      );
      await new pages.MatchingBraidersPage(page).open();
    },
    async run({ page, act, pages }) {
      const matching = new pages.MatchingBraidersPage(page);
      const dialog = new pages.FilterBraidersDialog(page);
      await act.wait(700);
      await act.click(matching.filtersButton, 900);
      await act.type(dialog.maxPrice, '165');
      await act.select(dialog.distance, '5', 700);
      await act.click(dialog.apply, 2000);
      await act.moveTo(matching.emptyState);
      await act.wait(1800);
      await act.click(matching.emptyAction('Clear filters'), 2200);
    },
  },
  {
    name: 'braiders-destination',
    pace: 1.22,
    async setup({ page, api, fixtures, pages }) {
      const { findBraiders, knotlessMatches } = fixtures.braiders;
      const { listStyles, gallery } = fixtures.styles;
      await api.given(
        listStyles(gallery),
        findBraiders(knotlessMatches, { style: null }),
        niaRules(fixtures),
      );
      await new pages.StyleGalleryPage(page).open();
    },
    async run({ page, act, pages }) {
      const shell = new pages.Shell(page);
      const matching = new pages.MatchingBraidersPage(page);
      await act.wait(800);
      await act.click(shell.navLink('Braiders'), 2200);
      await act.moveTo(matching.heading);
      await act.wait(1500);
      await act.click(matching.card('Nia Okafor').link, 2200);
    },
  },
  {
    name: 'profile-overview',
    pace: 2.4,
    async setup({ page, api, fixtures, pages }) {
      await api.given(niaRules(fixtures));
      await new pages.BraiderProfilePage(page).open('nia-okafor');
    },
    async run({ page, act, pages }) {
      const profile = new pages.BraiderProfilePage(page);
      await act.wait(1000);
      await act.moveTo(profile.name);
      await act.wait(1200);
      await act.moveTo(profile.rating);
      await act.wait(1200);
      await act.moveTo(profile.area);
      await act.wait(1200);
      await act.moveTo(profile.bio);
      await act.wait(1500);
      await act.moveTo(profile.book);
      await act.wait(1500);
      await act.scrollTo(profile.services.first());
      await act.moveTo(profile.services.first());
      await act.wait(1500);
      await act.moveTo(profile.services.last());
      await act.wait(1200);
      await act.moveTo(profile.policy('Service area'));
      await act.wait(1800);
      await act.moveTo(profile.policy('Cancellation'));
      await act.wait(1500);
      await act.scrollTo(profile.portfolio);
      await act.moveTo(profile.portfolioItems.first());
      await act.wait(1500);
      await act.moveTo(profile.portfolioItems.last());
      await act.wait(1500);
      await act.scrollTo(profile.reviews);
      await act.moveTo(profile.reviewItems.first());
      await act.wait(2000);
      await act.moveTo(profile.reviewItems.last());
      await act.wait(1500);
    },
  },
  {
    name: 'profile-reviews-retry',
    pace: 1.36,
    async setup({ page, api, fixtures, pages }) {
      await api.given(
        niaRules(fixtures),
        fixtures.errors.serverError('GET', '/api/braiders/nia-okafor/reviews', { times: 1 }),
      );
      await new pages.BraiderProfilePage(page).open('nia-okafor');
    },
    async run({ page, act, pages }) {
      const profile = new pages.BraiderProfilePage(page);
      await act.wait(600);
      await act.scrollTo(profile.reviews);
      await act.moveTo(profile.reviewsWarning);
      await act.wait(2000);
      await act.click(profile.reviewsWarning.getByRole('button', { name: 'Retry reviews' }), 2000);
      await act.moveTo(profile.reviewItems.first());
      await act.wait(1500);
    },
  },
  {
    name: 'profile-new-braider',
    pace: 1.65,
    async setup({ page, api, fixtures, pages }) {
      const { getBraider, getReviews, niaProfile } = fixtures.braiders;
      await api.given(getBraider({ ...niaProfile, rating: null }), getReviews('nia-okafor', []));
      await new pages.BraiderProfilePage(page).open('nia-okafor');
    },
    async run({ page, act, pages }) {
      const profile = new pages.BraiderProfilePage(page);
      await act.wait(800);
      await act.moveTo(profile.rating);
      await act.wait(1500);
      await act.scrollTo(profile.portfolio);
      await act.moveTo(profile.portfolio);
      await act.wait(1800);
      await act.scrollTo(profile.reviews);
      await act.moveTo(profile.reviews);
      await act.wait(1800);
    },
  },
];
