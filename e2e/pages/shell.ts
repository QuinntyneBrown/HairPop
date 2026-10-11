import { Locator, Page } from '@playwright/test';

/** The chrome every page shares: skip link, top bar, main landmark and footer. */
export class Shell {
  readonly skipLink: Locator;
  readonly topBar: Locator;
  readonly primaryNav: Locator;
  readonly main: Locator;
  readonly footer: Locator;
  readonly updatesLink: Locator;
  readonly accountLink: Locator;
  readonly menuButton: Locator;
  readonly themeToggle: Locator;
  readonly root: Locator;
  readonly announcements: Locator;

  constructor(readonly page: Page) {
    this.skipLink = page.locator('a.skip-link');
    this.topBar = page.locator('header.topbar');
    this.primaryNav = this.topBar.getByRole('navigation', { name: 'Primary' });
    this.main = page.locator('main#main');
    this.footer = page.locator('footer.site-footer');
    this.updatesLink = this.topBar.locator('a.account-link', { hasText: 'Updates' });
    this.accountLink = this.topBar.locator('a.topbar__account');
    this.menuButton = this.topBar.locator('button.topbar__menu');
    this.themeToggle = this.topBar.locator('button.theme-toggle');
    this.root = page.locator('html');
    this.announcements = page.locator('.cdk-live-announcer-element');
  }

  navLink(name: string): Locator {
    return this.primaryNav.getByRole('link', { name, exact: true });
  }

  /** The labels of the primary destinations, in order. */
  async navLabels(): Promise<string[]> {
    return this.primaryNav.getByRole('link').allInnerTexts();
  }

  footerLink(name: string): Locator {
    return this.footer.getByRole('link', { name, exact: true });
  }

  /** The colour the page paints behind its content: it differs between the two themes. */
  async pageBackground(): Promise<string> {
    return this.page.locator('body').evaluate((body) => getComputedStyle(body).backgroundColor);
  }

  /** Whether the page scrolls sideways, which a narrow screen must never need. */
  async scrollsHorizontally(): Promise<boolean> {
    return this.page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
  }

  heading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }
}
