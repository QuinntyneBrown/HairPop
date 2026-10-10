import { Directive, TemplateRef, inject } from '@angular/core';

/**
 * Marks lazily rendered panel content inside an `hp-tab`. The template is
 * instantiated the first time its tab is selected and kept afterwards (D-7).
 */
@Directive({
  selector: 'ng-template[hpTabContent]',
})
export class TabContent {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
