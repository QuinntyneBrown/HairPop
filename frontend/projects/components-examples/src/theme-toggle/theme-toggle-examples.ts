import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button, ThemeService, ThemeToggle } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the theme toggle (theme-toggle.md): the control and the service behind it. */
@Component({
  selector: 'hp-theme-toggle-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Example, ThemeToggle],
  template: `
    <hp-example
      heading="Toggle"
      description="A ghost small button; the label stays “Dark theme” and aria-pressed carries the state. Activating it switches this storybook's theme and saves the choice."
    >
      <button hp-button variant="ghost" size="sm" hpThemeToggle>Dark theme</button>
      <p class="story-note">Applied theme: {{ theme.theme() }}</p>
    </hp-example>
  `,
})
export class ThemeToggleExamples {
  protected readonly theme = inject(ThemeService);
}
