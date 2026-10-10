import { CdkMenuItemRadio } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A `role="menuitemradio"` item. Radios in one menu are exclusive (one radio set per
 * menu, menu.md D-7); `checked` mirrors `aria-checked` and the consumer updates it
 * from `triggered`. The menu closes on activation.
 */
@Component({
  selector: 'button[hp-menu-item-radio]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: CdkMenuItemRadio,
      inputs: ['cdkMenuItemDisabled: disabled', 'cdkMenuItemChecked: checked'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
  ],
  host: {
    class: 'menu__item',
    type: 'button',
    // D-6: a bare `disabled` attribute must not become native `disabled`; the item stays focusable.
    '[attr.disabled]': 'null',
  },
  template: '<ng-content />',
})
export class MenuItemRadio {}
