import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ApiError, CONTENT_API, ContentSlug, calendarDate } from '@hairpop/api';
import {
  Alert,
  Button,
  Card,
  EmptyState,
  Icon,
  PageHeader,
  SkeletonGroup,
} from '@hairpop/components';

type View = 'loading' | 'error' | 'offline' | 'ready';

/** The page header and the error wording for each legal page (docs/mocks/pages/terms, privacy). */
const PAGES: Record<'terms' | 'privacy', { heading: string; subtitle: string; failed: string }> = {
  terms: {
    heading: 'Terms of use',
    subtitle: 'How HairPop helps customers and independent braiders connect.',
    failed: 'We couldn’t load terms of use',
  },
  privacy: {
    heading: 'Privacy at HairPop',
    subtitle: 'What information is used when you browse, request and review.',
    failed: 'We couldn’t load privacy',
  },
};

/**
 * LegalPage serves Terms and Privacy (docs/detailed-designs/information/get-help-and-legal-content).
 * It shows only the approved text the API publishes, so a failed load is an error state rather
 * than placeholder copy presented as policy (L2-033 AC3).
 */
@Component({
  selector: 'hp-legal-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Card, EmptyState, Icon, PageHeader, RouterLink, SkeletonGroup],
  template: `
    <hp-page-header eyebrow="Legal" [heading]="page().heading" [subtitle]="page().subtitle" />
    <div class="stack">
      @switch (view()) {
        @case ('loading') {
          <section [attr.aria-label]="'Loading ' + loadingName()" aria-busy="true">
            <hp-skeleton-group
              [label]="'Loading ' + loadingName()"
              pattern="story-card"
              [count]="1"
              slowMessage="Still loading…"
              retryLabel="Try again"
              (retried)="content.reload()"
            />
          </section>
        }
        @case ('offline') {
          <hp-alert tone="warning" heading="You’re offline">
            <p>This page needs a connection. Connect and try again.</p>
            <button hp-button slot="actions" type="button" (click)="content.reload()">
              Try again
            </button>
          </hp-alert>
        }
        @case ('error') {
          <hp-empty-state
            variant="error"
            [heading]="page().failed"
            text="Check your connection and try again. Nothing you entered was lost."
          >
            <svg hp-icon slot="icon" name="alert-circle"></svg>
            <button
              hp-button
              variant="primary"
              slot="actions"
              type="button"
              (click)="content.reload()"
            >
              Try again
            </button>
            <a hp-button slot="actions" routerLink="/">Explore styles</a>
          </hp-empty-state>
        }
        @case ('ready') {
          <article hp-card class="legal-copy">
            @if (effective(); as date) {
              <p class="text-muted">Effective {{ date }}</p>
            }
            @for (section of sections(); track section.id) {
              <h2>{{ section.heading }}</h2>
              @for (paragraph of section.paragraphs; track $index) {
                <p>{{ paragraph }}</p>
              }
            }
          </article>
        }
      }
    </div>
  `,
})
export class LegalPage {
  private readonly api = inject(CONTENT_API);

  /** Route data: which legal page this is. */
  readonly slug = input.required<Extract<ContentSlug, 'terms' | 'privacy'>>();

  protected readonly page = computed(() => PAGES[this.slug()]);
  protected readonly loadingName = computed(() =>
    this.slug() === 'terms' ? 'terms of use' : 'privacy',
  );

  protected readonly content = rxResource({
    params: () => this.slug(),
    stream: ({ params }) => this.api.get(params),
  });

  protected readonly sections = computed(() =>
    this.content.hasValue() ? this.content.value().sections : [],
  );
  protected readonly effective = computed(() => {
    const date = this.content.hasValue() ? this.content.value().effectiveDate : null;
    return date ? calendarDate(date) : null;
  });

  protected readonly view = computed<View>(() => {
    if (this.content.isLoading()) return 'loading';
    if (this.content.status() === 'error') {
      return ApiError.from(this.content.error()).offline ? 'offline' : 'error';
    }
    return 'ready';
  });
}
