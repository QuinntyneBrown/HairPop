import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, Card, EmptyState, Icon } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the empty state (empty-state.md): every variant, size and state. */
@Component({
  selector: 'hp-empty-state-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, EmptyState, Example, Icon],
  template: `
    <hp-example heading="First-run" description="Default variant, full size, one primary link.">
      <hp-empty-state
        class="demo"
        heading="No appointments yet"
        text="When you request a visit, you’ll find its status and details here."
      >
        <svg hp-icon slot="icon" name="calendar"></svg>
        <a hp-button slot="actions" variant="primary" href="#">Explore styles</a>
      </hp-empty-state>
    </hp-example>

    <hp-example
      heading="No results"
      description="The only primary action is the “Clear filters” button."
    >
      <hp-empty-state
        class="demo"
        heading="No braiders match these filters"
        text="Try a wider price range or distance to see more options."
      >
        <svg hp-icon slot="icon" name="search"></svg>
        <button hp-button slot="actions" variant="primary">Clear filters</button>
      </hp-empty-state>
    </hp-example>

    <hp-example
      heading="Error"
      description="Danger tint, primary “Try again” and a secondary link."
    >
      <hp-empty-state
        class="demo"
        variant="error"
        heading="We couldn’t load the style gallery"
        text="Check your connection and try again. Your details are safe."
      >
        <svg hp-icon slot="icon" name="alert-circle"></svg>
        <button hp-button slot="actions" variant="primary">Try again</button>
        <a hp-button slot="actions" href="#">Explore styles</a>
      </hp-empty-state>
    </hp-example>

    <hp-example
      heading="Warning"
      description="Content exists but cannot be shown: offline or forbidden."
    >
      <hp-empty-state
        class="demo"
        variant="warning"
        heading="You’re offline"
        text="Saved appointment details remain available. Requests need a connection."
      >
        <svg hp-icon slot="icon" name="wifi-off"></svg>
        <button hp-button slot="actions" variant="primary">Try again</button>
      </hp-empty-state>
    </hp-example>

    <hp-example
      heading="Success"
      description="A finished form: check icon, primary link to the next step."
    >
      <hp-empty-state
        class="demo"
        heading="Request sent to Nia"
        text="This is a request, not a confirmed appointment. Nia will reply with the final time and price."
      >
        <svg hp-icon slot="icon" name="check"></svg>
        <a hp-button slot="actions" variant="primary" href="#">View appointment</a>
      </hp-empty-state>
    </hp-example>

    <hp-example
      heading="Compact in a card"
      description="Compact size and an h3 inside the portfolio card."
    >
      <section hp-card class="demo" aria-labelledby="empty-portfolio-title">
        <h2 class="card-title" id="empty-portfolio-title">Portfolio</h2>
        <hp-empty-state
          size="compact"
          [headingLevel]="3"
          heading="No portfolio photos yet"
          text="You can still read Nia’s services and policies."
        >
          <svg hp-icon slot="icon" name="star"></svg>
          <a hp-button slot="actions" variant="primary" size="sm" href="#">Request with Nia</a>
        </hp-empty-state>
      </section>
    </hp-example>

    <hp-example heading="Compact, no action" description="Nothing for Maya to do yet.">
      <section hp-card class="demo" aria-labelledby="empty-reviews-title">
        <h2 class="card-title" id="empty-reviews-title">Customer reviews</h2>
        <hp-empty-state
          size="compact"
          [headingLevel]="3"
          heading="No reviews yet"
          text="Nia’s first reviews will appear here after her next appointments."
        >
          <svg hp-icon slot="icon" name="star"></svg>
        </hp-empty-state>
      </section>
    </hp-example>

    <hp-example heading="Compact error" description="A region that did not load inside a page.">
      <section hp-card class="demo" aria-label="Customer reviews">
        <hp-empty-state
          variant="error"
          size="compact"
          [headingLevel]="3"
          heading="Reviews didn’t load"
        >
          <svg hp-icon slot="icon" name="alert-circle"></svg>
          <button hp-button slot="actions" variant="primary" size="sm">Try again</button>
        </hp-empty-state>
      </section>
    </hp-example>

    <hp-example
      heading="Reference and stacked actions"
      description="A support reference after the actions; actions stack below 640 px."
    >
      <hp-empty-state
        class="demo"
        variant="error"
        heading="HairPop needs a moment"
        text="We couldn’t load this page. Your booking request has not been resent."
        reference="Reference: HP-ERR-7F3K2Q · Sat 10 Oct, 9:42 am"
        stackActions
      >
        <svg hp-icon slot="icon" name="alert-circle"></svg>
        <button hp-button slot="actions" variant="primary">Try again</button>
        <a hp-button slot="actions" href="#">Contact support</a>
      </hp-empty-state>
    </hp-example>

    <hp-example
      heading="Busy"
      description="aria-busy on the host and busy on the primary button while retrying."
    >
      <hp-empty-state
        class="demo"
        variant="error"
        heading="We couldn’t load your appointments"
        text="Check your connection and try again. Your details are safe."
        busy
      >
        <svg hp-icon slot="icon" name="alert-circle"></svg>
        <button hp-button slot="actions" variant="primary" busy>Try again</button>
        <a hp-button slot="actions" href="#">Explore styles</a>
      </hp-empty-state>
    </hp-example>

    <hp-example
      heading="Retry (interactive)"
      description="A failed retry is announced assertively; focus stays on “Try again”."
    >
      <hp-empty-state
        class="demo"
        variant="error"
        heading="We couldn’t load Nia’s profile"
        text="Check your connection and try again. Your details are safe."
        statusRole="alert"
        [busy]="retrying()"
        [status]="retryStatus()"
      >
        <svg hp-icon slot="icon" name="alert-circle"></svg>
        <button hp-button slot="actions" variant="primary" [busy]="retrying()" (click)="retry()">
          Try again
        </button>
        <a hp-button slot="actions" href="#">Explore styles</a>
      </hp-empty-state>
    </hp-example>

    <hp-example
      heading="Success with focus (interactive)"
      description="focusOnRender moves focus to the heading when it appears."
    >
      <div class="demo">
        @if (sent()) {
          <hp-empty-state
            heading="Your review is posted"
            text="Your review helps others choose a braider with confidence."
            focusOnRender
            status="Your review is posted"
          >
            <svg hp-icon slot="icon" name="check"></svg>
            <button hp-button slot="actions" variant="primary" (click)="sent.set(false)">
              Post another review
            </button>
          </hp-empty-state>
        } @else {
          <button hp-button variant="primary" (click)="sent.set(true)">Post review</button>
        }
      </div>
    </hp-example>

    <hp-example
      heading="Heading levels"
      description="h2 in a main region by default; h4 for a nested panel."
    >
      <hp-empty-state
        class="demo"
        size="compact"
        [headingLevel]="4"
        heading="No updates yet"
        text="Updates about requests and appointments will appear here."
      >
        <svg hp-icon slot="icon" name="bell"></svg>
      </hp-empty-state>
    </hp-example>
  `,
  styles: `
    .demo {
      flex: 1 1 100%;
    }

    .card-title {
      font: var(--text-h4);
    }
  `,
})
export class EmptyStateExamples {
  protected readonly retrying = signal(false);
  protected readonly retryStatus = signal<string | null>(null);
  protected readonly sent = signal(false);

  protected retry(): void {
    this.retrying.set(true);
    this.retryStatus.set(null);
    setTimeout(() => {
      this.retrying.set(false);
      this.retryStatus.set('Still couldn’t load Nia’s profile. Try again in a moment.');
    }, 1500);
  }
}
