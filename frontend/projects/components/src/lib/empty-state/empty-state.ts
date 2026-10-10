import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  untracked,
  viewChild,
} from '@angular/core';

/** Tint of the icon circle: default (accent), error (danger) or warning. */
export type EmptyStateVariant = 'default' | 'error' | 'warning';

/** Full size for a page region; compact inside cards, panels and dialogs. */
export type EmptyStateSize = 'full' | 'compact';

/** Level of the title heading. */
export type EmptyStateHeadingLevel = 1 | 2 | 3 | 4;

/** Politeness of the live region: `alert` only when an action Maya took failed. */
export type EmptyStateStatusRole = 'status' | 'alert';

/**
 * A region with nothing to show yet, nothing that matches, nothing it could load,
 * or a finished form, with one clear next step (empty-state.md).
 *
 * The host carries the `.empty` classes (D-2). The icon and the actions are projected;
 * the component renders no copy of its own.
 */
@Component({
  selector: 'hp-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'empty',
    '[class.empty--error]': "variant() === 'error'",
    '[class.empty--warning]': "variant() === 'warning'",
    '[class.empty--compact]': "size() === 'compact'",
    '[class.empty--stack-actions]': 'stackActions()',
    '[attr.aria-busy]': "busy() ? 'true' : null",
  },
  template: `<div class="empty__icon" aria-hidden="true"><ng-content select="[slot=icon]" /></div>
    @switch (headingLevel()) {
      @case (1) {
        <h1 #title class="empty__title" [attr.tabindex]="titleTabindex()">{{ heading() }}</h1>
      }
      @case (3) {
        <h3 #title class="empty__title" [attr.tabindex]="titleTabindex()">{{ heading() }}</h3>
      }
      @case (4) {
        <h4 #title class="empty__title" [attr.tabindex]="titleTabindex()">{{ heading() }}</h4>
      }
      @default {
        <h2 #title class="empty__title" [attr.tabindex]="titleTabindex()">{{ heading() }}</h2>
      }
    }
    @if (text()) {
      <p class="empty__text">{{ text() }}</p>
    }
    <div class="empty__actions"><ng-content select="[slot=actions]" /></div>
    @if (reference()) {
      <p class="empty__reference">{{ reference() }}</p>
    }
    <span #live class="visually-hidden" [attr.role]="statusRole()"></span>`,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--space-3);
      padding: var(--space-12) var(--space-6);
    }

    :host(.empty--compact) {
      padding: var(--space-8) var(--space-4);
    }

    .empty__icon {
      --empty-icon-bg: var(--color-accent-subtle);
      --empty-icon-fg: var(--color-fg-accent);
      box-sizing: border-box;
      width: 4rem;
      height: 4rem;
      border-radius: var(--radius-full);
      display: grid;
      place-items: center;
      background: var(--empty-icon-bg);
      color: var(--empty-icon-fg);
      font: var(--text-h3);
      margin-bottom: var(--space-2);
    }

    :host(.empty--compact) .empty__icon {
      width: var(--control-height-lg);
      height: var(--control-height-lg);
    }

    :host(.empty--error) .empty__icon {
      --empty-icon-bg: var(--color-danger-bg);
      --empty-icon-fg: var(--color-danger-icon);
    }

    :host(.empty--warning) .empty__icon {
      --empty-icon-bg: var(--color-warning-bg);
      --empty-icon-fg: var(--color-warning-icon);
    }

    /* D-4: the component sizes the projected icon, whatever modifier it carries. */
    .empty__icon ::ng-deep .icon {
      width: 1.5rem;
      height: 1.5rem;
    }

    :host(.empty--compact) .empty__icon ::ng-deep .icon {
      width: 1.25rem;
      height: 1.25rem;
    }

    .empty__title {
      font: var(--text-h3);
      letter-spacing: var(--letter-spacing-normal);
      text-wrap: balance;
    }

    /* --layout-breakpoint-md */
    @media (min-width: 48rem) {
      .empty__title {
        font-size: var(--font-size-2xl);
      }
    }

    .empty__text {
      color: var(--color-fg-muted);
      max-width: 36ch;
    }

    .empty__actions {
      display: flex;
      gap: var(--space-3);
      margin-top: var(--space-2);
      flex-wrap: wrap;
      justify-content: center;
    }

    .empty__actions:empty {
      display: none;
    }

    /* D-6: mobile first, stacked at full content width below --layout-breakpoint-sm. */
    :host(.empty--stack-actions) .empty__actions {
      flex-direction: column;
      align-self: stretch;
    }

    :host(.empty--stack-actions) .empty__actions ::ng-deep > * {
      width: 100%;
    }

    /* --layout-breakpoint-sm */
    @media (min-width: 40rem) {
      :host(.empty--stack-actions) .empty__actions {
        flex-direction: row;
        align-self: auto;
      }

      :host(.empty--stack-actions) .empty__actions ::ng-deep > * {
        width: auto;
      }
    }

    .empty__reference {
      font: var(--text-code);
      font-size: var(--font-size-xs);
      color: var(--color-fg-subtle);
      overflow-wrap: break-word;
      user-select: text;
    }

    /* D-11 */
    @media (forced-colors: active) {
      .empty__icon {
        border: var(--border-width-hairline) solid CanvasText;
        color: CanvasText;
      }
    }
  `,
})
export class EmptyState {
  /** Tint of the icon circle. */
  readonly variant = input<EmptyStateVariant>('default');
  /** `compact` inside cards, panels and dialogs. */
  readonly size = input<EmptyStateSize>('full');
  /** The title text; names the specific thing. */
  readonly heading = input.required<string>();
  /** Level of the title heading: 2 in a main region, 3 in a card, 1 only on an error page. */
  readonly headingLevel = input<EmptyStateHeadingLevel>(2);
  /** The one sentence; null renders no `.empty__text`. */
  readonly text = input<string | null>(null);
  /** A support reference rendered after the actions. */
  readonly reference = input<string | null>(null);
  /** Sets `aria-busy="true"` on the host while its action is working. */
  readonly busy = input(false, { transform: booleanAttribute });
  /** Stacks the actions at full content width below 640 px. */
  readonly stackActions = input(false, { transform: booleanAttribute });
  /** Gives the heading `tabindex="-1"` and moves focus to it after the first render. */
  readonly focusOnRender = input(false, { transform: booleanAttribute });
  /** Text announced through the live region, written after render and on every change. */
  readonly status = input<string | null>(null);
  /** Politeness of the live region. */
  readonly statusRole = input<EmptyStateStatusRole>('status');

  /** `-1` when the heading takes programmatic focus (`focusOnRender`). */
  protected readonly titleTabindex = computed(() => (this.focusOnRender() ? -1 : null));

  private readonly headingRef = viewChild.required<ElementRef<HTMLElement>>('title');
  private readonly live = viewChild<ElementRef<HTMLElement>>('live');
  private readonly injector = inject(Injector);

  constructor() {
    afterNextRender(() => {
      if (this.focusOnRender()) {
        this.headingRef().nativeElement.focus();
      }
    });

    // D-5: write the message after render, clearing first so a repeated message is announced again.
    effect(() => {
      const message = this.status();
      const live = untracked(this.live)?.nativeElement;
      if (live) {
        live.textContent = '';
      }
      afterNextRender(
        () => {
          const region = this.live()?.nativeElement;
          if (region) {
            region.textContent = message ?? '';
          }
        },
        { injector: this.injector },
      );
    });
  }
}
