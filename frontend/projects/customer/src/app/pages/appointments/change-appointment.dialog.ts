import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { APPOINTMENTS_API, ApiError, AppointmentDetail, IsoDateTime, dateTime } from '@hairpop/api';
import {
  Alert,
  Button,
  Dialog,
  DialogClose,
  FormField,
  FormLayout,
  Radio,
  RadioGroup,
  Spinner,
  Textarea,
} from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

/** Selects an offered replacement while preserving the agreed time (L2-021). */
@Component({
  selector: 'hp-change-appointment-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Alert,
    Button,
    Dialog,
    DialogClose,
    FormField,
    FormLayout,
    Radio,
    RadioGroup,
    ReactiveFormsModule,
    Spinner,
    Textarea,
  ],
  template: `
    <hp-dialog
      heading="Request a change"
      [description]="
        'The current time for ' +
        appointment.reference +
        ' stays in place until your braider accepts.'
      "
      closeLabel="Close dialog"
      [busy]="saving()"
      busyLabel="Sending change request…"
    >
      <p>Current time: {{ date(appointment.start, appointment.timeZone) }}</p>
      @if (loading()) {
        <hp-spinner label="Loading offered times" />
      }
      @if (failure()) {
        <hp-alert tone="danger" announce heading="We couldn’t request that change"
          ><p>{{ failure() }}</p></hp-alert
        >
      }
      <form
        hp-form-layout
        id="change-appointment-form"
        [formGroup]="form"
        [busy]="saving()"
        [summaryTitle]="summaryTitle"
        (submitted)="save()"
      >
        <fieldset
          hp-form-field
          label="New offered time"
          [errorMessages]="slotMessages"
          [error]="slotError() ?? undefined"
        >
          <hp-radio-group cards formControlName="slotId">
            @for (slot of slots(); track slot.id) {
              <label hp-radio [value]="slot.id">{{ date(slot.start, appointment.timeZone) }}</label>
            }
          </hp-radio-group>
        </fieldset>
        <div hp-form-field label="Note (optional)" [error]="noteError() ?? undefined">
          <textarea hp-textarea formControlName="note" rows="3"></textarea>
        </div>
      </form>
      <button hp-button slot="footer" hpDialogClose>Keep current time</button>
      <button
        hp-button
        slot="footer"
        variant="primary"
        type="submit"
        form="change-appointment-form"
        [busy]="saving()"
      >
        Send change request
      </button>
    </hp-dialog>
  `,
})
export class ChangeAppointmentDialog {
  protected readonly appointment = inject<AppointmentDetail>(DIALOG_DATA);
  private readonly ref = inject<DialogRef<boolean>>(DialogRef);
  private readonly api = inject(APPOINTMENTS_API);
  protected readonly form = new FormGroup({
    slotId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    note: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
  });
  protected readonly slots = signal<readonly { id: string; start: IsoDateTime }[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly failure = signal<string | null>(null);
  protected readonly slotError = signal<string | null>(null);
  protected readonly noteError = signal<string | null>(null);
  protected readonly slotMessages = { required: 'Choose one of the offered times.' };
  protected readonly summaryTitle = (count: number): string =>
    count === 1 ? 'Check 1 answer' : `Check ${count} answers`;
  protected readonly date = dateTime;

  constructor() {
    afterNextRender(() => void this.load());
  }

  private async load(): Promise<void> {
    try {
      this.slots.set(
        (await firstValueFrom(this.api.changeOptions(this.appointment.reference))).slots,
      );
    } catch {
      this.failure.set('Offered times could not load. Close this dialog and try again.');
    } finally {
      this.loading.set(false);
    }
  }

  protected async save(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    this.failure.set(null);
    this.slotError.set(null);
    this.noteError.set(null);
    try {
      const { slotId, note } = this.form.getRawValue();
      await firstValueFrom(
        this.api.requestChange(this.appointment.reference, { slotId, note: note.trim() || null }),
      );
      this.ref.close(true);
    } catch (error) {
      const api = ApiError.from(error);
      if (api.status === 422) {
        this.slotError.set(api.field('slotId'));
        this.noteError.set(api.field('note'));
      } else
        this.failure.set(
          api.code === 'slot_unavailable'
            ? 'That time is no longer offered. Choose another.'
            : 'The change was not saved. Refresh and try again.',
        );
    } finally {
      this.saving.set(false);
    }
  }
}
