import { LocationStrategy } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  isDevMode,
  output,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Link } from '../link/link';

/** Router commands for a footer destination: a URL string or a commands array. */
export type FooterCommands = string | readonly unknown[];

/** One footer link. `opensDialog` marks the one link that requests a dialog (Cookie preferences). */
export interface FooterLink {
  readonly id: string;
  readonly label: string;
  readonly link: FooterCommands;
  readonly opensDialog?: boolean;
}

/** The content rule: never more than six links (D-8). */
const MAX_LINKS = 6;

/**
 * The site footer closing every screen (footer.md): brand line plus secondary links. The host is
 * the native `<footer>`, the page's contentinfo landmark (D-1). Each link is the Link component
 * with the inherit variant; a link with `opensDialog` emits `dialogRequested` instead of navigating
 * (D-3) and keeps a real `href` as its fallback destination.
 */
@Component({
  selector: 'footer[hp-footer]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Link, RouterLink],
  host: { class: 'site-footer' },
  template: `<p>{{ brandLine() }}</p>
    <ul class="site-footer__links">
      @for (item of items(); track item.id) {
        <li>
          @if (item.opensDialog) {
            <a
              hp-link
              variant="inherit"
              [attr.href]="item.href"
              aria-haspopup="dialog"
              (click)="activate($event, item.id)"
              >{{ item.label }}</a
            >
          } @else {
            <a hp-link variant="inherit" [routerLink]="item.link">{{ item.label }}</a>
          }
        </li>
      }
    </ul>`,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      justify-content: space-between;
      padding: var(--space-6) var(--layout-margin);
      border-top: var(--border-width-hairline) solid var(--color-border-default);
      color: var(--color-fg-muted);
      font: var(--text-body-sm);
    }

    p {
      max-width: var(--layout-measure);
    }

    .site-footer__links {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1) var(--space-4);
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .site-footer__links a {
      --link-inherit-hover-fg: var(--color-fg-default);
      display: inline-flex;
      align-items: center;
      min-height: var(--target-min);
    }

    @media (forced-colors: active) {
      .site-footer__links a {
        color: LinkText;
      }

      .site-footer__links a:focus-visible {
        outline-color: Highlight;
      }
    }
  `,
})
export class Footer {
  /** The brand sentence: "HairPop · Made for confident hair decisions". */
  readonly brandLine = input.required<string>();
  /** One to six links in display order. */
  readonly links = input.required<readonly FooterLink[]>();
  /** Emits the `id` of an `opensDialog` link when it is activated without modifiers. */
  readonly dialogRequested = output<string>();

  private readonly router = inject(Router);
  private readonly locationStrategy = inject(LocationStrategy);

  /** Links with the fallback `href` resolved for dialog items, which do not use RouterLink. */
  protected readonly items = computed(() =>
    this.links().map((item) => ({
      ...item,
      href: item.opensDialog ? this.hrefFor(item.link) : null,
    })),
  );

  constructor() {
    if (isDevMode()) {
      effect(() => {
        const count = this.links().length;
        if (count > MAX_LINKS) {
          console.error(
            `hp-footer: ${count} links passed; the footer holds at most ${MAX_LINKS}. Every link still renders.`,
          );
        }
      });
    }
  }

  protected activate(event: MouseEvent, id: string): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    this.dialogRequested.emit(id);
  }

  private hrefFor(link: FooterCommands): string {
    const commands = typeof link === 'string' ? [link] : [...link];
    const tree = this.router.createUrlTree(commands);
    return this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(tree));
  }
}
