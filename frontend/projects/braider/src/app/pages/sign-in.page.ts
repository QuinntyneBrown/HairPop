import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

@Component({
  selector: 'hp-braider-sign-in-page',
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
    TextField,
  ],
  template: `
    <hp-page-header
      eyebrow="HairPop for braiders"
      heading="Sign in to manage your bookings"
      subtitle="For braiders who offer services on HairPop."
    />
    <section hp-card class="form-panel stack" aria-labelledby="form-title">
      <h2 id="form-title">Sign in</h2>
      @if (denied() === '1') {
        <hp-alert tone="warning" heading="This area is for braider accounts">
          <p>Sign in with a braider account to manage bookings.</p>
        </hp-alert>
      }
      @if (failure() === 'not_braider') {
        <hp-alert tone="warning" announce heading="This area is for braider accounts">
          <p>Use a braider account to sign in.</p>
        </hp-alert>
      } @else if (failure()) {
        <hp-alert tone="danger" announce heading="We couldn’t sign you in">
          <p>Check your details and try again.</p>
        </hp-alert>
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
    </section>
  `,
})
export class BraiderSignInPage {
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);
  readonly returnUrl = input<string>();
  readonly denied = input<string>();
  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  protected readonly saving = signal(false);
  protected readonly failure = signal<string | null>(null);
  protected readonly emailMessages = {
    required: 'Enter your email address.',
    email: 'Enter a valid email address.',
  };
  protected readonly passwordMessages = { required: 'Enter your password.' };
  protected readonly summaryTitle = (count: number): string =>
    `Check ${count} answer${count === 1 ? '' : 's'}`;

  protected async signIn(): Promise<void> {
    const { email, password } = this.form.getRawValue();
    this.saving.set(true);
    this.failure.set(null);
    try {
      const user = await this.session.signIn({ email, password, audience: 'braider' });
      if (user.role !== 'braider') {
        this.session.clear();
        this.failure.set('not_braider');
        return;
      }
      const target = this.returnUrl();
      await this.router.navigateByUrl(target && /^\/(?![/\\])/.test(target) ? target : '/requests');
    } catch (error) {
      this.form.controls.password.reset('');
      this.failure.set(ApiError.from(error).code ?? 'unknown');
    } finally {
      this.saving.set(false);
    }
  }
}
