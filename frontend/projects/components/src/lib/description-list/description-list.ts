import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  input,
  isDevMode,
} from '@angular/core';

/** `horizontal` stacks below 640 px and puts terms beside values above it; `stacked` keeps one column. */
export type DescriptionListLayout = 'horizontal' | 'stacked';

const DASH_ONLY = /^[\s\-‐‑‒–—―]*$/;

/**
 * The facts of one record as `<dt>`/`<dd>` pairs. The host is the native
 * `<dl>`; the consumer's terms and values are its direct children.
 */
@Component({
  selector: 'dl[hp-description-list]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    class: 'dl',
    '[class.dl--stacked]': 'layout() === "stacked"',
  },
  styles: `
    :host {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--space-1) var(--space-6);
      margin: 0;
    }
    :host ::ng-deep > dt {
      font: var(--text-label);
      color: var(--color-fg-muted);
    }
    :host ::ng-deep > dd {
      margin: 0 0 var(--space-2);
      font: var(--text-body);
      color: var(--color-fg-default);
    }
    :host ::ng-deep > dd.text-muted {
      color: var(--color-fg-muted);
    }

    /* --layout-breakpoint-sm (40rem); media queries cannot read custom properties (D-6). */
    @media (min-width: 40rem) {
      :host {
        grid-template-columns: max-content minmax(0, 1fr);
        gap: var(--space-2) var(--space-6);
      }
      :host ::ng-deep > dd {
        margin: 0;
      }
    }

    :host(.dl--stacked) {
      grid-template-columns: minmax(0, 1fr);
    }
    :host(.dl--stacked) ::ng-deep > dd {
      margin: 0 0 var(--space-3);
    }
  `,
})
export class DescriptionList {
  /** Horizontal (default) or stacked at every width (asides and narrow cards, D-3). */
  readonly layout = input<DescriptionListLayout>('horizontal');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    if (isDevMode()) {
      afterNextRender(() => this.checkChildren());
    }
  }

  private checkChildren(): void {
    for (const child of Array.from(this.host.children)) {
      if (child.tagName !== 'DT' && child.tagName !== 'DD') {
        console.error(
          `hp-description-list: only <dt> and <dd> may be direct children; found <${child.tagName.toLowerCase()}>. ` +
            'Do not group pairs in <div> elements.',
          child,
        );
      } else if (
        child.tagName === 'DD' &&
        child.children.length === 0 &&
        DASH_ONLY.test(child.textContent ?? '')
      ) {
        console.error(
          'hp-description-list: a <dd> must hold a value, a pending sentence or a missing status, never nothing or a lone dash. ' +
            'Omit the pair when the record does not have the fact.',
          child,
        );
      }
    }
  }
}
