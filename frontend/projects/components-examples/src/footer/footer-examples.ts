import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Footer, FooterLink, InlineMessage } from '@hairpop/components';

import { Example } from '../shared';

const BRAND_LINE = 'HairPop · Made for confident hair decisions';

/** Stories for the site footer (footer.md): simple, with help and cookie links, and wrapped. */
@Component({
  selector: 'hp-footer-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Example, Footer, InlineMessage],
  template: `
    <hp-example heading="Simple" description="Today’s mocks: Terms and Privacy.">
      <footer hp-footer class="demo" [brandLine]="brandLine" [links]="simpleLinks"></footer>
    </hp-example>

    <hp-example
      heading="With help and cookie links"
      description="“Cookie preferences” requests a dialog instead of navigating; its href stays as the fallback."
    >
      <footer
        hp-footer
        class="demo"
        [brandLine]="brandLine"
        [links]="productLinks"
        (dialogRequested)="requested.set($event)"
      ></footer>
      <p hp-inline-message kind="status">
        {{ requested() ? 'Dialog requested: ' + requested() : '' }}
      </p>
    </hp-example>

    <hp-example
      heading="Wrapped"
      description="In a narrow column the brand line and links stack, and the links wrap as a row."
    >
      <footer hp-footer class="narrow" [brandLine]="brandLine" [links]="productLinks"></footer>
    </hp-example>
  `,
  styles: `
    .demo {
      flex: 1 1 100%;
    }

    .narrow {
      flex: 1 1 100%;
      max-width: var(--layout-card-min);
    }
  `,
})
export class FooterExamples {
  protected readonly brandLine = BRAND_LINE;

  protected readonly simpleLinks: readonly FooterLink[] = [
    { id: 'terms', label: 'Terms', link: '/terms' },
    { id: 'privacy', label: 'Privacy', link: '/privacy' },
  ];

  protected readonly productLinks: readonly FooterLink[] = [
    { id: 'help', label: 'Help', link: '/help' },
    { id: 'cookies', label: 'Cookie preferences', link: '/cookie-preferences', opensDialog: true },
    { id: 'terms', label: 'Terms', link: '/terms' },
    { id: 'privacy', label: 'Privacy', link: '/privacy' },
  ];

  protected readonly requested = signal<string | null>(null);
}
