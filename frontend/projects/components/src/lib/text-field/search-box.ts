import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

/**
 * The search box part of the text field: positions a projected search icon at the start of a
 * projected `input[hp-text-field] type="search"`. The host is the native `<div>`.
 */
@Component({
  selector: 'div[hp-search-box]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    class: 'search',
    '[class.search-box]': 'grow()',
  },
  styles: `
    :host {
      position: relative;
      display: block;
      min-width: 0;
    }

    :host(.search-box) {
      flex: 1;
      min-width: min(100%, var(--layout-card-min));
    }

    :host ::ng-deep > .input {
      padding-left: var(--space-10);
    }

    :host ::ng-deep > .icon {
      position: absolute;
      left: var(--space-3);
      top: 50%;
      translate: 0 -50%;
      color: var(--color-fg-subtle);
      pointer-events: none;
    }
  `,
})
export class SearchBox {
  /** Adds `.search-box`: fills the free space of a filter row. */
  readonly grow = input(false, { transform: booleanAttribute });
}
