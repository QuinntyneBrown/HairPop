import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { Button } from '../button/button';
import { Card } from '../card/card';
import { List } from '../list/list';
import { ListItem } from '../list/list-item';
import { Skeleton } from './skeleton';

/** Ready-made placeholder patterns that mirror a loaded layout. */
export type SkeletonPattern = 'story-card' | 'appointment-row' | 'list-row';

/** How long a read may take before the slow-read line appears (D-11). */
const SLOW_AFTER_MS = 10_000;

/**
 * One loading region's contents (skeleton.md): one status message, the placeholders (a pattern
 * or the page's own composition) and, after 10 seconds, the slow-read line with "Try again".
 * The host is `display: contents`, so the placeholders are the consumer container's children (D-3).
 */
@Component({
  selector: 'hp-skeleton-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, List, ListItem, Skeleton],
  template: `
    <span class="visually-hidden" role="status">{{ statusText() }}</span>
    @switch (pattern()) {
      @case ('story-card') {
        @for (item of items(); track $index) {
          <div hp-card layout="story" aria-hidden="true">
            <span hp-skeleton shape="hero"></span>
            <div class="stack">
              <span hp-skeleton width="30%"></span>
              <span hp-skeleton shape="title"></span>
              <div><span hp-skeleton></span><span hp-skeleton></span></div>
              <span hp-skeleton width="40%"></span>
            </div>
          </div>
        }
      }
      @case ('appointment-row') {
        @for (item of items(); track $index) {
          <div hp-card layout="row" aria-hidden="true">
            <div>
              <span hp-skeleton shape="rect" width="7rem" height="1.5rem"></span>
              <span hp-skeleton shape="title"></span>
              <span hp-skeleton></span>
            </div>
            <span hp-skeleton shape="rect" width="8rem" height="var(--control-height-md)"></span>
          </div>
        }
      }
      @case ('list-row') {
        <div hp-card flush aria-hidden="true">
          <ul hp-list>
            @for (item of items(); track $index) {
              <li hp-list-item>
                <span hp-skeleton shape="circle"></span>
                <div class="list__body">
                  <span hp-skeleton width="50%"></span><span hp-skeleton></span>
                </div>
              </li>
            }
          </ul>
        </div>
      }
      @default {
        <ng-content />
      }
    }
    @if (slow()) {
      <p
        class="span-full cluster text-sm text-muted"
        (focusin)="onLineFocusIn($event)"
        (focusout)="onLineFocusOut($event)"
      >
        <span aria-hidden="true">{{ slowMessage() }}</span>
        <button hp-button variant="link" size="sm" [busy]="retrying()" (click)="retry()">
          {{ retryLabel() }}
        </button>
      </p>
    }
  `,
  styles: `
    :host {
      display: contents;
    }

    /* D-4: the story-card placeholder measures within 1 px of the loaded card. */
    .story-card > .skeleton--hero {
      margin-bottom: 0;
    }

    .story-card .skeleton--title {
      height: calc(var(--line-height-snug) * 1em);
      margin: 0;
    }

    /* D-4: the body grows from the loaded row's text width, so the button wraps at the same width. */
    .appointment-row > div {
      flex: 1 1 21rem;
    }

    .appointment-row .skeleton--title {
      font-size: var(--font-size-xl);
      height: calc(var(--line-height-snug) * 1em);
      margin: 0;
    }

    /* D-5: two story cards fill a phone or tablet row; the rest show from 64 rem. */
    .story-card:nth-of-type(n + 3) {
      display: none;
    }

    @media (min-width: 64rem) {
      .story-card:nth-of-type(n + 3) {
        display: flex;
      }
    }
  `,
})
export class SkeletonGroup {
  /** The status message: "Loading" plus the content's name ("Loading styles"). */
  readonly label = input.required<string>();
  /** Renders that placeholder pattern `count` times; null projects the page's composition. */
  readonly pattern = input<SkeletonPattern | null>(null);
  /** Placeholders a pattern renders. Ignored without a pattern. */
  readonly count = input<number>(3);
  /** Shown and announced after 10 seconds of loading. */
  readonly slowMessage = input.required<string>();
  /** The slow-read line's button label ("Try again"). */
  readonly retryLabel = input.required<string>();
  /** The region's heading; receives focus when the group is removed with focus on "Try again" (D-8). */
  readonly returnFocusTo = input<HTMLElement | null>(null);

  /** Emitted when "Try again" is activated; the consumer restarts the read. */
  readonly retried = output<void>();

  protected readonly slow = signal(false);
  protected readonly retrying = signal(false);
  protected readonly items = computed(() =>
    Array.from({ length: Math.max(0, Math.floor(this.count())) }),
  );
  protected readonly statusText = computed(() =>
    this.slow() && !this.retrying() ? this.slowMessage() : this.label(),
  );

  /** The slow-read line while focus is inside it; it may be removed before destroy hooks run. */
  private focusedLine: HTMLElement | null = null;

  private readonly document = inject(DOCUMENT);
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    afterNextRender(() => this.startTimer());
    inject(DestroyRef).onDestroy(() => {
      this.clearTimer();
      this.returnFocus();
    });
  }

  protected retry(): void {
    if (this.retrying()) {
      return;
    }
    this.retrying.set(true);
    this.retried.emit();
    this.startTimer();
  }

  protected onLineFocusIn(event: FocusEvent): void {
    this.focusedLine = event.currentTarget as HTMLElement;
  }

  protected onLineFocusOut(event: FocusEvent): void {
    // A focused element that is removed reports no related target; keep the line for destroy.
    if (event.relatedTarget !== null) {
      this.focusedLine = null;
    }
  }

  private startTimer(): void {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.timer = null;
      this.slow.set(true);
      this.retrying.set(false);
    }, SLOW_AFTER_MS);
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private returnFocus(): void {
    const target = this.returnFocusTo();
    const line = this.focusedLine;
    if (!target || !line) {
      return;
    }
    const active = this.document.activeElement;
    if (active === null || active === this.document.body || line.contains(active)) {
      target.focus();
    }
  }
}
