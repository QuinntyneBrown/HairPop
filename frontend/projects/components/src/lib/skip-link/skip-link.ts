import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  inject,
  input,
  isDevMode,
} from '@angular/core';

/**
 * The first focusable element on every screen (skip-link.md). The host is the native anchor
 * (D-1); activation moves focus to the target in script instead of following the hash (D-2).
 */
@Component({
  selector: 'a[hp-skip-link]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    class: 'skip-link',
    '[attr.href]': 'href()',
    '(click)': 'activate($event)',
  },
  styles: `
    :host {
      position: absolute;
      left: var(--space-4);
      top: calc(-1 * var(--space-24));
      z-index: var(--z-tooltip);
      padding: var(--space-2) var(--space-4);
      background: var(--color-bg-surface-raised);
      color: var(--color-fg-default);
      font: var(--text-label);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-3);
      text-decoration: none;
      transition: top var(--duration-fast) var(--ease-standard);
    }

    :host(:focus-visible) {
      top: var(--space-4);
    }

    :host(:hover),
    :host(:active) {
      color: var(--color-fg-link-hover);
      text-decoration: none;
    }

    @media (forced-colors: active) {
      :host,
      :host(:hover),
      :host(:active) {
        color: LinkText;
        background: Canvas;
      }

      :host(:focus-visible) {
        outline-color: Highlight;
      }
    }

    @media print {
      :host {
        display: none !important;
      }
    }
  `,
})
export class SkipLink {
  /** Id of the element that receives focus, without `#`. Looked up at activation time. */
  readonly target = input<string>('main');

  private readonly document = inject(DOCUMENT);

  protected readonly href = computed(() => `#${this.target()}`);

  protected activate(event: Event): void {
    event.preventDefault();
    const id = this.target();
    const target = this.document.getElementById(id);
    if (!target) {
      if (isDevMode()) {
        console.error(`hp-skip-link: no element with id "${id}" to move focus to.`);
      }
      return;
    }
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
    target.focus();
  }
}
