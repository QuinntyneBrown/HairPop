import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
  isDevMode,
  model,
  signal,
  viewChild,
} from '@angular/core';

/** The sorted column and its direction. The table reports it; the page sorts the rows. */
export interface TableSortState {
  column: string;
  direction: 'ascending' | 'descending';
}

let nextCaptionId = 0;

/**
 * A native `<table>` inside a bordered, horizontally scrolling wrapper. The
 * consumer's `<caption>`, `<colgroup>`, `<thead>`, `<tbody>` and `<tfoot>` are
 * projected into the table. While the table is wider than the wrapper, the
 * wrapper is a named, focusable scroll region (D-4).
 */
@Component({
  selector: 'hp-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #wrap
      class="table-wrap"
      [attr.role]="overflowing() ? 'region' : null"
      [attr.aria-labelledby]="overflowing() ? captionId() : null"
      [attr.tabindex]="overflowing() ? 0 : null"
      [attr.aria-busy]="loading() ? 'true' : null"
    >
      <table #table class="table" [class.table--dense]="dense()">
        <ng-content />
      </table>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
    .table-wrap {
      overflow-x: auto;
      border: var(--border-width-hairline) solid var(--color-border-default);
      border-radius: var(--radius-lg);
      background: var(--color-bg-surface);
    }
    .table-wrap:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus-ring);
      outline-offset: var(--focus-ring-offset);
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      font: var(--text-body-sm);
      color: var(--color-fg-default);
    }

    :host ::ng-deep caption {
      text-align: left;
      padding: var(--space-3) var(--space-4);
      font: var(--text-label);
      color: var(--color-fg-default);
    }
    :host ::ng-deep :is(th, td) {
      text-align: left;
      padding: var(--space-3) var(--space-4);
      border-bottom: var(--border-width-hairline) solid var(--color-border-default);
      vertical-align: middle;
      white-space: nowrap;
    }
    :host ::ng-deep td[colspan] {
      white-space: normal;
    }
    :host ::ng-deep .table--dense :is(th, td) {
      padding: var(--space-2) var(--space-3);
    }

    /* Column headers: sunken and sticky within the wrapper (D-9). */
    :host ::ng-deep thead th {
      background: var(--color-bg-surface-sunken);
      font: var(--text-label);
      color: var(--color-fg-muted);
      position: sticky;
      top: 0;
    }
    /* Row headers take the row's background and default colour (D-3). */
    :host ::ng-deep tbody th {
      font: var(--text-label);
      color: var(--color-fg-default);
      background: none;
    }
    :host ::ng-deep tbody tr:last-child > :is(th, td) {
      border-bottom: 0;
    }

    :host ::ng-deep tbody tr:is(:hover, :focus-within) {
      background: var(--color-bg-subtle);
    }
    :host ::ng-deep tbody tr[aria-selected='true'] {
      background: var(--color-accent-subtle);
    }

    :host ::ng-deep :is(th, td).num {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    :host ::ng-deep .row-actions {
      display: flex;
      gap: var(--space-2);
      opacity: 0;
      transition: opacity var(--duration-fast) var(--ease-standard);
    }
    :host ::ng-deep tr:is(:hover, :focus-within) .row-actions {
      opacity: 1;
    }
    @media (hover: none) {
      :host ::ng-deep .row-actions {
        opacity: 1;
      }
    }

    @media (forced-colors: active) {
      .table-wrap {
        border-color: CanvasText;
      }
      :host ::ng-deep :is(th, td) {
        border-bottom-color: CanvasText;
      }
      :host ::ng-deep tbody tr[aria-selected='true'] {
        outline: var(--border-width-thick) solid Highlight;
        outline-offset: calc(-1 * var(--border-width-thick));
      }
    }
  `,
})
export class Table {
  /** Compact cell padding. */
  readonly dense = input(false, { transform: booleanAttribute });
  /** Sets `aria-busy="true"` on the wrapper; the consumer renders skeleton rows. */
  readonly loading = input(false, { transform: booleanAttribute });
  /** The sorted column and direction; `sortChange` emits when a sortable header is activated. */
  readonly sort = model<TableSortState | null>(null);

  protected readonly overflowing = signal(false);
  protected readonly captionId = signal<string | null>(null);

  private readonly wrap = viewChild.required<ElementRef<HTMLDivElement>>('wrap');
  private readonly table = viewChild.required<ElementRef<HTMLTableElement>>('table');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.readCaption();
      this.observeOverflow();
    });
  }

  private readCaption(): void {
    const caption = this.table().nativeElement.querySelector(':scope > caption');
    if (!caption) {
      if (isDevMode()) {
        console.error(
          'hp-table: a table needs a <caption> as its first child; it names the table and its scroll region. ' +
            'Use class="visually-hidden" when a heading already names it.',
          this.host,
        );
      }
      return;
    }
    if (!caption.id) {
      caption.id = `hp-table-caption-${nextCaptionId++}`;
    }
    this.captionId.set(caption.id);
  }

  private observeOverflow(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    const wrap = this.wrap().nativeElement;
    const check = () => {
      const overflowing = wrap.scrollWidth > wrap.clientWidth;
      if (overflowing !== this.overflowing()) {
        this.overflowing.set(overflowing);
      }
    };
    this.zone.runOutsideAngular(() => {
      const observer = new ResizeObserver(check);
      observer.observe(wrap);
      observer.observe(this.table().nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
    check();
  }
}
