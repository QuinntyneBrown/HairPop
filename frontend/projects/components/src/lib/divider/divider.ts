import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  afterNextRender,
  computed,
  inject,
  input,
  isDevMode,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/** Divider orientation. Ignored on an `<hr>` host, which is always horizontal. */
export type DividerOrientation = 'horizontal' | 'vertical';

/**
 * A hairline separating two adjacent groups (divider.md). The host element chooses the form
 * (D-2): `<hr>` is the rule, a horizontal `<div>` or `<span>` is the labelled form, and a
 * vertical `<span>` or `<div>` is the vertical separator.
 */
@Component({
  selector: 'hr[hp-divider], div[hp-divider], span[hp-divider]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: {
    class: 'divider',
    '[class.divider--label]': 'labelled()',
    '[class.divider--vertical]': 'vertical()',
    '[attr.role]': "vertical() ? 'separator' : null",
    '[attr.aria-orientation]': "vertical() ? 'vertical' : null",
  },
  template: `
    <ng-template #slot><ng-content /></ng-template>
    @if (labelled()) {
      <span><ng-container [ngTemplateOutlet]="slot" /></span>
    }
  `,
  styles: `
    :host {
      display: block;
      box-sizing: border-box;
      height: 0;
      border: 0;
      border-top: var(--border-width-hairline) solid var(--color-border-default);
      margin: var(--space-6) 0;
      padding: 0;
      overflow: visible;
      color: inherit;
    }

    :host(.divider--vertical) {
      display: inline-block;
      height: auto;
      border-top: 0;
      border-left: var(--border-width-hairline) solid var(--color-border-default);
      align-self: stretch;
      margin: 0 var(--space-2);
    }

    :host(.divider--label) {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      height: auto;
      border: 0;
      font: var(--text-overline);
      letter-spacing: var(--letter-spacing-wide);
      text-transform: uppercase;
      color: var(--color-fg-subtle);
    }

    :host(.divider--label)::before,
    :host(.divider--label)::after {
      content: '';
      flex: 1;
      border-top: var(--border-width-hairline) solid var(--color-border-default);
    }

    span {
      text-align: center;
      overflow-wrap: anywhere;
    }
  `,
})
export class Divider {
  /** `vertical` (on a `span` or `div` host) renders a vertical separator with no content. */
  readonly orientation = input<DividerOrientation>('horizontal');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly isRule = this.host.tagName === 'HR';
  private readonly slot = viewChild.required('slot', { read: TemplateRef });

  protected readonly vertical = computed(() => !this.isRule && this.orientation() === 'vertical');
  protected readonly labelled = computed(() => !this.isRule && this.orientation() !== 'vertical');

  constructor() {
    if (isDevMode()) {
      afterNextRender(() => this.checkContent());
    }
  }

  /** Development check (D-2): a labelled divider needs text; a vertical one takes none. */
  private checkContent(): void {
    if (this.labelled()) {
      if (!this.host.textContent?.trim()) {
        console.error(
          'hp-divider: a horizontal div or span divider is the labelled form and needs a text label such as "Earlier" or "or". Use <hr hp-divider> for a rule without a label.',
        );
      }
    } else if (this.vertical()) {
      const view = this.slot().createEmbeddedView(null);
      const text = view.rootNodes.map((node: Node) => node.textContent ?? '').join('');
      const hasElements = view.rootNodes.some((node: Node) => node.nodeType === Node.ELEMENT_NODE);
      view.destroy();
      if (text.trim() || hasElements) {
        console.error(
          'hp-divider: a vertical divider renders no content. Remove the projected content from <span hp-divider orientation="vertical">.',
        );
      }
    }
  }
}
