import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ACCOUNT_API, Account, ApiError } from '@hairpop/api';
import {
  Alert,
  Button,
  Card,
  DialogService,
  EmptyState,
  FormActions,
  FormField,
  FormLayout,
  PageHeader,
  Spinner,
  TextField,
} from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

import { SignOutDialog } from './sign-out.dialog';

/** Customer-owned contact details and explicit sign-out (L2-011, L2-014). */
@Component({
  selector: 'hp-account-settings-page',
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
    Spinner,
    TextField,
  ],
  template: `
    <hp-page-header
      eyebrow="Your HairPop"
      heading="Account settings"
      subtitle="Keep your contact details current so braiders can reach you."
    >
      <button hp-button slot="actions" type="button" (click)="openSignOut()">Sign out</button>
    </hp-page-header>
    @if (loading()) {
      <hp-spinner label="Loading your account" />
    } @else if (loadFailed()) {
      <hp-empty-state
        heading="We couldn’t load your details"
        text="Check your connection and try again."
      >
        <button hp-button variant="primary" slot="actions" type="button" (click)="load()">
          Try again
        </button>
      </hp-empty-state>
    } @else if (saved(); as account) {
      <hp-empty-state
        heading="Your changes are saved"
        [text]="
          account.pendingEmail
            ? 'Check ' + account.pendingEmail + ' to verify your new email address.'
            : 'Your contact details are up to date.'
        "
      >
        <button hp-button variant="primary" slot="actions" type="button" (click)="editAgain()">
          Edit details
        </button>
      </hp-empty-state>
    } @else {
      <section hp-card class="form-panel stack" aria-labelledby="form-title">
        <h2 id="form-title">Your details</h2>
        @if (failure()) {
          <hp-alert tone="danger" announce heading="We couldn’t save your changes"
            ><p>Check your connection and try again. Your entries are still here.</p></hp-alert
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
            label="Name"
            [errorMessages]="nameMessages"
            [error]="serverErrors().name"
          >
            <input hp-text-field type="text" formControlName="name" autocomplete="name" />
          </div>
          <div
            hp-form-field
            label="Email"
            hint="If you change it, we’ll ask you to verify the new address."
            [errorMessages]="emailMessages"
            [error]="serverErrors().email"
          >
            <input hp-text-field type="email" formControlName="email" autocomplete="email" />
          </div>
          <div hp-form-field label="Phone (optional)" [error]="serverErrors().phone">
            <input hp-text-field type="tel" formControlName="phone" autocomplete="tel" />
          </div>
          <div hp-form-actions>
            <button hp-button variant="primary" type="submit" [busy]="saving()">
              Save changes
            </button>
          </div>
        </form>
      </section>
    }
  `,
})
export class AccountSettingsPage {
  private readonly api = inject(ACCOUNT_API);
  private readonly dialogs = inject(DialogService);
  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { nonNullable: true }),
  });
  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);
  protected readonly saving = signal(false);
  protected readonly failure = signal(false);
  protected readonly saved = signal<Account | null>(null);
  protected readonly serverErrors = signal<{ name?: string; email?: string; phone?: string }>({});
  protected readonly nameMessages = { required: 'Enter your name.' };
  protected readonly emailMessages = {
    required: 'Enter your email address.',
    email: 'Enter a full email address, like name@example.com.',
  };
  protected readonly summaryTitle = (count: number): string =>
    count === 1 ? 'Check 1 answer' : `Check ${count} answers`;

  constructor() {
    afterNextRender(() => void this.load());
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.loadFailed.set(false);
    try {
      const account = await firstValueFrom(this.api.get());
      this.form.setValue({
        name: account.name,
        email: account.pendingEmail ?? account.email,
        phone: account.phone ?? '',
      });
    } catch {
      this.loadFailed.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  protected async save(): Promise<void> {
    this.saving.set(true);
    this.failure.set(false);
    this.serverErrors.set({});
    const details = this.form.getRawValue();
    try {
      const account = await firstValueFrom(
        this.api.update({ ...details, phone: details.phone.trim() || null }),
      );
      this.saved.set(account);
    } catch (error) {
      const api = ApiError.from(error);
      if (api.status === 422)
        this.serverErrors.set({
          name: api.field('name') ?? undefined,
          email: api.field('email') ?? undefined,
          phone: api.field('phone') ?? undefined,
        });
      else this.failure.set(true);
    } finally {
      this.saving.set(false);
    }
  }

  protected editAgain(): void {
    this.saved.set(null);
  }

  protected openSignOut(): void {
    this.dialogs.open(SignOutDialog, { variant: 'destructive' });
  }
}
