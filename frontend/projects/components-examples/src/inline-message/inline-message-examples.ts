import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Button, Icon, InlineMessage, InlineMessageTone } from '@hairpop/components';

import { Example } from '../shared';

type SaveState = 'idle' | 'saving' | 'saved' | 'device' | 'failed';

/** Stories for the inline message (inline-message.md): hint, error, counter and status. */
@Component({
  selector: 'hp-inline-message-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Example, Icon, InlineMessage],
  template: `
    <hp-example heading="Hint" description="What to enter, before anyone makes a mistake.">
      <span hp-inline-message>Use at least 12 characters.</span>
      <span hp-inline-message kind="hint">Braiders text this number.</span>
    </hp-example>

    <hp-example
      heading="Error"
      description="What is wrong and how to fix it; the ⚠ glyph is silent."
    >
      <span hp-inline-message kind="error">Enter an email address like name&#64;example.com.</span>
      <span hp-inline-message kind="error"
        >Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am.</span
      >
    </hp-example>

    <hp-example heading="Counter" description="Characters used against a limit.">
      <span hp-inline-message kind="counter">56 of 500 characters</span>
      <span hp-inline-message kind="counter" over>225 of 200 characters</span>
    </hp-example>

    <hp-example
      heading="Status, in progress"
      description="Pulsing dot; role status from the first render."
    >
      <p hp-inline-message kind="status" progress>Sending your request to Nia…</p>
    </hp-example>

    <hp-example
      heading="Status tones"
      description="Neutral, success, warning and danger, with a leading icon."
    >
      <p hp-inline-message kind="status">Saving…</p>
      <p hp-inline-message kind="status" tone="success">
        <svg hp-icon name="check" size="sm"></svg>Saved just now
      </p>
      <p hp-inline-message kind="status" tone="warning">
        <svg hp-icon name="warning" size="sm"></svg>Saved on this device only
      </p>
      <p hp-inline-message kind="status" tone="danger">
        <svg hp-icon name="alert-circle" size="sm"></svg>Not saved
      </p>
    </hp-example>

    <hp-example heading="Static status" description="live false: no role, read in place.">
      <p hp-inline-message kind="status" tone="success" [live]="false">
        <svg hp-icon name="check" size="sm"></svg>Request HP-1048 sent Sat 10 Oct
      </p>
    </hp-example>

    <hp-example
      heading="Long content"
      description="Wraps and breaks long words in a narrow column."
    >
      <div class="narrow">
        <span hp-inline-message kind="error"
          >Enter an email address like maya.chen.knotless.braids.toronto&#64;example.com.</span
        >
      </div>
    </hp-example>

    <hp-example
      heading="Interactive"
      description="A save cycle beside a form’s actions; changes are announced politely."
    >
      <p hp-inline-message kind="status" [tone]="tone()" [progress]="state() === 'saving'">
        {{ copy() }}
      </p>
      <button hp-button variant="primary" [busy]="state() === 'saving'" (click)="save()">
        Save changes
      </button>
      <button hp-button (click)="state.set('device')">Go offline</button>
      <button hp-button (click)="state.set('failed')">Fail</button>
    </hp-example>
  `,
  styles: `
    .narrow {
      max-width: var(--layout-sidebar-width);
    }
  `,
})
export class InlineMessageExamples {
  protected readonly state = signal<SaveState>('idle');

  protected readonly tone = computed<InlineMessageTone>(() => {
    switch (this.state()) {
      case 'saved':
        return 'success';
      case 'device':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'neutral';
    }
  });

  protected readonly copy = computed(() => {
    switch (this.state()) {
      case 'saving':
        return 'Saving…';
      case 'saved':
        return 'Saved just now';
      case 'device':
        return 'Saved on this device only';
      case 'failed':
        return 'Not saved';
      default:
        return '';
    }
  });

  protected save(): void {
    this.state.set('saving');
    setTimeout(() => this.state.set('saved'), 1500);
  }
}
