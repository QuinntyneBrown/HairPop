import { ChangeDetectionStrategy, Component, input, isDevMode, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Icon } from '../icon/icon';

/** One ancestor in a breadcrumb trail; `link` is passed to `routerLink`. */
export interface BreadcrumbLink {
  readonly label: string;
  readonly link: string | readonly unknown[];
}

/**
 * Where a detail page sits, with one tap back to its parent list (breadcrumb.md).
 * Full path from 48 rem; below it collapses by CSS to the parent link with a chevron (D-3).
 */
@Component({
  selector: 'hp-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  // Unformatted on purpose: keeps each link's text node free of surrounding whitespace.
  // prettier-ignore
  template: `@if (trail().length) {
    <nav class="breadcrumb" [attr.aria-label]="label()">
      <ol>
        @for (item of trail(); track $index) {
          <li><a [routerLink]="item.link">@if ($last) {<svg hp-icon name="chevron-left" size="sm"></svg>}{{ item.label }}</a></li>
        }
        <li><span aria-current="page">{{ current() }}</span></li>
      </ol>
    </nav>
  }`,
  styles: `
    :host {
      display: block;
    }

    .breadcrumb ol {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-2);
      list-style: none;
      padding: 0;
      margin: 0;
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }

    .breadcrumb li {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
    }

    .breadcrumb li + li::before {
      content: '/';
      content: '/' / '';
      color: var(--color-fg-subtle);
    }

    .breadcrumb a {
      color: var(--color-fg-muted);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      min-height: var(--target-min);
    }

    .breadcrumb a:hover,
    .breadcrumb a:active {
      color: var(--color-fg-default);
      text-decoration: underline;
    }

    .breadcrumb [aria-current='page'] {
      color: var(--color-fg-default);
      font-weight: var(--font-weight-medium);
    }

    @media (width < 48rem) {
      .breadcrumb li:not(:nth-last-child(2)) {
        display: none;
      }

      .breadcrumb li:nth-last-child(2)::before {
        content: none;
      }
    }

    @media (width >= 48rem) {
      .breadcrumb a .icon {
        display: none;
      }
    }

    @media (forced-colors: active) {
      .breadcrumb a,
      .breadcrumb a:hover,
      .breadcrumb a:active {
        color: LinkText;
      }

      .breadcrumb li + li::before,
      .breadcrumb [aria-current='page'] {
        color: CanvasText;
      }

      .breadcrumb a:focus-visible {
        outline-color: Highlight;
      }
    }
  `,
})
export class Breadcrumb implements OnInit {
  /** The landmark's accessible name: "Breadcrumb". */
  readonly label = input.required<string>();
  /** Ancestors from the top of the hierarchy down to the parent; at least one. */
  readonly trail = input.required<readonly BreadcrumbLink[]>();
  /** The current page's name, matching its `<h1>` topic. */
  readonly current = input.required<string>();

  ngOnInit(): void {
    if (isDevMode() && this.trail().length === 0) {
      console.error(
        'hp-breadcrumb: the trail is empty. A breadcrumb needs at least one ancestor link; nothing is rendered.',
      );
    }
  }
}
