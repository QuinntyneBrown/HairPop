import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Alert, Button, EmptyState, Icon, Tab, TabContent, Tabs } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for tabs (tabs.md): counts, sizes, overflow, lazy panels and every state. */
@Component({
  selector: 'hp-tabs-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, EmptyState, Example, Icon, Tab, TabContent, Tabs],
  template: `
    <hp-example
      heading="With counts"
      description="My appointments: automatic activation; arrow keys select."
    >
      <div class="story-block">
        <hp-tabs label="Appointments" [(selected)]="appointmentsTab">
          <hp-tab
            value="upcoming"
            label="Upcoming"
            [count]="1"
            countTone="info"
            countText=", 1 awaiting reply"
          >
            <p class="story-panel">
              HP-1048 · Medium knotless braids with Nia Okafor · Sat 24 Oct at 10:00 am · awaiting
              Nia’s reply.
            </p>
          </hp-tab>
          <hp-tab value="past" label="Past" [count]="1">
            <p class="story-panel">
              HP-0992 · Medium knotless braids with Nia Okafor · completed Sat 3 Oct.
            </p>
          </hp-tab>
          <hp-tab value="cancelled" label="Cancelled">
            <hp-empty-state
              size="compact"
              [headingLevel]="3"
              heading="No cancelled appointments"
              text="Appointments you cancel will show here."
            >
              <svg slot="icon" hp-icon name="calendar"></svg>
            </hp-empty-state>
          </hp-tab>
        </hp-tabs>
        <p class="story-note">Selected: {{ appointmentsTab() }}</p>
      </div>
    </hp-example>

    <hp-example
      heading="Manual activation"
      description="Arrow keys move focus; Enter or Space selects."
    >
      <div class="story-block">
        <hp-tabs label="Appointments" activation="manual">
          <hp-tab value="upcoming" label="Upcoming">
            <p class="story-panel">Sat 24 Oct at 10:00 am with Nia Okafor.</p>
          </hp-tab>
          <hp-tab value="past" label="Past">
            <p class="story-panel">Sat 3 Oct with Nia Okafor.</p>
          </hp-tab>
          <hp-tab value="cancelled" label="Cancelled">
            <p class="story-panel">No cancelled appointments.</p>
          </hp-tab>
        </hp-tabs>
      </div>
    </hp-example>

    <hp-example heading="Small" description="32 px tabs, only inside a card or dialog.">
      <div class="story-block">
        <hp-tabs label="Appointments" size="sm">
          <hp-tab value="upcoming" label="Upcoming">
            <p class="story-panel">Sat 24 Oct at 10:00 am.</p>
          </hp-tab>
          <hp-tab value="past" label="Past">
            <p class="story-panel">Sat 3 Oct.</p>
          </hp-tab>
        </hp-tabs>
      </div>
    </hp-example>

    <hp-example heading="Disabled tab" description="Skipped by the arrow keys; never selected.">
      <div class="story-block">
        <hp-tabs label="Appointments">
          <hp-tab value="upcoming" label="Upcoming">
            <p class="story-panel">Sat 24 Oct at 10:00 am with Nia Okafor.</p>
          </hp-tab>
          <hp-tab value="past" label="Past">
            <p class="story-panel">Sat 3 Oct with Nia Okafor.</p>
          </hp-tab>
          <hp-tab value="cancelled" label="Cancelled" disabled>
            <p class="story-panel">No cancelled appointments.</p>
          </hp-tab>
        </hp-tabs>
      </div>
    </hp-example>

    <hp-example
      heading="Scrollable"
      description="Nia’s profile in a narrow container: the list scrolls sideways and keeps the selected tab in view."
    >
      <div class="story-narrow">
        <hp-tabs label="Nia Okafor’s profile" selected="reviews">
          <hp-tab value="about" label="About">
            <p class="story-panel">Nia braids from her studio in Toronto.</p>
          </hp-tab>
          <hp-tab value="services" label="Services">
            <p class="story-panel">Knotless braids from $180, about five hours.</p>
          </hp-tab>
          <hp-tab value="reviews" label="Reviews" [count]="86">
            <p class="story-panel">
              “Nia explained each step and the braids feel comfortable.” — Maya Chen
            </p>
          </hp-tab>
          <hp-tab value="policies" label="Policies">
            <p class="story-panel">Please arrive with your hair washed and detangled.</p>
          </hp-tab>
          <hp-tab value="portfolio" label="Portfolio">
            <p class="story-panel">Recent knotless braids and passion twists.</p>
          </hp-tab>
        </hp-tabs>
      </div>
    </hp-example>

    <hp-example
      heading="Lazy panel"
      description="The Reviews panel renders the first time its tab is selected and is kept afterwards."
    >
      <div class="story-block">
        <hp-tabs label="Nia Okafor’s profile">
          <hp-tab value="about" label="About">
            <p class="story-panel">Nia braids from her studio in Toronto.</p>
          </hp-tab>
          <hp-tab value="reviews" label="Reviews">
            <ng-template hpTabContent>
              <hp-alert tone="warning" heading="Reviews didn’t load">
                Nia’s profile is up to date, but her reviews are not showing right now.
                <button slot="actions" hp-button size="sm" (click)="retries.set(retries() + 1)">
                  Retry reviews
                </button>
              </hp-alert>
              <p class="story-note">Retries: {{ retries() }}</p>
            </ng-template>
          </hp-tab>
        </hp-tabs>
      </div>
    </hp-example>
  `,
  styles: `
    .story-block {
      flex: 1 1 100%;
      min-width: 0;
    }

    .story-narrow {
      flex: 1 1 100%;
      min-width: 0;
      max-width: var(--layout-card-min);
    }

    .story-panel {
      margin: 0;
      padding-block: var(--space-4);
      font: var(--text-body);
      color: var(--color-fg-default);
    }

    .story-note {
      margin: var(--space-2) 0 0;
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }
  `,
})
export class TabsExamples {
  protected readonly appointmentsTab = signal<string | undefined>('upcoming');
  protected readonly retries = signal(0);
}
