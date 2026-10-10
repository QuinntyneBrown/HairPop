import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Button, Spinner } from '@hairpop/components';

import { Example } from '../shared';

/**
 * Stories for the spinner (spinner.md): sizes, standalone and inline, and the timing states.
 * Every spinner paints about 300 ms after it becomes active and stays at least 500 ms.
 */
@Component({
  selector: 'hp-spinner-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Example, Spinner],
  template: `
    <hp-example
      heading="Sizes"
      description="Standalone rings with visually hidden labels: sm, md and lg."
    >
      <hp-spinner size="sm" label="Saving…" />
      <hp-spinner label="Refreshing your appointments" />
      <hp-spinner size="lg" label="Loading Nia’s reviews" />
    </hp-example>

    <hp-example heading="Inline" description="Ring plus visible text in one row.">
      <hp-spinner inline size="sm" label="Sending your message to Nia…" />
      <hp-spinner inline label="Refreshing braiders near Toronto…" />
      <hp-spinner inline size="lg" label="Checking Nia’s availability…" />
    </hp-example>

    <hp-example
      heading="Active, interactive"
      description="Toggle active: the ring waits 300 ms before painting and holds at least 500 ms once shown."
    >
      <button hp-button (click)="refreshing.set(!refreshing())">
        {{ refreshing() ? 'Stop refreshing' : 'Refresh braiders' }}
      </button>
      <hp-spinner inline label="Refreshing braiders near Toronto…" [active]="refreshing()" />
    </hp-example>

    <hp-example
      heading="Finished early"
      description="Work that ends before 300 ms never paints the ring and announces nothing."
    >
      <button hp-button (click)="quickCheck()">Check a saved braider</button>
      <hp-spinner inline label="Checking Aisha’s availability…" [active]="checking()" />
    </hp-example>

    <hp-example
      heading="Label changed"
      description="A new label replaces the old one while spinning and is announced once."
    >
      <button hp-button (click)="nextStep()">Next step</button>
      <hp-spinner inline [label]="stepLabel()" />
    </hp-example>

    <hp-example
      heading="Under @if"
      description="Rendered only while the work runs, with the default active."
    >
      <button hp-button (click)="sending.set(!sending())">
        {{ sending() ? 'Finish sending' : 'Send request HP-1048' }}
      </button>
      @if (sending()) {
        <hp-spinner inline size="sm" label="Sending your request to Nia…" />
      }
    </hp-example>

    <hp-example heading="Long label" description="The inline label wraps instead of truncating.">
      <hp-spinner
        inline
        label="Refreshing knotless braiders near Toronto with openings on Sat 24 Oct and Sun 25 Oct…"
      />
    </hp-example>
  `,
})
export class SpinnerExamples {
  private readonly steps = [
    'Checking Nia’s availability…',
    'Holding Sat 24 Oct, 10:00 am…',
    'Sending your request to Nia…',
  ];
  private readonly step = signal(0);

  protected readonly refreshing = signal(true);
  protected readonly checking = signal(false);
  protected readonly sending = signal(false);
  protected readonly stepLabel = computed(() => this.steps[this.step()]);

  protected quickCheck(): void {
    this.checking.set(true);
    // Ends well before the 300 ms show delay.
    setTimeout(() => this.checking.set(false), 100);
  }

  protected nextStep(): void {
    this.step.update((step) => (step + 1) % this.steps.length);
  }
}
