// Screen captures for video 01, recorded with tools/video-record/record-clips.mjs.
// Each clip drives the built customer app against the e2e stub API, so the cast and copy
// come from e2e/fixtures (docs/mocks/README.md).

/** The gallery as published: the cast's three styles plus starter locs. */
function galleryRules({ styles }) {
  const { gallery, starterLocs, knotlessBraids, cornrows, passionTwists, listStyles } = styles;
  return [
    listStyles([...gallery, starterLocs]),
    listStyles([knotlessBraids, cornrows], { query: { category: 'braids' } }),
    listStyles([passionTwists], { query: { category: 'twists' } }),
    listStyles([starterLocs], { query: { category: 'locs' } }),
  ];
}

export default [
  {
    name: 'gallery-overview',
    pace: 3.1,
    async setup({ page, api, fixtures, pages }) {
      await api.given(galleryRules(fixtures));
      await new pages.StyleGalleryPage(page).open();
    },
    async run({ page, act, pages }) {
      const gallery = new pages.StyleGalleryPage(page);
      await act.wait(1200);
      await act.moveTo(gallery.heading);
      await act.wait(1200);
      await act.moveTo(gallery.card('Knotless braids').title);
      await act.wait(1500);
      await act.moveTo(gallery.card('Knotless braids').facts);
      await act.wait(1500);
      await act.moveTo(gallery.card('Passion twists').title);
      await act.wait(1200);
      await act.moveTo(gallery.card('Cornrows').facts);
      await act.wait(1500);
      await act.scrollTo(gallery.card('Starter locs').title);
      await act.moveTo(gallery.card('Starter locs').title);
      await act.wait(1500);
      await act.scrollTop();
      await act.moveTo(gallery.shell.primaryNav);
      await act.wait(1500);
    },
  },
  {
    name: 'gallery-categories',
    pace: 2.0,
    async setup({ page, api, fixtures, pages }) {
      await api.given(galleryRules(fixtures));
      await new pages.StyleGalleryPage(page).open();
    },
    async run({ page, act, pages }) {
      const gallery = new pages.StyleGalleryPage(page);
      await act.wait(800);
      await act.click(gallery.category('Braids'), 1800);
      await act.click(gallery.category('Twists'), 1800);
      await act.click(gallery.category('Locs'), 1800);
      await act.click(gallery.category('All styles'), 1800);
    },
  },
  {
    name: 'gallery-search',
    pace: 1.3,
    async setup({ page, api, fixtures, pages }) {
      const { listStyles, knotlessBraids } = fixtures.styles;
      await api.given(
        galleryRules(fixtures),
        listStyles([knotlessBraids], { query: { search: 'knotless' } }),
        listStyles([], { query: { search: 'twisted locs', category: 'locs' } }),
      );
      await new pages.StyleGalleryPage(page).open();
    },
    async run({ page, act, pages }) {
      const gallery = new pages.StyleGalleryPage(page);
      await act.wait(700);
      await act.type(gallery.searchBox, 'knotless');
      await act.press('Enter', 2200);
      await act.moveTo(gallery.resultsStatus);
      await act.wait(1200);
      await gallery.searchBox.fill('');
      await act.press('Enter', 1200);
      await act.click(gallery.category('Locs'), 1400);
      await act.type(gallery.searchBox, 'twisted locs');
      await act.press('Enter', 2500);
      await act.click(gallery.emptyAction('Clear filters'), 2200);
    },
  },
  {
    name: 'gallery-pages',
    pace: 2.1,
    async setup({ page, api, fixtures, pages }) {
      const { listStyles, knotlessBraids, cornrows } = fixtures.styles;
      await api.given(
        listStyles([knotlessBraids, cornrows], {
          query: { category: 'braids' },
          meta: { total: 3, perPage: 2 },
        }),
        listStyles([{ ...knotlessBraids, slug: 'box-braids', name: 'Box braids', image: null }], {
          query: { category: 'braids', page: '2' },
          meta: { total: 3, perPage: 2, page: 2 },
        }),
      );
      await new pages.StyleGalleryPage(page).open('?category=braids');
    },
    async run({ page, act, pages }) {
      const gallery = new pages.StyleGalleryPage(page);
      await act.wait(800);
      await act.scrollTo(gallery.pagination);
      await act.moveTo(gallery.pagination);
      await act.wait(1200);
      await act.click(gallery.pagination.getByRole('link', { name: 'Next' }), 2000);
      await act.scrollTop();
      await act.moveTo(gallery.category('Braids'));
      await act.wait(1500);
    },
  },
  {
    name: 'gallery-recovery',
    pace: 1.9,
    async setup({ page, api, fixtures, pages }) {
      await api.given(
        galleryRules(fixtures),
        fixtures.errors.serverError('GET', '/api/styles', {
          query: { category: 'twists' },
          times: 1,
        }),
      );
      await new pages.StyleGalleryPage(page).open();
    },
    async run({ page, api, act, pages }) {
      const gallery = new pages.StyleGalleryPage(page);
      await act.wait(700);
      await act.click(gallery.category('Twists'), 2200);
      await act.moveTo(gallery.emptyHeading());
      await act.wait(1200);
      await act.click(gallery.emptyAction('Try again'), 2000);
      await api.setOffline(true);
      await act.click(gallery.category('Braids'), 2500);
      await act.moveTo(gallery.offline);
      await act.wait(1200);
      await api.setOffline(false);
      await act.click(gallery.offline.getByRole('button', { name: 'Try again' }), 2200);
    },
  },
  {
    name: 'style-detail',
    pace: 2.1,
    async setup({ page, api, fixtures, pages }) {
      const { getStyle, knotlessBraidsDetail } = fixtures.styles;
      const { findBraiders, knotlessMatches } = fixtures.braiders;
      await api.given(
        galleryRules(fixtures),
        getStyle(knotlessBraidsDetail),
        findBraiders(knotlessMatches),
      );
      await new pages.StyleGalleryPage(page).open();
    },
    async run({ page, act, pages }) {
      const gallery = new pages.StyleGalleryPage(page);
      const detail = new pages.StyleDetailPage(page);
      await act.wait(700);
      await act.click(gallery.card('Knotless braids').link, 2000);
      await act.moveTo(detail.intro);
      await act.wait(1500);
      await act.moveTo(detail.fact('Typical time'));
      await act.wait(1000);
      await act.moveTo(detail.fact('Typical price'));
      await act.wait(1000);
      await act.moveTo(detail.fact('Typical wear'));
      await act.wait(1200);
      await act.scrollTo(detail.variations.first());
      await act.moveTo(detail.variations.nth(1));
      await act.wait(1800);
      await act.scrollTo(detail.quoteFactors.first());
      await act.moveTo(detail.quoteFactors.nth(2));
      await act.wait(1800);
      await act.moveTo(detail.estimateNote);
      await act.wait(1800);
      await act.click(detail.findBraider, 2500);
    },
  },
  {
    name: 'style-detail-partial',
    pace: 1.75,
    async setup({ page, api, fixtures, pages }) {
      const { getStyle, knotlessBraidsDetail } = fixtures.styles;
      await api.given(
        getStyle({ ...knotlessBraidsDetail, typicalWear: null, unavailable: ['typicalWear'] }),
      );
      await new pages.StyleDetailPage(page).open('knotless-braids');
    },
    async run({ page, api, act, fixtures, pages }) {
      const { getStyle, knotlessBraidsDetail } = fixtures.styles;
      const detail = new pages.StyleDetailPage(page);
      await act.wait(800);
      await act.moveTo(detail.partialWarning);
      await act.wait(2000);
      await api.given(getStyle(knotlessBraidsDetail));
      await act.click(detail.partialWarning.getByRole('button', { name: 'Retry' }), 2500);
      await act.moveTo(detail.fact('Typical wear'));
      await act.wait(1500);
    },
  },
];
