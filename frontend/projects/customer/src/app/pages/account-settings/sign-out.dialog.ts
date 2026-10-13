import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStore } from '@hairpop/api';
import { Alert, Button, Dialog, DialogClose } from '@hairpop/components';

/** Explicit customer sign-out confirmation (L2-011, L2-045). */
@Component({
  selector: 'hp-sign-out-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Dialog, DialogClose],
  template: `
    <hp-dialog
      heading="Sign out of HairPop?"
      description="Saved appointment details are removed from this browser. You can browse styles at any time."
      [busy]="saving()"
      busyLabel="Signing you out…"
    >
      @if (failed()) {
        <hp-alert tone="danger" announce heading="We couldn’t sign you out"
          ><p>Check your connection and try again. You are still signed in.</p></hp-alert
        >
      }
      <p>You’ll stay signed in on your other devices.</p>
      <button hp-button slot="footer" hpDialogClose>Stay signed in</button>
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
export class SignOutDialog {
  private readonly ref = inject<DialogRef<void>>(DialogRef);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);
  protected readonly saving = signal(false);
  protected readonly failed = signal(false);

  protected async signOut(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    this.failed.set(false);
    try {
      await this.session.signOut();
      this.ref.close();
      await this.router.navigateByUrl('/');
    } catch {
      this.failed.set(true);
    } finally {
      this.saving.set(false);
    }
  }
}
