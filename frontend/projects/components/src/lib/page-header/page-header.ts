import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

/**
 * The header that opens every screen: optional eyebrow, the page's one `<h1>`,
 * optional subtitle and optional page-level actions (`[slot=actions]`).
 */
@Component({
  selector: 'hp-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page-header' },
  template: `<div>
      @if (eyebrow()) {
        <p class="eyebrow">{{ eyebrow() }}</p>
      }
      <h1 #title tabindex="-1">{{ heading() }}</h1>
      @if (subtitle()) {
        <p class="subtitle">{{ subtitle() }}</p>
      }
    </div>
    <div class="page-header__actions"><ng-content select="[slot=actions]" /></div>`,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }
    .eyebrow {
      margin: 0 0 var(--space-2);
      font: var(--text-overline);
      letter-spacing: var(--letter-spacing-wide);
      text-transform: uppercase;
      color: var(--color-fg-accent);
    }
    h1 {
      margin: 0;
      font: var(--text-h1);
      letter-spacing: var(--letter-spacing-tight);
      color: var(--color-fg-default);
      text-wrap: balance;
      overflow-wrap: anywhere;
      hyphens: auto;
    }
    h1:focus {
      outline: none;
    }
    .subtitle {
      margin: var(--space-1) 0 0;
      font: var(--text-body);
      color: var(--color-fg-muted);
      max-width: var(--layout-measure);
      text-wrap: pretty;
    }
    .page-header__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      width: 100%;
    }
    .page-header__actions:empty {
      display: none;
    }
    .page-header__actions > ::ng-deep .btn--primary {
      flex: 1 1 100%;
    }
    @media (min-width: 48rem) {
      .page-header__actions {
        width: auto;
      }
      .page-header__actions > ::ng-deep .btn--primary {
        flex: none;
      }
    }
    @media (forced-colors: active) {
      .eyebrow,
      h1,
      .subtitle {
        color: CanvasText;
      }
    }
  `,
})
export class PageHeader {
  /** The `<h1>` text. */
  readonly heading = input.required<string>();
  /** The area name; `null` renders no eyebrow element (D-3). */
  readonly eyebrow = input<string | null>(null);
  /** Facts separated by middle dots; `null` renders no subtitle element. */
  readonly subtitle = input<string | null>(null);
  /** Move focus to the `<h1>` when created by a client-side navigation (D-6). */
  readonly focusOnNavigation = input(true, { transform: booleanAttribute });

  private readonly headingRef = viewChild.required<ElementRef<HTMLHeadingElement>>('title');

  constructor() {
    // True only when an earlier navigation has completed: a client-side route change.
    const createdByNavigation = inject(Router, { optional: true })?.navigated === true;
    afterNextRender(() => {
      if (createdByNavigation && this.focusOnNavigation()) {
        this.focusHeading();
      }
    });
  }

  /** Moves focus to the `<h1>` so screen readers announce the page. */
  focusHeading(): void {
    this.headingRef().nativeElement.focus({ preventScroll: false });
  }
}
