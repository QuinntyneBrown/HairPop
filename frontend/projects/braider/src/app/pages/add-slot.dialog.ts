import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ApiError, BRAIDER_SLOTS_API } from '@hairpop/api';
import { Alert, Button, Dialog, DialogClose } from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'hp-add-slot-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Dialog, DialogClose],
  template: `
    <hp-dialog
      heading="Add an offered time"
      description="Offer a future time that customers can request."
      [busy]="saving()"
      busyLabel="Adding offered time…"
    >
      @if (error()) {
        <hp-alert tone="danger" announce heading="We couldn’t add this time">
          <p>{{ error() }}</p>
        </hp-alert>
      }
      <div class="field">
        <label class="field__label" for="slot-date">Date</label>
        <input
          class="input"
          id="slot-date"
          type="date"
          [value]="date()"
          (input)="date.set($any($event.target).value)"
        />
      </div>
      <div class="field">
        <label class="field__label" for="slot-time">Time</label>
        <input
          class="input"
          id="slot-time"
          type="time"
          [value]="time()"
          (input)="time.set($any($event.target).value)"
        />
      </div>
      <div class="field">
        <label class="field__label" for="slot-hours">Maximum hours</label>
        <input
          class="input"
          id="slot-hours"
          type="number"
          min="1"
          max="12"
          step="0.5"
          [value]="hours()"
          (input)="hours.set($any($event.target).value)"
        />
      </div>
      <button hp-button slot="footer" type="button" hpDialogClose>Cancel</button>
      <button
        hp-button
        slot="footer"
        variant="primary"
        type="button"
        [busy]="saving()"
        (click)="add()"
      >
        Add offered time
      </button>
    </hp-dialog>
  `,
})
export class AddSlotDialog {
  private readonly ref = inject<DialogRef<boolean>>(DialogRef);
  private readonly api = inject(BRAIDER_SLOTS_API);
  protected readonly date = signal('');
  protected readonly time = signal('');
  protected readonly hours = signal('');
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected async add(): Promise<void> {
    const maxHours = Number(this.hours());
    if (!this.date() || !this.time() || maxHours <= 0 || maxHours > 12) {
      this.error.set('Enter a future date, time and a duration up to 12 hours.');
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(this.api.add({ date: this.date(), time: this.time(), maxHours }));
      this.ref.close(true);
    } catch (error) {
      const api = ApiError.from(error);
      this.error.set(
        api.code === 'overlap'
          ? 'This time overlaps another offered time.'
          : api.status === 422
            ? 'Choose a future date and valid duration.'
            : 'Check your connection and try again.',
      );
    } finally {
      this.saving.set(false);
    }
  }
}
