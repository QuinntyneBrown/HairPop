import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostAttributeToken,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
} from '@angular/core';

import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

/** Alert tones. Info is the base `.alert` look. */
export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const TONE_ICONS: Record<AlertTone, IconName> = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  danger: 'alert-circle',
};

/** Elements that can take keyboard focus, for moving focus off a dismissed alert (D-5). */
const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * A condition that affects a page or one region of it, shown while it is true (alert.md).
 * The host is the `.alert` element itself (D-2): the consumer's `class`, `tabindex`, `role`
 * and `aria-labelledby` stay on it untouched.
 */
@Component({
  selector: 'hp-alert',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'alert',
    '[class.alert--success]': "tone() === 'success'",
    '[class.alert--warning]': "tone() === 'warning'",
    '[class.alert--danger]': "tone() === 'danger'",
    '[class.banner]': 'banner()',
    '[attr.role]': 'liveRole()',
  },
  template: `<ng-content select="[slot=icon]"><svg hp-icon [name]="toneIcon()"></svg></ng-content>
    <div class="alert__body">
      @if (heading()) {
        <p class="alert__title">{{ heading() }}</p>
      }
      <ng-content />
      <div class="alert__actions"><ng-content select="[slot=actions]" /></div>
    </div>
    @if (dismissLabel()) {
      <button class="close" type="button" [attr.aria-label]="dismissLabel()" (click)="dismiss()">
        <svg hp-icon name="close" size="sm"></svg>
      </button>
    }`,
  styles: `
    :host {
      --alert-bg: var(--color-info-bg);
      --alert-fg: var(--color-info-fg);
      --alert-border: var(--color-info-border);
      --alert-icon: var(--color-info-icon);
      /* Projected inherit links are semibold in the tone colour (D-6). */
      --link-inherit-font-weight: var(--font-weight-semibold);
      display: flex;
      gap: var(--space-3);
      padding: var(--space-4);
      border: var(--border-width-hairline) solid var(--alert-border);
      border-left-width: var(--border-width-accent);
      border-radius: var(--radius-md);
      background: var(--alert-bg);
      color: var(--alert-fg);
    }

    :host(.alert--success) {
      --alert-bg: var(--color-success-bg);
      --alert-fg: var(--color-success-fg);
      --alert-border: var(--color-success-border);
      --alert-icon: var(--color-success-icon);
    }

    :host(.alert--warning) {
      --alert-bg: var(--color-warning-bg);
      --alert-fg: var(--color-warning-fg);
      --alert-border: var(--color-warning-border);
      --alert-icon: var(--color-warning-icon);
    }

    :host(.alert--danger) {
      --alert-bg: var(--color-danger-bg);
      --alert-fg: var(--color-danger-fg);
      --alert-border: var(--color-danger-border);
      --alert-icon: var(--color-danger-icon);
    }

    :host ::ng-deep > .icon {
      flex: none;
      color: var(--alert-icon);
      margin-top: var(--space-0-5);
    }

    .alert__body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      min-width: 0;
      overflow-wrap: break-word;
    }

    :host ::ng-deep p {
      max-width: none;
    }

    :host ::ng-deep a {
      color: inherit;
      font-weight: var(--font-weight-semibold);
    }

    .alert__title {
      font: var(--text-label);
      font-size: var(--font-size-md);
    }

    .alert__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      margin-top: var(--space-1);
    }

    .alert__actions:empty {
      display: none;
    }

    .alert__actions ::ng-deep > a,
    .alert__actions ::ng-deep > button {
      color: inherit;
      font: var(--text-label);
    }

    .close {
      flex: none;
      background: none;
      border: 0;
      color: inherit;
      cursor: pointer;
      width: var(--target-min);
      height: var(--target-min);
      padding: 0;
      display: grid;
      place-items: center;
      border-radius: var(--radius-sm);
      margin: calc(-1 * var(--space-1)) calc(-1 * var(--space-1)) 0 0;
    }

    .close:hover {
      background: color-mix(in srgb, currentColor 8%, transparent);
    }

    :host(.banner) {
      border-radius: 0;
      border-width: 0 0 var(--border-width-hairline);
      justify-content: center;
      padding-inline: var(--layout-margin);
    }

    :host(.banner) .alert__body {
      flex: 0 1 auto;
      flex-direction: row;
      align-items: center;
      gap: var(--space-2) var(--space-4);
      flex-wrap: wrap;
    }

    :host(.banner) .alert__body ::ng-deep > * {
      min-width: 0;
    }

    :host(.form-summary) {
      border-left-width: var(--border-width-accent);
    }

    :host(.form-summary:focus-visible) {
      outline-offset: var(--focus-ring-offset);
    }

    :host(.form-summary) ::ng-deep ul {
      margin-top: var(--space-1);
      padding-left: var(--space-5);
    }

    :host(.form-summary) ::ng-deep a {
      overflow-wrap: anywhere;
    }

    @media (forced-colors: active) {
      :host {
        border-color: CanvasText;
      }

      :host ::ng-deep a {
        color: LinkText;
      }
    }
  `,
})
export class Alert {
  /** Tone: adds `.alert--success`, `--warning` or `--danger` and picks the default icon. */
  readonly tone = input<AlertTone>('info');
  /** Rendered as `p.alert__title` first in the body when not empty. */
  readonly heading = input<string>('');
  /** Full-width page banner (`.banner`). */
  readonly banner = input(false, { transform: booleanAttribute });
  /** For an alert inserted after load: `role="alert"` for danger, `role="status"` otherwise (D-4). */
  readonly announce = input(false, { transform: booleanAttribute });
  /** When not empty, renders the dismiss control with this accessible name. */
  readonly dismissLabel = input<string>('');

  /** The dismiss control was activated; focus has already moved off the alert (D-5). */
  readonly dismissed = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  /** A consumer `role` (the error summary's `group`) always wins (D-7). */
  private readonly consumerRole = inject(new HostAttributeToken('role'), { optional: true });

  protected readonly toneIcon = computed(() => TONE_ICONS[this.tone()] ?? TONE_ICONS.info);

  protected readonly liveRole = computed(() => {
    if (this.consumerRole !== null) return this.consumerRole;
    if (!this.announce()) return null;
    return this.tone() === 'danger' ? 'alert' : 'status';
  });

  protected dismiss(): void {
    this.moveFocusAway();
    this.dismissed.emit();
  }

  /** Focuses the next focusable element after the alert, else the previous one (D-5). */
  private moveFocusAway(): void {
    const doc = this.host.ownerDocument;
    const candidates = Array.from(doc.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => !this.host.contains(el) && isFocusable(el),
    );
    const next = candidates.find(
      (el) => !!(this.host.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING),
    );
    const previous = candidates
      .filter((el) => !!(this.host.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING))
      .pop();
    (next ?? previous)?.focus();
  }
}

function isFocusable(el: HTMLElement): boolean {
  if (el.closest('[inert]')) return false;
  if (typeof el.checkVisibility === 'function') {
    return el.checkVisibility({ visibilityProperty: true });
  }
  return el.getClientRects().length > 0;
}
