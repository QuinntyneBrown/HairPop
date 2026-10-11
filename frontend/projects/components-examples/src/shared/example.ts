import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * One story: a titled canvas that renders a component in a single state.
 * Every examples page composes these, so stories share one frame in the storybook.
 */
@Component({
  selector: 'hp-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="example" [attr.aria-labelledby]="headingId">
      <h2 class="example__title" [id]="headingId">{{ heading() }}</h2>
      @if (description()) {
        <p class="example__description">{{ description() }}</p>
      }
      <div class="example__canvas">
        <ng-content />
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .example {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .example__title {
      margin: 0;
      font: var(--text-h4);
      color: var(--color-fg-default);
    }

    .example__description {
      margin: 0;
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }

    .example__canvas {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-6);
      background: var(--color-bg-surface);
      border: var(--border-width-hairline) solid var(--color-border-default);
      border-radius: var(--radius-lg);
    }
  `,
})
export class Example {
  private static nextId = 0;

  /** Story name shown above the canvas. */
  readonly heading = input.required<string>();
  /** Optional one-line note on what the story shows. */
  readonly description = input<string | null>(null);

  protected readonly headingId = `hp-example-${Example.nextId++}`;
}
