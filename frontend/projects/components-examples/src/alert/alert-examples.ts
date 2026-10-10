import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Alert, Button, Icon, Link } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the alert (alert.md): every tone, the banner, actions, dismissal and the error summary. */
@Component({
  selector: 'hp-alert-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Example, Icon, Link],
  template: `
    <hp-example heading="Tones" description="Info is the base look; each tone picks its own icon.">
      <hp-alert heading="Prices are estimates">
        <p>Nia confirms the final price after she reviews your request.</p>
      </hp-alert>
      <hp-alert tone="success" heading="Your changes are saved">
        <p>Nia will see your new notes on request HP-1048.</p>
      </hp-alert>
      <hp-alert tone="warning" heading="Some details are unavailable">
        <p>Reviews could not load.</p>
      </hp-alert>
      <hp-alert tone="danger" heading="We couldn’t cancel this request.">
        <p>Your request is unchanged. Check your connection and try again.</p>
      </hp-alert>
    </hp-example>

    <hp-example heading="Without a heading" description="The body text alone carries the message.">
      <hp-alert>
        <p>Knotless braids take about five hours. Plan a light meal and bring a charger.</p>
      </hp-alert>
    </hp-example>

    <hp-example heading="With actions" description="A targeted next step in the actions slot.">
      <hp-alert tone="warning" heading="Some details are unavailable">
        <p>Reviews could not load.</p>
        <a hp-link variant="inherit" slot="actions" href="#reviews">Retry reviews</a>
      </hp-alert>
      <hp-alert tone="danger" heading="We couldn’t save this change">
        <p>Your details remain here. Please try again.</p>
        <button
          hp-button
          variant="link"
          size="sm"
          slot="actions"
          [busy]="saving()"
          (click)="retrySave()"
        >
          Try again
        </button>
      </hp-alert>
    </hp-example>

    <hp-example
      heading="Dismissible"
      description="The page removes the alert; focus moves to the next control first."
    >
      @if (noteDismissed()) {
        <button hp-button size="sm" (click)="noteDismissed.set(false)">Show the note again</button>
      } @else {
        <hp-alert
          heading="New: request a change"
          dismissLabel="Dismiss: New: request a change"
          (dismissed)="noteDismissed.set(true)"
        >
          <p>You can now ask Nia for a different time from your appointment.</p>
        </hp-alert>
      }
    </hp-example>

    <hp-example
      heading="Banner"
      description="A whole-app condition under the top bar, with a custom icon."
    >
      <hp-alert tone="warning" banner heading="You’re offline">
        <svg hp-icon slot="icon" name="wifi-off"></svg>
        <p>Saved details are shown. Actions need a connection.</p>
      </hp-alert>
    </hp-example>

    <hp-example
      heading="Announced"
      description="Inserted after load: danger takes role alert, other tones role status."
    >
      <button hp-button size="sm" (click)="failed.set(!failed())">
        {{ failed() ? 'Clear the failure' : 'Simulate a failed cancel' }}
      </button>
      @if (failed()) {
        <hp-alert tone="danger" announce heading="We couldn’t cancel this request.">
          <p>Your request is unchanged. Check your connection and try again.</p>
        </hp-alert>
      }
    </hp-example>

    <hp-example
      heading="Error summary"
      description="As the form layout composes it: a focusable group named by its title."
    >
      <hp-alert
        tone="danger"
        class="form-summary"
        tabindex="-1"
        role="group"
        aria-labelledby="alert-example-summary-title"
      >
        <strong id="alert-example-summary-title">Check 1 field before sending</strong>
        <ul>
          <li>
            <a href="#time"
              >Preferred time: Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00
              am.</a
            >
          </li>
        </ul>
      </hp-alert>
    </hp-example>

    <hp-example heading="Long content" description="Text wraps; long words break inside the body.">
      <hp-alert tone="success" heading="Request sent to Amara Nkiruka Adeyemi-Williams">
        <p>
          Your knotless braids request HP-1048 for Sat 24 Oct at 10:00 am is with Amara. The
          estimate is $180–$240 for about five hours. You’ll get an update at
          maya.chen.knotless.braids.requests&#64;example.com as soon as she replies.
        </p>
      </hp-alert>
    </hp-example>
  `,
  styles: `
    hp-alert {
      flex: 1 1 100%;
    }
  `,
})
export class AlertExamples {
  protected readonly noteDismissed = signal(false);
  protected readonly failed = signal(false);
  protected readonly saving = signal(false);

  protected retrySave(): void {
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 1500);
  }
}
