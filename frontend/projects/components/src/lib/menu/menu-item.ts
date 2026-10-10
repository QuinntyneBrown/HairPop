import { CdkMenuItem } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';

/** Item tones: `danger` for destructive items, last, after a divider. */
export type MenuItemTone = 'default' | 'danger';

/**
 * A menu item (`role="menuitem"`) on a native `button` or `a href` (menu.md D-1).
 * `disabled` sets `aria-disabled` and keeps the item focusable (D-6); `triggered`
 * emits on click, Enter or Space and the menu closes.
 */
@Component({
  selector: 'button[hp-menu-item], a[hp-menu-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: CdkMenuItem,
      inputs: ['cdkMenuItemDisabled: disabled'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
  ],
  host: {
    class: 'menu__item',
    // D-6: a bare `disabled` attribute must not become native `disabled`; the item stays focusable.
    '[attr.disabled]': 'null',
    // A button item never submits a surrounding form.
    '[attr.type]': "isButton ? 'button' : null",
    '[class.menu__item--danger]': "tone() === 'danger'",
  },
  template: '<ng-content />',
})
export class MenuItem {
  /** `danger` adds `.menu__item--danger`. */
  readonly tone = input<MenuItemTone>('default');

  /** The host tag, read once. */
  protected readonly isButton =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName === 'BUTTON';
}
