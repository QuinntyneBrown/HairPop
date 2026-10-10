import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  ApiError,
  STYLES_API,
  StyleOptionalFact,
  hoursRange,
  moneyRange,
  weeksRange,
} from '@hairpop/api';
import {
  Alert,
  Button,
  Card,
  EmptyState,
  Fact,
  FactGrid,
  Icon,
  List,
  ListItem,
  PageHeader,
  SkeletonGroup,
  Skeleton,
} from '@hairpop/components';

import { NotFoundPage } from '../errors/not-found.page';
import { responseStatus } from '../../shared/response-status';

const FACT_NAMES: Record<StyleOptionalFact, string> = {
  typicalWear: 'Typical wear',
  variations: 'Variations',
  quoteFactors: 'Quote factors',
};

/** StyleDetailPage (docs/detailed-designs/discovery/inspect-style). */
@Component({
  selector: 'hp-style-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Alert,
    Button,
    Card,
    EmptyState,
    Fact,
    FactGrid,
    Icon,
    List,
    ListItem,
    NotFoundPage,
    PageHeader,
    RouterLink,
    Skeleton,
    SkeletonGroup,
  ],
  template: `
    @if (missing()) {
      <hp-not-found-page />
    } @else if (style.hasValue()) {
      @let s = style.value();
      <hp-page-header eyebrow="Discover" [heading]="s.name" />
      @if (unavailableText(); as text) {
        <hp-alert tone="warning" heading="Some details are unavailable">
          <p>{{ text }}</p>
          <button hp-button slot="actions" variant="link" type="button" (click)="style.reload()">
            Retry
          </button>
        </hp-alert>
      }
      <div class="detail-grid">
        <section hp-card aria-labelledby="expect-title">
          @if (s.image; as image) {
            <img class="hero-photo" [src]="image.src" [alt]="image.alt" />
          } @else {
            <div class="hero-art" aria-hidden="true">
              <svg hp-icon name="sparkle" size="lg"></svg>
            </div>
          }
          <h2 id="expect-title">What to expect</h2>
          <p data-style-intro>{{ s.intro }}</p>
          @if (facts().length) {
            <div hp-fact-grid>
              @for (fact of facts(); track fact.label) {
                <div hp-fact [value]="fact.value" [label]="fact.label"></div>
              }
            </div>
          }
          @if (s.variations.length) {
            <h2 id="variations-title">Variations</h2>
            <ul hp-list aria-labelledby="variations-title">
              @for (variation of s.variations; track variation.name) {
                <li hp-list-item>
                  <div class="list__body">
                    <span class="list__title">{{ variation.name }}</span>
                    <span class="list__meta">{{ variation.description }}</span>
                  </div>
                </li>
              }
            </ul>
          }
          @if (s.quoteFactors.length) {
            <h2 id="quote-title">What changes the final quote</h2>
            <ul aria-labelledby="quote-title">
              @for (factor of s.quoteFactors; track factor) {
                <li>{{ factor }}</li>
              }
            </ul>
          }
          <p class="text-muted" data-estimate-note>
            Prices are typical ranges. Your braider confirms the final price when they accept your
            request.
          </p>
        </section>
        <aside hp-card class="stack" aria-labelledby="yours-title">
          <h2 id="yours-title">Make it yours</h2>
          <p>
            Choose a braider who offers {{ s.name.toLowerCase() }}, then talk through size, length
            and colour.
          </p>
          <a hp-button variant="primary" [routerLink]="['/styles', s.slug, 'braiders']"
            >Find a braider</a
          >
        </aside>
      </div>
    } @else if (style.isLoading()) {
      <hp-page-header eyebrow="Discover" heading="Loading style" />
      <div class="detail-grid" aria-label="Style" aria-busy="true">
        <hp-skeleton-group
          label="Loading style"
          slowMessage="Still loading this style…"
          retryLabel="Try again"
          (retried)="style.reload()"
        >
          <div hp-card class="stack">
            <span hp-skeleton shape="hero"></span>
            <span hp-skeleton shape="title"></span>
            <span hp-skeleton></span>
            <span hp-skeleton></span>
          </div>
        </hp-skeleton-group>
      </div>
    } @else {
      <hp-page-header eyebrow="Discover" heading="Style details" />
      @if (offline()) {
        <hp-alert tone="warning" heading="You’re offline">
          <p>This style needs a connection. Connect and try again.</p>
          <button hp-button slot="actions" type="button" (click)="style.reload()">Try again</button>
        </hp-alert>
      } @else {
        <hp-empty-state
          variant="error"
          heading="We couldn’t load this style"
          text="Check your connection and try again."
        >
          <svg hp-icon slot="icon" name="alert-circle"></svg>
          <button hp-button variant="primary" slot="actions" type="button" (click)="style.reload()">
            Try again
          </button>
          <a hp-button slot="actions" routerLink="/">Explore styles</a>
        </hp-empty-state>
      }
    }
  `,
})
export class StyleDetailPage {
  private readonly api = inject(STYLES_API);

  /** Route parameter. */
  readonly slug = input.required<string>();

  protected readonly style = rxResource({
    params: () => this.slug(),
    stream: ({ params }) => this.api.get(params),
  });

  private readonly failure = computed(() =>
    this.style.status() === 'error' ? ApiError.from(this.style.error()) : null,
  );
  protected readonly missing = computed(() => this.failure()?.status === 404);
  protected readonly offline = computed(() => this.failure()?.offline ?? false);

  protected readonly facts = computed(() => {
    if (!this.style.hasValue()) return [];
    const s = this.style.value();
    const facts: { label: string; value: string }[] = [];
    if (s.typicalHours) facts.push({ label: 'Typical time', value: hoursRange(s.typicalHours) });
    if (s.typicalPrice) facts.push({ label: 'Typical price', value: moneyRange(s.typicalPrice) });
    if (s.typicalWear) facts.push({ label: 'Typical wear', value: weeksRange(s.typicalWear) });
    return facts;
  });

  protected readonly unavailableText = computed(() => {
    if (!this.style.hasValue()) return null;
    const names = this.style.value().unavailable.map((fact) => FACT_NAMES[fact]);
    if (!names.length) return null;
    return `${names.join(' and ')} couldn’t load. The rest of this style is up to date.`;
  });

  constructor() {
    responseStatus(() => (this.missing() ? 404 : null));
  }
}
