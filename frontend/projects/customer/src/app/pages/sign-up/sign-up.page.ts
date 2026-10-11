import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiError, AUTH_API, idempotencyKey } from '@hairpop/api';
import {
  Alert,
  Button,
  Card,
  EmptyState,
  FormActions,
  FormField,
  FormLayout,
  Icon,
  PageHeader,
  TextField,
} from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

import { waitText } from '../../shared/retry-wait';

/** The shortest password the API accepts (L2-010). */
const MIN_PASSWORD = 12;

/** How the last attempt failed, so the right message shows above the form. */
type Failure = { kind: 'rate-limited'; wait: string } | { kind: 'unknown' };

/** RegisterPage (docs/detailed-designs/identity/create-account). */
@Component({
  selector: 'hp-sign-up-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Alert,
    Button,
    Card,
    EmptyState,
    FormActions,
    FormField,
    FormLayout,
    Icon,
    PageHeader,
    ReactiveFormsModule,
    RouterLink,
    TextField,
  ],
  template: `
    <hp-page-header
      eyebrow="Account"
      heading="Join HairPop"
      subtitle="Keep your appointments and trusted braiders in one place."
    />
    @if (registeredEmail(); as email) {
      <hp-empty-state
        heading="Your account is ready"
        [text]="'We sent a verification link to ' + email + '.'"
      >
        <svg hp-icon slot="icon" name="check-circle"></svg>
        <a hp-button variant="primary" slot="actions" routerLink="/verify-email">Verify email</a>
      </hp-empty-state>
    } @else {
      <section hp-card class="form-panel stack" aria-labelledby="form-title">
        <h2 id="form-title">Create your account</h2>
        @switch (failure()?.kind) {
          @case ('rate-limited') {
            <hp-alert tone="warning" announce heading="Too many attempts">
              <p>Try again in {{ rateLimitWait() }}.</p>
            </hp-alert>
          }
          @case ('unknown') {
            <hp-alert tone="danger" announce heading="We couldn’t create your account">
              <p>Check your connection and try again. Nothing you entered was lost.</p>
            </hp-alert>
          }
        }
        <form
          hp-form-layout
          [formGroup]="form"
          [busy]="saving()"
          [summaryTitle]="summaryTitle"
          (submitted)="register()"
        >
          <div
            hp-form-field
            label="Name"
            [errorMessages]="nameMessages"
            [error]="serverErrors().name"
          >
            <input hp-text-field type="text" formControlName="name" autocomplete="name" />
          </div>
          <div
            hp-form-field
            label="Email"
            [errorMessages]="emailMessages"
            [error]="serverErrors().email"
          >
            <input hp-text-field type="email" formControlName="email" autocomplete="email" />
          </div>
          <div
            hp-form-field
            label="Password"
            hint="Use at least 12 characters."
            [errorMessages]="passwordMessages"
            [error]="serverErrors().password"
          >
            <input
              hp-text-field
              type="password"
              formControlName="password"
              autocomplete="new-password"
            />
          </div>
          <div hp-form-actions>
            <button hp-button variant="primary" type="submit" [busy]="saving()">
              Create account
            </button>
          </div>
        </form>
        <p class="text-muted">
          Already have an account? <a routerLink="/sign-in">Sign in</a>. By creating an account you
          agree to the <a routerLink="/terms">Terms</a> and <a routerLink="/privacy">Privacy</a>.
        </p>
      </section>
    }
  `,
})
export class SignUpPage {
  private readonly api = inject(AUTH_API);

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(MIN_PASSWORD)],
    }),
  });
  protected readonly saving = signal(false);
  protected readonly failure = signal<Failure | null>(null);
  protected readonly serverErrors = signal<{ name?: string; email?: string; password?: string }>(
    {},
  );
  protected readonly registeredEmail = signal<string | null>(null);

  protected readonly nameMessages = { required: 'Enter your name.' };
  protected readonly emailMessages = {
    required: 'Enter your email address.',
    email: 'Enter a full email address, like name@example.com.',
  };
  protected readonly passwordMessages = {
    required: 'Use at least 12 characters.',
    minlength: 'Use at least 12 characters.',
  };
  protected readonly summaryTitle = (count: number): string =>
    count === 1 ? 'Check 1 answer' : `Check ${count} answers`;

  /**
   * One key per set of entries: a retry after a failure repeats it, so the API creates at most
   * one account, and changing an entry starts a new one (L2-010 AC4).
   */
  private attemptKey: string | null = null;

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.attemptKey = null;
      this.serverErrors.set({});
    });
  }

  protected rateLimitWait(): string {
    const failure = this.failure();
    return failure?.kind === 'rate-limited' ? failure.wait : '';
  }

  protected async register(): Promise<void> {
    this.attemptKey ??= idempotencyKey();
    this.saving.set(true);
    this.failure.set(null);
    try {
      const { email } = await firstValueFrom(
        this.api.register(this.form.getRawValue(), this.attemptKey),
      );
      this.registeredEmail.set(email);
    } catch (error) {
      const api = ApiError.from(error);
      if (api.status === 422) {
        this.serverErrors.set({
          name: api.field('name') ?? undefined,
          email: api.field('email') ?? undefined,
          password: api.field('password') ?? undefined,
        });
      } else if (api.status === 429) {
        this.failure.set({ kind: 'rate-limited', wait: waitText(api.retryAfter) });
      } else {
        this.failure.set({ kind: 'unknown' });
      }
    } finally {
      this.saving.set(false);
    }
  }
}
