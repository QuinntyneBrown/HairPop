import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SessionStore } from '@hairpop/api';
import { Alert, Button, Dialog, DialogClose } from '@hairpop/components';

@Component({
  selector: 'hp-braider-sign-out-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Dialog, DialogClose],
  template: `
    <hp-dialog
      heading="Sign out of HairPop for braiders?"
      description="You’ll need to sign in again to manage bookings."
      [busy]="saving()"
      busyLabel="Signing out…"
    >
      @if (failed()) {
        <hp-alert tone="danger" announce heading="We couldn’t sign you out">
          <p>Check your connection and try again.</p>
        </hp-alert>
      }
      <button hp-button slot="footer" type="button" hpDialogClose>Stay signed in</button>
      <button
        hp-button
        slot="footer"
        variant="danger"
        type="button"
        [busy]="saving()"
        (click)="signOut()"
      >
        Sign out
      </button>
    </hp-dialog>
  `,
})
export class BraiderSignOutDialog {
  private readonly ref = inject<DialogRef<boolean>>(DialogRef);
  private readonly session = inject(SessionStore);
  protected readonly saving = signal(false);
  protected readonly failed = signal(false);

  protected async signOut(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    this.failed.set(false);
    try {
      await this.session.signOut();
      this.ref.close(true);
    } catch {
      this.failed.set(true);
    } finally {
      this.saving.set(false);
    }
  }
}
