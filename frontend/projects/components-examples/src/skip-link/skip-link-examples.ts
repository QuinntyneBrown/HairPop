import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkipLink } from '@hairpop/components';

import { Example } from '../shared';

/**
 * Stories for the skip link (skip-link.md). Each story is a small positioned page: the link
 * hides above it and slides in on keyboard focus. Click into the frame's text, then press Tab.
 */
@Component({
  selector: 'hp-skip-link-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Example, SkipLink],
  template: `
    <hp-example
      heading="Skip to content"
      description="Tab into the frame: the link appears; Enter moves focus to the main region."
    >
      <div class="skip-link-examples__page">
        <a hp-skip-link target="skip-link-examples-main">Skip to content</a>
        <p class="skip-link-examples__chrome">HairPop · Styles · Braiders · Appointments</p>
        <div id="skip-link-examples-main" class="skip-link-examples__main">
          Knotless braids with Nia Okafor · Sat 24 Oct, 10:00 am
        </div>
      </div>
    </hp-example>

    <hp-example
      heading="Skip to a named region"
      description="A second skip link in front of a long filter area."
    >
      <div class="skip-link-examples__page">
        <a hp-skip-link target="skip-link-examples-results">Skip to results</a>
        <p class="skip-link-examples__chrome">Filters: knotless braids · within 10 km of Toronto</p>
        <div id="skip-link-examples-results" class="skip-link-examples__main">
          3 braiders: Nia Okafor, Aisha Mensah, Jules Baptiste
        </div>
      </div>
    </hp-example>

    <hp-example
      heading="Target missing"
      description="No element has the target id: focus stays on the link and development mode logs an error."
    >
      <div class="skip-link-examples__page">
        <a hp-skip-link target="skip-link-examples-missing">Skip to content</a>
        <p class="skip-link-examples__chrome">This frame has no element with the target id.</p>
      </div>
    </hp-example>
  `,
  styles: `
    .skip-link-examples__page {
      position: relative;
      overflow: hidden;
      flex: 1 1 100%;
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      padding: var(--space-16) var(--space-4) var(--space-4);
      background: var(--color-bg-canvas);
      border-radius: var(--radius-md);
    }

    .skip-link-examples__chrome {
      margin: 0;
      color: var(--color-fg-muted);
    }

    .skip-link-examples__main {
      padding: var(--space-4);
      border: var(--border-width-hairline) solid var(--color-border-default);
      border-radius: var(--radius-md);
    }
  `,
})
export class SkipLinkExamples {}
