import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  isDevMode,
  OnInit,
} from '@angular/core';

import { Icon } from '../icon/icon';

/** Link variants: inline (no modifier), standalone, external, inherit. */
export type LinkVariant = 'inline' | 'standalone' | 'external' | 'inherit';

/**
 * A native `<a href>` that takes the customer somewhere (link.md). The host is the anchor
 * itself (D-1); the component renders only the variant's trailing parts (D-4).
 */
@Component({
  selector: 'a[hp-link]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: {
    class: 'link',
    '[class.link--standalone]': "variant() === 'standalone'",
    '[class.link--external]': "variant() === 'external'",
    '[class.link--inherit]': "variant() === 'inherit'",
    '[attr.target]': "variant() === 'external' ? '_blank' : null",
    '[attr.rel]': "variant() === 'external' ? 'noopener' : null",
  },
  template: `<ng-content />
    @if (variant() === 'standalone') {
      <span class="link__arrow" aria-hidden="true"
        ><svg hp-icon name="arrow-right" size="sm"></svg
      ></span>
    }
    @if (variant() === 'external') {
      <svg hp-icon name="external" size="sm"></svg
      ><span class="visually-hidden">{{ newTabText() }}</span>
    }`,
  styles: `
    :host {
      color: var(--color-fg-link);
      text-decoration-line: underline;
      text-underline-offset: 0.15em;
      text-decoration-thickness: var(--border-width-hairline);
    }

    :host(:hover),
    :host(:active) {
      color: var(--color-fg-link-hover);
      text-decoration-thickness: var(--border-width-thick);
    }

    :host(.link--standalone) {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      min-height: var(--target-min);
      font: var(--text-label);
      font-size: var(--font-size-md);
      white-space: normal;
    }

    .link__arrow {
      flex: none;
      display: inline-flex;
      transition: translate var(--duration-fast) var(--ease-standard);
    }

    :host(.link--standalone:hover) .link__arrow {
      translate: var(--space-1) 0;
    }

    :host(.link--external) .icon {
      display: inline-block;
      vertical-align: -0.125em;
      margin-left: var(--space-1);
    }

    :host(.link--inherit) {
      color: inherit;
      font-weight: var(--link-inherit-font-weight, inherit);
    }

    :host(.link--inherit:hover),
    :host(.link--inherit:active) {
      color: var(--link-inherit-hover-fg, currentColor);
    }

    @media (forced-colors: active) {
      :host,
      :host(:hover),
      :host(:active),
      :host(.link--inherit),
      :host(.link--inherit:hover),
      :host(.link--inherit:active) {
        color: LinkText;
        text-decoration-color: LinkText;
      }

      :host(:focus-visible) {
        outline-color: Highlight;
      }
    }
  `,
})
export class Link implements OnInit {
  /** Visual and behavioural variant; external opens a new tab with `rel="noopener"` (D-5). */
  readonly variant = input<LinkVariant>('inline');
  /** External only: the visually hidden hint, with its leading space: " (opens in a new tab)". */
  readonly newTabText = input<string>('');

  private readonly host = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

  constructor() {
    if (isDevMode()) {
      afterNextRender(() => {
        if (!this.host.nativeElement.hasAttribute('href')) {
          console.error(
            'hp-link: the link has no destination. Add an href or routerLink to the a[hp-link] host.',
          );
        }
      });
    }
  }

  ngOnInit(): void {
    if (isDevMode() && this.variant() === 'external' && !this.newTabText()) {
      console.error(
        'hp-link: an external link needs newTabText, the hidden " (opens in a new tab)" hint.',
      );
    }
  }
}
