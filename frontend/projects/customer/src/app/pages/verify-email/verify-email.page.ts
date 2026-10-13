import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
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
  Spinner,
  TextField,
} from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

import { waitText } from '../../shared/retry-wait';

/** Uses an emailed challenge on load, or offers a controlled resend (L2-013). */
@Component({
  selector: 'hp-verify-email-page',
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
    Spinner,
    TextField,
  ],
  template: `
    <hp-page-header
      eyebrow="Account"
      heading="Check your email"
      subtitle="Verify your address to keep your HairPop account up to date."
    />
    @if (verified()) {
      <hp-empty-state
        heading="Your email is verified"
        text="You can now use this address for your account."
      >
        <a hp-button variant="primary" slot="actions" routerLink="/sign-in">Sign in</a>
      </hp-empty-state>
    } @else {
      <section hp-card class="form-panel stack" aria-labelledby="form-title">
        <h2 id="form-title">Verify your email</h2>
        @if (verifying()) {
          <hp-spinner label="Verifying your email" />
        }
        @if (invalidLink()) {
          <hp-alert
            tone="danger"
            announce
            heading="This verification link has expired or was already used"
          >
            <p>Enter your email below to request another link.</p>
          </hp-alert>
        }
        @if (failure()) {
          <hp-alert tone="danger" announce heading="We couldn’t send that email"
            ><p>{{ failure() }}</p></hp-alert
          >
        }
        @if (sent()) {
          <hp-alert tone="success" announce heading="Another email is on its way"
            ><p>If this address needs verification, check your inbox for a new link.</p></hp-alert
          >
        }
        <form
          hp-form-layout
          [formGroup]="form"
          [busy]="sending()"
          [summaryTitle]="summaryTitle"
          (submitted)="resend()"
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
            <button hp-button variant="primary" type="submit" [busy]="sending()">
              Resend email
            </button>
          </div>
        </form>
      </section>
    }
  `,
})
export class VerifyEmailPage {
  private readonly api = inject(AUTH_API);
  readonly token = input<string>();
  protected readonly verifying = signal(false);
  protected readonly verified = signal(false);
  protected readonly invalidLink = signal(false);
  protected readonly sending = signal(false);
  protected readonly sent = signal(false);
  protected readonly failure = signal<string | null>(null);
  protected readonly serverError = signal<string | null>(null);
  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });
  protected readonly emailMessages = {
    required: 'Enter your email address.',
    email: 'Enter a full email address, like name@example.com.',
  };
  protected readonly summaryTitle = (count: number): string =>
    count === 1 ? 'Check 1 answer' : `Check ${count} answers`;

  constructor() {
    // A POST must run in the browser, never during server rendering.
    afterNextRender(() => {
      const token = this.token();
      if (token) void this.verify(token);
    });
  }

  private async verify(token: string): Promise<void> {
    this.verifying.set(true);
    try {
      await firstValueFrom(this.api.verifyEmail(token));
      this.verified.set(true);
    } catch (error) {
      if (ApiError.from(error).code === 'invalid_token') this.invalidLink.set(true);
      else this.failure.set('Check your connection and reload this page to try again.');
    } finally {
      this.verifying.set(false);
    }
  }

  protected async resend(): Promise<void> {
    this.sending.set(true);
    this.sent.set(false);
    this.failure.set(null);
    this.serverError.set(null);
    try {
      await firstValueFrom(this.api.resendVerification(this.form.controls.email.value));
      this.sent.set(true);
    } catch (error) {
      const api = ApiError.from(error);
      if (api.status === 422) this.serverError.set(api.field('email'));
      else if (api.status === 429)
        this.failure.set(`Too many attempts. Try again in ${waitText(api.retryAfter)}.`);
      else this.failure.set('Check your connection and try again. Your email is still here.');
    } finally {
      this.sending.set(false);
    }
  }
}
