import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionStore } from '@hairpop/api';
import {
  AppShell,
  Button,
  Footer,
  SkipLink,
  ThemeToggle,
  TopBar,
  TopBarLink,
} from '@hairpop/components';

const LINKS: readonly TopBarLink[] = [
  { id: 'requests', label: 'Requests', link: '/requests' },
  { id: 'services', label: 'Services', link: '/services' },
  { id: 'profile', label: 'Profile', link: '/profile' },
  { id: 'availability', label: 'Availability', link: '/availability' },
];

@Component({
  selector: 'hp-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-hydrated]': "hydrated() ? '' : null" },
  imports: [AppShell, Button, Footer, RouterOutlet, SkipLink, ThemeToggle, TopBar],
  template: `
    <a hp-skip-link>Skip to content</a>
    <hp-app-shell>
      <header
        hp-top-bar
        slot="topbar"
        brandLabel="HairPop for braiders"
        brandLink="/"
        navLabel="Management"
        menuLabel="Menu"
        [links]="links"
        [account]="account()"
      >
        <button slot="actions" hp-button variant="ghost" size="sm" hpThemeToggle>Dark theme</button>
      </header>
      <router-outlet />
      <footer
        hp-footer
        slot="footer"
        brandLine="HairPop for braiders · Keep your bookings current"
        [links]="[]"
      ></footer>
    </hp-app-shell>
  `,
})
export class App {
  private readonly session = inject(SessionStore);
  protected readonly hydrated = signal(false);
  protected readonly links = LINKS;
  protected readonly account = computed(() => {
    const user = this.session.user();
    return user?.role === 'braider'
      ? { label: user.firstName, link: '/requests' }
      : { label: 'Sign in', link: '/sign-in' };
  });

  constructor() {
    afterNextRender(() => this.hydrated.set(true));
  }
}
