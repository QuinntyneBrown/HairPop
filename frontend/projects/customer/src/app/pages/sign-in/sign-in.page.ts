import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiError, SessionStore } from '@hairpop/api';
import {
  Alert,
  Button,
  Card,
  FormActions,
  FormField,
  FormLayout,
  PageHeader,
  TextField,
} from '@hairpop/components';

/** How the last attempt failed, so the right message shows above the form. */
type Failure = { kind: 'refused' } | { kind: 'rate-limited'; wait: string } | { kind: 'unknown' };

/** "2 minutes", "30 seconds": how long the API asks the visitor to wait. */
function waitText(seconds: number | null): string {
  if (seconds === null || seconds <= 0) return 'a few minutes';
  if (seconds < 60) return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
}

/** A return address stays on this site: a path, never another origin. */
function safeReturnUrl(url: string | undefined): string {
  return url && /^\/(?![/\\])/.test(url) ? url : '/';
}

/** SignInPage (docs/detailed-designs/identity/manage-session). */
@Component({
  selector: 'hp-sign-in-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Alert,
    Button,
    Card,
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
      heading="Welcome back"
      subtitle="Sign in to manage requests, appointments and reviews."
    />
    <section hp-card class="form-panel stack" aria-labelledby="form-title">
      <h2 id="form-title">Sign in</h2>
      @switch (failure()?.kind) {
        @case ('refused') {
          <hp-alert tone="danger" announce heading="We couldn’t sign you in">
            <p>Check your email and password and try again.</p>
          </hp-alert>
        }
        @case ('rate-limited') {
          <hp-alert tone="warning" announce heading="Too many sign-in attempts">
            <p>Try again in {{ rateLimitWait() }}.</p>
          </hp-alert>
        }
        @case ('unknown') {
          <hp-alert tone="danger" announce heading="We couldn’t sign you in">
            <p>Something went wrong on our side. Try again in a moment.</p>
          </hp-alert>
        }
      }
      <form
        hp-form-layout
        [formGroup]="form"
        [busy]="saving()"
        [summaryTitle]="summaryTitle"
        (submitted)="signIn()"
      >
        <div hp-form-field label="Email" [errorMessages]="emailMessages">
          <input hp-text-field type="email" formControlName="email" autocomplete="email" />
        </div>
        <div hp-form-field label="Password" [errorMessages]="passwordMessages">
          <input
            hp-text-field
            type="password"
            formControlName="password"
            autocomplete="current-password"
          />
        </div>
        <div hp-form-actions>
          <button hp-button variant="primary" type="submit" [busy]="saving()">Sign in</button>
        </div>
      </form>
      <p><a routerLink="/forgot-password">Forgot your password?</a></p>
      <p class="text-muted">New to HairPop? <a routerLink="/sign-up">Create an account</a></p>
    </section>
  `,
})
export class SignInPage {
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);

  /** Query parameter: where to go after signing in. */
  readonly returnUrl = input<string>();

  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  protected readonly saving = signal(false);
  protected readonly failure = signal<Failure | null>(null);

  protected readonly emailMessages = {
    required: 'Enter your email address.',
    email: 'Enter a full email address, like name@example.com.',
  };
  protected readonly passwordMessages = { required: 'Enter your password.' };
  protected readonly summaryTitle = (count: number): string =>
    count === 1 ? 'Check 1 answer' : `Check ${count} answers`;

  protected rateLimitWait(): string {
    const failure = this.failure();
    return failure?.kind === 'rate-limited' ? failure.wait : '';
  }

  protected async signIn(): Promise<void> {
    const { email, password } = this.form.getRawValue();
    this.saving.set(true);
    this.failure.set(null);
    try {
      await this.session.signIn({ email, password, audience: 'customer' });
    } catch (error) {
      const api = ApiError.from(error);
      this.form.controls.password.reset('');
      if (api.status === 422) {
        this.failure.set({ kind: 'refused' });
      } else if (api.status === 429) {
        this.failure.set({ kind: 'rate-limited', wait: waitText(api.retryAfter) });
      } else {
        this.failure.set({ kind: 'unknown' });
      }
      return;
    } finally {
      this.saving.set(false);
    }
    await this.router.navigateByUrl(safeReturnUrl(this.returnUrl()));
  }
}
