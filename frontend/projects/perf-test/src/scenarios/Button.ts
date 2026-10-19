import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@hairpop/components';

/** The booking form's primary submit. */
@Component({
  selector: 'hp-button-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  template: `<button hp-button variant="primary" type="submit">Send request</button>`,
})
export default class ButtonScenario {}
