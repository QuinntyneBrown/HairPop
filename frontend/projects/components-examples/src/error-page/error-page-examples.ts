import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, ErrorPage } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the error page (error-page.md): the four kinds plus the retry states. */
@Component({
  selector: 'hp-error-page-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Example, ErrorPage],
  template: `
    <hp-example
      heading="Not found"
      description="Accent tint and search icon, so a wrong link does not feel like a failure."
    >
      <hp-error-page
        class="demo"
        kind="not-found"
        heading="We couldn’t find that page"
        text="The link may be old, or the address may have changed."
      >
        <a hp-button slot="actions" variant="primary" href="#">Explore styles</a>
      </hp-error-page>
    </hp-example>

    <hp-example heading="Forbidden" description="Warning tint and lock icon.">
      <hp-error-page
        class="demo"
        kind="forbidden"
        heading="You can’t open this page"
        text="Sign in with the account you use for your appointments."
      >
        <a hp-button slot="actions" variant="primary" href="#">Sign in</a>
      </hp-error-page>
    </hp-example>

    <hp-example
      heading="Server error"
      description="Error tint, “Try again”, “Contact support” and the reference."
    >
      <hp-error-page
        class="demo"
        kind="server-error"
        heading="HairPop needs a moment"
        text="We couldn’t load this page. Your booking request has not been resent."
        reference="Reference: HP-ERR-7F3K2Q · Sat 10 Oct, 9:42 am"
      >
        <button hp-button slot="actions" variant="primary">Try again</button>
        <a hp-button slot="actions" href="#">Contact support</a>
      </hp-error-page>
    </hp-example>

    <hp-example heading="Offline" description="Warning tint and wifi-off icon.">
      <hp-error-page
        class="demo"
        kind="offline"
        heading="You’re offline"
        text="Saved appointment details remain available. Requests need a connection."
      >
        <button hp-button slot="actions" variant="primary">Try again</button>
        <a hp-button slot="actions" href="#">View saved appointments</a>
      </hp-error-page>
    </hp-example>

    <hp-example heading="Retrying" description="busy on the page and on the “Try again” button.">
      <hp-error-page
        class="demo"
        kind="offline"
        heading="You’re offline"
        text="Saved appointment details remain available. Requests need a connection."
        busy
      >
        <button hp-button slot="actions" variant="primary" busy>Try again</button>
        <a hp-button slot="actions" href="#">View saved appointments</a>
      </hp-error-page>
    </hp-example>

    <hp-example
      heading="Retry failed (interactive)"
      description="The failure is announced assertively; focus stays on “Try again”."
    >
      <hp-error-page
        class="demo"
        kind="server-error"
        heading="HairPop needs a moment"
        text="We couldn’t load this page. Your booking request has not been resent."
        reference="Reference: HP-ERR-7F3K2Q · Sat 10 Oct, 9:42 am"
        [busy]="retrying()"
        [status]="status()"
      >
        <button hp-button slot="actions" variant="primary" [busy]="retrying()" (click)="retry()">
          Try again
        </button>
        <a hp-button slot="actions" href="#">Contact support</a>
      </hp-error-page>
    </hp-example>
  `,
  styles: `
    .demo {
      flex: 1 1 100%;
    }
  `,
})
export class ErrorPageExamples {
  protected readonly retrying = signal(false);
  protected readonly status = signal<string | null>(null);

  protected retry(): void {
    this.retrying.set(true);
    this.status.set(null);
    setTimeout(() => {
      this.retrying.set(false);
      this.status.set('HairPop still needs a moment. Try again shortly.');
    }, 1500);
  }
}
