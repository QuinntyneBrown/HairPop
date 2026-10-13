import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { APPOINTMENTS_API, ApiError, AppointmentDetail } from '@hairpop/api';
import { Alert, Button, Dialog, DialogClose } from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

/** Explicit cancellation after the owner reads the accepted policy (L2-022). */
@Component({
  selector: 'hp-cancel-appointment-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Dialog, DialogClose],
  template: `
    <hp-dialog
      [heading]="'Cancel request ' + appointment.reference + '?'"
      [description]="
        'Review the cancellation terms before cancelling ' + appointment.reference + '.'
      "
      [busy]="saving()"
      busyLabel="Cancelling your request…"
    >
      @if (failure()) {
        <hp-alert tone="danger" announce heading="We couldn’t cancel this request"
          ><p>{{ failure() }}</p></hp-alert
        >
      }
      <p>{{ appointment.policy.cancellation || 'Ask your braider about cancellation.' }}</p>
      <button hp-button slot="footer" hpDialogClose>Keep request</button>
      <button
        hp-button
        slot="footer"
        variant="danger"
        type="button"
        [busy]="saving()"
        (click)="cancel()"
      >
        Cancel request
      </button>
    </hp-dialog>
  `,
})
export class CancelAppointmentDialog {
  protected readonly appointment = inject<AppointmentDetail>(DIALOG_DATA);
  private readonly ref = inject<DialogRef<boolean>>(DialogRef);
  private readonly api = inject(APPOINTMENTS_API);
  protected readonly saving = signal(false);
  protected readonly failure = signal<string | null>(null);

  protected async cancel(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    this.failure.set(null);
    try {
      await firstValueFrom(this.api.cancel(this.appointment.reference));
      this.ref.close(true);
    } catch (error) {
      const api = ApiError.from(error);
      this.failure.set(
        api.code === 'not_cancellable'
          ? 'This request can’t be cancelled now. Refresh its details.'
          : 'Check your connection and try again. The request has not been marked cancelled.',
      );
    } finally {
      this.saving.set(false);
    }
  }
}
