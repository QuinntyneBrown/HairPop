import { Page } from '@playwright/test';
import { BRAIDER_URL } from '../fixtures/urls';

export class BraiderAvailabilityPage {
  constructor(private readonly page: Page) {}
  readonly heading = this.page.getByRole('heading', { name: 'Availability' });
  readonly main = this.page.getByRole('main');
  readonly add = this.page.getByRole('button', { name: 'Add offered time' });
  readonly dialog = this.page.getByRole('dialog');
  readonly withdrawDialog = this.page.getByRole('alertdialog');
  readonly offeredTimes = this.page.getByRole('region', { name: 'Offered times' });

  async open(): Promise<void> {
    await this.page.goto(`${BRAIDER_URL}/manage/availability`);
  }

  async addTime(date: string, time: string, hours: string): Promise<void> {
    await this.add.click();
    await this.dialog.getByLabel('Date').fill(date);
    await this.dialog.getByLabel('Time').fill(time);
    await this.dialog.getByLabel('Maximum hours').fill(hours);
    await this.dialog.getByRole('button', { name: 'Add offered time' }).click();
  }
}
