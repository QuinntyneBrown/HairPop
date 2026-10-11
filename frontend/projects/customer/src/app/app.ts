import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  AppShell,
  Button,
  Footer,
  FooterLink,
  SkipLink,
  ThemeToggle,
  TopBar,
  TopBarLink,
} from '@hairpop/components';
import { filter, map } from 'rxjs';

/** The primary destinations, in top-bar order (top-bar.md). */
const NAV_LINKS: readonly TopBarLink[] = [
  { id: 'styles', label: 'Styles', link: '/' },
  { id: 'braiders', label: 'Braiders', link: '/braiders' },
  { id: 'appointments', label: 'Appointments', link: '/appointments' },
  { id: 'help', label: 'Help', link: '/help' },
];

const FOOTER_LINKS: readonly FooterLink[] = [
  { id: 'help', label: 'Help', link: '/help' },
  { id: 'terms', label: 'Terms', link: '/terms' },
  { id: 'privacy', label: 'Privacy', link: '/privacy' },
];

/** Reads the deepest route's `nav` data: the top-bar link marked current (top-bar.md D-2). */
function currentNav(route: ActivatedRouteSnapshot): string | null {
  let nav: string | null = null;
  for (let r: ActivatedRouteSnapshot | null = route; r; r = r.firstChild) {
    nav = (r.data['nav'] as string | undefined) ?? nav;
  }
  return nav;
}

/** CustomerRouteShell: skip link, top bar, the one main landmark and the footer. */
@Component({
  selector: 'hp-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppShell, Button, Footer, RouterOutlet, SkipLink, ThemeToggle, TopBar],
  template: `
    <a hp-skip-link>Skip to content</a>
    <hp-app-shell>
      <header
        hp-top-bar
        slot="topbar"
        brandLabel="HairPop"
        brandLink="/"
        navLabel="Primary"
        menuLabel="Menu"
        [links]="links"
        [current]="current()"
        [account]="account"
      >
        <button slot="actions" hp-button variant="ghost" size="sm" hpThemeToggle>Dark theme</button>
      </header>
      <router-outlet />
      <footer
        hp-footer
        slot="footer"
        brandLine="HairPop · Made for confident hair decisions"
        [links]="footerLinks"
      ></footer>
    </hp-app-shell>
  `,
})
export class App {
  private readonly router = inject(Router);

  protected readonly links = NAV_LINKS;
  protected readonly footerLinks = FOOTER_LINKS;
  protected readonly account = { label: 'Sign in', link: '/sign-in' };

  protected readonly current = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => currentNav(this.router.routerState.snapshot.root)),
    ),
    { initialValue: null },
  );
}
