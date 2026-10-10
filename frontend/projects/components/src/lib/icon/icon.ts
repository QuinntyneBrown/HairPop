import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  isDevMode,
} from '@angular/core';

import { ICONS, IconName } from './icons';

/** Icon box sizes: sm 1 rem, md 1.25 rem (no modifier), lg 1.5 rem. */
export type IconSize = 'sm' | 'md' | 'lg';

/** Unknown names already reported in development mode, so each is logged once. */
const reportedUnknownNames = new Set<string>();

/**
 * One icon from the HairPop set, drawn as an inline SVG in `currentColor`.
 *
 * The host is the native `<svg>` (icon.md D-1). Styles live in the shared
 * foundation stylesheet (`.icon`, `.icon--sm`, `.icon--lg`, `.icon--fill`; D-2).
 * Decorative by default; `label` makes it an image named by `aria-label` (D-3).
 */
@Component({
  selector: 'svg[hp-icon]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg:path [attr.d]="path()" />`,
  host: {
    class: 'icon',
    viewBox: '0 0 24 24',
    '[class.icon--sm]': "size() === 'sm'",
    '[class.icon--lg]': "size() === 'lg'",
    '[class.icon--fill]': 'fill()',
    '[attr.aria-hidden]': "labelled() ? null : 'true'",
    '[attr.role]': "labelled() ? 'img' : null",
    '[attr.aria-label]': 'labelled() ? label() : null',
  },
})
export class Icon {
  /** The icon to draw; selects the path from the registry. */
  readonly name = input.required<IconName>();
  /** Box size; md adds no modifier class. */
  readonly size = input<IconSize>('md');
  /** Solid `currentColor` with no stroke. Only for the rating star and art-panel sparkle. */
  readonly fill = input(false, { transform: booleanAttribute });
  /** Accessible name for an icon that carries meaning on its own; null keeps it decorative. */
  readonly label = input<string | null>(null);

  protected readonly path = computed<string>(() => {
    const name = this.name() as string;
    return Object.hasOwn(ICONS, name) ? ICONS[name as IconName] : '';
  });

  protected readonly labelled = computed(() => {
    const label = this.label();
    return label !== null && label !== undefined && label !== '';
  });

  constructor() {
    if (isDevMode()) {
      effect(() => {
        const name = this.name() as string;
        if (!Object.hasOwn(ICONS, name) && !reportedUnknownNames.has(name)) {
          reportedUnknownNames.add(name);
          console.error(`hp-icon: unknown icon name "${name}". It renders an empty box.`);
        }
      });
    }
  }
}
