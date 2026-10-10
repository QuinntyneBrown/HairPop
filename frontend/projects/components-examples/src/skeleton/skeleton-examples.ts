import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, Card, Skeleton, SkeletonGroup } from '@hairpop/components';

import { Example } from '../shared';

/**
 * Stories for the skeleton and the skeleton group (skeleton.md): every block shape, every
 * pattern, a page's own composition and the loaded and retry flow. Every group shows its
 * slow-read line 10 seconds after it renders.
 */
@Component({
  selector: 'hp-skeleton-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, Example, Skeleton, SkeletonGroup],
  template: `
    <hp-example
      heading="Block shapes"
      description="Text, title, circle, rect and hero. Blocks are always hidden from assistive technology."
    >
      <div class="stack skeleton-examples__frame">
        <span hp-skeleton shape="title"></span>
        <span hp-skeleton width="30%"></span>
        <span hp-skeleton></span>
        <span hp-skeleton></span>
        <span hp-skeleton shape="circle"></span>
        <span hp-skeleton shape="rect" width="8rem" height="var(--control-height-md)"></span>
        <span hp-skeleton shape="hero"></span>
      </div>
    </hp-example>

    <hp-example heading="Story card pattern" description="The style gallery while styles load.">
      <section class="feature-grid skeleton-examples__frame" aria-label="Styles" aria-busy="true">
        <hp-skeleton-group
          pattern="story-card"
          [count]="2"
          label="Loading styles"
          slowMessage="Still loading. Check your connection."
          retryLabel="Try again"
        />
      </section>
    </hp-example>

    <hp-example heading="Appointment row pattern" description="My appointments while they load.">
      <section class="stack skeleton-examples__frame" aria-label="My appointments" aria-busy="true">
        <hp-skeleton-group
          pattern="appointment-row"
          [count]="2"
          label="Loading your appointments"
          slowMessage="Still loading. Check your connection."
          retryLabel="Try again"
        />
      </section>
    </hp-example>

    <hp-example
      heading="List row pattern"
      description="The notification centre while updates load."
    >
      <section class="skeleton-examples__frame" aria-label="Updates" aria-busy="true">
        <hp-skeleton-group
          pattern="list-row"
          [count]="4"
          label="Loading your updates"
          slowMessage="Still loading. Check your connection."
          retryLabel="Try again"
        />
      </section>
    </hp-example>

    <hp-example
      heading="Page composition"
      description="Without a pattern the group projects the page’s own blocks."
    >
      <div class="stack skeleton-examples__frame" aria-label="Knotless braids" aria-busy="true">
        <hp-skeleton-group
          label="Loading knotless braids"
          slowMessage="Still loading. Check your connection."
          retryLabel="Try again"
        >
          <div hp-card aria-hidden="true">
            <span hp-skeleton shape="hero"></span>
            <span hp-skeleton shape="title"></span>
            <span hp-skeleton></span>
            <span hp-skeleton></span>
            <span hp-skeleton shape="rect" width="100%" height="var(--control-height-md)"></span>
          </div>
        </hp-skeleton-group>
      </div>
    </hp-example>

    <hp-example
      heading="Loading, slow, retrying and loaded"
      description="After 10 seconds the slow-read line appears; Try again emits retried and its button turns busy."
    >
      <div class="cluster skeleton-examples__frame">
        <button hp-button (click)="loading.set(!loading())">
          {{ loading() ? 'Finish loading' : 'Load again' }}
        </button>
        <span>Retries: {{ retries() }}</span>
      </div>
      <section
        class="stack skeleton-examples__frame"
        aria-label="Nia’s appointments"
        [attr.aria-busy]="loading() || null"
      >
        @if (loading()) {
          <hp-skeleton-group
            pattern="appointment-row"
            [count]="2"
            label="Loading Nia’s appointments"
            slowMessage="Still loading. Check your connection."
            retryLabel="Try again"
            (retried)="retries.set(retries() + 1)"
          />
        } @else {
          <div hp-card>
            <strong>Knotless braids with Nia Okafor</strong>
            <p>Request HP-1048 · Sat 24 Oct, 10:00 am · about five hours · $180–$240</p>
          </div>
          <div hp-card>
            <strong>Previous appointment</strong>
            <p>HP-0992 · Sat 3 Oct · completed</p>
          </div>
        }
      </section>
    </hp-example>
  `,
  styles: `
    .skeleton-examples__frame {
      flex: 1 1 100%;
    }
  `,
})
export class SkeletonExamples {
  protected readonly loading = signal(true);
  protected readonly retries = signal(0);
}
