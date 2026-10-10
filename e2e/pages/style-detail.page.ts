import { Locator, Page, Response } from '@playwright/test';

import { Shell } from './shell';

/** A style's detail at `/styles/:slug` (docs/mocks/pages/style-detail). */
export class StyleDetailPage {
  readonly shell: Shell;
  readonly heading: Locator;
  readonly intro: Locator;
  readonly facts: Locator;
  readonly variations: Locator;
  readonly quoteFactors: Locator;
  readonly estimateNote: Locator;
  readonly findBraider: Locator;
  readonly partialWarning: Locator;
  readonly heroPhoto: Locator;
  readonly loading: Locator;
  readonly emptyState: Locator;

  constructor(readonly page: Page) {
    this.shell = new Shell(page);
    this.heading = page.getByRole('heading', { level: 1 });
    const main = page.locator('main');
    this.intro = main.locator('[data-style-intro]');
    this.facts = main.locator('.fact');
    this.variations = main.getByRole('list', { name: 'Variations' }).getByRole('listitem');
    this.quoteFactors = main
      .getByRole('list', { name: 'What changes the final quote' })
      .getByRole('listitem');
    this.estimateNote = main.locator('[data-estimate-note]');
    this.findBraider = main.getByRole('link', { name: 'Find a braider' });
    this.partialWarning = main.locator('hp-alert', { hasText: 'Some details are unavailable' });
    this.heroPhoto = main.locator('img.hero-photo');
    this.loading = main.locator('hp-skeleton-group');
    this.emptyState = main.locator('hp-empty-state');
  }

  async open(slug: string): Promise<Response | null> {
    return this.page.goto(`/styles/${slug}`);
  }

  fact(label: string): Locator {
    return this.facts.filter({ hasText: label }).locator('.fact__value');
  }

  async factLabels(): Promise<string[]> {
    return this.facts.locator('.fact__label').allInnerTexts();
  }
}
