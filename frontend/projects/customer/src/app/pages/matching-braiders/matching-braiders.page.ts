import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiError, BraiderMatch, MATCHING_API, MatchQuery, money, shortDate } from '@hairpop/api';
import {
  Alert,
  Button,
  Card,
  Chip,
  ChipRow,
  DialogService,
  EmptyState,
  FormLayout,
  Icon,
  PageHeader,
  Pagination,
  RatingSummary,
  SearchBox,
  SkeletonGroup,
  TextField,
} from '@hairpop/components';

import {
  FilterBraidersData,
  FilterBraidersDialog,
  FilterBraidersResult,
} from './filter-braiders.dialog';

type View = 'loading' | 'error' | 'offline' | 'empty' | 'no-results' | 'results';

/** Distances the API accepts, in km. */
const DISTANCES: readonly number[] = [5, 10, 25];

/** "Nia Okafor" → "Nia’s". */
function possessiveFirstName(name: string): string {
  return `${name.split(' ')[0]}’s`;
}

/** MatchingBraidersPage (docs/detailed-designs/matching/find-braiders-for-style). */
@Component({
  selector: 'hp-matching-braiders-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Alert,
    Button,
    Card,
    Chip,
    ChipRow,
    EmptyState,
    FormLayout,
    Icon,
    PageHeader,
    Pagination,
    RatingSummary,
    ReactiveFormsModule,
    RouterLink,
    SearchBox,
    SkeletonGroup,
    TextField,
  ],
  template: `
    <hp-page-header eyebrow="Discover" [heading]="heading()" [subtitle]="subtitle()" />
    <div class="stack">
      <form
        hp-form-layout
        layout="inline"
        role="search"
        [formGroup]="form"
        (submitted)="applySearch()"
      >
        <div hp-search-box grow>
          <svg hp-icon name="search"></svg>
          <input
            hp-text-field
            type="search"
            formControlName="q"
            aria-label="Search matching braiders"
            enterkeyhint="search"
          />
        </div>
        <button hp-button type="button" aria-haspopup="dialog" (click)="openFilters()">
          Filters
        </button>
      </form>

      @if (activeFilters().length) {
        <hp-chip-row aria-label="Active filters">
          @for (filter of activeFilters(); track filter) {
            <span hp-chip>{{ filter }}</span>
          }
        </hp-chip-row>
      }

      <p class="visually-hidden" role="status">{{ statusText() }}</p>
      @switch (view()) {
        @case ('loading') {
          <section class="feature-grid" [attr.aria-label]="heading()" aria-busy="true">
            <hp-skeleton-group
              [label]="'Loading ' + heading().toLowerCase()"
              pattern="story-card"
              [count]="3"
              slowMessage="Still loading braiders…"
              retryLabel="Try again"
              (retried)="matches.reload()"
            />
          </section>
        }
        @case ('offline') {
          <hp-alert tone="warning" heading="You’re offline">
            <p>Braider results need a connection. Connect and try again.</p>
            <button hp-button slot="actions" type="button" (click)="matches.reload()">
              Try again
            </button>
          </hp-alert>
        }
        @case ('error') {
          <hp-empty-state
            variant="error"
            heading="We couldn’t load braiders"
            text="Check your connection and try again. Nothing you entered was lost."
          >
            <svg hp-icon slot="icon" name="alert-circle"></svg>
            <button
              hp-button
              variant="primary"
              slot="actions"
              type="button"
              (click)="matches.reload()"
            >
              Try again
            </button>
          </hp-empty-state>
        }
        @case ('empty') {
          <hp-empty-state [heading]="emptyHeading()" [text]="emptyText()">
            <svg hp-icon slot="icon" name="sparkle"></svg>
            <a hp-button variant="primary" slot="actions" routerLink="/">Explore styles</a>
          </hp-empty-state>
        }
        @case ('no-results') {
          <hp-empty-state heading="No matches" [text]="noResultsText()">
            <svg hp-icon slot="icon" name="search"></svg>
            <button
              hp-button
              variant="primary"
              slot="actions"
              type="button"
              (click)="clearFilters()"
            >
              Clear filters
            </button>
          </hp-empty-state>
        }
        @case ('results') {
          <section class="feature-grid" [attr.aria-label]="heading()">
            @for (match of results(); track match.braider.slug) {
              <article hp-card layout="story">
                @if (match.braider.photo; as photo) {
                  <img class="story-card__photo" [src]="photo.src" [alt]="photo.alt" />
                } @else {
                  <div class="story-card__art" aria-hidden="true">
                    <svg hp-icon name="sparkle" size="lg"></svg>
                  </div>
                }
                <div class="stack">
                  <p class="eyebrow">{{ availability(match) }}</p>
                  <h2 class="card__title">{{ match.braider.name }}</h2>
                  <span
                    hp-rating-summary
                    [value]="match.rating?.average ?? null"
                    [count]="match.rating?.count ?? 0"
                  ></span>
                  <p class="text-muted">{{ serviceLine(match) }}</p>
                  <a [routerLink]="['/braiders', match.braider.slug]"
                    >View {{ firstName(match.braider.name) }} profile
                    <span aria-hidden="true">→</span></a
                  >
                </div>
              </article>
            }
          </section>
          <hp-pagination
            label="Results pages"
            [page]="currentPage()"
            [pageCount]="pageCount()"
            [summary]="summary()"
            previousLabel="Previous"
            nextLabel="Next"
          />
        }
      }
    </div>
  `,
})
export class MatchingBraidersPage {
  private readonly api = inject(MATCHING_API);
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);

  /** Route parameter; absent on `/braiders`. */
  readonly slug = input<string>();
  /** Query parameters. */
  readonly q = input<string>();
  readonly maxPrice = input<string>();
  readonly distanceKm = input<string>();
  readonly page = input<string>();

  protected readonly form = new FormGroup({ q: new FormControl('', { nonNullable: true }) });

  protected readonly firstName = possessiveFirstName;

  /** A price in the address counts only when it is a whole number of dollars above zero. */
  private readonly appliedMaxPrice = computed(() => {
    const value = Number(this.maxPrice());
    return Number.isInteger(value) && value > 0 ? value : null;
  });
  private readonly appliedDistance = computed(() => {
    const value = Number(this.distanceKm());
    return DISTANCES.includes(value) ? value : null;
  });

  private readonly query = computed<MatchQuery>(() => ({
    style: this.slug() ?? null,
    search: this.q()?.trim() || null,
    maxPrice: this.appliedMaxPrice(),
    distanceKm: this.appliedDistance(),
    page: Math.max(1, Number(this.page()) || 1),
  }));

  protected readonly matches = rxResource({
    params: () => this.query(),
    stream: ({ params }) => this.api.find(params),
  });

  protected readonly results = computed(() =>
    this.matches.hasValue() ? this.matches.value().data : [],
  );
  private readonly meta = computed(() =>
    this.matches.hasValue() ? this.matches.value().meta : null,
  );
  protected readonly currentPage = computed(() => this.meta()?.page ?? 1);
  protected readonly pageCount = computed(() => this.meta()?.lastPage ?? 1);
  protected readonly summary = computed(() => {
    const meta = this.meta();
    if (!meta) return '';
    const first = (meta.page - 1) * meta.perPage + 1;
    return `Showing ${first}–${Math.min(meta.total, meta.page * meta.perPage)} of ${meta.total}`;
  });

  private readonly styleName = computed(() => {
    const slug = this.slug();
    if (!slug) return null;
    return this.meta()?.style?.name ?? slug.replace(/-/g, ' ');
  });

  protected readonly heading = computed(() => {
    const style = this.styleName();
    return style ? `Braiders for ${style.toLowerCase()}` : 'Braiders near Toronto';
  });

  protected readonly subtitle = computed(() => {
    const meta = this.meta();
    if (!meta || !this.styleName()) return 'Prices and availability vary.';
    const noun = meta.total === 1 ? 'braider offers' : 'braiders offer';
    return `${meta.total} ${noun} this style near Toronto · prices and availability vary.`;
  });

  protected readonly view = computed<View>(() => {
    if (this.matches.isLoading()) return 'loading';
    if (this.matches.status() === 'error') {
      return ApiError.from(this.matches.error()).offline ? 'offline' : 'error';
    }
    if (this.results().length) return 'results';
    return this.hasCriteria() ? 'no-results' : 'empty';
  });

  protected readonly statusText = computed(() => {
    switch (this.view()) {
      case 'results': {
        const total = this.meta()?.total ?? 0;
        return `${total} ${total === 1 ? 'braider' : 'braiders'}`;
      }
      case 'no-results':
        return 'No matching braiders';
      default:
        return '';
    }
  });

  private readonly hasFilters = computed(
    () => this.appliedMaxPrice() !== null || this.appliedDistance() !== null,
  );
  private readonly hasCriteria = computed(() => !!this.query().search || this.hasFilters());

  protected readonly noResultsText = computed(() =>
    this.hasFilters()
      ? 'No braiders match these filters. Try a wider price range or distance.'
      : `No braiders match “${this.query().search}”. Clear the search to see every braider${
          this.styleName() ? ' for this style' : ''
        }.`,
  );

  /** The style and the applied price and distance, as the chips under the search box. */
  protected readonly activeFilters = computed(() => {
    const chips: string[] = [];
    const style = this.styleName();
    if (style) chips.push(style);
    const price = this.appliedMaxPrice();
    const distance = this.appliedDistance();
    const parts = [
      price !== null ? `Under ${money(price)}` : null,
      distance !== null ? `${price !== null ? 'within' : 'Within'} ${distance} km` : null,
    ].filter((part) => part !== null);
    if (parts.length) chips.push(parts.join(' · '));
    return chips;
  });

  protected readonly emptyHeading = computed(() =>
    this.styleName() ? 'No braiders offer this style yet' : 'No braiders to show yet',
  );
  protected readonly emptyText = computed(() => {
    const style = this.styleName();
    return style
      ? `No braiders near Toronto list ${style.toLowerCase()} right now. Try a related style.`
      : 'Braiders appear here once they publish their services.';
  });

  constructor() {
    // Keep the search box in step with the URL (back, forward and Clear filters).
    effect(() => {
      const term = this.q() ?? '';
      if (this.form.controls.q.value !== term) {
        this.form.controls.q.setValue(term, { emitEvent: false });
      }
    });
  }

  protected applySearch(): void {
    const term = this.form.controls.q.value.trim();
    void this.router.navigate([], {
      queryParams: { q: term || null, page: null },
      queryParamsHandling: 'merge',
    });
  }

  protected openFilters(): void {
    const ref = this.dialog.open<FilterBraidersDialog, FilterBraidersData, FilterBraidersResult>(
      FilterBraidersDialog,
      {
        data: {
          style: this.slug() ?? null,
          minPrice: this.meta()?.style?.minPrice ?? null,
          search: this.query().search ?? null,
          maxPrice: this.appliedMaxPrice(),
          distanceKm: this.appliedDistance(),
        },
      },
    );
    ref.closed.subscribe((result) => {
      if (!result) return;
      void this.router.navigate([], {
        queryParams: { maxPrice: result.maxPrice, distanceKm: result.distanceKm, page: null },
        queryParamsHandling: 'merge',
      });
    });
  }

  protected clearFilters(): void {
    this.form.controls.q.setValue('', { emitEvent: false });
    void this.router.navigate([], { queryParams: {} });
  }

  protected availability(match: BraiderMatch): string {
    return match.nextAvailable
      ? `Available ${shortDate(match.nextAvailable)}`
      : 'No times offered yet';
  }

  protected serviceLine(match: BraiderMatch): string {
    return `${match.braider.area} · ${match.service.name.toLowerCase()} from ${money(match.service.startingPrice)}`;
  }
}
