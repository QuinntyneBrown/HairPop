import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Two short related form fields (form-layout.md): one column, two equal columns from 768 px.
 * The host is the native `div.form-row`.
 */
@Component({
  selector: 'div[hp-form-row]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'form-row' },
  template: '<ng-content />',
  styles: `
    :host {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      align-items: start;
      gap: var(--space-4);
    }

    @media (min-width: 48rem) {
      :host {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `,
})
export class FormRow {}
