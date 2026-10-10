import { DialogRef } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';

import { DialogState } from './dialog-state';

/**
 * Closes the enclosing dialog on click with its value as the result (`''` dismisses),
 * unless the dialog is busy. Used on the safe action:
 * `<button hp-button slot="footer" hpDialogClose>Keep request</button>`.
 */
@Directive({
  selector: 'button[hpDialogClose]',
  host: { '(click)': 'close()' },
})
export class DialogClose<R = unknown> {
  private readonly dialogRef = inject<DialogRef<R>>(DialogRef, { optional: true });
  private readonly state = inject(DialogState, { optional: true });

  /** The result `closed` emits; empty dismisses with `undefined`. */
  readonly hpDialogClose = input<R | ''>('');

  protected close(): void {
    if (!this.dialogRef || this.state?.busy()) {
      return;
    }
    const result = this.hpDialogClose();
    this.dialogRef.close(result === '' ? undefined : result);
  }
}
