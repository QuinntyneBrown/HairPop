import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ApiError, BRAIDER_SLOTS_API, OfferedSlot, dateTime } from '@hairpop/api';
import { Alert, Button, Dialog, DialogClose } from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'hp-withdraw-slot-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Dialog, DialogClose],
  template: `
    <hp-dialog
      [heading]="'Withdraw ' + date(slot.start) + '?'"
      description="Customers will no longer be able to request this time."
      [busy]="saving()"
      busyLabel="Withdrawing time…"
    >
      @if (error()) {
        <hp-alert tone="danger" announce heading="We couldn’t withdraw this time"
          ><p>{{ error() }}</p></hp-alert
        >
      }
      <p>{{ date(slot.start) }} · Up to {{ slot.maxHours }} hours</p>
      <button hp-button slot="footer" type="button" hpDialogClose>Keep time</button>
      <button
        hp-button
        slot="footer"
        variant="danger"
        type="button"
        [busy]="saving()"
        (click)="withdraw()"
      >
        Withdraw time
      </button>
    </hp-dialog>
  `,
})
export class WithdrawSlotDialog {
  protected readonly slot = inject<OfferedSlot>(DIALOG_DATA);
  private readonly ref = inject<DialogRef<boolean>>(DialogRef);
  private readonly api = inject(BRAIDER_SLOTS_API);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly date = dateTime;

  protected async withdraw(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(this.api.withdraw(this.slot.id));
      this.ref.close(true);
    } catch (error) {
      this.error.set(
        ApiError.from(error).code === 'requested'
          ? 'This time has a request and can’t be withdrawn.'
          : 'Check your connection and try again.',
      );
    } finally {
      this.saving.set(false);
    }
  }
}
