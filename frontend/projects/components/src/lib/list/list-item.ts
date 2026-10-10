import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  booleanAttribute,
  inject,
  input,
  isDevMode,
} from '@angular/core';

/**
 * A list row. On an `<li>` it is static; on an `<a>` it is a link row
 * (`.list__item--interactive`), one tab stop per row.
 */
@Component({
  selector: 'li[hp-list-item], a[hp-list-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    class: 'list__item',
    '[class.list__item--interactive]': 'isLink',
    '[class.list__item--unread]': 'unread()',
    '[attr.aria-current]': 'current() ? "true" : null',
  },
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
    }
    :host(.list__item--interactive) {
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      min-height: var(--target-comfortable);
      transition: background-color var(--duration-fast) var(--ease-standard);
    }
    :host(.list__item--interactive:hover),
    :host(.list__item--interactive:active) {
      background: var(--color-bg-subtle);
      color: inherit;
    }
    :host(.list__item--interactive:focus-visible) {
      outline: var(--focus-ring-width) solid var(--color-focus-ring);
      outline-offset: calc(-1 * (var(--focus-ring-width) + var(--focus-ring-offset)));
    }
    :host([aria-current='true']) {
      background: var(--color-accent-subtle);
    }

    :host ::ng-deep .list__body {
      flex: 1 1 50%;
      min-width: 50%;
    }
    :host ::ng-deep .list__title {
      display: block;
      font: var(--text-label);
      font-size: var(--font-size-md);
      color: var(--color-fg-default);
    }
    :host ::ng-deep .list__meta {
      display: block;
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }
    :host ::ng-deep .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Trailing chevron or badge stays at the end, on its own line when it would squeeze the body (D-4). */
    :host ::ng-deep > :last-child:not(.list__body):not(:first-child) {
      margin-inline-start: auto;
    }
    :host ::ng-deep > .badge:last-child {
      align-self: flex-start;
    }

    :host(.list__item--unread) ::ng-deep .list__title::before {
      content: '';
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      margin-inline-end: var(--space-2);
      border-radius: var(--radius-full);
      background: var(--color-accent);
      vertical-align: middle;
    }

    @media (forced-colors: active) {
      :host(.list__item--unread) ::ng-deep .list__title::before {
        forced-color-adjust: none;
        background: CanvasText;
      }
      :host([aria-current='true']) {
        outline: var(--border-width-thick) solid Highlight;
        outline-offset: calc(-1 * var(--border-width-thick));
      }
    }
  `,
})
export class ListItem {
  /** Shows the accent dot before the title; the row must also say "Unread" in text (D-5). */
  readonly unread = input(false, { transform: booleanAttribute });
  /** Marks the current row with `aria-current="true"` and the accent tint. */
  readonly current = input(false, { transform: booleanAttribute });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  /** The host tag decides whether the row is a link row; read once. */
  protected readonly isLink = this.host.tagName === 'A';

  constructor() {
    if (isDevMode()) {
      afterRenderEffect(() => {
        if (this.unread() && !this.host.querySelector('.visually-hidden, .badge')) {
          console.error(
            'hp-list-item: an unread row must say "Unread" in text; add a <span class="visually-hidden">Unread: </span> ' +
              'prefix to the title or a visible "Unread" badge.',
            this.host,
          );
        }
      });
    }
  }
}
