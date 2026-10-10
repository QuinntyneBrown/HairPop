import { CdkMenuItemCheckbox } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A `role="menuitemcheckbox"` item. `checked` mirrors `aria-checked`; the consumer
 * updates it from `triggered`. The menu closes on activation.
 */
@Component({
  selector: 'button[hp-menu-item-checkbox]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: CdkMenuItemCheckbox,
      inputs: ['cdkMenuItemDisabled: disabled', 'cdkMenuItemChecked: checked'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
  ],
  host: {
    class: 'menu__item',
    // D-6: a bare `disabled` attribute must not become native `disabled`; the item stays focusable.
    '[attr.disabled]': 'null',
  },
  template: '<ng-content />',
})
export class MenuItemCheckbox {}
