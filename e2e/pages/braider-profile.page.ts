import { Locator, Page, Response } from '@playwright/test';

import { Shell } from './shell';
import { textsOf } from './texts';

/** A braider's public profile at `/braiders/:slug` (docs/mocks/pages/braider-profile). */
export class BraiderProfilePage {
  readonly shell: Shell;
  readonly heading: Locator;
  readonly about: Locator;
  readonly name: Locator;
  readonly rating: Locator;
  readonly area: Locator;
  readonly bio: Locator;
  readonly book: Locator;
  readonly services: Locator;
  readonly beforeYouBook: Locator;
  readonly portfolio: Locator;
  readonly portfolioItems: Locator;
  readonly reviews: Locator;
  readonly reviewItems: Locator;
  readonly reviewsWarning: Locator;
  readonly emptyState: Locator;
  readonly loading: Locator;
  readonly offline: Locator;

  constructor(readonly page: Page) {
    this.shell = new Shell(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.about = page.locator('section.card').filter({ has: page.locator('.profile-head') });
    this.name = this.about.locator('.profile-head h2');
    this.rating = this.about.locator('.rating');
    this.area = this.about.locator('.profile-head p.text-muted');
    this.bio = this.about.locator(':scope > p');
    this.book = page.getByRole('link', { name: 'Request an appointment' });
    this.services = page.getByRole('region', { name: 'Services' }).getByRole('listitem');
    this.beforeYouBook = page.getByRole('complementary', { name: 'Before you book' });
    this.portfolio = page.getByRole('region', { name: 'Recent work' });
    this.portfolioItems = this.portfolio.locator('li.gallery__item');
    this.reviews = page.getByRole('region', { name: 'Customer reviews' });
    this.reviewItems = this.reviews.locator('figure.review');
    this.reviewsWarning = this.reviews.locator('hp-alert', { hasText: 'Reviews couldn’t load' });
    this.emptyState = page.locator('hp-empty-state');
    this.loading = page.locator('hp-skeleton-group');
    this.offline = page.locator('hp-alert', { hasText: 'You’re offline' });
  }

  async open(slug: string): Promise<Response | null> {
    return this.page.goto(`/braiders/${slug}`);
  }

  async serviceTitles(): Promise<string[]> {
    return textsOf(this.services.locator('.list__title'));
  }

  /** The "Before you book" terms in order. */
  async policyTerms(): Promise<string[]> {
    return textsOf(this.beforeYouBook.locator('dt'));
  }

  /** The value shown for one "Before you book" term. */
  policy(term: string): Locator {
    return this.beforeYouBook.locator('dt', { hasText: term }).locator('+ dd');
  }

  async portfolioCaptions(): Promise<string[]> {
    return textsOf(this.portfolio.locator('.gallery__caption'));
  }

  /** How many columns the portfolio grid lays out: the distinct left edges of its items. */
  async portfolioColumns(): Promise<number> {
    const lefts = await this.portfolioItems.evaluateAll((items) =>
      items.map((item) => Math.round(item.getBoundingClientRect().left)),
    );
    return new Set(lefts).size;
  }

  /** One review's parts: score, date, words and who wrote it. */
  review(index: number): {
    score: Locator;
    spokenScore: Locator;
    date: Locator;
    quote: Locator;
    author: Locator;
  } {
    const item = this.reviewItems.nth(index);
    return {
      score: item.locator('.rating__value'),
      spokenScore: item.locator('.rating .visually-hidden'),
      date: item.locator('time.review__date'),
      quote: item.locator('blockquote.review__quote'),
      author: item.locator('figcaption.review__author'),
    };
  }

  emptyHeading(): Locator {
    return this.emptyState.locator('.empty__title');
  }

  retry(): Locator {
    return this.page.getByRole('button', { name: 'Try again' });
  }
}
