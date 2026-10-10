import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  isDevMode,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Icon } from '../icon/icon';

/** Numbered pages with a summary, or previous/next arrows around the summary. */
export type PaginationVariant = 'numbered' | 'simple';

/** One rendered item of the pagination row. */
interface PaginationItem {
  readonly key: string;
  readonly kind: 'page' | 'gap' | 'previous' | 'next';
  readonly page?: number;
  /** Shown only from 48 rem (`.pagination__wide`). */
  readonly wide: boolean;
  /** Shown only below 48 rem (`.pagination__narrow`). */
  readonly narrow: boolean;
  /** False for an unavailable end (no `href`, `aria-disabled`). */
  readonly available: boolean;
  readonly current: boolean;
  readonly queryParams: Record<string, number | null> | null;
  readonly ariaLabel: string | null;
}

/** Pages shown by one window: the first, the last and `radius` either side of the current page. */
function windowPages(current: number, count: number, radius: number): number[] {
  const pages = new Set<number>([1, count]);
  for (let p = current - radius; p <= current + radius; p++) {
    if (p >= 1 && p <= count) {
      pages.add(p);
    }
  }
  const sorted = [...pages].sort((a, b) => a - b);
  // D-5: a gap of exactly one page shows that page instead of an ellipsis.
  const filled = new Set(sorted);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] === 2) {
      filled.add(sorted[i] - 1);
    }
  }
  return [...filled].sort((a, b) => a - b);
}

/**
 * Splits a long result set into pages under a `<nav>` landmark (pagination.md). Every page is a
 * link to the current route with the page in a query parameter, so other parameters are kept (D-2).
 * Both page windows are rendered and CSS chooses between them at 48 rem (D-4).
 */
@Component({
  selector: 'hp-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterLink, Icon],
  template: `
    @if (pageCount() > 1) {
      <nav
        class="pagination"
        [class.pagination--simple]="variant() === 'simple'"
        [attr.aria-label]="label()"
      >
        @if (variant() === 'numbered') {
          <span class="pagination__summary">{{ summary() }}</span>
        }
        @for (item of items(); track item.key) {
          @switch (item.kind) {
            @case ('gap') {
              <span
                class="pagination__ellipsis"
                [class.pagination__wide]="item.wide"
                [class.pagination__narrow]="item.narrow"
                aria-hidden="true"
                >…</span
              >
            }
            @case ('page') {
              <a
                [class.pagination__wide]="item.wide"
                [class.pagination__narrow]="item.narrow"
                [routerLink]="[]"
                [queryParams]="item.queryParams"
                [queryParamsHandling]="'merge'"
                [attr.aria-current]="item.current ? 'page' : null"
                [attr.aria-label]="item.ariaLabel"
                >{{ item.page }}</a
              >
            }
            @default {
              @if (item.available) {
                <a
                  [routerLink]="[]"
                  [queryParams]="item.queryParams"
                  [queryParamsHandling]="'merge'"
                >
                  <ng-container *ngTemplateOutlet="endContent; context: { $implicit: item.kind }" />
                </a>
              } @else {
                <a role="link" aria-disabled="true">
                  <ng-container *ngTemplateOutlet="endContent; context: { $implicit: item.kind }" />
                </a>
              }
              @if (item.kind === 'previous' && variant() === 'simple') {
                <span class="pagination__summary">{{ summary() }}</span>
              }
            }
          }
        }
      </nav>
    }

    <ng-template #endContent let-kind>
      @if (variant() === 'simple') {
        <svg hp-icon [name]="kind === 'previous' ? 'chevron-left' : 'chevron-right'" size="sm"></svg
        ><span class="visually-hidden">{{
          kind === 'previous' ? previousLabel() : nextLabel()
        }}</span>
      } @else {
        {{ kind === 'previous' ? previousLabel() : nextLabel() }}
      }
    </ng-template>
  `,
  styles: `
    :host {
      display: block;
    }

    .pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: var(--space-1);
      list-style: none;
      padding: 0;
      margin: var(--space-6) 0 0;
    }

    .pagination__summary {
      color: var(--color-fg-muted);
      font: var(--text-body-sm);
      font-variant-numeric: tabular-nums;
      margin-right: var(--space-2);
      flex-basis: 100%;
      text-align: center;
    }

    @media (min-width: 40rem) {
      .pagination__summary {
        flex-basis: auto;
      }
    }

    /* D-6: the simple variant keeps the summary between the arrows at every width. */
    .pagination--simple .pagination__summary {
      flex-basis: auto;
      margin: 0;
    }

    .pagination a,
    .pagination__ellipsis {
      display: inline-grid;
      place-items: center;
      box-sizing: border-box;
      min-width: var(--control-height-sm);
      height: var(--control-height-sm);
      padding-inline: var(--space-2);
      border-radius: var(--radius-md);
      border: var(--border-width-hairline) solid transparent;
      background: none;
      color: var(--color-fg-muted);
      font: var(--text-label);
      font-variant-numeric: tabular-nums;
      text-decoration: none;
    }

    .pagination a {
      cursor: pointer;
    }

    .pagination a:hover,
    .pagination a:active {
      background: var(--color-bg-subtle);
      color: var(--color-fg-default);
    }

    .pagination [aria-current='page'],
    .pagination [aria-current='page']:hover {
      background: var(--color-accent-subtle);
      color: var(--color-fg-accent);
      border-color: var(--color-accent);
    }

    .pagination [aria-disabled='true'] {
      opacity: 0.5;
      pointer-events: none;
      cursor: default;
    }

    .pagination .icon {
      stroke: currentColor;
    }

    /* D-4: both windows are in the DOM; the viewport chooses. */
    @media (width < 48rem) {
      .pagination .pagination__wide {
        display: none;
      }
    }

    @media (width >= 48rem) {
      .pagination .pagination__narrow {
        display: none;
      }
    }

    /* D-9: every item keeps an edge, and the current page an outline, without fills. */
    @media (forced-colors: active) {
      .pagination a {
        border-color: LinkText;
      }

      .pagination [aria-current='page'] {
        outline: var(--border-width-thick) solid Highlight;
      }

      .pagination a:focus-visible {
        outline-color: Highlight;
      }
    }
  `,
})
export class Pagination {
  /** The landmark's `aria-label`, naming what it pages ("Results pages"). */
  readonly label = input.required<string>();
  /** The current page, 1-based; clamped for rendering (D-8). */
  readonly page = input.required<number>();
  /** Total pages; 1 or fewer renders nothing. */
  readonly pageCount = input.required<number>();
  /** The formatted range ("Showing 1–3 of 126"). */
  readonly summary = input.required<string>();
  /** "Previous" (numbered, visible) or "Previous reviews" (simple, visually hidden). */
  readonly previousLabel = input.required<string>();
  /** "Next" or "Next reviews". */
  readonly nextLabel = input.required<string>();
  /** `simple` drops the page numbers and shows chevrons with hidden labels. */
  readonly variant = input<PaginationVariant>('numbered');
  /** The query parameter each link sets; page 1 removes it. */
  readonly queryParam = input<string>('page');
  /** Accessible name for each number link ("Page 2"); the visible text stays the number. */
  readonly pageLabel = input<((page: number) => string) | undefined>(undefined);

  private readonly count = computed(() => Math.max(1, Math.floor(this.pageCount())));
  private readonly current = computed(() => {
    const page = Math.floor(this.page());
    return Number.isFinite(page) ? Math.min(Math.max(1, page), this.count()) : 1;
  });

  protected readonly items = computed<PaginationItem[]>(() => {
    const count = this.count();
    const current = this.current();
    const param = this.queryParam();
    const pageLabel = this.pageLabel();
    const params = (page: number): Record<string, number | null> => ({
      [param]: page === 1 ? null : page,
    });
    const end = (kind: 'previous' | 'next', target: number, available: boolean) => ({
      key: kind,
      kind,
      page: target,
      wide: false,
      narrow: false,
      available,
      current: false,
      queryParams: available ? params(target) : null,
      ariaLabel: null,
    });

    const items: PaginationItem[] = [end('previous', current - 1, current > 1)];
    if (this.variant() === 'numbered') {
      const wide = windowPages(current, count, 2);
      const narrow = windowPages(current, count, 0);
      const inWide = new Set(wide);
      const inNarrow = new Set(narrow);
      const all = [...new Set([...wide, ...narrow])].sort((a, b) => a - b);
      const gap = (key: string, wideGap: boolean, narrowGap: boolean): PaginationItem => ({
        key,
        kind: 'gap',
        wide: wideGap && !narrowGap,
        narrow: narrowGap && !wideGap,
        available: false,
        current: false,
        queryParams: null,
        ariaLabel: null,
      });
      // A window has a gap after page 1 when its second page is beyond 2, and before the
      // last page when its second-last page is before count - 1.
      const startGap = (pages: number[]) => pages.length > 1 && pages[1] > 2;
      const endGap = (pages: number[]) => pages.length > 1 && pages[pages.length - 2] < count - 1;
      for (const page of all) {
        if (page === count && (endGap(wide) || endGap(narrow))) {
          items.push(gap('gap-end', endGap(wide), endGap(narrow)));
        }
        items.push({
          key: `page-${page}`,
          kind: 'page',
          page,
          wide: inWide.has(page) && !inNarrow.has(page),
          narrow: inNarrow.has(page) && !inWide.has(page),
          available: true,
          current: page === current,
          queryParams: params(page),
          ariaLabel: pageLabel ? pageLabel(page) : null,
        });
        if (page === 1 && (startGap(wide) || startGap(narrow))) {
          items.push(gap('gap-start', startGap(wide), startGap(narrow)));
        }
      }
    }
    items.push(end('next', current + 1, current < count));
    return items;
  });

  constructor() {
    if (isDevMode()) {
      effect(() => {
        const page = this.page();
        const count = this.count();
        if (!Number.isFinite(page) || page < 1 || page > count) {
          console.error(
            `hp-pagination: page ${page} is outside 1…${count}; page ${this.current()} is shown as current.`,
          );
        }
      });
    }
  }
}
