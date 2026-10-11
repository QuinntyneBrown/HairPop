import { Locator, Page } from '@playwright/test';

import { Shell } from './shell';

/** Help at `/help` (docs/mocks/pages/help). */
export class HelpPage {
  readonly shell: Shell;
  readonly heading: Locator;
  readonly topics: Locator;
  readonly contactAction: Locator;
  readonly emptyState: Locator;
  readonly loading: Locator;
  readonly offline: Locator;

  constructor(readonly page: Page) {
    this.shell = new Shell(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.topics = page.locator('section.feature-grid article.story-card');
    this.contactAction = page.getByRole('link', { name: 'Email support' });
    this.emptyState = page.locator('hp-empty-state');
    this.loading = page.locator('hp-skeleton-group');
    this.offline = page.locator('hp-alert', { hasText: 'You’re offline' });
  }

  async open(path = '/help'): Promise<void> {
    await this.page.goto(path);
  }

  async topicTitles(): Promise<string[]> {
    return this.topics.locator('.card__title').allInnerTexts();
  }

  emptyHeading(): Locator {
    return this.emptyState.locator('.empty__title');
  }

  retry(): Locator {
    return this.page.getByRole('button', { name: 'Try again' });
  }
}
