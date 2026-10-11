import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  Button,
  ThemeToggle,
  TopBar,
  TopBarAccount,
  TopBarLink,
  TopBarUpdates,
} from '@hairpop/components';

import { Example } from '../shared';

/** The four destinations, pointed at storybook routes so every link resolves. */
const LINKS: readonly TopBarLink[] = [
  { id: 'styles', label: 'Styles', link: '/' },
  { id: 'braiders', label: 'Braiders', link: '/table' },
  { id: 'appointments', label: 'Appointments', link: '/tabs' },
  { id: 'help', label: 'Help', link: '/top-bar' },
];

const MAYA: TopBarAccount = { label: 'Maya', link: '/switch', panelLabel: 'Maya · account' };
const SIGN_IN: TopBarAccount = { label: 'Sign in', link: '/text-field' };

function updates(unreadCount: number): TopBarUpdates {
  return {
    label: 'Updates',
    link: '/toast',
    unreadCount,
    unreadText: unreadCount > 0 ? `, ${unreadCount} unread` : '',
  };
}

/** Stories for the top bar (top-bar.md): signed in and out, counts and the phone menu. */
@Component({
  selector: 'hp-top-bar-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Example, ThemeToggle, TopBar],
  template: `
    <hp-example
      heading="Signed in"
      description="Styles is current; Updates shows 2 unread. Below 768 px the links move into the menu."
    >
      <header
        hp-top-bar
        class="story-block"
        brandLabel="HairPop"
        brandLink="/"
        navLabel="Primary"
        menuLabel="Menu"
        current="styles"
        [links]="links"
        [updates]="twoUnread"
        [account]="maya"
        [(menuOpen)]="menuOpen"
      ></header>
      <p class="story-note">Menu {{ menuOpen() ? 'open' : 'closed' }}</p>
    </hp-example>

    <hp-example
      heading="Signed out"
      description="No Updates link; the account link reads “Sign in”."
    >
      <header
        hp-top-bar
        class="story-block"
        brandLabel="HairPop"
        brandLink="/"
        navLabel="Primary"
        menuLabel="Menu"
        [links]="links"
        [account]="signIn"
      ></header>
    </hp-example>

    <hp-example
      heading="With actions"
      description="The theme toggle projected into [slot=actions], after Updates and before the menu button at every width."
    >
      <header
        hp-top-bar
        class="story-block"
        brandLabel="HairPop"
        brandLink="/"
        navLabel="Primary"
        menuLabel="Menu"
        [links]="links"
        [updates]="twoUnread"
        [account]="maya"
      >
        <button slot="actions" hp-button variant="ghost" size="sm" hpThemeToggle>Dark theme</button>
      </header>
    </hp-example>

    <hp-example heading="No unread" description="A zero count hides the badge and the hidden text.">
      <header
        hp-top-bar
        class="story-block"
        brandLabel="HairPop"
        brandLink="/"
        navLabel="Primary"
        menuLabel="Menu"
        current="appointments"
        [links]="links"
        [updates]="noneUnread"
        [account]="maya"
      ></header>
    </hp-example>

    <hp-example
      heading="Count capped"
      description="Above 99 the badge reads 99+; the hidden text gives the number."
    >
      <header
        hp-top-bar
        class="story-block"
        brandLabel="HairPop"
        brandLink="/"
        navLabel="Primary"
        menuLabel="Menu"
        [links]="links"
        [updates]="manyUnread"
        [account]="maya"
      ></header>
    </hp-example>
  `,
  styles: `
    .story-block {
      flex: 1 1 100%;
      min-width: 0;
    }

    .story-note {
      margin: 0;
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }
  `,
})
export class TopBarExamples {
  protected readonly links = LINKS;
  protected readonly maya = MAYA;
  protected readonly signIn = SIGN_IN;
  protected readonly twoUnread = updates(2);
  protected readonly noneUnread = updates(0);
  protected readonly manyUnread = updates(120);
  protected readonly menuOpen = signal(false);
}
