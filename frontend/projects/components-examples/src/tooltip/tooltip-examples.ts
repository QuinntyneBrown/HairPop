import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Icon, Tooltip } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the tooltip (tooltip.md): names icon-only controls on hover and keyboard focus. */
@Component({
  selector: 'hp-tooltip-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Example, Icon, Tooltip],
  template: `
    <hp-example
      heading="Text"
      description="Hover for 300 ms or Tab to a control; the text equals the control’s aria-label."
    >
      <hp-tooltip text="Edit request">
        <button hp-button iconOnly aria-label="Edit request">
          <svg hp-icon name="edit"></svg>
        </button>
      </hp-tooltip>
      <hp-tooltip text="Close dialog">
        <button hp-button variant="ghost" iconOnly aria-label="Close dialog">
          <svg hp-icon name="close"></svg>
        </button>
      </hp-tooltip>
      <hp-tooltip text="More actions">
        <button hp-button variant="ghost" iconOnly aria-label="More actions for HP-1048">
          <svg hp-icon name="more"></svg>
        </button>
      </hp-tooltip>
    </hp-example>

    <hp-example heading="With shortcut" description="A desktop power feature shows its key.">
      <hp-tooltip text="Search styles" shortcut="/">
        <button hp-button iconOnly aria-label="Search styles">
          <svg hp-icon name="search"></svg>
        </button>
      </hp-tooltip>
    </hp-example>

    <hp-example
      heading="Below"
      description="Prefers the side below; the CDK flips it when there is no room."
    >
      <hp-tooltip text="Filters" position="below">
        <button hp-button iconOnly aria-label="Filters">
          <svg hp-icon name="filter"></svg>
        </button>
      </hp-tooltip>
    </hp-example>

    <hp-example
      heading="Disabled trigger"
      description="A disabled control never shows its tooltip."
    >
      <hp-tooltip text="Filters">
        <button hp-button iconOnly disabled aria-label="Filters">
          <svg hp-icon name="filter"></svg>
        </button>
      </hp-tooltip>
    </hp-example>
  `,
})
export class TooltipExamples {}
