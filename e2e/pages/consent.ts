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

/** The Cookie preferences dialog (docs/mocks/dialogs/cookie-preferences). */
export class CookiePreferencesDialog {
  readonly root: Locator;
  readonly allow: Locator;
  readonly essentialOnly: Locator;
  readonly save: Locator;
  readonly cancel: Locator;
  readonly summary: Locator;
  readonly fieldError: Locator;
  readonly failure: Locator;

  constructor(readonly page: Page) {
    this.root = page.getByRole('dialog', { name: 'Cookie preferences' });
    this.allow = this.root.getByRole('radio', { name: 'Allow optional usage data' });
    this.essentialOnly = this.root.getByRole('radio', { name: 'Essential only' });
    this.save = this.root.getByRole('button', { name: 'Save preferences' });
    this.cancel = this.root.getByRole('button', { name: 'Cancel' });
    this.summary = this.root.locator('.form-summary');
    this.fieldError = this.root.locator('.field__error');
    this.failure = this.root.getByRole('alert').filter({ hasText: 'We couldn’t save this' });
  }
}
