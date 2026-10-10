import { BreakpointObserver } from '@angular/cdk/layout';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  model,
  untracked,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { Badge } from '../badge/badge';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';

/** `RouterLink` commands: a path string or a commands array. */
export type TopBarCommands = string | readonly unknown[];

/** One primary destination. */
export interface TopBarLink {
  readonly id: string;
  readonly label: string;
  readonly link: TopBarCommands;
}

/** The Updates link, shown while signed in. */
export interface TopBarUpdates {
  /** "Updates". */
  readonly label: string;
  /** '/notifications'. */
  readonly link: TopBarCommands;
  /** 0 hides the badge and the unread text. */
  readonly unreadCount: number;
  /** ", 2 unread": visually hidden, read after the count. */
  readonly unreadText: string;
}

/** The account link: "Maya" → account settings, or "Sign in" → `/sign-in`. */
export interface TopBarAccount {
  readonly label: string;
  readonly link: TopBarCommands;
  /** Label in the phone menu panel ("Maya · account"); defaults to `label`. */
  readonly panelLabel?: string;
}

/** The wide layout: links inline, menu button hidden (`--layout-breakpoint-md`). */
const WIDE_QUERY = '(min-width: 48rem)';

/** Largest count the badge shows before "99+" (D-10). */
const MAX_COUNT = 99;

let nextPanelId = 0;

/**
 * The banner on every HairPop screen (top-bar.md): brand, the primary destinations, Updates
 * with the unread count and the account link. Below 48 rem the destinations and the account
 * move into a non-modal disclosure panel in a CDK Overlay under the bar (D-3, D-4, D-5).
 * The host is the native `<header>`, so it stays sticky and is the banner landmark (D-1).
 */
@Component({
  selector: 'header[hp-top-bar]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Badge, Button, Icon],
  host: {
    class: 'topbar',
  },
  template: `
    <a class="topbar__brand" [routerLink]="brandLink()"
      ><svg hp-icon name="sparkle"></svg>{{ brandLabel() }}</a
    >
    <nav class="topbar__nav" [attr.aria-label]="navLabel()">
      @for (link of links(); track link.id; let i = $index) {
        <a class="nav-link" [routerLink]="link.link" [attr.aria-current]="currents()[i]">{{
          link.label
        }}</a>
      }
    </nav>
    <span class="topbar__spacer"></span>
    @if (updates(); as updates) {
      <a class="account-link" [routerLink]="updates.link"
        >{{ updates.label }}
        @if (showCount()) {
          <span hp-badge [count]="updates.unreadCount" [max]="maxCount"></span
          ><span class="visually-hidden">{{ updates.unreadText }}</span>
        }
      </a>
    }
    <button
      #menuButton
      hp-button
      variant="ghost"
      iconOnly
      class="topbar__menu"
      type="button"
      [attr.aria-label]="menuLabel()"
      [attr.aria-expanded]="menuOpen()"
      [attr.aria-controls]="panelId"
      (click)="toggle()"
      (keydown)="onButtonKeydown($event)"
    >
      <svg hp-icon [name]="menuOpen() ? 'close' : 'menu'"></svg>
    </button>
    <a class="account-link topbar__account" [routerLink]="account().link">{{ account().label }}</a>

    <ng-template #panel>
      <nav class="topbar__panel" [id]="panelId" [attr.aria-label]="navLabel()">
        @for (link of links(); track link.id; let i = $index) {
          <a
            class="nav-link"
            [routerLink]="link.link"
            [attr.aria-current]="currents()[i]"
            (keydown)="onPanelKeydown($event)"
            (click)="closeFromLink()"
            >{{ link.label }}</a
          >
        }
        <a
          class="nav-link"
          [routerLink]="account().link"
          (keydown)="onPanelKeydown($event)"
          (click)="closeFromLink()"
          >{{ accountPanelLabel() }}</a
        >
      </nav>
    </ng-template>
  `,
  styles: `
    :host {
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-3);
      row-gap: 0;
      box-sizing: border-box;
      min-height: var(--layout-topbar-height);
      padding-inline: var(--layout-margin);
      background: var(--topbar-bg, var(--color-bg-surface));
      border-bottom: var(--border-width-hairline) solid var(--color-border-default);
    }

    .topbar__brand {
      font: var(--text-h4);
      color: var(--color-fg-accent);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      white-space: nowrap;
      min-height: var(--target-comfortable);
    }

    .topbar__brand:hover,
    .topbar__brand:active {
      color: var(--color-fg-link-hover);
      text-decoration: none;
    }

    .topbar__nav {
      display: none;
      gap: var(--space-1);
      margin-left: var(--space-4);
    }

    .topbar__nav .nav-link {
      white-space: nowrap;
    }

    .topbar__spacer {
      flex: 1;
    }

    .topbar__menu {
      display: inline-flex;
    }

    .account-link {
      color: var(--color-fg-default);
      min-height: var(--target-comfortable);
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-sm);
      white-space: nowrap;
    }

    .account-link:hover,
    .account-link:active {
      color: var(--color-fg-link-hover);
    }

    /* D-5: below 48 rem the account link lives in the menu panel. */
    .topbar__account {
      display: none;
    }

    @media (min-width: 48rem) {
      .topbar__nav {
        display: flex;
      }

      .topbar__menu {
        display: none;
      }

      .account-link {
        font-size: var(--font-size-md);
      }

      .topbar__account {
        display: inline-flex;
      }
    }

    .nav-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      box-sizing: border-box;
      min-height: var(--target-comfortable);
      padding: 0 var(--space-3);
      border-radius: var(--radius-md);
      color: var(--color-fg-muted);
      text-decoration: none;
      font: var(--text-label);
      transition:
        background-color var(--duration-fast) var(--ease-standard),
        color var(--duration-fast) var(--ease-standard);
    }

    .nav-link:hover,
    .nav-link:active {
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

    /* D-3: the phone menu panel, rendered in the overlay pane under the bar. */
    .topbar__panel {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      box-sizing: border-box;
      width: 100%;
      overflow-y: auto;
      padding: var(--space-2) var(--layout-margin) var(--space-4);
      background: var(--topbar-bg, var(--color-bg-surface));
      border-bottom: var(--border-width-hairline) solid var(--color-border-default);
    }

    @media (forced-colors: active) {
      .nav-link[aria-current='page'] {
        outline: var(--border-width-thick) solid Highlight;
      }

      a:focus-visible {
        outline-color: Highlight;
      }
    }

    @media print {
      :host {
        display: none !important;
      }
    }
  `,
})
export class TopBar {
  /** Text of the brand link ("HairPop"). */
  readonly brandLabel = input.required<string>();
  /** `RouterLink` commands for the style gallery. */
  readonly brandLink = input.required<TopBarCommands>();
  /** `aria-label` of the inline nav and the menu panel ("Primary"). */
  readonly navLabel = input.required<string>();
  /** The primary destinations in display order. */
  readonly links = input.required<readonly TopBarLink[]>();
  /** The `id` of the current destination; null marks none. */
  readonly current = input<string | null>(null);
  /** The Updates link; null hides it (signed out, D-7). */
  readonly updates = input<TopBarUpdates | null>(null);
  /** The account link: the customer's first name, or "Sign in". */
  readonly account = input.required<TopBarAccount>();
  /** `aria-label` of the menu button ("Menu"). */
  readonly menuLabel = input.required<string>();
  /** Whether the phone menu panel is open; `true` at 48 rem or wider is ignored. */
  readonly menuOpen = model(false);

  protected readonly panelId = `hp-top-bar-panel-${++nextPanelId}`;
  protected readonly maxCount = MAX_COUNT;

  protected readonly currents = computed(() => {
    const current = this.current();
    return this.links().map((link) => (current !== null && link.id === current ? 'page' : null));
  });
  protected readonly showCount = computed(() => (this.updates()?.unreadCount ?? 0) > 0);
  protected readonly accountPanelLabel = computed(
    () => this.account().panelLabel ?? this.account().label,
  );

  private readonly menuButton = viewChild.required('menuButton', { read: ElementRef });
  private readonly panelTemplate = viewChild.required<TemplateRef<unknown>>('panel');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly interactivity = inject(InteractivityChecker);
  private readonly breakpoints = inject(BreakpointObserver);

  private overlayRef: OverlayRef | null = null;
  private readonly overlaySubscriptions = new Subscription();
  private wide = false;
  private readonly onViewportChange = () => this.updatePanelGeometry();

  constructor() {
    const subscriptions = new Subscription();
    subscriptions.add(
      this.breakpoints.observe(WIDE_QUERY).subscribe((state) => {
        this.wide = state.matches;
        if (state.matches && this.menuOpen()) {
          this.menuOpen.set(false);
        }
      }),
    );
    subscriptions.add(
      inject(Router)
        .events.pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          if (this.menuOpen()) {
            this.menuOpen.set(false);
          }
        }),
    );

    // The model is the one source of truth: every open and close goes through it.
    effect(() => {
      const open = this.menuOpen();
      untracked(() => this.sync(open));
    });

    inject(DestroyRef).onDestroy(() => {
      subscriptions.unsubscribe();
      this.overlaySubscriptions.unsubscribe();
      this.removeViewportListeners();
      this.overlayRef?.dispose();
      this.overlayRef = null;
    });
  }

  protected toggle(): void {
    const open = !this.menuOpen();
    this.menuOpen.set(open);
    // Attach or detach at once, so the panel exists before the next pointer event.
    this.sync(open);
  }

  private sync(open: boolean): void {
    if (open && this.wide) {
      this.menuOpen.set(false);
    } else if (open) {
      this.attachPanel();
    } else {
      this.detachPanel();
    }
  }

  protected onButtonKeydown(event: KeyboardEvent): void {
    // D-4: the panel follows the button in keyboard order although it lives in the overlay.
    if (event.key === 'Tab' && !event.shiftKey && this.menuOpen()) {
      const first = this.panelLinks()[0];
      if (first) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  protected onPanelKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }
    const links = this.panelLinks();
    const index = links.indexOf(event.target as HTMLElement);
    if (event.shiftKey && index === 0) {
      event.preventDefault();
      this.focusButton();
    } else if (!event.shiftKey && index === links.length - 1) {
      event.preventDefault();
      this.menuOpen.set(false);
      const next = this.firstTabbableAfterHost();
      if (next) {
        next.focus();
      } else {
        this.focusButton();
      }
    }
  }

  protected closeFromLink(): void {
    // Activating a link closes the panel even when the route does not change.
    this.menuOpen.set(false);
  }

  private attachPanel(): void {
    if (this.overlayRef?.hasAttached()) {
      return;
    }
    const overlayRef = this.overlayRef ?? this.createOverlay();
    overlayRef.attach(new TemplatePortal(this.panelTemplate(), this.viewContainerRef));
    // The pane is outside the header, so an ancestor's --topbar-bg override must be copied.
    const topbarBg = getComputedStyle(this.host).getPropertyValue('--topbar-bg').trim();
    const panel = overlayRef.overlayElement.querySelector<HTMLElement>('.topbar__panel');
    if (panel) {
      if (topbarBg) {
        panel.style.setProperty('--topbar-bg', topbarBg);
      } else {
        panel.style.removeProperty('--topbar-bg');
      }
    }
    this.updatePanelGeometry();
    const view = this.document.defaultView;
    view?.addEventListener('resize', this.onViewportChange);
    view?.addEventListener('scroll', this.onViewportChange, { passive: true });
  }

  private detachPanel(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.removeViewportListeners();
  }

  private createOverlay(): OverlayRef {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.host)
      .withPositions([{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }])
      .withFlexibleDimensions(false)
      .withPush(false);
    const overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      // In the overlay container, not the top layer, so `--z-dropdown` keeps the panel under
      // dialogs and toasts (Design: Elevation and layer).
      usePopover: false,
    });
    overlayRef.hostElement.style.zIndex = 'var(--z-dropdown)';
    this.overlaySubscriptions.add(
      overlayRef.keydownEvents().subscribe((event) => {
        if (event.key === 'Escape' && !event.altKey && !event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          this.menuOpen.set(false);
          this.focusButton();
        }
      }),
    );
    this.overlaySubscriptions.add(
      overlayRef.outsidePointerEvents().subscribe((event) => {
        const target = event.target as Node | null;
        if (target && this.host.contains(target)) {
          return;
        }
        this.menuOpen.set(false);
      }),
    );
    this.overlayRef = overlayRef;
    return overlayRef;
  }

  private updatePanelGeometry(): void {
    const overlayRef = this.overlayRef;
    if (!overlayRef?.hasAttached()) {
      return;
    }
    const rect = this.host.getBoundingClientRect();
    overlayRef.updateSize({ width: rect.width });
    const panel = overlayRef.overlayElement.querySelector<HTMLElement>('.topbar__panel');
    if (panel) {
      panel.style.maxHeight = `calc(100dvh - ${Math.max(0, rect.bottom)}px)`;
    }
    overlayRef.updatePosition();
  }

  private removeViewportListeners(): void {
    const view = this.document.defaultView;
    view?.removeEventListener('resize', this.onViewportChange);
    view?.removeEventListener('scroll', this.onViewportChange);
  }

  private panelLinks(): HTMLElement[] {
    const pane = this.overlayRef?.hasAttached() ? this.overlayRef.overlayElement : null;
    return pane ? Array.from(pane.querySelectorAll<HTMLElement>('.topbar__panel a')) : [];
  }

  private focusButton(): void {
    (this.menuButton().nativeElement as HTMLElement).focus();
  }

  /** The first tabbable element after the bar in document order, outside the overlay. */
  private firstTabbableAfterHost(): HTMLElement | null {
    const overlayContainer = this.overlayRef?.hostElement.parentElement ?? null;
    const walker = this.document.createTreeWalker(this.document.body, NodeFilter.SHOW_ELEMENT);
    // Start after the bar's own subtree.
    walker.currentNode = this.host;
    let current: Node | null = walker.nextSibling();
    let ancestor: Node | null = this.host;
    while (!current && ancestor && ancestor !== this.document.body) {
      walker.currentNode = ancestor;
      current = walker.nextSibling();
      ancestor = ancestor.parentNode;
    }
    while (current) {
      const element = current as HTMLElement;
      if (overlayContainer?.contains(element)) {
        return null;
      }
      if (this.interactivity.isFocusable(element) && this.interactivity.isTabbable(element)) {
        return element;
      }
      current = walker.nextNode();
    }
    return null;
  }
}
