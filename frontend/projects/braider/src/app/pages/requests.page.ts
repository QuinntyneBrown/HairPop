import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { BRAIDER_REQUESTS_API, BraiderRequest } from '@hairpop/api';
import { Alert, Button, DialogService, EmptyState, PageHeader, Spinner } from '@hairpop/components';
import { firstValueFrom } from 'rxjs';
import { RespondToRequestDialog } from './respond-to-request.dialog';

@Component({
  selector: 'hp-braider-requests-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, EmptyState, PageHeader, Spinner],
  template: `
    <hp-page-header
      eyebrow="Your bookings"
      heading="Requests"
      subtitle="Reply to customers and keep your schedule current."
    />
    @if (loading()) {
      <hp-spinner label="Loading requests" />
    } @else if (failed()) {
      <hp-alert tone="danger" announce heading="We couldn’t load requests">
        <p>Check your connection and try again.</p>
        <button hp-button slot="actions" type="button" (click)="load()">Try again</button>
      </hp-alert>
    } @else if (!requests().length) {
      <hp-empty-state
        heading="No requests to reply to"
        text="New booking and change requests will appear here."
      />
    } @else {
      <section class="stack" aria-label="Requests">
        @for (request of requests(); track request.reference) {
          <article class="card stack">
            <span class="badge badge--warning">{{
              request.kind === 'change' ? 'Change requested' : 'Awaiting your reply'
            }}</span>
            <h2 class="card__title">
              {{ request.customer.name }} · {{ request.service.toLowerCase() }}
            </h2>
            <dl class="dl">
              <dt>Reference</dt>
              <dd>{{ request.reference }}</dd>
              <dt>Requested time</dt>
              <dd>{{ date(request.start) }} · about {{ request.durationHours }} hours</dd>
              @if (request.previousStart) {
                <dt>Previous time</dt>
                <dd>{{ date(request.previousStart) }}</dd>
              }
              @if (request.estimate) {
                <dt>Estimate</dt>
                <dd>{{ '$' }}{{ request.estimate.min }}–{{ '$' }}{{ request.estimate.max }}</dd>
              }
              <dt>Hair details</dt>
              <dd>{{ request.hairDetails }}</dd>
            </dl>
            <div class="cluster">
              <button hp-button variant="primary" type="button" (click)="respond(request)">
                Respond<span class="visually-hidden"> to {{ request.reference }}</span>
              </button>
            </div>
          </article>
        }
      </section>
    }
  `,
})
export class BraiderRequestsPage {
  private readonly api = inject(BRAIDER_REQUESTS_API);
  private readonly dialogs = inject(DialogService);
  protected readonly requests = signal<readonly BraiderRequest[]>([]);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);

  constructor() {
    afterNextRender(() => void this.load());
  }

  protected date(value: string): string {
    return new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value),
    );
  }

  protected respond(request: BraiderRequest): void {
    this.dialogs
      .open<RespondToRequestDialog, BraiderRequest, boolean>(RespondToRequestDialog, {
        data: request,
      })
      .closed.subscribe((changed) => {
        if (changed) void this.load();
      });
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.failed.set(false);
    try {
      this.requests.set((await firstValueFrom(this.api.list())).data);
    } catch {
      this.failed.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
