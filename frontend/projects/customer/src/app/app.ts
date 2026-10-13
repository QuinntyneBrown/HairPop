import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { SessionStore } from '@hairpop/api';
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
import { filter, map, take } from 'rxjs';

import { ConsentPreferences } from './shared/consent-preferences';
import { CookieBanner } from './shared/cookie-banner';
import { UnreadCountStore } from './shared/unread-count.store';

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
  { id: 'cookies', label: 'Cookie preferences', link: '/privacy', opensDialog: true },
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
  host: { '[attr.data-hydrated]': "hydrated() ? '' : null" },
  imports: [AppShell, Button, CookieBanner, Footer, RouterOutlet, SkipLink, ThemeToggle, TopBar],
  template: `
    <a hp-skip-link>Skip to content</a>
    <hp-cookie-banner />
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
        [account]="account()"
        [updates]="updates()"
      >
        <button slot="actions" hp-button variant="ghost" size="sm" hpThemeToggle>Dark theme</button>
      </header>
      <router-outlet />
      <footer
        hp-footer
        slot="footer"
        brandLine="HairPop · Made for confident hair decisions"
        [links]="footerLinks"
        (dialogRequested)="preferences.open()"
      ></footer>
    </hp-app-shell>
  `,
})
export class App {
  private readonly router = inject(Router);
  protected readonly preferences = inject(ConsentPreferences);

  /**
   * Set once the first navigation's page has rendered in the browser, so e2e tests act only on
   * an interactive app: a lazy page hydrates after the shell does.
   */
  protected readonly hydrated = signal(false);

  protected readonly links = NAV_LINKS;
  protected readonly footerLinks = FOOTER_LINKS;
  private readonly session = inject(SessionStore);
  private readonly unread = inject(UnreadCountStore);
  protected readonly updates = computed(() =>
    this.session.user()?.role === 'customer'
      ? {
          label: 'Updates',
          link: '/notifications',
          unreadCount: this.unread.count(),
          unreadText: `, ${this.unread.count()} unread`,
        }
      : null,
  );

  /** The person's first name once signed in; otherwise the way to sign in. */
  protected readonly account = computed(() => {
    const user = this.session.user();
    return user
      ? { label: user.firstName, link: '/settings', panelLabel: `${user.firstName} · account` }
      : { label: 'Sign in', link: '/sign-in' };
  });

  constructor() {
    this.announceTitleOnNavigation();
    effect(() => {
      if (this.session.user()?.role === 'customer') {
        afterNextRender(() => void this.unread.refresh(), { injector: this.injector });
      } else {
        this.unread.set(0);
      }
    });
    const injector = inject(Injector);
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => afterNextRender(() => this.hydrated.set(true), { injector }));
  }

  private readonly injector = inject(Injector);

  /**
   * Announces the page title after a client-side navigation to another page (L2-041); the first
   * load and query-only changes such as searching stay quiet. The heading takes focus itself
   * (page-header D-6).
   */
  private announceTitleOnNavigation(): void {
    const announcer = inject(LiveAnnouncer);
    const title = inject(Title);
    const injector = inject(Injector);
    let previous: string | null = null;
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      const path = e.urlAfterRedirects.split(/[?#]/)[0];
      if (previous !== null && path !== previous) {
        // The router sets the document title after this event, so read it after the next render.
        afterNextRender(() => void announcer.announce(title.getTitle()), { injector });
      }
      previous = path;
    });
  }

  protected readonly current = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => currentNav(this.router.routerState.snapshot.root)),
    ),
    { initialValue: null },
  );
}
