import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BRAIDER_SERVICES_API, ManagedService } from '@hairpop/api';
import { Alert, Button, Dialog, DialogClose } from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'hp-remove-service-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Dialog, DialogClose],
  template: `
    <hp-dialog
      [heading]="'Remove ' + service.name + '?'"
      description="Customers will no longer be able to request this service."
      [busy]="saving()"
      busyLabel="Removing service…"
    >
      @if (failed()) {
        <hp-alert tone="danger" announce heading="We couldn’t remove this service">
          <p>Check your connection and try again.</p>
        </hp-alert>
      }
      <p>Past appointments keep their recorded service details.</p>
      <button hp-button slot="footer" type="button" hpDialogClose>Keep service</button>
      <button
        hp-button
        slot="footer"
        variant="danger"
        type="button"
        [busy]="saving()"
        (click)="remove()"
      >
        Remove service
      </button>
    </hp-dialog>
  `,
})
export class RemoveServiceDialog {
  protected readonly service = inject<ManagedService>(DIALOG_DATA);
  private readonly ref = inject<DialogRef<boolean>>(DialogRef);
  private readonly api = inject(BRAIDER_SERVICES_API);
  protected readonly saving = signal(false);
  protected readonly failed = signal(false);

  protected async remove(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    this.failed.set(false);
    try {
      await firstValueFrom(this.api.remove(this.service.id));
      this.ref.close(true);
    } catch {
      this.failed.set(true);
    } finally {
      this.saving.set(false);
    }
  }
}
