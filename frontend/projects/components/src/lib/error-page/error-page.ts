import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';

import { EmptyState, EmptyStateStatusRole, EmptyStateVariant } from '../empty-state/empty-state';
import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

/** Why the page cannot be shown. */
export type ErrorPageKind = 'not-found' | 'forbidden' | 'server-error' | 'offline';

const VARIANTS: Record<ErrorPageKind, EmptyStateVariant> = {
  'not-found': 'default',
  forbidden: 'warning',
  'server-error': 'error',
  offline: 'warning',
};

const ICON_NAMES: Record<ErrorPageKind, IconName> = {
  'not-found': 'search',
  forbidden: 'lock',
  'server-error': 'alert-circle',
  offline: 'wifi-off',
};

/**
 * Replaces the page content when a whole page cannot be shown: not found, forbidden,
 * server error or offline (error-page.md). A full-size empty state whose title is the
 * page's only `h1`; the recovery actions are projected Buttons.
 */
@Component({
  selector: 'hp-error-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyState, Icon],
  template: `<hp-empty-state
    [variant]="variant()"
    size="full"
    [headingLevel]="1"
    [heading]="heading()"
    [text]="text()"
    [reference]="kind() === 'server-error' ? reference() : null"
    [busy]="busy()"
    [status]="status()"
    [statusRole]="statusRole()"
    [focusOnRender]="focusHeading"
    stackActions
    ><svg hp-icon slot="icon" size="lg" [name]="icon()"></svg
    ><ng-container ngProjectAs="[slot=actions]"><ng-content select="[slot=actions]" /></ng-container
  ></hp-empty-state>`,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class ErrorPage {
  /** Sets the empty state's variant and the icon. */
  readonly kind = input.required<ErrorPageKind>();
  /** The `h1` text, in plain words with no codes. */
  readonly heading = input.required<string>();
  /** One sentence on what happened and what is safe. */
  readonly text = input.required<string>();
  /** Server error only: the full reference line. Ignored for the other kinds. */
  readonly reference = input<string | null>(null);
  /** Passed to the empty state while "Try again" is working. */
  readonly busy = input(false, { transform: booleanAttribute });
  /** Message announced after a retry fails. */
  readonly status = input<string | null>(null);
  /** Politeness of the announcement; a failed retry is assertive by default. */
  readonly statusRole = input<EmptyStateStatusRole>('alert');

  protected readonly variant = computed(() => VARIANTS[this.kind()]);
  protected readonly icon = computed(() => ICON_NAMES[this.kind()]);

  /**
   * D-7: focus the `h1` unless this is the session's first navigation. A full page load
   * keeps focus at the top of the document so the skip link comes first.
   */
  protected readonly focusHeading = isAfterFirstNavigation(inject(Router, { optional: true }));
}

function isAfterFirstNavigation(router: Router | null): boolean {
  if (!router) {
    return false;
  }
  return untracked(() => {
    // While routes activate, the navigation in flight is current; once it settles, it is the last successful one.
    const navigation = router.currentNavigation() ?? router.lastSuccessfulNavigation();
    return navigation?.previousNavigation != null;
  });
}
