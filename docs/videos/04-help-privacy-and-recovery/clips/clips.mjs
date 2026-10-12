// Screen captures for video 04, recorded with tools/video-record/record-clips.mjs.
// Each clip drives the built customer app against the e2e stub API, so the cast and copy
// come from e2e/fixtures (docs/mocks/README.md).

/** Everything the shell can link to in these clips. */
function siteRules({ styles, content }) {
  const { listStyles, gallery } = styles;
  const { getContent, helpContent, termsContent, privacyContent } = content;
  return [
    listStyles(gallery),
    getContent(helpContent),
    getContent(termsContent),
    getContent(privacyContent),
  ];
}

export default [
  {
    name: 'consent-first-visit',
    pace: 2.53,
    consent: null,
    async setup({ page, api, fixtures, pages }) {
      await api.given(siteRules(fixtures), fixtures.consent.saveConsent(false));
      await new pages.StyleGalleryPage(page).open();
    },
    async run({ page, act, pages }) {
      const banner = new pages.ConsentBanner(page);
      const dialog = new pages.CookiePreferencesDialog(page);
      const toasts = new pages.Toasts(page);
      await act.wait(1200);
      await act.moveTo(banner.root);
      await act.wait(1800);
      await act.click(banner.preferences, 1500);
      await act.click(dialog.save, 1800);
      await act.moveTo(dialog.summary);
      await act.wait(1500);
      await act.click(dialog.essentialOnly, 900);
      await act.click(dialog.save, 1800);
      await act.moveTo(toasts.toast('Preferences saved'));
      await act.wait(2000);
    },
  },
  {
    name: 'consent-footer',
    pace: 1.16,
    consent: 'essential',
    async setup({ page, api, fixtures, pages }) {
      await api.given(siteRules(fixtures), fixtures.consent.saveConsent(true));
      await new pages.StyleGalleryPage(page).open();
    },
    async run({ page, act, pages }) {
      const shell = new pages.Shell(page);
      const dialog = new pages.CookiePreferencesDialog(page);
      await act.wait(800);
      await act.scrollTo(shell.footer, 700);
      await act.click(shell.footerLink('Cookie preferences'), 1500);
      await act.moveTo(dialog.essentialOnly);
      await act.wait(1200);
      await act.click(dialog.allow, 900);
      await act.click(dialog.save, 2200);
    },
  },
  {
    name: 'theme',
    pace: 1.18,
    async setup({ page, api, fixtures, pages }) {
      await api.given(siteRules(fixtures));
      await new pages.StyleGalleryPage(page).open();
    },
    async run({ page, act, pages }) {
      const shell = new pages.Shell(page);
      await act.wait(1000);
      await act.click(shell.themeToggle, 2200);
      await act.click(shell.navLink('Help'), 2000);
      await page.reload();
      await page.locator('hp-root[data-hydrated]').waitFor({ state: 'attached' });
      await act.wait(1500);
      await act.moveTo(shell.themeToggle);
      await act.wait(1200);
      await act.click(shell.themeToggle, 2000);
    },
  },
  {
    name: 'help',
    pace: 2.06,
    async setup({ page, api, fixtures, pages }) {
      await api.given(siteRules(fixtures));
      await new pages.StyleGalleryPage(page).open();
    },
    async run({ page, act, pages }) {
      const shell = new pages.Shell(page);
      const help = new pages.HelpPage(page);
      await act.wait(800);
      await act.click(shell.navLink('Help'), 1800);
      await act.moveTo(help.topics.nth(0));
      await act.wait(1500);
      await act.moveTo(help.topics.nth(1));
      await act.wait(1500);
      await act.moveTo(help.topics.nth(2));
      await act.wait(1500);
      await act.moveTo(help.topics.nth(3));
      await act.wait(1500);
      await act.moveTo(help.contactAction);
      await act.wait(1800);
    },
  },
  {
    name: 'legal',
    pace: 1.16,
    async setup({ page, api, fixtures, pages }) {
      await api.given(siteRules(fixtures));
      await new pages.HelpPage(page).open();
    },
    async run({ page, act, pages }) {
      const shell = new pages.Shell(page);
      const legal = new pages.LegalPage(page);
      await act.wait(800);
      await act.scrollTo(shell.footer, 700);
      await act.click(shell.footerLink('Terms'), 1800);
      await act.moveTo(legal.effectiveDate);
      await act.wait(1500);
      await act.moveTo(legal.copy.getByRole('heading', { level: 2 }).nth(1));
      await act.wait(1800);
      await act.scrollTo(shell.footer, 700);
      await act.click(shell.footerLink('Privacy'), 1800);
      await act.moveTo(legal.effectiveDate);
      await act.wait(1800);
    },
  },
  {
    name: 'error-pages',
    pace: 2.13,
    async setup({ page, api, fixtures, pages }) {
      await api.given(siteRules(fixtures));
      await new pages.ErrorPage(page).open('/styles-that-do-not-exist');
    },
    async run({ page, act, pages }) {
      const error = new pages.ErrorPage(page);
      await act.wait(1000);
      await act.moveTo(error.heading);
      await act.wait(1500);
      await act.moveTo(error.action('Explore styles'));
      await act.wait(1500);
      await error.open('/403');
      await act.wait(800);
      await act.moveTo(error.action('Sign in'));
      await act.wait(1800);
      await error.open('/500?reference=HP-ERR-7F3K2Q&at=2026-10-10T09:42:00-04:00');
      await act.wait(800);
      await act.moveTo(error.reference);
      await act.wait(1800);
      await act.moveTo(error.action('Contact support'));
      await act.wait(1500);
      await error.open('/offline');
      await act.wait(800);
      await act.moveTo(error.action('View saved appointments'));
      await act.wait(1800);
    },
  },
  {
    name: 'keyboard',
    pace: 1.98,
    async setup({ page, api, fixtures, pages }) {
      await api.given(
        siteRules(fixtures),
        fixtures.styles.getStyle(fixtures.styles.knotlessBraidsDetail),
      );
      await new pages.StyleGalleryPage(page).open();
    },
    async run({ page, act, pages }) {
      const gallery = new pages.StyleGalleryPage(page);
      await act.hideCursor();
      await act.wait(1000);
      await act.press('Tab', 1800);
      await act.press('Enter', 1500);
      for (let i = 0; i < 6; i++) await act.press('Tab', 450);
      await act.wait(800);
      await gallery.card('Knotless braids').link.focus();
      await act.wait(1200);
      await act.press('Enter', 2500);
    },
  },
];
