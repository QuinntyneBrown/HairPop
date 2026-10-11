import { Locator, Page, Response } from '@playwright/test';

import { Shell } from './shell';

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
    this.emptyState = page.locator('hp-empty-state');
    this.loading = page.locator('hp-skeleton-group');
    this.offline = page.locator('hp-alert', { hasText: 'You’re offline' });
  }

  async open(slug: string): Promise<Response | null> {
    return this.page.goto(`/braiders/${slug}`);
  }

  async serviceTitles(): Promise<string[]> {
    return this.services.locator('.list__title').allInnerTexts();
  }

  /** The "Before you book" terms in order. */
  async policyTerms(): Promise<string[]> {
    return this.beforeYouBook.locator('dt').allInnerTexts();
  }

  /** The value shown for one "Before you book" term. */
  policy(term: string): Locator {
    return this.beforeYouBook.locator('dt', { hasText: term }).locator('+ dd');
  }

  emptyHeading(): Locator {
    return this.emptyState.locator('.empty__title');
  }

  retry(): Locator {
    return this.page.getByRole('button', { name: 'Try again' });
  }
}
