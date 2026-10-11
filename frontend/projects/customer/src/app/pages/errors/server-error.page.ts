import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Button, ErrorPage, Icon } from '@hairpop/components';
import { clockTime, shortDate } from '@hairpop/api';

/**
 * A server error (L2-037 AC4, error-page.md). The API's support reference and time arrive as
 * the `reference` and `at` query parameters. Try again goes back rather than replaying the
 * failed request, so a state-changing action is never resent silently.
 */
@Component({
  selector: 'hp-server-error-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ErrorPage, Icon],
  template: `
    <hp-error-page
      kind="server-error"
      heading="HairPop needs a moment"
      text="We couldn’t load this page. Your booking request has not been resent."
      [reference]="referenceLine()"
    >
      <button hp-button variant="primary" slot="actions" type="button" (click)="back()">
        <svg hp-icon name="refresh"></svg>Try again
      </button>
      <a hp-button slot="actions" href="mailto:support@hairpop.example">Contact support</a>
    </hp-error-page>
  `,
})
export class ServerErrorPage {
  private readonly location = inject(Location);

  readonly reference = input<string>();
  readonly at = input<string>();

  protected readonly referenceLine = computed(() => {
    const reference = this.reference();
    if (!reference) {
      return null;
    }
    const at = this.at();
    return at
      ? `Reference: ${reference} · ${shortDate(at)}, ${clockTime(at)}`
      : `Reference: ${reference}`;
  });

  protected back(): void {
    this.location.back();
  }
}
