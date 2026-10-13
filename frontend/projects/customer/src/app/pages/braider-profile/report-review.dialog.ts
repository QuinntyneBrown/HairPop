import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiError, BRAIDERS_API } from '@hairpop/api';
import {
  Alert,
  Button,
  Dialog,
  DialogClose,
  FormField,
  FormLayout,
  Radio,
  RadioGroup,
  Textarea,
} from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

/** Reports one published review for moderation (L2-009). */
@Component({
  selector: 'hp-report-review-dialog',
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
    Textarea,
  ],
  template: `
    <hp-dialog
      heading="Report a review"
      description="Tell us why this review needs a closer look."
      closeLabel="Close dialog"
      [busy]="saving()"
      busyLabel="Sending report…"
    >
      @if (failure()) {
        <hp-alert tone="danger" announce heading="We couldn’t send your report"
          ><p>{{ failure() }}</p></hp-alert
        >
      }
      <form
        hp-form-layout
        id="report-review-form"
        [formGroup]="form"
        [busy]="saving()"
        [summaryTitle]="summaryTitle"
        (submitted)="submit()"
      >
        <fieldset
          hp-form-field
          label="Reason"
          [errorMessages]="reasonMessages"
          [error]="reasonError() ?? undefined"
        >
          <hp-radio-group formControlName="reason">
            <label hp-radio value="not_real_visit">Not a real visit</label>
            <label hp-radio value="offensive">Offensive content</label>
            <label hp-radio value="private_info">Private information</label>
            <label hp-radio value="other">Something else</label>
          </hp-radio-group>
        </fieldset>
        <div hp-form-field label="Details (optional)" [error]="detailsError() ?? undefined">
          <textarea hp-textarea formControlName="details" rows="3"></textarea>
        </div>
      </form>
      <button hp-button slot="footer" hpDialogClose>Keep browsing</button>
      <button
        hp-button
        slot="footer"
        variant="primary"
        type="submit"
        form="report-review-form"
        [busy]="saving()"
      >
        Send report
      </button>
    </hp-dialog>
  `,
})
export class ReportReviewDialog {
  private readonly reviewId = inject<string>(DIALOG_DATA);
  private readonly api = inject(BRAIDERS_API);
  private readonly ref = inject<DialogRef<boolean>>(DialogRef);
  protected readonly form = new FormGroup({
    reason: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    details: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(1000)] }),
  });
  protected readonly saving = signal(false);
  protected readonly failure = signal<string | null>(null);
  protected readonly reasonError = signal<string | null>(null);
  protected readonly detailsError = signal<string | null>(null);
  protected readonly reasonMessages = { required: 'Choose why this review needs a closer look.' };
  protected readonly summaryTitle = (count: number): string =>
    count === 1 ? 'Check 1 answer' : `Check ${count} answers`;

  protected async submit(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    this.failure.set(null);
    try {
      const values = this.form.getRawValue();
      await firstValueFrom(
        this.api.reportReview(this.reviewId, {
          reason: values.reason as 'not_real_visit' | 'offensive' | 'private_info' | 'other',
          details: values.details.trim() || null,
        }),
      );
      this.ref.close(true);
    } catch (error) {
      const api = ApiError.from(error);
      if (api.status === 422) {
        this.reasonError.set(api.field('reason'));
        this.detailsError.set(api.field('details'));
      } else this.failure.set('Check your connection and try again. Your entries are still here.');
    } finally {
      this.saving.set(false);
    }
  }
}
