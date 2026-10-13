import { Locator, Page } from '@playwright/test';

/** Customer account settings and its sign-out dialog. */
export class AccountSettingsPage {
  readonly name: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly save: Locator;
  readonly success: Locator;
  readonly signOut: Locator;
  readonly dialog: Locator;

  constructor(readonly page: Page) {
    this.name = page.getByRole('main').getByRole('textbox', { name: 'Name' });
    this.email = page.getByRole('main').getByRole('textbox', { name: 'Email' });
    this.phone = page.getByRole('main').getByRole('textbox', { name: /Phone/ });
    this.save = page.getByRole('main').getByRole('button', { name: 'Save changes' });
    this.success = page.getByRole('main').getByText('Your changes are saved');
    this.signOut = page.getByRole('main').getByRole('button', { name: 'Sign out' });
    this.dialog = page.getByRole('alertdialog', { name: /Sign out/ });
  }

  async open(): Promise<void> {
    await this.page.goto('/settings');
  }
}
