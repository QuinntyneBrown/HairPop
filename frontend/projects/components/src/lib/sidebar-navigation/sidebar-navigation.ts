import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Overlay } from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  TemplateRef,
  computed,
  effect,
  inject,
  input,
  isDevMode,
  model,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

/** Router commands for a sidebar link, as `RouterLink` accepts them. */
type Commands = string | readonly unknown[];

/** One destination in the sidebar. */
export interface SidebarNavItem {
  readonly id: string;
  readonly label: string;
  readonly link: Commands;
  /** A name from the icon registry; on every item of the sidebar or on none. */
  readonly icon?: IconName;
  /** 0 or absent: no badge; above 99: "99+". */
  readonly count?: number;
  /** Visually hidden, read after the count: ", 2 unread". */
  readonly countText?: string;
}

/** A labelled group of destinations. */
export interface SidebarNavGroup {
  readonly label: string;
  /** Default false: `<p>` label; true: `<details>`/`<summary>`. */
  readonly collapsible?: boolean;
  /** Initial state of a collapsible group; default false (open). */
  readonly collapsed?: boolean;
  readonly items: readonly SidebarNavItem[];
}

interface ItemView {
  readonly id: string;
  readonly label: string;
  readonly link: Commands;
  readonly icon: IconName | null;
  readonly current: 'page' | null;
  readonly badge: string | null;
  readonly countText: string | null;
}

interface GroupView {
  readonly key: string;
  readonly label: string;
  readonly collapsible: boolean;
  readonly forced: boolean;
  readonly open: boolean;
  readonly items: readonly ItemView[];
}

let nextSidebarId = 0;

/** `--layout-breakpoint-lg`: the column shows and the drawer closes. */
const COLUMN_QUERY = '(min-width: 64rem)';
/** `--layout-breakpoint-sm`: below it the drawer is the viewport's width. */
const NARROW_DRAWER_QUERY = '(min-width: 40rem)';

/**
 * Grouped navigation beside the page: a sticky column from 1024 px, and a
 * drawer (CDK Dialog) opened from its own toggle below 1024 px.
 */
@Component({
  selector: 'hp-sidebar-navigation',
  imports: [NgTemplateOutlet, RouterLink, Button, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
  template: `<button
      hp-button
      variant="ghost"
      class="sidebar__toggle"
      aria-haspopup="dialog"
      [attr.aria-expanded]="open() ? 'true' : 'false'"
      [attr.aria-controls]="drawerId"
      (click)="open.set(true)"
    >
      <svg hp-icon name="menu"></svg>{{ toggleLabel() }}
    </button>
    <nav class="sidebar" [attr.aria-label]="label()">
      <ng-container [ngTemplateOutlet]="links" [ngTemplateOutletContext]="{ inDrawer: false }" />
    </nav>

    <ng-template #links let-inDrawer="inDrawer">
      @for (group of view(); track group.key) {
        @if (group.collapsible) {
          <details [open]="group.open" (toggle)="onGroupToggle($event, group)">
            <summary class="sidebar__group">{{ group.label }}</summary>
            <ng-container
              [ngTemplateOutlet]="itemList"
              [ngTemplateOutletContext]="{ $implicit: group.items, inDrawer: inDrawer }"
            />
          </details>
        } @else {
          @if (group.label) {
            <p class="sidebar__group">{{ group.label }}</p>
          }
          <ng-container
            [ngTemplateOutlet]="itemList"
            [ngTemplateOutletContext]="{ $implicit: group.items, inDrawer: inDrawer }"
          />
        }
      }
    </ng-template>

    <ng-template #itemList let-items let-inDrawer="inDrawer">
      @for (item of items; track item.id) {
        <a
          class="nav-link"
          [routerLink]="item.link"
          [attr.aria-current]="item.current"
          (click)="inDrawer && closeDrawer()"
        >
          @if (item.icon) {
            <svg hp-icon [name]="item.icon"></svg>
          }
          {{ item.label }}
          @if (item.badge) {
            <span class="badge badge--count">{{ item.badge }}</span>
            @if (item.countText) {
              <span class="visually-hidden">{{ item.countText }}</span>
            }
          }
        </a>
      }
    </ng-template>

    <ng-template #drawer>
      <nav class="sidebar" data-open="true" [attr.aria-label]="label()">
        <button
          hp-button
          variant="ghost"
          iconOnly
          class="sidebar__close"
          [attr.aria-label]="closeLabel()"
          (click)="closeDrawer()"
        >
          <svg hp-icon name="close"></svg>
        </button>
        <ng-container [ngTemplateOutlet]="links" [ngTemplateOutletContext]="{ inDrawer: true }" />
      </nav>
    </ng-template>`,
  styles: `
    .sidebar__toggle {
      margin-inline: var(--layout-margin);
    }
    .sidebar {
      box-sizing: border-box;
      background: var(--color-bg-surface);
      border-right: var(--border-width-hairline) solid var(--color-border-default);
      padding: var(--space-4);
      display: none;
      flex-direction: column;
      gap: var(--space-1);
    }
    .sidebar[data-open='true'] {
      display: flex;
      width: 100%;
      height: 100%;
      overflow: auto;
      animation: hp-sidebar-slide-in var(--duration-slow) var(--ease-enter);
    }
    @media (min-width: 64rem) {
      .sidebar__toggle {
        display: none;
      }
      .sidebar {
        display: flex;
        position: sticky;
        top: var(--layout-topbar-height);
        height: calc(100dvh - var(--layout-topbar-height));
        overflow: auto;
      }
    }
    .sidebar__close {
      align-self: flex-end;
      flex: none;
    }
    .sidebar__group {
      display: block;
      max-width: none;
      margin: 0;
      font: var(--text-overline);
      letter-spacing: var(--letter-spacing-wide);
      text-transform: uppercase;
      color: var(--color-fg-subtle);
      padding: var(--space-4) var(--space-3) var(--space-1);
    }
    summary.sidebar__group {
      display: list-item;
      min-height: var(--target-min);
      cursor: pointer;
      border-radius: var(--radius-md);
    }
    summary.sidebar__group:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus-ring);
      outline-offset: var(--focus-ring-offset);
    }
    details .nav-link {
      margin-top: var(--space-1);
    }
    .nav-link {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      width: 100%;
      min-height: var(--target-comfortable);
      padding: 0 var(--space-3);
      border-radius: var(--radius-md);
      color: var(--color-fg-muted);
      text-decoration: none;
      font: var(--text-label);
      overflow-wrap: anywhere;
      transition:
        background-color var(--duration-fast) var(--ease-standard),
        color var(--duration-fast) var(--ease-standard);
    }
    .nav-link:hover {
      background: var(--color-bg-subtle);
      color: var(--color-fg-default);
    }
    .nav-link[aria-current='page'] {
      background: var(--color-accent-subtle);
      color: var(--color-fg-accent);
    }
    .nav-link[aria-current='page']:hover {
      background: var(--color-accent-subtle-hover);
    }
    .nav-link:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus-ring);
      outline-offset: var(--focus-ring-offset);
    }
    .badge {
      --badge-bg: var(--color-danger-solid);
      --badge-fg: var(--color-fg-on-danger);
      --badge-height: 1.5rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      align-self: center;
      flex: none;
      margin-left: auto;
      min-width: var(--badge-height);
      min-height: var(--badge-height);
      padding: 0 var(--space-1);
      border-radius: var(--radius-full);
      font: var(--text-overline);
      font-variant-numeric: tabular-nums;
      letter-spacing: var(--letter-spacing-normal);
      text-transform: uppercase;
      background: var(--badge-bg);
      color: var(--badge-fg);
      white-space: nowrap;
    }
    .visually-hidden {
      position: absolute !important;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    }
    @keyframes hp-sidebar-slide-in {
      from {
        translate: -100% 0;
      }
    }
    ::ng-deep .cdk-overlay-backdrop.hp-sidebar-backdrop {
      background: var(--color-bg-backdrop);
    }
    @media (forced-colors: active) {
      .badge {
        border: var(--border-width-hairline) solid CanvasText;
      }
      .nav-link[aria-current='page'] {
        outline: var(--border-width-thick) solid Highlight;
      }
    }
    @media print {
      :host {
        display: none !important;
      }
    }
  `,
})
export class SidebarNavigation {
  private readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);
  private readonly breakpoints = inject(BreakpointObserver);
  private readonly document = inject(DOCUMENT);

  /** `aria-label` of the `<nav>`; differs from the top bar's "Primary". */
  readonly label = input.required<string>();
  /** Groups in display order, each with at least one item. */
  readonly groups = input.required<readonly SidebarNavGroup[]>();
  /** The `id` of the current item. */
  readonly current = input<string | null>(null);
  /** Visible text of the drawer toggle and the drawer dialog's name. */
  readonly toggleLabel = input.required<string>();
  /** `aria-label` of the drawer's close button. */
  readonly closeLabel = input.required<string>();
  /** Whether the drawer is open (two-way). Ignored from 1024 px. */
  readonly open = model(false);

  readonly drawerId = `hp-sidebar-drawer-${++nextSidebarId}`;

  private readonly drawerTemplate = viewChild.required<TemplateRef<unknown>>('drawer');
  private drawerRef: DialogRef<unknown, unknown> | null = null;
  private readonly wide = signal(false);

  /** Open state of collapsible groups after the customer toggled them (D-10). */
  private readonly toggled = signal<Readonly<Record<string, boolean>>>({});

  protected readonly view = computed<readonly GroupView[]>(() => {
    const current = this.current();
    const toggled = this.toggled();
    return this.groups().map((group, index) => {
      const key = `${index}:${group.label}`;
      const forced = !!current && group.items.some((item) => item.id === current);
      const collapsible = !!group.collapsible;
      return {
        key,
        label: group.label,
        collapsible,
        forced,
        open: !collapsible || forced || (toggled[key] ?? !group.collapsed),
        items: group.items.map((item) => ({
          id: item.id,
          label: item.label,
          link: item.link,
          icon: item.icon ?? null,
          current: item.id === current ? 'page' : null,
          badge: item.count && item.count > 0 ? (item.count > 99 ? '99+' : `${item.count}`) : null,
          countText: item.countText ?? null,
        })),
      };
    });
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    // D-8: icons on every link or on none.
    effect(() => {
      const items = this.groups().flatMap((group) => group.items);
      const withIcon = items.filter((item) => item.icon).length;
      if (isDevMode() && withIcon > 0 && withIcon < items.length) {
        console.error(
          `hp-sidebar-navigation: icons must be on every link or on none; ${withIcon} of ${items.length} links in "${untracked(this.label)}" have one.`,
        );
      }
    });

    const breakpoint = this.breakpoints.observe(COLUMN_QUERY).subscribe((state) => {
      this.wide.set(state.matches);
    });

    const router = inject(Router, { optional: true });
    const navigation = router?.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeDrawer();
      }
    });

    destroyRef.onDestroy(() => {
      breakpoint.unsubscribe();
      navigation?.unsubscribe();
      this.drawerRef?.close();
    });

    // Keep the drawer in step with the `open` model and the viewport.
    effect(() => {
      const open = this.open();
      const wide = this.wide();
      untracked(() => {
        if (open && wide) {
          this.open.set(false);
        } else if (open && !this.drawerRef) {
          this.openDrawer();
        } else if (!open && this.drawerRef) {
          this.drawerRef.close();
        }
      });
    });
  }

  /** Closes the drawer; focus returns to the toggle. */
  closeDrawer(): void {
    if (this.open()) {
      this.open.set(false);
    }
  }

  protected onGroupToggle(event: Event, group: GroupView): void {
    const details = event.target as HTMLDetailsElement;
    if (group.forced && !details.open) {
      details.open = true;
      return;
    }
    if (this.toggled()[group.key] !== details.open) {
      this.toggled.update((state) => ({ ...state, [group.key]: details.open }));
    }
  }

  private openDrawer(): void {
    const narrow = !this.document.defaultView?.matchMedia(NARROW_DRAWER_QUERY).matches;
    const ref = this.dialog.open(this.drawerTemplate(), {
      id: this.drawerId,
      ariaLabel: this.toggleLabel(),
      ariaModal: true,
      autoFocus: '.nav-link',
      restoreFocus: true,
      hasBackdrop: true,
      backdropClass: ['backdrop', 'hp-sidebar-backdrop'],
      positionStrategy: this.overlay.position().global().left('0').top('0'),
      width: narrow ? '100%' : 'var(--layout-sidebar-width)',
      height: '100dvh',
      maxWidth: '100%',
    });
    this.drawerRef = ref;
    ref.closed.subscribe(() => {
      this.drawerRef = null;
      if (this.open()) {
        this.open.set(false);
      }
    });
  }
}
