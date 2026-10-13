import { Page } from '@playwright/test';
import { BRAIDER_URL } from '../fixtures/urls';

export class BraiderServicesPage {
  constructor(private readonly page: Page) {}
  readonly main = this.page.getByRole('main');
  readonly services = this.page.getByRole('region', { name: 'Services' });
  readonly add = this.page.getByRole('button', { name: 'Add service' });
  readonly dialog = this.page.getByRole('dialog');
  readonly removeDialog = this.page.getByRole('alertdialog');
  readonly serviceName = this.dialog.getByRole('textbox', { name: 'Service name' });

  async open(): Promise<void> {
    await this.page.goto(`${BRAIDER_URL}/manage/services`);
  }

  async create(): Promise<void> {
    await this.add.click();
    await this.dialog.getByLabel('Style').selectOption('knotless-braids');
    await this.serviceName.fill('Medium knotless braids');
    await this.dialog.getByRole('spinbutton', { name: 'Starting price' }).fill('180');
    await this.dialog.getByRole('spinbutton', { name: 'Typical hours' }).fill('5');
    await this.dialog.getByRole('button', { name: 'Save service' }).click();
  }
}
