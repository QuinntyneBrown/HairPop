import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, ErrorPage } from '@hairpop/components';

/**
 * A resource the customer may not open (L2-037 AC3, error-page.md). The copy never says whether
 * the resource exists, so it reveals nothing about another customer's data.
 */
@Component({
  selector: 'hp-forbidden-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ErrorPage, RouterLink],
  template: `
    <hp-error-page
      kind="forbidden"
      heading="You can’t open this page"
      text="Sign in with the account you use for your appointments."
    >
      <a hp-button variant="primary" slot="actions" routerLink="/sign-in">Sign in</a>
    </hp-error-page>
  `,
})
export class ForbiddenPage {}
