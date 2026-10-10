import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert, Card, Link } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the link (link.md): inline, standalone, external and inherit. */
@Component({
  selector: 'hp-link-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Card, Example, Link],
  template: `
    <hp-example heading="Inline" description="Inside running text; never carries an icon.">
      <p>Read <a hp-link href="#">Nia’s cancellation policy</a> before you send a request.</p>
    </hp-example>

    <hp-example heading="Inline, alone on its line">
      <a hp-link href="#">Report a review</a>
    </hp-example>

    <hp-example
      heading="Standalone"
      description="The one link that ends a card; the arrow shifts on hover."
    >
      <a hp-link variant="standalone" href="#">Explore Knotless braids</a>
      <a hp-link variant="standalone" href="#">Explore Nia Okafor</a>
      <a hp-link variant="standalone" href="#">Explore Aisha Mensah</a>
      <a hp-link variant="standalone" href="#">Explore Jules Baptiste</a>
    </hp-example>

    <hp-example
      heading="External"
      description="Opens in a new tab with a hidden “(opens in a new tab)” hint."
    >
      <a
        hp-link
        variant="external"
        href="https://www.w3.org/TR/WCAG22/"
        newTabText=" (opens in a new tab)"
        >WCAG 2.2 guidelines</a
      >
    </hp-example>

    <hp-example
      heading="Inherit"
      description="Takes the container’s text colour inside alerts and the footer."
    >
      <hp-alert tone="warning" heading="Some details are unavailable">
        Reviews didn’t load. <a hp-link variant="inherit" href="#">Retry reviews</a>
      </hp-alert>
      <p class="footer-text">
        <a hp-link variant="inherit" href="#">Terms</a>
        ·
        <a hp-link variant="inherit" href="#">Privacy</a>
      </p>
    </hp-example>

    <hp-example
      heading="Long label in a narrow card"
      description="The standalone label wraps and the arrow stays at the end of the row."
    >
      <div hp-card class="narrow">
        <a hp-link variant="standalone" href="#">Explore How requests work and what to expect</a>
      </div>
    </hp-example>
  `,
  styles: `
    .footer-text {
      color: var(--color-fg-muted);
      font: var(--text-body-sm);
    }

    .narrow {
      max-width: var(--layout-sidebar-width);
    }
  `,
})
export class LinkExamples {}
