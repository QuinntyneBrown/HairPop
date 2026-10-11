import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ApiError, BRAIDERS_API, BraiderProfile, hoursRange, money } from '@hairpop/api';
import {
  Alert,
  Avatar,
  Button,
  Card,
  DescriptionList,
  EmptyState,
  Gallery,
  GalleryItem,
  Icon,
  List,
  ListItem,
  PageHeader,
  RatingSummary,
  ReviewQuote,
  Skeleton,
  SkeletonGroup,
} from '@hairpop/components';

import { NotFoundPage } from '../errors/not-found.page';
import { responseStatus } from '../../shared/response-status';

/** "Nia Okafor" → "Nia". */
function firstName(name: string): string {
  return name.split(' ')[0];
}

/** BraiderProfilePage (docs/detailed-designs/profiles/inspect-braider). */
@Component({
  selector: 'hp-braider-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Alert,
    Avatar,
    Button,
    Card,
    DescriptionList,
    EmptyState,
    Gallery,
    Icon,
    List,
    ListItem,
    NotFoundPage,
    PageHeader,
    RatingSummary,
    ReviewQuote,
    RouterLink,
    Skeleton,
    SkeletonGroup,
  ],
  template: `
    @if (missing()) {
      <hp-not-found-page />
    } @else if (profile.hasValue()) {
      @let p = profile.value();
      <hp-page-header eyebrow="Braider" [heading]="p.name" [subtitle]="p.area" />
      <div class="detail-grid">
        <div class="stack">
          <section hp-card aria-labelledby="about">
            <div class="profile-head">
              <span hp-avatar size="xl" [name]="p.name" [src]="p.photo?.src ?? null"></span>
              <div class="stack stack--sm">
                <h2>{{ p.name }}</h2>
                <span
                  hp-rating-summary
                  [value]="p.rating?.average ?? null"
                  [count]="p.rating?.count ?? 0"
                ></span>
                <p class="text-muted">{{ areaLine(p) }}</p>
              </div>
            </div>
            <h2 id="about" class="visually-hidden">About {{ first(p) }}</h2>
            <p>{{ p.bio }}</p>
            <a hp-button variant="primary" [routerLink]="['/book', p.slug]"
              >Request an appointment</a
            >
          </section>

          <section hp-card aria-labelledby="services-title">
            <h2 id="services-title">Services</h2>
            <ul hp-list>
              @for (service of p.services; track service.id) {
                <li hp-list-item>
                  <div class="list__body">
                    <span class="list__title">{{ service.name }}</span>
                    <span class="list__meta"
                      >From {{ price(service.startingPrice) }} · about
                      {{ hours(service.typicalHours) }}</span
                    >
                  </div>
                </li>
              }
            </ul>
          </section>

          <section hp-card aria-labelledby="work-title">
            <h2 id="work-title">Recent work</h2>
            @if (p.portfolio.length) {
              <ul hp-gallery [items]="portfolio(p)"></ul>
            } @else {
              <hp-empty-state
                size="compact"
                [headingLevel]="3"
                heading="No portfolio photos yet"
                [text]="
                  first(p) +
                  ' hasn’t added portfolio work yet. You can still read their services and policies.'
                "
              >
                <svg hp-icon slot="icon" name="sparkle"></svg>
              </hp-empty-state>
            }
          </section>

          <section hp-card aria-labelledby="reviews-title">
            <h2 id="reviews-title">Customer reviews</h2>
            @if (reviews.hasValue()) {
              @if (reviews.value().data.length) {
                <span
                  hp-rating-summary
                  [value]="p.rating?.average ?? null"
                  [count]="p.rating?.count ?? 0"
                ></span>
                @for (review of reviews.value().data; track review.id) {
                  <figure
                    hp-review-quote
                    [rating]="review.rating"
                    [date]="review.date"
                    [text]="review.text"
                    [author]="review.author"
                    [service]="review.service"
                  ></figure>
                }
              } @else {
                <hp-empty-state
                  size="compact"
                  [headingLevel]="3"
                  heading="No reviews yet"
                  [text]="
                    first(p) +
                    ' hasn’t received a published review yet. Their services and policies are below.'
                  "
                >
                  <svg hp-icon slot="icon" name="star"></svg>
                </hp-empty-state>
              }
            } @else if (reviews.status() === 'error') {
              <hp-alert tone="warning" heading="Reviews couldn’t load">
                <p>{{ first(p) }}’s services, prices and policies are up to date.</p>
                <button
                  hp-button
                  slot="actions"
                  variant="link"
                  size="sm"
                  type="button"
                  (click)="reviews.reload()"
                >
                  Retry reviews
                </button>
              </hp-alert>
            } @else {
              <hp-skeleton-group
                label="Loading reviews"
                slowMessage="Still loading reviews…"
                retryLabel="Try again"
                (retried)="reviews.reload()"
              >
                <span hp-skeleton></span>
                <span hp-skeleton></span>
              </hp-skeleton-group>
            }
          </section>
        </div>

        <aside hp-card class="stack" aria-labelledby="before">
          <h2 id="before">Before you book</h2>
          <dl hp-description-list>
            <dt>Service area</dt>
            <dd>{{ p.area }}. Studio address shared after {{ first(p) }} accepts.</dd>
            @if (p.policies.preparation; as text) {
              <dt>Preparation</dt>
              <dd>{{ text }}</dd>
            }
            @if (p.policies.changes; as text) {
              <dt>Changes</dt>
              <dd>{{ text }}</dd>
            }
            @if (p.policies.cancellation; as text) {
              <dt>Cancellation</dt>
              <dd>{{ text }}</dd>
            }
          </dl>
        </aside>
      </div>
    } @else if (profile.isLoading()) {
      <hp-page-header eyebrow="Braider" heading="Loading profile" />
      <div class="detail-grid" aria-label="Braider profile" aria-busy="true">
        <hp-skeleton-group
          label="Loading profile"
          slowMessage="Still loading this profile…"
          retryLabel="Try again"
          (retried)="profile.reload()"
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
      <hp-page-header eyebrow="Braider" heading="Braider profile" />
      @if (offline()) {
        <hp-alert tone="warning" heading="You’re offline">
          <p>This profile needs a connection. Connect and try again.</p>
          <button hp-button slot="actions" type="button" (click)="profile.reload()">
            Try again
          </button>
        </hp-alert>
      } @else {
        <hp-empty-state
          variant="error"
          heading="We couldn’t load this profile"
          text="Check your connection and try again. Nothing you entered was lost."
        >
          <svg hp-icon slot="icon" name="alert-circle"></svg>
          <button
            hp-button
            variant="primary"
            slot="actions"
            type="button"
            (click)="profile.reload()"
          >
            Try again
          </button>
          <a hp-button slot="actions" routerLink="/">Explore styles</a>
        </hp-empty-state>
      }
    }
  `,
})
export class BraiderProfilePage {
  private readonly api = inject(BRAIDERS_API);

  /** Route parameter. */
  readonly slug = input.required<string>();

  protected readonly profile = rxResource({
    params: () => this.slug(),
    stream: ({ params }) => this.api.get(params),
  });

  /**
   * Reviews load in the browser once the profile has, so their failure is partial and never fails
   * the page, and an unknown braider's reviews are never requested.
   */
  private readonly inBrowser = signal(false);
  protected readonly reviews = rxResource({
    params: () => (this.inBrowser() && this.profile.hasValue() ? this.slug() : undefined),
    stream: ({ params }) => this.api.reviews(params),
  });

  private readonly failure = computed(() =>
    this.profile.status() === 'error' ? ApiError.from(this.profile.error()) : null,
  );
  protected readonly missing = computed(() => this.failure()?.status === 404);
  protected readonly offline = computed(() => this.failure()?.offline ?? false);

  protected readonly price = money;
  protected hours(typicalHours: number): string {
    return hoursRange({ min: typicalHours, max: null });
  }

  constructor() {
    afterNextRender(() => this.inBrowser.set(true));
    responseStatus(() => (this.missing() ? 404 : null));
  }

  protected first(profile: BraiderProfile): string {
    return firstName(profile.name);
  }

  protected portfolio(profile: BraiderProfile): readonly GalleryItem[] {
    return profile.portfolio.map((item) => ({
      id: item.id,
      src: item.image?.src ?? null,
      alt: item.image?.alt ?? '',
      caption: item.caption,
    }));
  }

  protected areaLine(profile: BraiderProfile): string {
    return profile.travelKm === null
      ? profile.area
      : `${profile.area} · travels up to ${profile.travelKm} km`;
  }
}
