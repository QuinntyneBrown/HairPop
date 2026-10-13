import { Page } from '@playwright/test';
import { BRAIDER_URL } from '../fixtures/urls';

export class BraiderProfileContentPage {
  constructor(private readonly page: Page) {}
  readonly main = this.page.getByRole('main');
  readonly area = this.page.getByRole('textbox', { name: 'Service area' });
  readonly address = this.page.getByRole('textbox', { name: 'Studio address' });
  readonly save = this.page.getByRole('button', { name: 'Save changes' });
  readonly signOut = this.page.getByRole('button', { name: 'Sign out' });
  readonly signOutDialog = this.page.getByRole('alertdialog');
  readonly addPhoto = this.page.getByRole('button', { name: 'Add photo' });
  readonly uploadDialog = this.page.getByRole('dialog', { name: 'Add a portfolio photo' });
  readonly removePhoto = this.page.getByRole('button', { name: 'Remove Medium knotless braids' });

  async uploadPhoto(path: string, caption: string, style: string): Promise<void> {
    await this.addPhoto.click();
    await this.uploadDialog.getByLabel('Photo').setInputFiles(path);
    await this.uploadDialog.getByRole('textbox', { name: 'Caption' }).fill(caption);
    await this.uploadDialog.getByRole('combobox', { name: 'Style' }).selectOption({ label: style });
    await this.uploadDialog.getByRole('button', { name: 'Add photo' }).click();
  }

  async open(): Promise<void> {
    await this.page.goto(`${BRAIDER_URL}/manage/profile`);
  }
}
