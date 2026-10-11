import { Locator, Page } from '@playwright/test';

import { Shell } from './shell';

/** One result card. */
export class BraiderCard {
  readonly title: Locator;
  readonly availability: Locator;
  readonly rating: Locator;
  readonly ratingSpoken: Locator;
  readonly service: Locator;
  readonly link: Locator;

  constructor(readonly root: Locator) {
    this.title = root.locator('.card__title');
    this.availability = root.locator('.eyebrow');
    this.rating = root.locator('.rating');
    this.ratingSpoken = this.rating.locator('.visually-hidden');
    this.service = root.locator('p.text-muted');
    this.link = root.getByRole('link');
  }
}

/** Matching braiders at `/styles/:slug/braiders` and `/braiders`. */
export class MatchingBraidersPage {
  readonly shell: Shell;
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly cards: Locator;
  readonly searchBox: Locator;
  readonly filtersButton: Locator;
  readonly activeFilters: Locator;
  readonly activeFilterChips: Locator;
  readonly emptyState: Locator;
  readonly pagination: Locator;

  constructor(readonly page: Page) {
    this.shell = new Shell(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.subtitle = page.locator('hp-page-header .subtitle');
    this.cards = page.locator('section.feature-grid article.story-card');
    this.searchBox = page.getByRole('searchbox', { name: 'Search matching braiders' });
    this.filtersButton = page.getByRole('button', { name: /^Filters/ });
    this.activeFilters = page.getByRole('group', { name: 'Active filters' });
    this.activeFilterChips = this.activeFilters.locator('.chip');
    this.emptyState = page.locator('hp-empty-state');
    this.pagination = page.getByRole('navigation', { name: 'Results pages' });
  }

  async open(path = '/styles/knotless-braids/braiders'): Promise<void> {
    await this.page.goto(path);
  }

  /** The text of each active-filter chip, in order. */
  async activeFilterLabels(): Promise<string[]> {
    return this.activeFilterChips.allInnerTexts();
  }

  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
    await this.searchBox.press('Enter');
  }

  card(name: string): BraiderCard {
    return new BraiderCard(
      this.cards.filter({ has: this.page.locator('.card__title', { hasText: name }) }),
    );
  }

  async cardTitles(): Promise<string[]> {
    return this.cards.locator('.card__title').allInnerTexts();
  }

  emptyHeading(): Locator {
    return this.emptyState.locator('.empty__title');
  }

  emptyAction(name: string): Locator {
    return this.emptyState
      .getByRole('button', { name })
      .or(this.emptyState.getByRole('link', { name }));
  }
}
