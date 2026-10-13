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
import { APPOINTMENTS_API, ApiError, CareDetail, idempotencyKey } from '@hairpop/api';
import {
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
  Spinner,
  Textarea,
} from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

import { ForbiddenPage } from '../errors/forbidden.page';

/** Post-visit guidance and one review for an owned completed visit (L2-024, L2-025). */
@Component({
  selector: 'hp-care-and-review-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Alert,
    Button,
    Card,
    EmptyState,
    ForbiddenPage,
    FormActions,
    FormField,
    FormLayout,
    PageHeader,
    Radio,
    RadioGroup,
    ReactiveFormsModule,
    RouterLink,
    Spinner,
    Textarea,
  ],
  template: `
    @if (forbidden()) {
      <hp-forbidden-page />
    } @else if (loading()) {
      <hp-page-header eyebrow="Your HairPop" heading="Care and review" />
      <hp-spinner label="Loading care guidance" />
    } @else if (care(); as visit) {
      <hp-page-header
        eyebrow="After your visit"
        [heading]="'Care for your ' + visit.service.toLowerCase()"
        [subtitle]="visit.braider.name + ' · ' + visit.date"
      />
      @if (posted()) {
        <hp-empty-state
          [heading]="
            posted() === 'published' ? 'Your review is posted' : 'Your review is held for checks'
          "
          text="Thanks for helping other customers choose with confidence."
        >
          <a
            hp-button
            variant="primary"
            slot="actions"
            [routerLink]="['/appointments', visit.reference]"
            >View appointment</a
          >
        </hp-empty-state>
      } @else {
        <div class="detail-grid">
          <section hp-card class="stack" aria-labelledby="care-title">
            <h2 id="care-title">Care guidance from {{ visit.braider.name.split(' ')[0] }}</h2>
            @if (visit.guidance; as guidance) {
              <ul>
                @for (item of guidance.items; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
              <p class="text-muted">Source: {{ guidance.source }}</p>
            } @else {
              <p>Care guidance isn’t available for this visit.</p>
            }
          </section>
          <section hp-card class="stack" aria-labelledby="review-title">
            <h2 id="review-title">Review your visit</h2>
            @if (visit.review === 'open') {
              @if (failure()) {
                <hp-alert tone="danger" announce heading="We couldn’t post your review"
                  ><p>{{ failure() }}</p></hp-alert
                >
              }
              <form
                hp-form-layout
                [formGroup]="form"
                [busy]="saving()"
                [summaryTitle]="summaryTitle"
                (submitted)="submit()"
              >
                <fieldset
                  hp-form-field
                  label="Your rating"
                  [errorMessages]="ratingMessages"
                  [error]="serverErrors().rating"
                >
                  <hp-radio-group orientation="horizontal" formControlName="rating">
                    @for (star of ratings; track star) {
                      <label hp-radio [value]="String(star)"
                        >{{ star }}{{ star === 5 ? ' (excellent)' : '' }}</label
                      >
                    }
                  </hp-radio-group>
                </fieldset>
                <div
                  hp-form-field
                  label="Your review"
                  [errorMessages]="textMessages"
                  [error]="serverErrors().text"
                >
                  <textarea hp-textarea formControlName="text" rows="5"></textarea>
                </div>
                <div hp-form-actions>
                  <button hp-button variant="primary" type="submit" [busy]="saving()">
                    Post review
                  </button>
                </div>
              </form>
            } @else if (visit.review === 'submitted') {
              <p>Your review was submitted for this visit.</p>
            } @else {
              <p>Reviews open after a completed visit.</p>
            }
          </section>
        </div>
      }
    } @else {
      <hp-page-header eyebrow="Your HairPop" heading="Care and review" />
      <hp-empty-state
        variant="error"
        heading="We couldn’t load this visit"
        text="Check your connection and try again."
      >
        <button hp-button variant="primary" slot="actions" type="button" (click)="load()">
          Try again
        </button>
      </hp-empty-state>
    }
  `,
})
export class CareAndReviewPage {
  private readonly api = inject(APPOINTMENTS_API);
  readonly ref = input.required<string>();
  protected readonly care = signal<CareDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly forbidden = signal(false);
  protected readonly saving = signal(false);
  protected readonly posted = signal<'published' | 'pending' | null>(null);
  protected readonly failure = signal<string | null>(null);
  protected readonly serverErrors = signal<{ rating?: string; text?: string }>({});
  protected readonly form = new FormGroup({
    rating: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    text: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(1000)],
    }),
  });
  protected readonly ratings = [1, 2, 3, 4, 5];
  protected readonly String = String;
  protected readonly ratingMessages = { required: 'Choose a rating from 1 to 5 stars.' };
  protected readonly textMessages = {
    required: 'Tell others how your visit went.',
    maxlength: 'Use at most 1,000 characters.',
  };
  protected readonly summaryTitle = (count: number): string =>
    count === 1 ? 'Check 1 answer' : `Check ${count} answers`;
  private attemptKey: string | null = null;

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.attemptKey = null;
      this.serverErrors.set({});
    });
    afterNextRender(() => void this.load());
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.care.set(await firstValueFrom(this.api.care(this.ref())));
    } catch (error) {
      if (ApiError.from(error).status === 404) this.forbidden.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  protected async submit(): Promise<void> {
    if (this.saving()) return;
    const { rating, text } = this.form.getRawValue();
    this.attemptKey ??= idempotencyKey();
    this.saving.set(true);
    this.failure.set(null);
    this.serverErrors.set({});
    try {
      const result = await firstValueFrom(
        this.api.submitReview(
          this.ref(),
          { rating: Number(rating), text: text.trim() },
          this.attemptKey,
        ),
      );
      this.posted.set(result.status);
    } catch (error) {
      const api = ApiError.from(error);
      if (api.status === 422)
        this.serverErrors.set({
          rating: api.field('rating') ?? undefined,
          text: api.field('text') ?? undefined,
        });
      else if (api.code === 'already_reviewed')
        this.failure.set('This visit has already been reviewed.');
      else
        this.failure.set(
          'Check your connection and try again. Your rating and review are still here.',
        );
    } finally {
      this.saving.set(false);
    }
  }
}
