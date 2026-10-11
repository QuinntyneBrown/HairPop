import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, ErrorPage, Icon } from '@hairpop/components';

/** Navigation while offline (L2-037, error-page.md): saved appointments stay reachable. */
@Component({
  selector: 'hp-offline-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ErrorPage, Icon, RouterLink],
  template: `
    <hp-error-page
      kind="offline"
      heading="You’re offline"
      text="Saved appointment details remain available. Requests need a connection."
    >
      <button hp-button variant="primary" slot="actions" type="button" (click)="back()">
        <svg hp-icon name="refresh"></svg>Try again
      </button>
      <a hp-button slot="actions" routerLink="/appointments">View saved appointments</a>
    </hp-error-page>
  `,
})
export class OfflinePage {
  private readonly location = inject(Location);

  protected back(): void {
    this.location.back();
  }
}
