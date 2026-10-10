import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Breadcrumb, BreadcrumbLink } from '@hairpop/components';

import { Example } from '../shared';

/**
 * Stories for the breadcrumb (breadcrumb.md). Below 768 px the same DOM collapses to the parent
 * link with a chevron: narrow the window to see it.
 */
@Component({
  selector: 'hp-breadcrumb-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Breadcrumb, Example],
  template: `
    <hp-example heading="Two levels" description="Nia Okafor’s profile.">
      <hp-breadcrumb label="Breadcrumb" [trail]="braiders" current="Nia Okafor" />
    </hp-example>

    <hp-example heading="Appointment detail" description="The reference is the current page.">
      <hp-breadcrumb label="Breadcrumb" [trail]="appointments" current="HP-1048" />
    </hp-example>

    <hp-example
      heading="Three levels"
      description="Braiders for a style; only the parent carries the chevron when collapsed."
    >
      <hp-breadcrumb label="Breadcrumb" [trail]="styleTrail" current="Braiders" />
    </hp-example>

    <hp-example
      heading="Long path"
      description="The row wraps onto further lines; nothing truncates."
    >
      <div class="narrow">
        <hp-breadcrumb
          label="Breadcrumb"
          [trail]="longTrail"
          current="Amara Nkiruka Adeyemi-Williams"
        />
      </div>
    </hp-example>
  `,
  styles: `
    .narrow {
      max-width: var(--layout-card-min);
    }
  `,
})
export class BreadcrumbExamples {
  protected readonly braiders: readonly BreadcrumbLink[] = [
    { label: 'Braiders', link: '/braiders' },
  ];

  protected readonly appointments: readonly BreadcrumbLink[] = [
    { label: 'Appointments', link: '/appointments' },
  ];

  protected readonly styleTrail: readonly BreadcrumbLink[] = [
    { label: 'Styles', link: '/styles' },
    { label: 'Knotless braids', link: ['/styles', 'knotless-braids'] },
  ];

  protected readonly longTrail: readonly BreadcrumbLink[] = [
    { label: 'Styles', link: '/styles' },
    { label: 'Medium knotless braids', link: ['/styles', 'knotless-braids'] },
    { label: 'Braiders in Toronto West', link: ['/styles', 'knotless-braids', 'braiders'] },
  ];
}
