import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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

import { waitText } from '../../shared/retry-wait';

/** Requests an account-recovery link without revealing whether an account exists (L2-012). */
@Component({
  selector: 'hp-forgot-password-page',
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
      heading="Reset your password"
      subtitle="We’ll send a secure link to the email on your account."
    />
    @if (sent()) {
      <hp-empty-state
        heading="Check your inbox"
        text="If this email belongs to an account, a reset link is on its way. The link expires in 1 hour."
      >
        <a hp-button variant="primary" slot="actions" routerLink="/sign-in">Back to sign in</a>
      </hp-empty-state>
    } @else {
      <section hp-card class="form-panel stack" aria-labelledby="form-title">
        <h2 id="form-title">Reset link</h2>
        @if (failure()) {
          <hp-alert tone="danger" announce heading="We couldn’t send a reset link"
            ><p>{{ failure() }}</p></hp-alert
          >
        }
        <form
          hp-form-layout
          [formGroup]="form"
          [busy]="saving()"
          [summaryTitle]="summaryTitle"
          (submitted)="send()"
        >
          <div
            hp-form-field
            label="Email"
            [errorMessages]="emailMessages"
            [error]="serverError() ?? undefined"
          >
            <input hp-text-field type="email" formControlName="email" autocomplete="email" />
          </div>
          <div hp-form-actions>
            <button hp-button variant="primary" type="submit" [busy]="saving()">
              Send reset link
            </button>
          </div>
        </form>
        <p><a routerLink="/sign-in">Back to sign in</a></p>
      </section>
    }
  `,
})
export class ForgotPasswordPage {
  private readonly api = inject(AUTH_API);
  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });
  protected readonly saving = signal(false);
  protected readonly sent = signal(false);
  protected readonly failure = signal<string | null>(null);
  protected readonly serverError = signal<string | null>(null);
  protected readonly emailMessages = {
    required: 'Enter your email address.',
    email: 'Enter a full email address, like name@example.com.',
  };
  protected readonly summaryTitle = (count: number): string =>
    count === 1 ? 'Check 1 answer' : `Check ${count} answers`;

  protected async send(): Promise<void> {
    this.saving.set(true);
    this.failure.set(null);
    this.serverError.set(null);
    try {
      await firstValueFrom(this.api.forgotPassword(this.form.controls.email.value));
      this.sent.set(true);
    } catch (error) {
      const api = ApiError.from(error);
      if (api.status === 422) this.serverError.set(api.field('email'));
      else if (api.status === 429)
        this.failure.set(`Too many attempts. Try again in ${waitText(api.retryAfter)}.`);
      else this.failure.set('Check your connection and try again. Your email is still here.');
    } finally {
      this.saving.set(false);
    }
  }
}
