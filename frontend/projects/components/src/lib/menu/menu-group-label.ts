import { Directive } from '@angular/core';

/**
 * A visual section label ("Account", "Sort by"); its text is the element's own content.
 * Hidden from assistive technology: every item names itself fully (menu.md D-7).
 */
@Directive({
  selector: 'li[hpMenuGroupLabel]',
  host: {
    class: 'menu__group',
    role: 'none',
    'aria-hidden': 'true',
  },
})
export class MenuGroupLabel {}
