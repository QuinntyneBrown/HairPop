import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, ThemeToggle } from '@hairpop/components';

/** The top bar's theme control. */
@Component({
  selector: 'hp-theme-toggle-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ThemeToggle],
  template: `<button hp-button variant="ghost" size="sm" hpThemeToggle>Dark theme</button>`,
})
export default class ThemeToggleScenario {}
