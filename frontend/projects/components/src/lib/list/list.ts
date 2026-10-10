import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A native `<ul>` or `<ol>` of short, similar rows. Draws a hairline rule
 * between rows and none after the last (D-2).
 */
@Component({
  selector: 'ul[hp-list], ol[hp-list]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: { class: 'list' },
  styles: `
    :host {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
    }
    :host ::ng-deep > li:not(:last-child) > .list__item,
    :host ::ng-deep > li.list__item:not(:last-child) {
      border-bottom: var(--border-width-hairline) solid var(--color-border-default);
    }
  `,
})
export class List {}
