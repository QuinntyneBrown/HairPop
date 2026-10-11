import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, ICONS, Icon, IconName } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the icon (icon.md): the full set, sizes, fill, label and parent colour. */
@Component({
  selector: 'hp-icon-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Example, Icon],
  template: `
    <hp-example
      heading="The set"
      description="Every name in the registry, drawn at md in currentColor."
    >
      <ul class="set">
        @for (name of names; track name) {
          <li class="set__item">
            <svg hp-icon [name]="name"></svg>
            <code>{{ name }}</code>
          </li>
        }
      </ul>
    </hp-example>

    <hp-example heading="Sizes" description="sm 1 rem, md 1.25 rem (no modifier), lg 1.5 rem.">
      <svg hp-icon name="calendar" size="sm"></svg>
      <svg hp-icon name="calendar"></svg>
      <svg hp-icon name="calendar" size="lg"></svg>
    </hp-example>

    <hp-example heading="Fill" description="Only for the rating star and the art-panel sparkle.">
      <svg hp-icon name="star" fill></svg>
      <svg hp-icon name="sparkle" fill size="lg"></svg>
      <svg hp-icon name="star"></svg>
      <svg hp-icon name="sparkle" size="lg"></svg>
    </hp-example>

    <hp-example
      heading="Labelled"
      description="The rating star carries meaning on its own: role img, named by aria-label."
    >
      <span class="meta">
        4.9 <svg hp-icon name="star" size="sm" fill label="out of 5 stars"></svg> from 86 reviews
      </span>
    </hp-example>

    <hp-example heading="Follows its parent" description="Colour comes from the parent’s text.">
      <span class="tone tone--accent"><svg hp-icon name="sparkle"></svg> HairPop</span>
      <span class="tone tone--success"><svg hp-icon name="check-circle"></svg> Time confirmed</span>
      <span class="tone tone--warning"><svg hp-icon name="wifi-off"></svg> You’re offline</span>
      <span class="tone tone--danger"><svg hp-icon name="alert-circle"></svg> Not saved</span>
    </hp-example>

    <hp-example heading="In a button" description="Sized 1.25 em by the button rule.">
      <button hp-button variant="primary" size="sm">
        <svg hp-icon name="calendar"></svg>
        Request with Nia
      </button>
      <button hp-button variant="primary">
        <svg hp-icon name="calendar"></svg>
        Request with Nia
      </button>
      <button hp-button variant="primary" size="lg">
        <svg hp-icon name="calendar"></svg>
        Request with Nia
      </button>
      <button hp-button disabled>
        Filters
        <svg hp-icon name="filter"></svg>
      </button>
    </hp-example>
  `,
  styles: `
    .set {
      flex: 1 1 100%;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(calc(var(--layout-card-min) / 2), 1fr));
      gap: var(--space-3);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .set__item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--color-fg-default);
    }

    .set__item code {
      font: var(--text-code);
      font-size: var(--font-size-xs);
      color: var(--color-fg-muted);
    }

    .meta {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }

    .tone {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
    }

    .tone--accent {
      color: var(--color-fg-accent);
    }

    .tone--success {
      color: var(--color-success-fg);
    }

    .tone--warning {
      color: var(--color-warning-fg);
    }

    .tone--danger {
      color: var(--color-danger-fg);
    }
  `,
})
export class IconExamples {
  protected readonly names = Object.keys(ICONS) as IconName[];
}
