import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiError, AUTH_API } from '@hairpop/api';
import {
  Alert,
  Button,
  Card,
  EmptyState,
  FormActions,
  FormField,
  FormLayout,
  PageHeader,
  TextField,
} from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

/** Consumes an emailed, single-use reset link (L2-012). */
@Component({
  selector: 'hp-reset-password-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Alert,
    Button,
    Card,
    EmptyState,
    FormActions,
    FormField,
    FormLayout,
    PageHeader,
    ReactiveFormsModule,
    RouterLink,
    TextField,
  ],
  template: `
    <hp-page-header
      eyebrow="Account"
      heading="Choose a new password"
      subtitle="Use at least 12 characters for your HairPop account."
    />
    @if (saved()) {
      <hp-empty-state heading="Password updated" text="Sign in with your new password.">
        <a hp-button variant="primary" slot="actions" routerLink="/sign-in">Sign in</a>
      </hp-empty-state>
    } @else if (invalidLink() || !token() || !email()) {
      <hp-alert tone="danger" announce heading="This reset link has expired or was already used">
        <p>Ask for a new reset link to continue.</p>
        <a routerLink="/forgot-password">Request a new reset link</a>
      </hp-alert>
    } @else {
      <section hp-card class="form-panel stack" aria-labelledby="form-title">
        <h2 id="form-title">New password</h2>
        @if (failure()) {
          <hp-alert tone="danger" announce heading="We couldn’t save your password"
            ><p>{{ failure() }}</p></hp-alert
          >
        }
        <form
          hp-form-layout
          [formGroup]="form"
          [busy]="saving()"
          [summaryTitle]="summaryTitle"
          (submitted)="save()"
        >
          <div
            hp-form-field
            label="New password"
            hint="Use at least 12 characters."
            [errorMessages]="passwordMessages"
            [error]="passwordError() ?? undefined"
          >
            <input
              hp-text-field
              type="password"
              formControlName="password"
              autocomplete="new-password"
            />
          </div>
          <div
            hp-form-field
            label="Confirm password"
            [errorMessages]="confirmationMessages"
            [error]="confirmationError() ?? undefined"
          >
            <input
              hp-text-field
              type="password"
              formControlName="passwordConfirmation"
              autocomplete="new-password"
            />
          </div>
          <div hp-form-actions>
            <button hp-button variant="primary" type="submit" [busy]="saving()">
              Save password
            </button>
          </div>
        </form>
      </section>
    }
  `,
})
export class ResetPasswordPage {
  private readonly api = inject(AUTH_API);
  readonly token = input<string>();
  readonly email = input<string>();
  protected readonly form = new FormGroup({
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(12)],
    }),
    passwordConfirmation: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly invalidLink = signal(false);
  protected readonly failure = signal<string | null>(null);
  protected readonly passwordError = signal<string | null>(null);
  protected readonly confirmationError = signal<string | null>(null);
  protected readonly passwordMessages = {
    required: 'Use at least 12 characters.',
    minlength: 'Use at least 12 characters.',
  };
  protected readonly confirmationMessages = { required: 'Enter the same password again.' };
  protected readonly summaryTitle = (count: number): string =>
    count === 1 ? 'Check 1 answer' : `Check ${count} answers`;

  protected async save(): Promise<void> {
    const { password, passwordConfirmation } = this.form.getRawValue();
    this.passwordError.set(null);
    this.confirmationError.set(null);
    if (password !== passwordConfirmation) {
      this.confirmationError.set('Enter the same password again.');
      return;
    }
    this.saving.set(true);
    this.failure.set(null);
    try {
      await firstValueFrom(
        this.api.resetPassword({
          token: this.token()!,
          email: this.email()!,
          password,
          passwordConfirmation,
        }),
      );
      this.saved.set(true);
    } catch (error) {
      const api = ApiError.from(error);
      if (api.code === 'invalid_token') this.invalidLink.set(true);
      else if (api.status === 422) {
        this.passwordError.set(api.field('password'));
        this.confirmationError.set(api.field('passwordConfirmation'));
      } else this.failure.set('Check your connection and try again. Nothing you entered was lost.');
    } finally {
      this.saving.set(false);
    }
  }
}
