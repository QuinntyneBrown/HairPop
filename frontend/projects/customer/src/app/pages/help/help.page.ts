import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ApiError, CONTENT_API } from '@hairpop/api';
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

/** A reference like HP-1048: letters, digits and hyphens only, so it is safe in a mailto subject. */
const SAFE_REFERENCE = /^[A-Za-z0-9-]{1,32}$/;

/** Used when no published content supplies one, so support stays reachable offline. */
const SUPPORT_EMAIL = 'support@hairpop.example';

/** HelpPage (docs/detailed-designs/information/get-help-and-legal-content). */
@Component({
  selector: 'hp-help-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Card, EmptyState, Icon, PageHeader, RouterLink, SkeletonGroup],
  template: `
    <hp-page-header
      eyebrow="Support"
      heading="How can we help?"
      subtitle="Find answers about requests, pricing, changes and reviews."
    />
    <div class="stack">
      @switch (view()) {
        @case ('loading') {
          <section class="feature-grid" aria-label="Loading help" aria-busy="true">
            <hp-skeleton-group
              label="Loading help"
              pattern="story-card"
              [count]="3"
              slowMessage="Still loading help…"
              retryLabel="Try again"
              (retried)="content.reload()"
            />
          </section>
        }
        @case ('offline') {
          <hp-alert tone="warning" heading="You’re offline">
            <p>Help topics need a connection. You can still email support.</p>
            <button hp-button slot="actions" type="button" (click)="content.reload()">
              Try again
            </button>
          </hp-alert>
        }
        @case ('error') {
          <hp-empty-state
            variant="error"
            heading="We couldn’t load help"
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
          <section class="feature-grid" aria-label="Help topics">
            @for (section of sections(); track section.id) {
              <article hp-card layout="story">
                <div class="story-card__art" aria-hidden="true">
                  <svg hp-icon name="sparkle" size="lg"></svg>
                </div>
                <div class="stack">
                  <h2 class="card__title">{{ section.heading }}</h2>
                  @for (paragraph of section.paragraphs; track $index) {
                    <p class="text-muted">{{ paragraph }}</p>
                  }
                </div>
              </article>
            }
          </section>
        }
      }

      <section hp-card class="stack" aria-labelledby="contact">
        <h2 id="contact">Contact support</h2>
        <p>
          Email us with your request number, like HP-1048, and we’ll reply within one business day.
        </p>
        <a hp-button variant="primary" [href]="mailto()">Email support</a>
      </section>
    </div>
  `,
})
export class HelpPage {
  private readonly api = inject(CONTENT_API);

  /** The customer's own request reference, when they arrive from an appointment. */
  readonly ref = input<string>();

  protected readonly content = rxResource({
    stream: () => this.api.get('help'),
  });

  protected readonly sections = computed(() =>
    this.content.hasValue() ? this.content.value().sections : [],
  );

  protected readonly view = computed<View>(() => {
    if (this.content.isLoading()) return 'loading';
    if (this.content.status() === 'error') {
      return ApiError.from(this.content.error()).offline ? 'offline' : 'error';
    }
    return 'ready';
  });

  /** Support's address, with the reference as the subject when it is safe. */
  protected readonly mailto = computed(() => {
    const email =
      (this.content.hasValue() ? this.content.value().supportEmail : null) ?? SUPPORT_EMAIL;
    const ref = this.ref();
    return ref && SAFE_REFERENCE.test(ref)
      ? `mailto:${email}?subject=${encodeURIComponent(`Help with ${ref}`)}`
      : `mailto:${email}`;
  });
}
