import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ApiError,
  STYLES_API,
  STYLE_CATEGORIES,
  StyleCategory,
  StyleQuery,
  StyleSummary,
  hoursRange,
  moneyRange,
} from '@hairpop/api';
import {
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
  SearchBox,
  SkeletonGroup,
  TextField,
} from '@hairpop/components';

const CATEGORY_LABELS: Record<StyleCategory, string> = {
  braids: 'Braids',
  twists: 'Twists',
  locs: 'Locs',
};

/** "4–7 hours typical · typically $160–$300" (L2-001 AC1: time and price labelled typical). */
export function styleFacts(style: StyleSummary): string {
  const facts: string[] = [];
  if (style.typicalHours) facts.push(`${hoursRange(style.typicalHours)} typical`);
  if (style.typicalPrice) facts.push(`typically ${moneyRange(style.typicalPrice)}`);
  return facts.join(' · ');
}

type View = 'loading' | 'error' | 'offline' | 'empty' | 'no-results' | 'results';

/** StyleGalleryPage (docs/detailed-designs/discovery/browse-and-search-styles). */
@Component({
  selector: 'hp-style-gallery-page',
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
    ReactiveFormsModule,
    RouterLink,
    SearchBox,
    SkeletonGroup,
    TextField,
  ],
  template: `
    <hp-page-header
      eyebrow="Discover"
      heading="Find a style that feels like you"
      subtitle="Browse protective styles, compare typical time and price, and see real work."
    />
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
            aria-label="Search styles"
            enterkeyhint="search"
          />
        </div>
        <a hp-button routerLink="/braiders">Find braiders</a>
      </form>

      <hp-chip-row
        single
        aria-label="Style category"
        [value]="activeCategory() ?? 'all'"
        (valueChange)="chooseCategory($event)"
      >
        <button hp-chip value="all">All styles</button>
        @for (category of categories; track category) {
          <button hp-chip [value]="category">{{ categoryLabels[category] }}</button>
        }
      </hp-chip-row>

      <p class="visually-hidden" role="status" data-results-status>{{ statusText() }}</p>

      @switch (view()) {
        @case ('loading') {
          <section class="feature-grid" aria-label="Styles" aria-busy="true">
            <hp-skeleton-group
              label="Loading styles"
              pattern="story-card"
              [count]="3"
              slowMessage="Still loading styles…"
              retryLabel="Try again"
              (retried)="styles.reload()"
            />
          </section>
        }
        @case ('offline') {
          <hp-alert tone="warning" heading="You’re offline">
            <p>Styles need a connection. Connect and try again.</p>
            <button hp-button slot="actions" type="button" (click)="styles.reload()">
              Try again
            </button>
          </hp-alert>
        }
        @case ('error') {
          <hp-empty-state
            variant="error"
            heading="We couldn’t load styles"
            text="Check your connection and try again. Nothing you entered was lost."
          >
            <svg hp-icon slot="icon" name="alert-circle"></svg>
            <button
              hp-button
              variant="primary"
              slot="actions"
              type="button"
              (click)="styles.reload()"
            >
              Try again
            </button>
          </hp-empty-state>
        }
        @case ('empty') {
          <hp-empty-state
            heading="No styles to show yet"
            text="We’re adding styles to the gallery. Check back soon, or browse braiders directly."
          >
            <svg hp-icon slot="icon" name="sparkle"></svg>
            <a hp-button variant="primary" slot="actions" routerLink="/braiders">Browse braiders</a>
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
          <section class="feature-grid" aria-label="Styles">
            @for (style of results(); track style.slug) {
              <article hp-card layout="story">
                @if (style.image; as image) {
                  <img class="story-card__photo" [src]="image.src" [alt]="image.alt" />
                } @else {
                  <div class="story-card__art" aria-hidden="true">
                    <svg hp-icon name="sparkle" size="lg"></svg>
                  </div>
                }
                <div class="stack">
                  <p class="eyebrow">{{ style.eyebrow }}</p>
                  <h2 class="card__title">{{ style.name }}</h2>
                  <p class="text-muted">{{ facts(style) }}</p>
                  <a [routerLink]="['/styles', style.slug]"
                    >Explore {{ style.name }} <span aria-hidden="true">→</span></a
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
export class StyleGalleryPage {
  private readonly api = inject(STYLES_API);
  private readonly router = inject(Router);

  /** Query parameters (router component input binding). */
  readonly q = input<string>();
  readonly category = input<string>();
  readonly page = input<string>();

  protected readonly categories = STYLE_CATEGORIES;
  protected readonly categoryLabels = CATEGORY_LABELS;
  protected readonly facts = styleFacts;

  protected readonly form = new FormGroup({ q: new FormControl('', { nonNullable: true }) });

  protected readonly activeCategory = computed<StyleCategory | null>(() => {
    const value = this.category();
    return STYLE_CATEGORIES.includes(value as StyleCategory) ? (value as StyleCategory) : null;
  });

  private readonly query = computed<StyleQuery>(() => ({
    search: this.q()?.trim() || null,
    category: this.activeCategory(),
    page: Math.max(1, Number(this.page()) || 1),
  }));

  protected readonly styles = rxResource({
    params: () => this.query(),
    stream: ({ params }) => this.api.list(params),
  });

  protected readonly results = computed(() =>
    this.styles.hasValue() ? this.styles.value().data : [],
  );
  protected readonly currentPage = computed(() =>
    this.styles.hasValue() ? this.styles.value().meta.page : 1,
  );
  protected readonly pageCount = computed(() =>
    this.styles.hasValue() ? this.styles.value().meta.lastPage : 1,
  );
  protected readonly summary = computed(() => {
    if (!this.styles.hasValue()) return '';
    const { page, perPage, total } = this.styles.value().meta;
    const first = (page - 1) * perPage + 1;
    const last = Math.min(total, page * perPage);
    return `Showing ${first}–${last} of ${total}`;
  });

  private readonly hasCriteria = computed(() => {
    const query = this.query();
    return query.search !== null || query.category !== null;
  });

  protected readonly view = computed<View>(() => {
    if (this.styles.isLoading()) return 'loading';
    if (this.styles.status() === 'error') {
      return ApiError.from(this.styles.error()).offline ? 'offline' : 'error';
    }
    if (this.results().length > 0) return 'results';
    return this.hasCriteria() ? 'no-results' : 'empty';
  });

  protected readonly statusText = computed(() => {
    switch (this.view()) {
      case 'results': {
        const total = this.styles.hasValue() ? this.styles.value().meta.total : 0;
        return `${total} ${total === 1 ? 'style' : 'styles'}`;
      }
      case 'no-results':
        return 'No matching styles';
      default:
        return '';
    }
  });

  protected readonly noResultsText = computed(() => {
    const { search, category } = this.query();
    const where = category ? ` in ${CATEGORY_LABELS[category]}` : '';
    const what = search ? `“${search}”` : 'these filters';
    return `No styles match ${what}${where}. Clear the search or choose another category.`;
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
    this.navigate({ q: term || null, page: null });
  }

  protected chooseCategory(value: string | null): void {
    const category = value && value !== 'all' ? value : null;
    this.navigate({ category, page: null });
  }

  protected clearFilters(): void {
    this.form.controls.q.setValue('', { emitEvent: false });
    void this.router.navigate(['/']);
  }

  private navigate(queryParams: Record<string, string | null>): void {
    void this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }
}
