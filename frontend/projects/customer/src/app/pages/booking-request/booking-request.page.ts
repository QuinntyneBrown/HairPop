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
import {
  BOOKING_API,
  BookingOptions,
  BookingRequest,
  dateTime,
  idempotencyKey,
  money,
} from '@hairpop/api';
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
  Radio,
  RadioGroup,
  Spinner,
  TextField,
  Textarea,
} from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

import { RequestReviewDialog, ReviewResult } from './request-review.dialog';

/** Choose a current service and time, review terms, and send one pending request. */
@Component({
  selector: 'hp-booking-request-page',
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
    Radio,
    RadioGroup,
    ReactiveFormsModule,
    RouterLink,
    Spinner,
    TextField,
    Textarea,
  ],
  template: `
    <hp-page-header
      eyebrow="Your HairPop"
      heading="Request your appointment"
      subtitle="Choose an offered time and share the details your braider needs."
    />
    @if (reference(); as ref) {
      <hp-empty-state
        [heading]="'Request ' + ref + ' sent to ' + firstName()"
        text="Awaiting reply. Your time and estimate are not confirmed until the braider accepts."
      >
        <a hp-button variant="primary" slot="actions" [routerLink]="['/appointments', ref]"
          >View request</a
        >
      </hp-empty-state>
    } @else if (loading()) {
      <hp-spinner label="Loading booking options" />
    } @else if (loadFailed()) {
      <hp-empty-state
        variant="error"
        heading="We couldn’t load booking choices"
        text="Check your connection and try again."
      >
        <button hp-button variant="primary" slot="actions" type="button" (click)="load()">
          Try again
        </button>
      </hp-empty-state>
    } @else if (options(); as choices) {
      @if (!choices.services.length || !choices.slots.length) {
        <hp-empty-state
          heading="No times to request right now"
          text="Check back later or explore another braider."
        >
          <a hp-button variant="primary" slot="actions" routerLink="/braiders">Explore braiders</a>
        </hp-empty-state>
      } @else {
        <section hp-card class="form-panel stack" aria-labelledby="form-title">
          <h2 id="form-title">Your request</h2>
          @if (conflict()) {
            <hp-alert tone="warning" announce heading="Booking choices changed"
              ><p>{{ conflict() }}</p></hp-alert
            >
          }
          <form
            hp-form-layout
            [formGroup]="form"
            [summaryTitle]="summaryTitle"
            (submitted)="review()"
          >
            <fieldset
              hp-form-field
              label="Service"
              [errorMessages]="serviceMessages"
              [error]="serverErrors().serviceId"
            >
              <hp-radio-group cards formControlName="serviceId">
                @for (service of choices.services; track service.id) {
                  <label
                    hp-radio
                    [value]="service.id"
                    [description]="
                      'From ' +
                      price(service.startingPrice) +
                      ' · about ' +
                      service.typicalHours +
                      ' hours'
                    "
                    >{{ service.name }}</label
                  >
                }
              </hp-radio-group>
            </fieldset>
            <fieldset
              hp-form-field
              label="Offered time"
              [errorMessages]="timeMessages"
              [error]="serverErrors().slotId"
            >
              <hp-radio-group cards formControlName="slotId">
                @for (slot of choices.slots; track slot.id) {
                  <label
                    hp-radio
                    [value]="slot.id"
                    [description]="'Offered by ' + choices.braider.name.split(' ')[0]"
                    >{{ date(slot.start, choices.timeZone) }}</label
                  >
                }
              </hp-radio-group>
            </fieldset>
            <div
              hp-form-field
              label="Your email"
              [errorMessages]="emailMessages"
              [error]="serverErrors().email"
            >
              <input hp-text-field type="email" formControlName="email" autocomplete="email" />
            </div>
            <div hp-form-field label="Phone (optional)" [error]="serverErrors().phone">
              <input hp-text-field type="tel" formControlName="phone" autocomplete="tel" />
            </div>
            <div
              hp-form-field
              label="Hair details"
              [errorMessages]="hairMessages"
              [error]="serverErrors().hairDetails"
            >
              <textarea hp-textarea formControlName="hairDetails" rows="4"></textarea>
            </div>
            <div hp-form-actions>
              <button hp-button variant="primary" type="submit">Review request</button>
            </div>
          </form>
        </section>
      }
    }
  `,
})
export class BookingRequestPage {
  private readonly api = inject(BOOKING_API);
  private readonly dialogs = inject(DialogService);
  readonly braiderSlug = input.required<string>();
  readonly service = input<string>();
  protected readonly options = signal<BookingOptions | null>(null);
  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);
  protected readonly conflict = signal<string | null>(null);
  protected readonly serverErrors = signal<{
    serviceId?: string;
    slotId?: string;
    email?: string;
    phone?: string;
    hairDetails?: string;
  }>({});
  protected readonly reference = signal<string | null>(null);
  protected readonly form = new FormGroup({
    serviceId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    slotId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { nonNullable: true }),
    hairDetails: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(500)],
    }),
  });
  protected readonly serviceMessages = { required: 'Choose a service.' };
  protected readonly timeMessages = { required: 'Choose one of the offered times.' };
  protected readonly emailMessages = {
    required: 'Enter your email address.',
    email: 'Enter a full email address, like name@example.com.',
  };
  protected readonly hairMessages = {
    required: 'Describe your hair, for example its length and whether you’re bringing extensions.',
    maxlength: 'Use at most 500 characters.',
  };
  protected readonly summaryTitle = (count: number): string =>
    count === 1 ? 'Check 1 answer' : `Check ${count} answers`;
  protected readonly date = dateTime;
  protected readonly price = money;
  private attemptKey: string | null = null;

  protected firstName(): string {
    return this.options()?.braider.name.split(' ')[0] ?? 'your braider';
  }

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.attemptKey = null;
      this.conflict.set(null);
      this.serverErrors.set({});
    });
    afterNextRender(() => void this.load());
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.loadFailed.set(false);
    try {
      const options = await firstValueFrom(this.api.options(this.braiderSlug()));
      this.options.set(options);
      this.form.patchValue(
        {
          serviceId: options.services.some((item) => item.id === this.form.controls.serviceId.value)
            ? this.form.controls.serviceId.value
            : (options.services.find((item) => item.id === this.service())?.id ?? ''),
          slotId: options.slots.some((item) => item.id === this.form.controls.slotId.value)
            ? this.form.controls.slotId.value
            : '',
          email: this.form.controls.email.value || options.contact.email,
          phone: this.form.controls.phone.value || options.contact.phone || '',
        },
        { emitEvent: false },
      );
    } catch {
      this.loadFailed.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  protected review(): void {
    const options = this.options();
    if (!options) return;
    const values = this.form.getRawValue();
    const request: BookingRequest = {
      braiderSlug: options.braider.slug,
      serviceId: values.serviceId,
      slotId: values.slotId,
      email: values.email,
      phone: values.phone.trim() || null,
      hairDetails: values.hairDetails.trim(),
      policyVersion: options.policy.version,
    };
    this.attemptKey ??= idempotencyKey();
    this.dialogs
      .open<
        RequestReviewDialog,
        { options: BookingOptions; request: BookingRequest; idempotencyKey: string },
        ReviewResult
      >(RequestReviewDialog, {
        variant: 'confirmation',
        data: { options, request, idempotencyKey: this.attemptKey },
      })
      .closed.subscribe((result) => {
        if (!result) return;
        if ('reference' in result) this.reference.set(result.reference);
        else if ('validation' in result) {
          const errors = result.validation;
          this.serverErrors.set({
            serviceId: errors['serviceId']?.[0],
            slotId: errors['slotId']?.[0],
            email: errors['email']?.[0],
            phone: errors['phone']?.[0],
            hairDetails: errors['hairDetails']?.[0],
          });
        } else {
          this.attemptKey = null;
          this.conflict.set(
            result.conflict === 'terms_changed'
              ? 'The braider’s terms changed. Review the current terms before sending.'
              : 'That service or time is no longer offered. Choose another.',
          );
          void this.load();
        }
      });
  }
}
