import { Locator, Page } from '@playwright/test';

import { Shell } from './shell';
import { textsOf } from './texts';

/** One story card in the gallery. */
export class StyleCard {
  readonly title: Locator;
  readonly eyebrow: Locator;
  readonly facts: Locator;
  readonly photo: Locator;
  readonly art: Locator;
  readonly link: Locator;

  constructor(readonly root: Locator) {
    this.title = root.locator('.card__title');
    this.eyebrow = root.locator('.eyebrow');
    this.facts = root.locator('.text-muted');
    this.photo = root.locator('img.story-card__photo');
    this.art = root.locator('.story-card__art');
    this.link = root.getByRole('link');
  }
}

/** The style gallery at `/` (docs/mocks/pages/style-gallery). */
export class StyleGalleryPage {
  readonly shell: Shell;
  readonly heading: Locator;
  readonly searchBox: Locator;
  readonly findBraiders: Locator;
  readonly categories: Locator;
  readonly results: Locator;
  readonly cards: Locator;
  readonly titles: Locator;
  readonly emptyState: Locator;
  readonly loading: Locator;
  readonly offline: Locator;
  readonly pagination: Locator;
  readonly resultsStatus: Locator;

  constructor(readonly page: Page) {
    this.shell = new Shell(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.searchBox = page.getByRole('searchbox', { name: 'Search styles' });
    this.findBraiders = page.getByRole('link', { name: 'Find braiders' });
    this.categories = page.getByRole('group', { name: 'Style category' });
    this.results = page.locator('section.feature-grid');
    this.cards = this.results.locator('article.story-card');
    this.titles = this.cards.locator('.card__title');
    this.emptyState = page.locator('hp-empty-state');
    this.loading = page.locator('hp-skeleton-group');
    this.offline = page.locator('hp-alert', { hasText: 'You’re offline' });
    this.pagination = page.getByRole('navigation', { name: 'Results pages' });
    this.resultsStatus = page.locator('[data-results-status]');
  }

  async open(query = ''): Promise<void> {
    await this.page.goto(`/${query}`);
  }

  card(name: string): StyleCard {
    return new StyleCard(
      this.cards.filter({ has: this.page.locator('.card__title', { hasText: name }) }),
    );
  }

  async cardTitles(): Promise<string[]> {
    return textsOf(this.cards.locator('.card__title'));
  }

  category(name: string): Locator {
    return this.categories.getByRole('button', { name, exact: true });
  }

  async chooseCategory(name: string): Promise<void> {
    await this.category(name).click();
  }

  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
    await this.searchBox.press('Enter');
  }

  emptyHeading(): Locator {
    return this.emptyState.locator('.empty__title');
  }

  emptyAction(name: string): Locator {
    return this.emptyState
      .getByRole('button', { name })
      .or(this.emptyState.getByRole('link', { name }));
  }

  async goToPage(label: string): Promise<void> {
    await this.pagination.getByRole('link', { name: label }).click();
  }
}
