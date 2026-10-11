import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { COMPONENT_EXAMPLES } from '@hairpop/components-examples';
import { filter, map } from 'rxjs';

/** `system` follows the OS; `light` and `dark` force a theme with `data-theme` on `<html>`. */
type Theme = 'system' | 'light' | 'dark';

const THEMES: readonly Theme[] = ['system', 'light', 'dark'];
const THEME_KEY = 'hp-storybook-theme';

/** Storybook shell: a searchable list of components beside the selected component's stories. */
@Component({
  selector: 'hp-storybook-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="storybook">
      <aside class="storybook__sidebar">
        <p class="storybook__brand">HairPop Storybook</p>
        <label class="storybook__label" for="storybook-search">Find a component</label>
        <input
          id="storybook-search"
          class="storybook__search"
          type="search"
          autocomplete="off"
          [value]="query()"
          (input)="query.set($any($event.target).value)"
        />
        <nav aria-label="Components">
          <ul class="storybook__list">
            @for (entry of visible(); track entry.id) {
              <li>
                <a
                  class="storybook__link"
                  [routerLink]="['/', entry.id]"
                  routerLinkActive="storybook__link--current"
                  ariaCurrentWhenActive="page"
                  >{{ entry.title }}</a
                >
              </li>
            } @empty {
              <li class="storybook__empty">No components match “{{ query() }}”.</li>
            }
          </ul>
        </nav>
        <label class="storybook__label" for="storybook-theme">Theme</label>
        <select
          id="storybook-theme"
          class="storybook__theme"
          [value]="theme()"
          (change)="setTheme($any($event.target).value)"
        >
          @for (option of themes; track option) {
            <option [value]="option">{{ option }}</option>
          }
        </select>
      </aside>
      <main class="storybook__main">
        @if (heading(); as heading) {
          <h1 class="storybook__heading">{{ heading }}</h1>
        }
        <div class="storybook__stories">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: `
    .storybook {
      display: grid;
      grid-template-columns: var(--layout-sidebar-width) minmax(0, 1fr);
      min-height: 100vh;
    }

    .storybook__sidebar {
      position: sticky;
      top: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      height: 100vh;
      padding: var(--space-4);
      overflow-y: auto;
      background: var(--color-bg-surface);
      border-inline-end: var(--border-width-hairline) solid var(--color-border-default);
    }

    .storybook__brand {
      margin: 0 0 var(--space-2);
      font: var(--text-h4);
      color: var(--color-fg-accent);
    }

    .storybook__label {
      font: var(--text-label);
      color: var(--color-fg-muted);
    }

    .storybook__search,
    .storybook__theme {
      min-height: var(--control-height-sm);
      padding-inline: var(--space-2);
      font: var(--text-body-sm);
      color: var(--color-fg-default);
      background: var(--color-bg-surface);
      border: var(--border-width-hairline) solid var(--color-border-strong);
      border-radius: var(--radius-md);
      text-transform: capitalize;
    }

    nav {
      flex: 1;
    }

    .storybook__list {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      margin: var(--space-2) 0;
      padding: 0;
      list-style: none;
    }

    .storybook__link {
      display: block;
      padding: var(--space-1) var(--space-2);
      font: var(--text-body-sm);
      color: var(--color-fg-default);
      text-decoration: none;
      border-radius: var(--radius-sm);
    }

    .storybook__link:hover {
      background: var(--color-bg-subtle);
    }

    .storybook__link--current {
      color: var(--color-fg-accent);
      background: var(--color-accent-subtle);
    }

    .storybook__empty {
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }

    .storybook__main {
      min-width: 0;
      padding: var(--space-8) var(--layout-margin);
    }

    .storybook__heading {
      margin: 0 0 var(--space-6);
      font: var(--text-h1);
    }

    .storybook__stories {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
      max-width: var(--layout-container-max);
    }

    @media (max-width: 47.99rem) {
      .storybook {
        grid-template-columns: minmax(0, 1fr);
      }

      .storybook__sidebar {
        position: static;
        height: auto;
        border-inline-end: none;
        border-block-end: var(--border-width-hairline) solid var(--color-border-default);
      }
    }
  `,
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly themes = THEMES;
  protected readonly query = signal('');
  protected readonly theme = signal<Theme>(readTheme());

  protected readonly visible = computed(() => {
    const query = this.query().trim().toLowerCase();
    return COMPONENT_EXAMPLES.filter((entry) => entry.title.toLowerCase().includes(query));
  });

  protected readonly heading = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.route.snapshot;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return (route.data['heading'] as string | undefined) ?? null;
      }),
    ),
    { initialValue: null },
  );

  constructor() {
    effect(() => {
      const theme = this.theme();
      const root = this.document.documentElement;
      if (theme === 'system') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', theme);
      }
    });
  }

  protected setTheme(value: string): void {
    const theme = THEMES.find((option) => option === value) ?? 'system';
    this.theme.set(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Storage can be unavailable; the choice then lasts for this visit only.
    }
  }
}

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return THEMES.find((option) => option === stored) ?? 'system';
  } catch {
    return 'system';
  }
}
