import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Button, Progress, ProgressField, ProgressStatus } from '@hairpop/components';

import { Example } from '../shared';

/** Inspiration photos in the upload story. */
const PHOTO_TOTAL = 3;

/** Stories for the progress bar (progress-bar.md): the bar, the field, every status and value. */
@Component({
  selector: 'hp-progress-bar-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Example, Progress, ProgressField],
  template: `
    <hp-example
      heading="Upload, interactive"
      description="A progress field with a count, an action, and the success and danger endings."
    >
      <div class="progress-bar-examples__frame">
        <hp-progress-field
          [label]="uploadLabel()"
          [displayValue]="uploaded() + ' of ' + total"
          [value]="uploaded()"
          [max]="total"
          [status]="uploadStatus()"
          [valueText]="uploaded() + ' of ' + total + ' photos' + (failed() ? ', stopped' : '')"
        >
          @if (failed()) {
            <button hp-button size="sm" slot="action" (click)="retry()">Retry upload</button>
          }
          @if (!failed() && !done()) {
            <button hp-button size="sm" slot="action" (click)="reset()">Cancel upload</button>
          }
        </hp-progress-field>
      </div>
      <button hp-button variant="primary" [disabled]="done() || failed()" (click)="next()">
        Upload next photo
      </button>
      <button hp-button [disabled]="done() || failed()" (click)="failed.set(true)">
        Lose the connection
      </button>
      <button hp-button variant="ghost" (click)="reset()">Start again</button>
    </hp-example>

    <hp-example heading="Determinate" description="Starting, in progress and full.">
      <div class="progress-bar-examples__frame">
        <hp-progress-field label="Uploading braids-front.jpg" displayValue="0%" [value]="0" />
        <hp-progress-field label="Uploading braids-side.jpg" displayValue="40%" [value]="40" />
        <hp-progress-field
          label="Request HP-1048 steps"
          displayValue="2 of 3"
          [value]="2"
          [max]="3"
          valueText="Step 2 of 3"
        />
      </div>
    </hp-example>

    <hp-example
      heading="Indeterminate"
      description="Value null while running: the length is unknown."
    >
      <div class="progress-bar-examples__frame">
        <hp-progress-field label="Preparing your appointment history" />
      </div>
    </hp-example>

    <hp-example heading="Success" description="Full when the value is null or equals max.">
      <div class="progress-bar-examples__frame">
        <hp-progress-field
          label="Photos uploaded"
          displayValue="3 of 3"
          [value]="3"
          [max]="3"
          status="success"
          valueText="3 of 3 photos"
        />
        <hp-progress-field label="Appointment history ready" status="success" />
      </div>
    </hp-example>

    <hp-example
      heading="Danger"
      description="The fill stays at the reached value, or full when unknown."
    >
      <div class="progress-bar-examples__frame">
        <hp-progress-field
          label="Upload stopped: connection lost"
          displayValue="1 of 3"
          [value]="1"
          [max]="3"
          status="danger"
          valueText="1 of 3 photos, stopped"
        >
          <button hp-button size="sm" slot="action">Retry upload</button>
        </hp-progress-field>
        <hp-progress-field label="Export failed" status="danger" />
      </div>
    </hp-example>

    <hp-example heading="Bar only" description="A dense row names the bar with aria-label.">
      <div class="progress-bar-examples__frame">
        <div hp-progress aria-label="Uploading braids-front.jpg" [value]="40"></div>
        <div hp-progress aria-label="Uploading braids-back.jpg"></div>
        <div hp-progress aria-label="Uploaded braids-side.jpg" status="success" [value]="100"></div>
        <div
          hp-progress
          aria-label="Upload of braids-top.jpg stopped"
          status="danger"
          [value]="70"
        ></div>
      </div>
    </hp-example>

    <hp-example
      heading="Long label"
      description="The label wraps; the count and action stay readable."
    >
      <div class="progress-bar-examples__frame">
        <hp-progress-field
          label="Uploading inspiration photos for knotless braids with Nia Okafor on Sat 24 Oct"
          displayValue="2 of 3"
          [value]="2"
          [max]="3"
          valueText="2 of 3 photos"
        >
          <button hp-button size="sm" slot="action">Cancel upload</button>
        </hp-progress-field>
      </div>
    </hp-example>
  `,
  styles: `
    .progress-bar-examples__frame {
      display: flex;
      flex: 1 1 100%;
      flex-direction: column;
      gap: var(--space-4);
    }
  `,
})
export class ProgressBarExamples {
  protected readonly total = PHOTO_TOTAL;
  protected readonly uploaded = signal(1);
  protected readonly failed = signal(false);
  protected readonly done = computed(() => this.uploaded() >= this.total);

  protected readonly uploadStatus = computed<ProgressStatus>(() =>
    this.failed() ? 'danger' : this.done() ? 'success' : 'running',
  );
  protected readonly uploadLabel = computed(() =>
    this.failed()
      ? 'Upload stopped: connection lost'
      : this.done()
        ? 'Photos uploaded'
        : 'Uploading inspiration photos',
  );

  protected next(): void {
    this.uploaded.update((count) => Math.min(count + 1, this.total));
  }

  protected retry(): void {
    this.failed.set(false);
  }

  protected reset(): void {
    this.failed.set(false);
    this.uploaded.set(0);
  }
}
