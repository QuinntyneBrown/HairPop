import { Locator, Page } from '@playwright/test';

/** Toast notifications (hp-toast): feedback that appears over any page. */
export class Toasts {
  constructor(readonly page: Page) {}

  /** The toast with this heading. */
  toast(heading: string): Locator {
    return this.page
      .locator('.toast')
      .filter({ has: this.page.getByText(heading, { exact: true }) });
  }

  /** The toast's action button, such as Retry or Change. */
  action(heading: string, name: string): Locator {
    return this.toast(heading).getByRole('button', { name, exact: true });
  }
}
