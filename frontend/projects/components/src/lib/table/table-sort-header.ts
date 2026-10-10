import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Table, TableSortState } from './table';

/**
 * A sortable column header. Wraps the label in a button; the sorted column
 * carries `aria-sort` and a decorative arrow. Unsorted columns carry no
 * `aria-sort` (D-5).
 */
@Component({
  selector: 'th[hp-table-sort]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<button type="button" (click)="toggle()"><ng-content /></button>',
  host: {
    '[attr.aria-sort]': 'ariaSort()',
  },
  styles: `
    :host button {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      gap: var(--space-1);
      align-items: center;
      min-height: var(--target-min);
    }
    :host button:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus-ring);
      outline-offset: var(--focus-ring-offset);
    }
    :host([aria-sort='ascending']) button::after {
      content: '↑';
      content: '↑' / '';
    }
    :host([aria-sort='descending']) button::after {
      content: '↓';
      content: '↓' / '';
    }
  `,
})
export class TableSortHeader {
  /** The column key, matched against the table's `sort.column`. */
  readonly column = input.required<string>({ alias: 'hp-table-sort' });
  /** The direction applied when this unsorted column is activated. */
  readonly firstDirection = input<TableSortState['direction']>('ascending');

  private readonly table = inject(Table);

  protected readonly ariaSort = computed(() => {
    const sort = this.table.sort();
    return sort && sort.column === this.column() ? sort.direction : null;
  });

  protected toggle(): void {
    const current = this.ariaSort();
    const direction: TableSortState['direction'] = current
      ? current === 'ascending'
        ? 'descending'
        : 'ascending'
      : this.firstDirection();
    this.table.sort.set({ column: this.column(), direction });
  }
}
