import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Alert,
  Button,
  Dialog,
  DialogClose,
  FormField,
  FormLayout,
  Radio,
  RadioGroup,
} from '@hairpop/components';

import { ConsentChoice, ConsentStore } from './consent.store';

/**
 * CookiePreferencesDialog (docs/detailed-designs/privacy/manage-cookie-choice). Closes with
 * whether optional usage data is allowed once the API confirms the save; a failed save keeps
 * the selection and says nothing was changed (L2-034 AC3).
 */
@Component({
  selector: 'hp-cookie-preferences-dialog',
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
  ],
  template: `
    <hp-dialog
      heading="Cookie preferences"
      description="Essential storage keeps you signed in. Optional usage data helps us improve HairPop."
      closeLabel="Close dialog"
      [busy]="saving()"
      busyLabel="Saving…"
    >
      @if (failed()) {
        <hp-alert tone="danger" announce heading="We couldn’t save this">
          <p>Nothing was changed. Your entries are still here, so you can try again.</p>
        </hp-alert>
      }
      <p>
        <strong>Essential storage</strong> · always on. Keeps you signed in and remembers this
        choice.
      </p>
      <form
        hp-form-layout
        id="cookie-preferences-form"
        [formGroup]="form"
        [busy]="saving()"
        [summaryTitle]="summaryTitle"
        (submitted)="save()"
      >
        <fieldset hp-form-field label="Optional usage data" [errorMessages]="messages">
          <hp-radio-group cards formControlName="choice">
            <label
              hp-radio
              value="allow"
              description="Helps us understand which styles people explore."
              >Allow optional usage data</label
            >
            <label hp-radio value="essential" description="HairPop works the same either way."
              >Essential only</label
            >
          </hp-radio-group>
        </fieldset>
      </form>
      <button hp-button slot="footer" hpDialogClose>Cancel</button>
      <button
        hp-button
        slot="footer"
        variant="primary"
        type="submit"
        form="cookie-preferences-form"
        [busy]="saving()"
      >
        Save preferences
      </button>
    </hp-dialog>
  `,
})
export class CookiePreferencesDialog {
  private readonly ref = inject<DialogRef<boolean>>(DialogRef);
  private readonly consent = inject(ConsentStore);

  protected readonly form = new FormGroup({
    choice: new FormControl<ConsentChoice | null>(this.consent.choice(), Validators.required),
  });
  protected readonly saving = signal(false);
  protected readonly failed = signal(false);

  protected readonly messages = { required: 'Choose whether to allow optional usage data.' };
  protected readonly summaryTitle = (count: number): string =>
    count === 1 ? 'Check 1 answer' : `Check ${count} answers`;

  protected async save(): Promise<void> {
    const optionalUsage = this.form.controls.choice.value === 'allow';
    this.saving.set(true);
    this.failed.set(false);
    try {
      await this.consent.save(optionalUsage);
      this.ref.close(optionalUsage);
    } catch {
      this.failed.set(true);
    } finally {
      this.saving.set(false);
    }
  }
}
