import { Directive } from '@angular/core';

/** A hairline between groups of items; destructive items sit after one. */
@Directive({
  selector: 'li[hpMenuDivider]',
  host: {
    class: 'menu__divider',
    role: 'separator',
  },
})
export class MenuDivider {}
