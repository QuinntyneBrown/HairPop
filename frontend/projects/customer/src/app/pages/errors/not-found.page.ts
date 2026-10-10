import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, ErrorPage } from '@hairpop/components';

/** Unknown routes and unknown or unpublished resources (L2-037 AC1, error-page.md). */
@Component({
  selector: 'hp-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ErrorPage, RouterLink],
  template: `
    <hp-error-page
      kind="not-found"
      heading="We couldn’t find that page"
      text="The link may be old, or the address may have changed."
    >
      <a hp-button variant="primary" slot="actions" routerLink="/">Explore styles</a>
    </hp-error-page>
  `,
})
export class NotFoundPage {}
