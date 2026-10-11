import { Locator, Page } from '@playwright/test';

import { Shell } from './shell';
import { textsOf } from './texts';

/** Terms of use at `/terms` and Privacy at `/privacy` (docs/mocks/pages/terms, privacy). */
export class LegalPage {
  readonly shell: Shell;
  readonly heading: Locator;
  readonly copy: Locator;
  readonly effectiveDate: Locator;
  readonly emptyState: Locator;
  readonly loading: Locator;

  constructor(readonly page: Page) {
    this.shell = new Shell(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.copy = page.locator('article.legal-copy');
    this.effectiveDate = this.copy.locator('p.text-muted').first();
    this.emptyState = page.locator('hp-empty-state');
    this.loading = page.locator('hp-skeleton-group');
  }

  async open(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async sectionHeadings(): Promise<string[]> {
    return textsOf(this.copy.getByRole('heading', { level: 2 }));
  }

  emptyHeading(): Locator {
    return this.emptyState.locator('.empty__title');
  }

  retry(): Locator {
    return this.page.getByRole('button', { name: 'Try again' });
  }
}
