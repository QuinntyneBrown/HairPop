import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Button,
  Icon,
  Menu,
  MenuDivider,
  MenuGroupLabel,
  MenuItem,
  MenuItemCheckbox,
  MenuItemRadio,
  MenuTrigger,
} from '@hairpop/components';

import { Example } from '../shared';

/** A "Sort by" choice in the braider results. */
interface SortOption {
  readonly value: string;
  readonly label: string;
}

/** Stories for the menu (menu.md): trigger, items, sections, checkable items and every item state. */
@Component({
  selector: 'hp-menu-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Button,
    Example,
    Icon,
    Menu,
    MenuDivider,
    MenuGroupLabel,
    MenuItem,
    MenuItemCheckbox,
    MenuItemRadio,
    MenuTrigger,
    RouterLink,
  ],
  template: `
    <hp-example
      heading="Account menu"
      description="Section label, icons, link items and a danger item after a divider. The trigger names the menu."
    >
      <button hp-button variant="ghost" [hpMenuTriggerFor]="account">
        Maya
        <svg hp-icon name="chevron-down" size="sm"></svg>
      </button>
      <ng-template #account>
        <ul hp-menu>
          <li hpMenuGroupLabel>Account</li>
          <li role="none">
            <a hp-menu-item routerLink="/avatar">
              <svg hp-icon name="user" size="sm"></svg>
              Account settings
            </a>
          </li>
          <li role="none">
            <a hp-menu-item routerLink="/toast">
              <svg hp-icon name="bell" size="sm"></svg>
              Notifications
            </a>
          </li>
          <li hpMenuDivider></li>
          <li role="none">
            <button hp-menu-item tone="danger" (triggered)="lastAction.set('Sign out')">
              <svg hp-icon name="log-out" size="sm"></svg>
              Sign out
            </button>
          </li>
        </ul>
      </ng-template>
      <span>Last action: {{ lastAction() }}</span>
    </hp-example>

    <hp-example
      heading="Icon-only trigger"
      description="The trigger carries an aria-label; the menu names itself because the trigger’s name is not a good menu name."
    >
      <button
        hp-button
        variant="ghost"
        iconOnly
        aria-label="More actions for HP-1048"
        [hpMenuTriggerFor]="actions"
      >
        <svg hp-icon name="more"></svg>
      </button>
      <ng-template #actions>
        <ul hp-menu aria-label="Appointment HP-1048 actions">
          <li role="none">
            <button hp-menu-item (triggered)="lastAction.set('Message Nia')">
              <svg hp-icon name="message" size="sm"></svg>
              Message Nia
            </button>
          </li>
          <li role="none">
            <button hp-menu-item (triggered)="lastAction.set('Request a change')">
              <svg hp-icon name="edit" size="sm"></svg>
              Request a change
            </button>
          </li>
          <li role="none">
            <button hp-menu-item disabled>
              <svg hp-icon name="calendar" size="sm"></svg>
              Add to calendar
            </button>
          </li>
          <li hpMenuDivider></li>
          <li role="none">
            <button hp-menu-item tone="danger" (triggered)="lastAction.set('Cancel request')">
              <svg hp-icon name="trash" size="sm"></svg>
              Cancel request
            </button>
          </li>
        </ul>
      </ng-template>
      <span>Last action: {{ lastAction() }}</span>
    </hp-example>

    <hp-example
      heading="Checkable items"
      description="One radio set per menu plus checkbox items. The consumer updates checked from triggered; the menu closes on activation."
    >
      <button hp-button [hpMenuTriggerFor]="sortMenu">
        Sort and filter
        <svg hp-icon name="chevron-down" size="sm"></svg>
      </button>
      <ng-template #sortMenu>
        <ul hp-menu aria-label="Sort and filter braiders">
          <li hpMenuGroupLabel>Sort by</li>
          @for (option of sortOptions; track option.value) {
            <li role="none">
              <button
                hp-menu-item-radio
                [checked]="sort() === option.value"
                (triggered)="sort.set(option.value)"
              >
                {{ option.label }}
              </button>
            </li>
          }
          <li hpMenuDivider></li>
          <li hpMenuGroupLabel>Show</li>
          <li role="none">
            <button
              hp-menu-item-checkbox
              [checked]="availableThisWeek()"
              (triggered)="availableThisWeek.set(!availableThisWeek())"
            >
              Available this week
            </button>
          </li>
          <li role="none">
            <button
              hp-menu-item-checkbox
              [checked]="savedOnly()"
              (triggered)="savedOnly.set(!savedOnly())"
            >
              Saved braiders only
            </button>
          </li>
        </ul>
      </ng-template>
      <span>
        Sort: {{ sortLabel() }} · Available this week: {{ availableThisWeek() ? 'on' : 'off' }} ·
        Saved only: {{ savedOnly() ? 'on' : 'off' }}
      </span>
    </hp-example>

    <hp-example heading="With shortcuts" description="A trailing kbd shows a desktop shortcut.">
      <button hp-button variant="ghost" [hpMenuTriggerFor]="shortcuts">Gallery</button>
      <ng-template #shortcuts>
        <ul hp-menu aria-label="Gallery shortcuts">
          <li role="none">
            <button hp-menu-item>
              <svg hp-icon name="search" size="sm"></svg>
              Search styles
              <kbd>/</kbd>
            </button>
          </li>
          <li role="none">
            <button hp-menu-item>
              <svg hp-icon name="filter" size="sm"></svg>
              Filter braiders
              <kbd>F</kbd>
            </button>
          </li>
        </ul>
      </ng-template>
    </hp-example>

    <hp-example
      heading="Long menu"
      description="More than five items: below 640 px the menu opens as a bottom sheet with 44 px items."
    >
      <button hp-button [hpMenuTriggerFor]="longMenu">Jump to</button>
      <ng-template #longMenu>
        <ul hp-menu aria-label="Jump to">
          <li role="none"><a hp-menu-item routerLink="/card">Appointments</a></li>
          <li role="none"><a hp-menu-item routerLink="/list">Updates</a></li>
          <li role="none"><a hp-menu-item routerLink="/chip">Saved braiders</a></li>
          <li role="none"><a hp-menu-item routerLink="/form-field">Account settings</a></li>
          <li role="none"><a hp-menu-item routerLink="/switch">Privacy choices</a></li>
          <li role="none"><a hp-menu-item routerLink="/link">Help</a></li>
        </ul>
      </ng-template>
    </hp-example>

    <hp-example
      heading="Item states"
      description="Static panels in flow (.menu--static): default, disabled, checked and danger items. Hover and Tab through them."
    >
      <ul hp-menu class="menu--static" aria-label="Item states">
        <li role="none"><button hp-menu-item>Message Nia</button></li>
        <li role="none"><button hp-menu-item disabled>Add to calendar</button></li>
        <li role="none"><button hp-menu-item-radio checked>Best match</button></li>
        <li role="none"><button hp-menu-item-radio>Lowest price</button></li>
        <li hpMenuDivider></li>
        <li role="none"><button hp-menu-item tone="danger">Cancel request</button></li>
      </ul>
      <ul hp-menu class="menu--static" aria-label="Disabled checked item">
        <li role="none">
          <button hp-menu-item-checkbox checked disabled>Reminder the day before</button>
        </li>
        <li role="none"><button hp-menu-item-checkbox>Reminder an hour before</button></li>
      </ul>
    </hp-example>

    <hp-example
      heading="Long labels"
      description="Labels wrap inside the 20 rem maximum width instead of truncating."
    >
      <ul hp-menu class="menu--static" aria-label="Request HP-1048">
        <li role="none">
          <button hp-menu-item>
            <svg hp-icon name="calendar" size="sm"></svg>
            Request knotless braids with Nia Okafor for Sat 24 Oct at 10:00 am
          </button>
        </li>
        <li role="none">
          <button hp-menu-item>
            <svg hp-icon name="clock" size="sm"></svg>
            About five hours · estimate $180–$240
          </button>
        </li>
      </ul>
    </hp-example>
  `,
})
export class MenuExamples {
  protected readonly sortOptions: readonly SortOption[] = [
    { value: 'best', label: 'Best match' },
    { value: 'price', label: 'Lowest price' },
    { value: 'rating', label: 'Highest rated' },
    { value: 'distance', label: 'Nearest to Toronto' },
  ];

  protected readonly lastAction = signal('none');
  protected readonly sort = signal('best');
  protected readonly availableThisWeek = signal(true);
  protected readonly savedOnly = signal(false);

  protected readonly sortLabel = computed(
    () => this.sortOptions.find((option) => option.value === this.sort())?.label ?? '',
  );
}
