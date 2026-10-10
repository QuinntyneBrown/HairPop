import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The actions bar at the end of a page form (form-layout.md): an optional status first, then
 * buttons, aligned to the end. Below 768 px the primary button is full width and first (D-12).
 * The host is the native `div.form-actions`.
 */
@Component({
  selector: 'div[hp-form-actions]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'form-actions' },
  template: '<ng-content />',
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      justify-content: flex-end;
      padding-top: var(--space-4);
    }

    /* D-2: the bar reaches only its own projected primary button. */
    :host ::ng-deep > .btn--primary {
      flex: 1 1 100%;
      order: -1;
    }

    @media (min-width: 48rem) {
      :host ::ng-deep > .btn--primary {
        flex: none;
        order: 0;
      }
    }
  `,
})
export class FormActions {}
