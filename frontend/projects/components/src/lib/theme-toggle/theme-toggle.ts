import { Directive, effect, inject } from '@angular/core';

import { Button } from '../button/button';
import { ThemeService } from './theme.service';

/**
 * Turns a ghost small `button[hp-button]` into the theme control (theme-toggle.md): the Button's
 * `pressed` state mirrors the dark theme, so the label stays constant (D-3). It adds no styles.
 */
@Directive({
  selector: 'button[hp-button][hpThemeToggle]',
  host: {
    class: 'theme-toggle',
    '(click)': 'theme.toggle()',
  },
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  private readonly button = inject(Button);

  constructor() {
    effect(() => this.button.pressed.set(this.theme.theme() === 'dark'));
  }
}
