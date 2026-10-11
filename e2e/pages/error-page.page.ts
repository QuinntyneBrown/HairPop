import { Locator, Page, Response } from '@playwright/test';

import { Shell } from './shell';

/** The 404, 403, 500 and offline destinations (hp-error-page). */
export class ErrorPage {
  readonly shell: Shell;
  readonly root: Locator;
  readonly heading: Locator;
  readonly text: Locator;
  readonly reference: Locator;

  constructor(readonly page: Page) {
    this.shell = new Shell(page);
    this.root = page.locator('hp-error-page');
    this.heading = this.root.locator('h1.empty__title');
    this.text = this.root.locator('.empty__text');
    this.reference = this.root.locator('.empty__reference');
  }

  /** Opens a path directly and returns the document response. */
  async open(path: string): Promise<Response | null> {
    return this.page.goto(path);
  }

  action(name: string): Locator {
    return this.root
      .getByRole('link', { name, exact: true })
      .or(this.root.getByRole('button', { name, exact: true }));
  }

  async isShown(): Promise<boolean> {
    return this.root.isVisible();
  }
}
