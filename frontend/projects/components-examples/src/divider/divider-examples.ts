import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, Divider, Link } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the divider (divider.md): horizontal, labelled and vertical, on each surface. */
@Component({
  selector: 'hp-divider-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Divider, Example, Link],
  template: `
    <hp-example heading="Horizontal" description="An hr rule between topics inside a card.">
      <div hp-card class="demo">
        <p>Nia received your request for knotless braids on Sat 24 Oct at 10:00 am.</p>
        <hr hp-divider />
        <p class="text-muted">Notifications older than 30 days are archived.</p>
      </div>
    </hp-example>

    <hp-example
      heading="Labelled"
      description="A div or span host names the split: “Earlier” between notification dates."
    >
      <div class="demo">
        <p>Nia received your request</p>
        <div hp-divider>Earlier</div>
        <p>How to prepare for knotless braids</p>
      </div>
    </hp-example>

    <hp-example heading="Labelled “or”" description="Between signing in and creating an account.">
      <div class="demo">
        <a hp-link variant="standalone" href="#">Sign in</a>
        <div hp-divider>or</div>
        <a hp-link variant="standalone" href="#">Create account</a>
      </div>
    </hp-example>

    <hp-example heading="Vertical" description="Separates inline groups in a footer row.">
      <div class="row">
        <span>HairPop · Made for confident hair decisions</span>
        <span hp-divider orientation="vertical"></span>
        <a hp-link variant="inherit" href="#">Terms</a>
        <a hp-link variant="inherit" href="#">Privacy</a>
      </div>
    </hp-example>

    <hp-example
      heading="On a sunken surface"
      description="Inside a well: same rule and label tokens."
    >
      <div class="demo well">
        <p>Pay Nia directly at your appointment.</p>
        <div hp-divider>or</div>
        <p>Send a deposit when Nia confirms the time.</p>
      </div>
    </hp-example>

    <hp-example
      heading="Long label"
      description="The label wraps inside its span and the two lines shrink; nothing overflows."
    >
      <div class="demo narrow">
        <div hp-divider>Updates about your previous appointment HP-0992 on Sat 3 Oct</div>
      </div>
    </hp-example>
  `,
  styles: `
    .demo {
      flex: 1 1 100%;
    }

    .narrow {
      max-width: var(--layout-sidebar-width);
    }

    .well {
      padding: var(--space-4);
      background: var(--color-bg-surface-sunken);
      border-radius: var(--radius-md);
    }

    .row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-3);
      color: var(--color-fg-muted);
      font: var(--text-body-sm);
    }
  `,
})
export class DividerExamples {}
