import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, SidebarNavGroup, SidebarNavigation } from '@hairpop/components';

import { Example } from '../shared';

/** Maya's account area: grouped, with an icon on every link and an unread count. */
const ACCOUNT_GROUPS: readonly SidebarNavGroup[] = [
  {
    label: 'Your HairPop',
    items: [
      { id: 'appointments', label: 'Appointments', link: '/card', icon: 'calendar' },
      {
        id: 'updates',
        label: 'Updates',
        link: '/list',
        icon: 'bell',
        count: 2,
        countText: ', 2 unread',
      },
      { id: 'saved', label: 'Saved braiders', link: '/chip', icon: 'star' },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'settings', label: 'Account settings', link: '/form-field', icon: 'user' },
      { id: 'privacy', label: 'Privacy choices', link: '/switch', icon: 'lock' },
    ],
  },
];

/** The same area without icons, with a count above 99. */
const PLAIN_GROUPS: readonly SidebarNavGroup[] = [
  {
    label: 'Your HairPop',
    items: [
      { id: 'appointments', label: 'Appointments', link: '/card' },
      {
        id: 'updates',
        label: 'Updates',
        link: '/list',
        count: 120,
        countText: ', 120 unread',
      },
      { id: 'saved', label: 'Saved braiders', link: '/chip' },
    ],
  },
  {
    label: '',
    items: [{ id: 'help', label: 'Help', link: '/link' }],
  },
];

/** Collapsible groups: Legal starts collapsed; Account holds the current link and stays open. */
const COLLAPSIBLE_GROUPS: readonly SidebarNavGroup[] = [
  {
    label: 'Account',
    collapsible: true,
    items: [
      { id: 'settings', label: 'Account settings', link: '/form-field' },
      { id: 'privacy', label: 'Privacy choices', link: '/switch' },
    ],
  },
  {
    label: 'Legal',
    collapsible: true,
    collapsed: true,
    items: [
      { id: 'terms', label: 'Terms of use', link: '/footer' },
      { id: 'privacy-policy', label: 'Privacy policy', link: '/footer' },
    ],
  },
];

/**
 * Stories for sidebar navigation (sidebar-navigation.md). From 1024 px each story shows the
 * sticky column; below 1024 px it shows the drawer toggle, and the drawer opens in a CDK Dialog.
 */
@Component({
  selector: 'hp-sidebar-navigation-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Example, SidebarNavigation],
  template: `
    <hp-example
      heading="Grouped, with icons and a count"
      description="The current link carries aria-current. Narrow the window below 1024 px for the drawer toggle."
    >
      <hp-sidebar-navigation
        class="sidebar-navigation-examples__frame"
        label="Account"
        toggleLabel="Account menu"
        closeLabel="Close account menu"
        current="appointments"
        [groups]="accountGroups"
      />
    </hp-example>

    <hp-example
      heading="Without icons"
      description="Icons are on every link or on none. A count above 99 reads 99+; a group with an empty label has no label."
    >
      <hp-sidebar-navigation
        class="sidebar-navigation-examples__frame"
        label="Account, plain"
        toggleLabel="Account menu"
        closeLabel="Close account menu"
        current="updates"
        [groups]="plainGroups"
      />
    </hp-example>

    <hp-example
      heading="Collapsible groups"
      description="Legal starts collapsed; the group holding the current link is always open."
    >
      <hp-sidebar-navigation
        class="sidebar-navigation-examples__frame"
        label="Settings"
        toggleLabel="Settings menu"
        closeLabel="Close settings menu"
        current="privacy"
        [groups]="collapsibleGroups"
      />
    </hp-example>

    <hp-example
      heading="Drawer, controlled"
      description="The open model is two-way. Below 1024 px the button opens the drawer; from 1024 px it is ignored."
    >
      <hp-sidebar-navigation
        class="sidebar-navigation-examples__frame"
        label="Account, drawer"
        toggleLabel="Account menu"
        closeLabel="Close account menu"
        current="saved"
        [groups]="accountGroups"
        [(open)]="drawerOpen"
      />
      <button hp-button (click)="drawerOpen.set(true)">Open the drawer</button>
      <span>Drawer open: {{ drawerOpen() ? 'yes' : 'no' }}</span>
    </hp-example>
  `,
  styles: `
    .sidebar-navigation-examples__frame {
      width: var(--layout-sidebar-width);
    }
  `,
})
export class SidebarNavigationExamples {
  protected readonly accountGroups = ACCOUNT_GROUPS;
  protected readonly plainGroups = PLAIN_GROUPS;
  protected readonly collapsibleGroups = COLLAPSIBLE_GROUPS;
  protected readonly drawerOpen = signal(false);
}
