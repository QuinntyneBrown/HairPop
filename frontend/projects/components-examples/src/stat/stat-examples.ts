import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, Fact, FactGrid, Stat } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the stat (stat.md): fact tiles in a fact grid, and the stat with its delta. */
@Component({
  selector: 'hp-stat-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Example, Fact, FactGrid, Stat],
  template: `
    <hp-example heading="Fact grid" description="“What to expect” on the knotless braids style.">
      <div class="story-block">
        <div hp-fact-grid>
          <div hp-fact value="4–7 hours" label="Typical time"></div>
          <div hp-fact value="$160–$300" label="Typical price"></div>
          <div hp-fact value="4–8 weeks" label="Typical wear"></div>
        </div>
      </div>
    </hp-example>

    <hp-example heading="Two facts" description="Nia Okafor’s service facts, side by side.">
      <div class="story-block">
        <div hp-fact-grid>
          <div hp-fact value="From $180" label="Knotless braids"></div>
          <div hp-fact value="5 hours" label="Typical duration"></div>
        </div>
      </div>
    </hp-example>

    <hp-example
      heading="Not listed"
      description="A null value omits the tile; the others fill the row."
    >
      <div class="story-block">
        <div hp-fact-grid>
          <div hp-fact value="4–7 hours" label="Typical time"></div>
          <div hp-fact value="$160–$300" label="Typical price"></div>
          <div hp-fact [value]="null" label="Typical wear"></div>
        </div>
      </div>
    </hp-example>

    <hp-example
      heading="Loading facts"
      description="The grid is busy; each tile keeps its loaded height."
    >
      <div class="story-block">
        <div hp-fact-grid busy>
          <div hp-fact loading [value]="null" label="Typical time"></div>
          <div hp-fact loading [value]="null" label="Typical price"></div>
          <div hp-fact loading [value]="null" label="Typical wear"></div>
        </div>
      </div>
    </hp-example>

    <hp-example
      heading="Loading, then loaded"
      description="Toggle the facts arriving after their card."
    >
      <div class="story-block">
        <button hp-button size="sm" (click)="loaded.set(!loaded())">
          {{ loaded() ? 'Show loading' : 'Load facts' }}
        </button>
        <div hp-fact-grid [busy]="!loaded()">
          <div hp-fact [loading]="!loaded()" value="From $180" label="Knotless braids"></div>
          <div hp-fact [loading]="!loaded()" value="5 hours" label="Typical duration"></div>
        </div>
      </div>
    </hp-example>

    <hp-example
      heading="Long value"
      description="Text wraps inside the tile; tiles stay equal height."
    >
      <div class="story-block">
        <div hp-fact-grid>
          <div hp-fact value="From $1,240" label="Waist-length knotless, extra small"></div>
          <div hp-fact value="5 hours" label="Typical duration"></div>
        </div>
      </div>
    </hp-example>

    <hp-example heading="On a sunken well" description="Tiles take the surface fill.">
      <div class="story-block well">
        <div hp-fact-grid>
          <div hp-fact value="From $180" label="Knotless braids"></div>
          <div hp-fact value="5 hours" label="Typical duration"></div>
        </div>
      </div>
    </hp-example>

    <hp-example heading="Stat with trend" description="The arrow only reinforces the words.">
      <div
        hp-stat
        label="Requests this month"
        value="24"
        delta="+6 from September"
        trend="up"
      ></div>
      <div
        hp-stat
        label="Average reply time"
        value="3 h"
        delta="1 h slower than September"
        trend="down"
      ></div>
    </hp-example>

    <hp-example heading="Stat states">
      <div hp-stat label="Requests this month" value="0" delta="No requests yet"></div>
      <div hp-stat label="Reviews" value="1,284"></div>
      <div hp-stat loading label="Requests this month" value="24"></div>
    </hp-example>
  `,
  styles: `
    .story-block {
      flex: 1 1 100%;
      min-width: 0;
    }

    .well {
      padding: var(--space-4);
      border-radius: var(--radius-md);
      background: var(--color-bg-surface-sunken);
    }
  `,
})
export class StatExamples {
  protected readonly loaded = signal(false);
}
