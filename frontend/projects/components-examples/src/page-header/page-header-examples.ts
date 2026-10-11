import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, PageHeader } from '@hairpop/components';

import { Example } from '../shared';

/**
 * Stories for the page header (page-header.md): every variant and state. Stories turn off
 * focus-on-navigation so opening this page does not move focus into one of them.
 */
@Component({
  selector: 'hp-page-header-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Example, PageHeader, RouterLink],
  template: `
    <hp-example heading="Eyebrow, title and subtitle" description="The common form.">
      <hp-page-header
        class="page-header-examples__frame"
        eyebrow="Appointments"
        heading="Your appointment with Nia"
        subtitle="Request HP-1048 · Sat 24 Oct, 10:00 am · awaiting Nia’s reply."
        [focusOnNavigation]="false"
      />
    </hp-example>

    <hp-example
      heading="Title and subtitle"
      description="No eyebrow: auth, legal, help and error pages."
    >
      <hp-page-header
        class="page-header-examples__frame"
        heading="Sign in to HairPop"
        subtitle="Book braiders, follow requests and keep your appointments in one place."
        [focusOnNavigation]="false"
      />
    </hp-example>

    <hp-example heading="Title only">
      <hp-page-header
        class="page-header-examples__frame"
        heading="Terms of use"
        [focusOnNavigation]="false"
      />
    </hp-example>

    <hp-example heading="With an action" description="One page-level action in the actions slot.">
      <hp-page-header
        class="page-header-examples__frame"
        eyebrow="Appointments"
        heading="My appointments"
        subtitle="1 upcoming · 1 past"
        [focusOnNavigation]="false"
      >
        <a hp-button variant="primary" slot="actions" routerLink="/button">Book a style</a>
      </hp-page-header>
    </hp-example>

    <hp-example
      heading="With actions in their states"
      description="Actions keep Button’s own states; the header itself is not interactive."
    >
      <hp-page-header
        class="page-header-examples__frame"
        eyebrow="Appointments"
        heading="Your appointment with Nia"
        subtitle="Request HP-1048 · Sat 24 Oct, 10:00 am · about five hours · $180–$240"
        [focusOnNavigation]="false"
      >
        <button hp-button slot="actions" [busy]="requesting()" (click)="requesting.set(true)">
          Request a change
        </button>
        <button hp-button variant="primary" slot="actions" disabled>Message Nia</button>
      </hp-page-header>
    </hp-example>

    <hp-example
      heading="Wrapped title"
      description="A long title wraps in balanced lines; long words break where they cannot fit."
    >
      <hp-page-header
        class="page-header-examples__frame"
        eyebrow="Styles"
        heading="Knotless braids with Nia Okafor, Aisha Mensah and Jules Baptiste near Toronto"
        subtitle="3 braiders · from $180 · about five hours"
        [focusOnNavigation]="false"
      />
    </hp-example>

    <hp-example
      heading="Focused after navigation"
      description="A client-side route change moves focus to the h1 without a visible ring. The button calls focusHeading()."
    >
      <hp-page-header
        #focusable
        class="page-header-examples__frame"
        eyebrow="Appointments"
        heading="Previous appointment"
        subtitle="HP-0992 · Sat 3 Oct · completed"
        [focusOnNavigation]="false"
      />
      <button hp-button (click)="focusable.focusHeading()">Move focus to the heading</button>
    </hp-example>
  `,
  styles: `
    .page-header-examples__frame {
      flex: 1 1 100%;
    }
  `,
})
export class PageHeaderExamples {
  protected readonly requesting = signal(false);
}
