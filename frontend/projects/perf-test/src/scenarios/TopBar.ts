import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, ThemeToggle, TopBar, TopBarLink } from '@hairpop/components';

const LINKS: readonly TopBarLink[] = [
  { id: 'styles', label: 'Styles', link: '/' },
  { id: 'braiders', label: 'Braiders', link: '/braiders' },
  { id: 'appointments', label: 'Appointments', link: '/appointments' },
  { id: 'help', label: 'Help', link: '/help' },
];

/** The signed-in customer bar with Updates and the theme toggle. */
@Component({
  selector: 'hp-top-bar-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, ThemeToggle, TopBar],
  template: `
    <header
      hp-top-bar
      brandLabel="HairPop"
      brandLink="/"
      navLabel="Primary"
      menuLabel="Menu"
      current="styles"
      [links]="links"
      [updates]="{
        label: 'Updates',
        link: '/notifications',
        unreadCount: 2,
        unreadText: ', 2 unread',
      }"
      [account]="{ label: 'Maya', link: '/settings' }"
    >
      <button slot="actions" hp-button variant="ghost" size="sm" hpThemeToggle>Dark theme</button>
    </header>
  `,
})
export default class TopBarScenario {
  protected readonly links = LINKS;
}
