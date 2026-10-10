import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

/**
 * Lays out two to four fact tiles (stat.md). The host is the native `<div>` and carries
 * `.fact-grid`, so the projected `div[hp-fact]` tiles are its grid items (D-1).
 */
@Component({
  selector: 'div[hp-fact-grid]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    class: 'fact-grid',
    '[attr.aria-busy]': "busy() ? 'true' : null",
  },
  styles: `
    /* D-4: the column minimum never exceeds the grid, so enlarged text stacks the tiles. */
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(8rem, 100%), 1fr));
      gap: var(--space-4);
      margin-block: var(--space-6);
    }
  `,
})
export class FactGrid {
  /** Sets `aria-busy="true"` while the tiles load; removes the attribute when done. */
  readonly busy = input(false, { transform: booleanAttribute });
}
