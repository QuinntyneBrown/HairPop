import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APPOINTMENTS_API, AppointmentSummary, Page, dateTime, moneyRange } from '@hairpop/api';
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Spinner,
  TextField,
} from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

type Filter = 'all' | 'upcoming' | 'past';

/** Owned appointment summaries with search and lifecycle filters (L2-018). */
@Component({
  selector: 'hp-appointments-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Badge, Button, Card, EmptyState, PageHeader, RouterLink, Spinner, TextField],
  template: `
    <hp-page-header
      eyebrow="Your HairPop"
      heading="My appointments"
      subtitle="Follow requests and prepare for your visits."
    />
    <div class="stack">
      <form class="cluster" role="search" (submit)="searchFor($event)">
        <label for="appointment-search">Search my appointments</label>
        <input
          hp-text-field
          id="appointment-search"
          type="search"
          [value]="search()"
          (input)="search.set($any($event.target).value)"
        />
        <button hp-button type="submit">Search</button>
      </form>
      <div class="cluster" aria-label="Appointment filter">
        <button
          hp-button
          type="button"
          [variant]="filter() === 'all' ? 'primary' : 'ghost'"
          [attr.aria-pressed]="filter() === 'all'"
          (click)="choose('all')"
        >
          All
        </button>
        <button
          hp-button
          type="button"
          [variant]="filter() === 'upcoming' ? 'primary' : 'ghost'"
          [attr.aria-pressed]="filter() === 'upcoming'"
          (click)="choose('upcoming')"
        >
          Upcoming
        </button>
        <button
          hp-button
          type="button"
          [variant]="filter() === 'past' ? 'primary' : 'ghost'"
          [attr.aria-pressed]="filter() === 'past'"
          (click)="choose('past')"
        >
          Past
        </button>
      </div>
      @if (loading()) {
        <hp-spinner label="Loading appointments" />
      } @else if (failed()) {
        <hp-alert tone="danger" announce heading="We couldn’t load appointments">
          <p>Check your connection and try again.</p>
          <button hp-button slot="actions" type="button" (click)="load()">Try again</button>
        </hp-alert>
      } @else if (result(); as page) {
        @if (!page.data.length) {
          <hp-empty-state
            [heading]="search() ? 'No matching appointments' : 'No appointments yet'"
            [text]="
              search()
                ? 'Try another search or clear it.'
                : 'Explore styles to find your first braider.'
            "
          >
            @if (search()) {
              <button
                hp-button
                variant="primary"
                slot="actions"
                type="button"
                (click)="clearSearch()"
              >
                Clear search
              </button>
            } @else {
              <a hp-button variant="primary" slot="actions" routerLink="/">Explore styles</a>
            }
          </hp-empty-state>
        } @else {
          <div class="stack">
            @for (item of page.data; track item.reference) {
              <article hp-card layout="row" class="stack stack--sm">
                <h2>{{ item.braider.name }} · {{ item.service.toLowerCase() }}</h2>
                <span hp-badge [tone]="item.status === 'confirmed' ? 'success' : 'neutral'">{{
                  status(item.status)
                }}</span>
                <p>
                  {{ date(item.start, item.timeZone) }} ·
                  {{ item.price.kind === 'estimate' ? 'Estimate' : 'Agreed' }}
                  {{ price(item.price) }}
                </p>
                <a hp-button [routerLink]="['/appointments', item.reference]"
                  >View details {{ item.reference }}</a
                >
              </article>
            }
          </div>
          @if (page.meta.lastPage > 1) {
            <nav class="cluster" aria-label="Appointment pages">
              <button
                hp-button
                type="button"
                [disabled]="page.meta.page <= 1 || loading()"
                (click)="load(page.meta.page - 1)"
              >
                Previous page
              </button>
              <span>Page {{ page.meta.page }} of {{ page.meta.lastPage }}</span>
              <button
                hp-button
                type="button"
                [disabled]="page.meta.page >= page.meta.lastPage || loading()"
                (click)="load(page.meta.page + 1)"
              >
                Next page
              </button>
            </nav>
          }
        }
      }
    </div>
  `,
})
export class AppointmentsPage {
  private readonly api = inject(APPOINTMENTS_API);
  protected readonly filter = signal<Filter>('all');
  protected readonly search = signal('');
  protected readonly result = signal<Page<AppointmentSummary> | null>(null);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly date = dateTime;
  protected readonly price = moneyRange;

  constructor() {
    afterNextRender(() => void this.load());
  }

  protected status(status: AppointmentSummary['status']): string {
    return {
      awaiting_reply: 'Awaiting reply',
      confirmed: 'Confirmed',
      declined: 'Declined',
      cancelled: 'Cancelled',
      completed: 'Completed',
    }[status];
  }

  protected choose(filter: Filter): void {
    this.filter.set(filter);
    void this.load(1);
  }

  protected searchFor(event: Event): void {
    event.preventDefault();
    void this.load(1);
  }

  protected clearSearch(): void {
    this.search.set('');
    void this.load(1);
  }

  protected async load(pageNumber = 1): Promise<void> {
    this.loading.set(true);
    this.failed.set(false);
    try {
      this.result.set(
        await firstValueFrom(this.api.list(this.filter(), this.search(), pageNumber)),
      );
    } catch {
      this.failed.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
