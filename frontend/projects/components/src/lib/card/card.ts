import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
  isDevMode,
} from '@angular/core';

/** Layout of a card: a detail section, media-first story, or a record row. */
export type CardLayout = 'block' | 'story' | 'row';

/**
 * A raised surface grouping one subject. The host is the native sectioning
 * element (`article`, `section`, `aside` or `div`) and carries `.card`; every
 * part (media, title, header, footer, link, profile head, well) is projected
 * markup styled by the card.
 */
@Component({
  selector: 'article[hp-card], section[hp-card], aside[hp-card], div[hp-card]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    class: 'card',
    '[class.story-card]': 'layout() === "story"',
    '[class.appointment-row]': 'layout() === "row"',
    '[class.card--interactive]': 'interactive()',
    '[class.card--selected]': 'selected()',
    '[class.card--flush]': 'flush()',
  },
  styles: `
    :host {
      --card-bg: var(--color-bg-surface);
      --card-border: var(--color-border-default);
      --card-shadow: var(--shadow-1);
      --card-padding: var(--space-6);
      background: var(--card-bg);
      border: var(--border-width-hairline) solid var(--card-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--card-shadow);
      padding: var(--card-padding);
      min-width: 0;
    }

    /* Block flow: layout classes on the host own their gaps; dividers keep their own space (D-4). */
    :host(:not(.stack):not(.story-card):not(.appointment-row):not(.cluster):not(.profile-head))
      ::ng-deep
      > :not(hr, .divider)
      + :not(hr, .divider) {
      margin-top: var(--space-4);
    }

    /* Headings: section headings take the h3 role, titles the h4 role; long words break (D-8, D-16). */
    :host ::ng-deep :is(h2, h3):not(.card__title):not(.empty__title) {
      font: var(--text-h3);
      letter-spacing: var(--letter-spacing-normal);
    }
    :host ::ng-deep .card__title {
      font: var(--text-h4);
      letter-spacing: var(--letter-spacing-normal);
    }
    :host ::ng-deep :is(.card__title, h2, h3) {
      overflow-wrap: anywhere;
    }

    /* Flush */
    :host(.card--flush) {
      --card-padding: 0;
      overflow: hidden;
    }

    /* Interactive: the one .card__link is stretched over the card. */
    :host(.card--interactive) {
      position: relative;
      transition:
        box-shadow var(--duration-fast) var(--ease-standard),
        border-color var(--duration-fast) var(--ease-standard),
        transform var(--duration-fast) var(--ease-standard);
    }
    :host(.card--interactive:hover) {
      --card-shadow: var(--shadow-2);
      --card-border: var(--color-border-strong);
      transform: translateY(-1px);
    }
    :host(.card--interactive) ::ng-deep .card__link::after {
      content: '';
      position: absolute;
      inset: calc(-1 * var(--border-width-hairline));
      border-radius: var(--radius-lg);
    }
    :host(.card--interactive) ::ng-deep .card__link:focus-visible {
      outline: none;
    }
    :host(.card--interactive) ::ng-deep .card__link:focus-visible::after {
      outline: var(--focus-ring-width) solid var(--color-focus-ring);
      outline-offset: var(--focus-ring-offset);
    }

    /* Selected (visual only, D-14). */
    :host(.card--selected),
    :host([aria-selected='true']) {
      --card-border: var(--color-accent);
      box-shadow: 0 0 0 1px var(--color-accent);
    }

    /* Header and footer */
    :host ::ng-deep .card__header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-4);
    }
    :host ::ng-deep .card__footer {
      padding-top: var(--space-4);
      border-top: var(--border-width-hairline) solid var(--color-border-default);
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      justify-content: flex-end;
    }

    /* Story layout and media */
    :host(.story-card) {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    :host(.story-card) ::ng-deep a:not(.btn) {
      align-self: flex-start;
    }
    :host ::ng-deep :is(.story-card__photo, .hero-photo) {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 3 / 2;
      object-fit: cover;
      border-radius: var(--radius-md);
    }
    :host ::ng-deep :is(.story-card__art, .hero-art) {
      display: grid;
      place-items: center;
      width: 100%;
      aspect-ratio: 3 / 2;
      color: var(--color-fg-accent);
      background: var(--color-accent-subtle);
      border-radius: var(--radius-md);
      font-size: var(--font-size-5xl);
      line-height: 1;
    }
    :host ::ng-deep :is(.hero-photo, .hero-art) {
      margin-bottom: var(--space-6);
    }

    /* Row layout */
    :host(.appointment-row) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
    }
    :host(.appointment-row) ::ng-deep > div {
      min-width: 0;
    }

    /* Profile head */
    :host ::ng-deep .profile-head {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-3);
    }
    :host ::ng-deep .profile-head > :not(.avatar) {
      min-width: 0;
    }

    /* Well */
    :host ::ng-deep .well {
      background: var(--color-bg-surface-sunken);
      border-radius: var(--radius-md);
      padding: var(--space-4);
    }

    @media (forced-colors: active) {
      :host {
        border: var(--border-width-hairline) solid CanvasText;
      }
      :host(.card--selected),
      :host([aria-selected='true']) {
        border-color: var(--color-focus-ring);
      }
    }
  `,
})
export class Card {
  /** `story` adds `.story-card`, `row` adds `.appointment-row`; `block` adds nothing. */
  readonly layout = input<CardLayout>('block');
  /** Stretches the one `.card__link` over the card. */
  readonly interactive = input(false, { transform: booleanAttribute });
  /** Accent edge for the chosen option in a set. Visual only. */
  readonly selected = input(false, { transform: booleanAttribute });
  /** Drops the padding so media, lists and tables meet the rounded edge. */
  readonly flush = input(false, { transform: booleanAttribute });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    if (isDevMode()) {
      afterNextRender(() => this.checkUsage());
    }
  }

  private checkUsage(): void {
    const host = this.host;
    if (this.interactive()) {
      const links = host.querySelectorAll('.card__link');
      const controls = host.querySelectorAll('a[href], button');
      if (links.length !== 1 || controls.length !== 1 || controls[0] !== links[0]) {
        console.error(
          `hp-card: an interactive card must contain exactly one .card__link and no other link or button ` +
            `(found ${links.length} .card__link and ${controls.length} links or buttons). ` +
            `The one-link rule keeps every control clickable under the stretched link.`,
          host,
        );
      }
    }
    if (
      host.tagName === 'SECTION' &&
      !host.hasAttribute('aria-labelledby') &&
      !host.hasAttribute('aria-label')
    ) {
      console.error(
        'hp-card: a <section> card needs a region name; add aria-labelledby pointing at its heading, or aria-label.',
        host,
      );
    }
  }
}
