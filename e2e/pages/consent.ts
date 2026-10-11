import { Locator, Page } from '@playwright/test';

/** The cookie consent banner shown above the top bar until the visitor chooses. */
export class ConsentBanner {
  readonly root: Locator;
  readonly allow: Locator;
  readonly essentialOnly: Locator;
  readonly preferences: Locator;

  constructor(readonly page: Page) {
    this.root = page.getByRole('region', { name: 'Privacy choices' });
    this.allow = this.root.getByRole('button', { name: 'Allow optional data' });
    this.essentialOnly = this.root.getByRole('button', { name: 'Essential only' });
    this.preferences = this.root.getByRole('link', { name: 'Cookie preferences' });
  }

  /** The saved choice from the essential `hp-consent` cookie, or null before a choice. */
  async savedChoice(): Promise<string | null> {
    const cookies = await this.page.context().cookies();
    return cookies.find((cookie) => cookie.name === 'hp-consent')?.value ?? null;
  }
}
