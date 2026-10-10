import { CdkMenu, MENU_TRIGGER } from '@angular/cdk/menu';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';

import { MenuTrigger } from './menu-trigger';

/** D-8: more items than this become a bottom sheet below 640 px. */
const SHEET_ITEM_THRESHOLD = 5;

/** Below `--layout-breakpoint-sm` (640 px). Media queries cannot read custom properties. */
const SHEET_MEDIA_QUERY = '(max-width: 39.99rem)';

let nextMenuId = 0;

/**
 * The menu panel: `ul.menu[role="menu"]` holding `li[role="none"]` items, section labels
 * and dividers (menu.md). Rendered in an `ng-template` opened by `hpMenuTriggerFor`;
 * the CDK Menu supplies roving focus, typeahead, Home/End, wrapping and closing.
 */
@Component({
  selector: 'ul[hp-menu]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [{ directive: CdkMenu, inputs: ['id'] }],
  host: {
    class: 'menu',
    '[class.menu--sheet]': 'sheet()',
  },
  template: '<ng-content />',
  styles: `
    .menu {
      box-sizing: border-box;
      min-width: min(12rem, calc(100vw - 2 * var(--space-4)));
      max-width: min(20rem, calc(100vw - 2 * var(--space-4)));
      margin: var(--space-1) 0;
      padding: var(--space-1);
      list-style: none;
      background: var(--color-bg-surface-raised);
      color: var(--color-fg-default);
      border: var(--border-width-hairline) solid var(--color-border-default);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-3);
      transform-origin: top left;
      animation: scale-in var(--duration-fast) var(--ease-enter);
    }

    .menu > li {
      margin: 0;
      padding: 0;
    }

    /* Documentation and perf frame: the panel in flow, without the overlay. */
    .menu--static {
      animation: none;
    }

    .menu__item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      box-sizing: border-box;
      width: 100%;
      min-height: var(--control-height-sm);
      margin: 0;
      padding: var(--space-1) var(--space-3);
      border: 0;
      border-radius: var(--radius-sm);
      background: none;
      color: var(--color-fg-default);
      font: var(--text-body-sm);
      text-align: start;
      text-decoration: none;
      overflow-wrap: anywhere;
      cursor: pointer;
    }

    .menu__item > .icon {
      flex: none;
    }

    .menu__item:focus {
      outline: none;
    }

    /* D-3: a highlight visible in both themes; keyboard focus adds the inset ring. */
    .menu__item:hover,
    .menu__item:focus-visible {
      background: var(--color-bg-subtle-hover);
      color: var(--color-fg-default);
    }

    .menu__item:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus-ring);
      outline-offset: calc(-1 * var(--focus-ring-width));
    }

    .menu__item--danger {
      color: var(--color-danger-fg);
    }

    .menu__item--danger:hover,
    .menu__item--danger:focus-visible {
      background: var(--color-danger-bg);
      color: var(--color-danger-fg);
    }

    .menu__item[aria-disabled='true'],
    .menu__item[aria-disabled='true']:hover,
    .menu__item[aria-disabled='true']:focus-visible {
      background: none;
      color: var(--color-fg-disabled);
      cursor: not-allowed;
    }

    .menu__item[aria-checked='true']::after {
      content: '✓';
      content: '✓' / '';
      margin-left: auto;
      color: var(--color-fg-accent);
    }

    .menu__item kbd {
      margin-left: auto;
      font-size: var(--font-size-xs);
    }

    .menu__group {
      padding: var(--space-2) var(--space-3) var(--space-1);
      font: var(--text-overline);
      letter-spacing: var(--letter-spacing-wide);
      text-transform: uppercase;
      color: var(--color-fg-subtle);
    }

    .menu__divider {
      margin: var(--space-1) 0;
      border-top: var(--border-width-hairline) solid var(--color-border-default);
    }

    /* D-8: long menus on phones. */
    .menu--sheet {
      position: fixed;
      inset: auto 0 0 0;
      min-width: 0;
      max-width: none;
      margin: 0;
      padding-bottom: calc(var(--space-1) + env(safe-area-inset-bottom));
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    }

    .menu--sheet .menu__item {
      min-height: var(--target-comfortable);
    }

    @media (forced-colors: active) {
      .menu {
        border-color: CanvasText;
      }

      .menu__item:focus-visible {
        outline-color: Highlight;
      }
    }
  `,
})
export class Menu implements AfterContentInit {
  private readonly cdkMenu = inject(CdkMenu, { self: true });
  private readonly cdkTrigger = inject(MENU_TRIGGER, { optional: true });
  private readonly trigger = inject(MenuTrigger, { optional: true });
  private readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);

  protected readonly sheet = signal(false);

  constructor() {
    // Replaced by the consumer's `id`, when it sets one.
    this.cdkMenu.id = `hp-menu-${++nextMenuId}`;
  }

  ngAfterContentInit(): void {
    if (!this.cdkTrigger || !this.trigger) {
      return;
    }
    // Naming: the trigger labels the menu unless the consumer named it.
    if (!this.host.hasAttribute('aria-label') && !this.host.hasAttribute('aria-labelledby')) {
      this.host.setAttribute('aria-labelledby', this.trigger.ensureId());
    }
    const view = this.document.defaultView;
    this.sheet.set(
      this.cdkMenu.items.length > SHEET_ITEM_THRESHOLD &&
        !!view &&
        view.matchMedia(SHEET_MEDIA_QUERY).matches,
    );
    this.trigger.configureOverlay();
  }
}
