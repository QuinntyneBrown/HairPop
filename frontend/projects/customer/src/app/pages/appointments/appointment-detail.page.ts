import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  APPOINTMENTS_API,
  ApiError,
  AppointmentDetail,
  AppointmentSummary,
  SessionStore,
  dateTime,
  moneyRange,
} from '@hairpop/api';
import {
  Alert,
  Button,
  Card,
  DescriptionList,
  DialogService,
  EmptyState,
  PageHeader,
  Spinner,
} from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

import { ForbiddenPage } from '../errors/forbidden.page';
import { CancelAppointmentDialog } from './cancel-appointment.dialog';
import { ChangeAppointmentDialog } from './change-appointment.dialog';

type CachedSummary = AppointmentSummary & { readonly updatedAt: string };

/** Owner-only lifecycle detail; the API decides which private facts may be disclosed. */
@Component({
  selector: 'hp-appointment-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Alert,
    Button,
    Card,
    DescriptionList,
    EmptyState,
    ForbiddenPage,
    PageHeader,
    RouterLink,
    Spinner,
  ],
  template: `
    @if (forbidden()) {
      <hp-forbidden-page />
    } @else if (loading()) {
      <hp-page-header eyebrow="Your HairPop" heading="Loading appointment" />
      <hp-spinner label="Loading appointment" />
    } @else if (detail(); as appointment) {
      <hp-page-header
        eyebrow="Your HairPop"
        [heading]="'Your appointment with ' + firstName(appointment.braider.name)"
        [subtitle]="'Request ' + appointment.reference"
      />
      <div class="detail-grid">
        <section hp-card class="stack" aria-labelledby="appointment-title">
          <h2 id="appointment-title">
            {{ appointment.service }} with {{ appointment.braider.name }}
          </h2>
          <p>
            <strong>{{ status(appointment.status) }}</strong>
          </p>
          @if (appointment.status === 'awaiting_reply') {
            <hp-alert tone="info" heading="Awaiting reply"
              ><p>
                Your time, price and location are not confirmed until
                {{ appointment.braider.name }} accepts.
              </p></hp-alert
            >
          }
          @if (appointment.unavailable.length) {
            <hp-alert tone="warning" heading="Some details are unavailable"
              ><p>
                Preparation guidance is unavailable. The appointment facts below are current.
              </p></hp-alert
            >
          }
          @if (repeatFailure()) {
            <hp-alert tone="warning" announce heading="This service is no longer offered"
              ><p>Choose from {{ appointment.braider.name }}’s current services.</p>
              <a slot="actions" [routerLink]="['/braiders', appointment.braider.slug]"
                >View current services</a
              ></hp-alert
            >
          }
          <dl hp-description-list>
            <dt>Reference</dt>
            <dd>{{ appointment.reference }}</dd>
            <dt>When</dt>
            <dd>{{ date(appointment.start, appointment.timeZone) }}</dd>
            <dt>Duration</dt>
            <dd>About {{ appointment.durationHours }} hours</dd>
            <dt>Price</dt>
            <dd>
              {{ appointment.price.kind === 'estimate' ? 'Estimate' : 'Agreed amount' }}
              {{ price(appointment.price) }}
            </dd>
            <dt>Area</dt>
            <dd>{{ appointment.location.area }}</dd>
            @if (appointment.location.address; as address) {
              <dt>Studio address</dt>
              <dd>{{ address }}</dd>
            }
            <dt>Contact</dt>
            <dd>
              {{ appointment.contact.email
              }}{{ appointment.contact.phone ? ' · ' + appointment.contact.phone : '' }}
            </dd>
            <dt>Changes</dt>
            <dd>{{ appointment.policy.changes || 'Ask your braider about changes.' }}</dd>
            <dt>Cancellation</dt>
            <dd>{{ appointment.policy.cancellation || 'Ask your braider about cancellation.' }}</dd>
            @if (appointment.pendingChange; as change) {
              <dt>Proposed new time</dt>
              <dd>{{ date(change.start, appointment.timeZone) }} · awaiting reply</dd>
            }
          </dl>
          <a hp-button routerLink="/appointments">All appointments</a>
          @if (appointment.allowed.cancel) {
            <button
              hp-button
              variant="danger"
              type="button"
              (click)="openCancellation(appointment)"
            >
              Cancel request
            </button>
          }
          @if (appointment.allowed.change) {
            <button hp-button type="button" (click)="openChange(appointment)">
              Request a change
            </button>
          }
          @if (appointment.allowed.rebook) {
            <button hp-button type="button" (click)="bookAgain(appointment)">Book again</button>
          }
          @if (appointment.status === 'completed') {
            <a hp-button [routerLink]="['/appointments', appointment.reference, 'care']"
              >Care and review</a
            >
          }
        </section>
        <aside hp-card class="stack" aria-labelledby="prepare-title">
          <h2 id="prepare-title">Prepare for your visit</h2>
          @if (appointment.preparation?.length) {
            <ul>
              @for (step of appointment.preparation; track step) {
                <li>{{ step }}</li>
              }
            </ul>
          } @else {
            <p>Preparation guidance isn’t available for this visit.</p>
          }
        </aside>
      </div>
    } @else if (cached(); as saved) {
      <hp-page-header
        eyebrow="Your HairPop"
        heading="Last saved summary"
        [subtitle]="'Request ' + saved.reference"
      />
      <hp-alert tone="warning" heading="This summary may be out of date">
        <p>
          Updated {{ date(saved.updatedAt, saved.timeZone) }}. Connect again for current details and
          actions.
        </p>
      </hp-alert>
      <section hp-card class="stack" aria-label="Saved appointment summary">
        <h2>{{ saved.service }} with {{ saved.braider.name }}</h2>
        <p>{{ status(saved.status) }} · {{ date(saved.start, saved.timeZone) }}</p>
        <p>
          {{ saved.price.kind === 'estimate' ? 'Estimate' : 'Agreed amount' }}
          {{ price(saved.price) }}
        </p>
        <button hp-button type="button" (click)="load()">Try again</button>
      </section>
    } @else {
      <hp-page-header eyebrow="Your HairPop" heading="Your appointment" />
      <hp-empty-state
        variant="error"
        heading="We couldn’t load this appointment"
        text="Check your connection and try again."
      >
        <button hp-button variant="primary" slot="actions" type="button" (click)="load()">
          Try again
        </button>
      </hp-empty-state>
    }
  `,
})
export class AppointmentDetailPage {
  private readonly api = inject(APPOINTMENTS_API);
  private readonly dialogs = inject(DialogService);
  private readonly router = inject(Router);
  private readonly session = inject(SessionStore);
  readonly ref = input.required<string>();
  protected readonly detail = signal<AppointmentDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly forbidden = signal(false);
  protected readonly repeatFailure = signal(false);
  protected readonly cached = signal<CachedSummary | null>(null);
  protected readonly date = dateTime;
  protected readonly price = moneyRange;

  constructor() {
    afterNextRender(() => void this.load());
  }

  protected firstName(name: string): string {
    return name.split(' ')[0];
  }

  protected status(status: AppointmentDetail['status']): string {
    return {
      awaiting_reply: 'Awaiting reply',
      confirmed: 'Confirmed',
      declined: 'Declined',
      cancelled: 'Cancelled',
      completed: 'Completed',
    }[status];
  }

  protected openCancellation(appointment: AppointmentDetail): void {
    this.dialogs
      .open<CancelAppointmentDialog, AppointmentDetail, boolean>(CancelAppointmentDialog, {
        variant: 'destructive',
        data: appointment,
      })
      .closed.subscribe((cancelled) => {
        if (cancelled) void this.load();
      });
  }

  protected openChange(appointment: AppointmentDetail): void {
    this.dialogs
      .open<ChangeAppointmentDialog, AppointmentDetail, boolean>(ChangeAppointmentDialog, {
        data: appointment,
      })
      .closed.subscribe((changed) => {
        if (changed) void this.load();
      });
  }

  protected async bookAgain(appointment: AppointmentDetail): Promise<void> {
    this.repeatFailure.set(false);
    try {
      const choice = await firstValueFrom(this.api.repeatBooking(appointment.reference));
      await this.router.navigate(['/book', choice.braiderSlug], {
        queryParams: { service: choice.serviceId },
      });
    } catch {
      this.repeatFailure.set(true);
    }
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.forbidden.set(false);
    try {
      const detail = await firstValueFrom(this.api.detail(this.ref()));
      this.detail.set(detail);
      this.cached.set(null);
      this.remember(detail);
    } catch (error) {
      this.detail.set(null);
      if (ApiError.from(error).status === 404) this.forbidden.set(true);
      else this.cached.set(this.lastSaved());
    } finally {
      this.loading.set(false);
    }
  }

  private cacheKey(): string | null {
    const id = this.session.user()?.id;
    return id ? `hp-appointment-summary-${id}-${this.ref()}` : null;
  }

  private remember(detail: AppointmentDetail): void {
    const key = this.cacheKey();
    if (!key) return;
    const summary: CachedSummary = {
      reference: detail.reference,
      status: detail.status,
      service: detail.service,
      braider: detail.braider,
      start: detail.start,
      timeZone: detail.timeZone,
      price: detail.price,
      updatedAt: detail.updatedAt,
    };
    try {
      sessionStorage.setItem(key, JSON.stringify(summary));
    } catch {
      /* Storage unavailable. */
    }
  }

  private lastSaved(): CachedSummary | null {
    const key = this.cacheKey();
    if (!key) return null;
    try {
      const value = sessionStorage.getItem(key);
      return value ? (JSON.parse(value) as CachedSummary) : null;
    } catch {
      return null;
    }
  }
}
