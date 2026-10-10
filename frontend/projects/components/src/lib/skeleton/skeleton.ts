import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Block shapes: a text line, a heading bar, an avatar circle, a sized rectangle or 3:2 media. */
export type SkeletonShape = 'text' | 'title' | 'circle' | 'rect' | 'hero';

/**
 * One placeholder block (skeleton.md). The host is the native `<span>` and carries `.skeleton`
 * and its shape, so the design system's sibling and parent layout rules apply to it (D-2).
 * Always hidden from assistive technology; the group's status message names what is loading.
 */
@Component({
  selector: 'span[hp-skeleton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    class: 'skeleton',
    'aria-hidden': 'true',
    '[class.skeleton--text]': "shape() === 'text'",
    '[class.skeleton--title]': "shape() === 'title'",
    '[class.skeleton--circle]': "shape() === 'circle'",
    '[class.skeleton--rect]': "shape() === 'rect'",
    '[class.skeleton--hero]': "shape() === 'hero'",
    '[style.width]': 'width()',
    '[style.height]': 'rectHeight()',
  },
  styles: `
    :host {
      display: block;
      min-height: 1em;
      border-radius: var(--radius-sm);
      background: linear-gradient(
        90deg,
        var(--color-bg-subtle) 25%,
        var(--color-bg-subtle-hover) 37%,
        var(--color-bg-subtle) 63%
      );
      background-size: 400% 100%;
      animation: shimmer var(--duration-loop-shimmer) var(--ease-standard) infinite;
      animation-play-state: var(--motion-loop-state);
    }

    :host(.skeleton--text) {
      height: 0.875em;
      margin-block: 0.375em;
    }

    :host(.skeleton--text:last-child) {
      width: 60%;
    }

    :host(.skeleton--title) {
      height: 1.5em;
      width: 40%;
      margin-bottom: var(--space-2);
    }

    :host(.skeleton--circle) {
      border-radius: var(--radius-full);
      aspect-ratio: 1;
      width: var(--control-height-md);
    }

    :host(.skeleton--rect) {
      border-radius: var(--radius-md);
    }

    :host(.skeleton--hero) {
      border-radius: var(--radius-md);
      aspect-ratio: 3 / 2;
      width: 100%;
      margin-bottom: var(--space-4);
    }

    @keyframes shimmer {
      from {
        background-position: 100% 0;
      }
      to {
        background-position: 0 0;
      }
    }

    /* D-9: backgrounds vanish in forced colours, so each block keeps a hairline outline. */
    @media (forced-colors: active) {
      :host {
        outline: var(--border-width-hairline) solid CanvasText;
        outline-offset: calc(-1 * var(--border-width-hairline));
      }
    }
  `,
})
export class Skeleton {
  /** Adds `.skeleton--{shape}`. */
  readonly shape = input<SkeletonShape>('text');
  /** Written to the host's `width` style ("30%", "8rem"); null keeps the shape's default. */
  readonly width = input<string | null>(null);
  /** Written to the host's `height` style for a rect only ("var(--control-height-md)", "1.5rem"). */
  readonly height = input<string | null>(null);

  protected readonly rectHeight = computed(() => (this.shape() === 'rect' ? this.height() : null));
}
