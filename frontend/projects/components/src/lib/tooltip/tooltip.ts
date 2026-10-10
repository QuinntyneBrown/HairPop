import { FocusMonitor, FocusOrigin, InputModalityDetector } from '@angular/cdk/a11y';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  afterNextRender,
  inject,
  input,
  isDevMode,
  signal,
  viewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

let nextTooltipId = 0;

/** D-4: the design system's hover delay; a behavioural delay, not a transition. */
const HOVER_DELAY_MS = 300;

/**
 * D-7: the hide grace never drops below this, so the bubble stays hoverable
 * (WCAG 1.4.13) when reduced motion zeroes `--duration-fast`.
 */
const MIN_HIDE_GRACE_MS = 100;

/** Elements that can be the tooltip's trigger, disabled controls included. */
const TRIGGER_SELECTOR =
  'button, a[href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';

/**
 * Names an icon-only control, or adds a short hint, on hover and keyboard focus
 * (APG Tooltip). The bubble renders in a CDK overlay so it is never clipped (D-1).
 */
@Component({
  selector: 'hp-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'has-tooltip',
    '(pointerenter)': 'onPointerEnter($event)',
    '(pointerleave)': 'scheduleHide()',
    '(click)': 'hide()',
  },
  // Kept compact: whitespace after the text would become part of the bubble's text.
  // prettier-ignore
  template: `<ng-content /><ng-template #bubble><span class="tooltip" role="tooltip" [id]="id" [class.tooltip--below]="below()" [style.--tooltip-arrow-x]="arrowX()" (pointerenter)="cancelHide()" (pointerleave)="scheduleHide()">{{ text() }}@if (shortcut()) {<kbd>{{ shortcut() }}</kbd>}</span></ng-template>`,
  styles: `
    .has-tooltip {
      position: relative;
      display: inline-flex;
    }
    .tooltip {
      position: relative;
      z-index: var(--z-tooltip);
      padding: var(--space-1) var(--space-2);
      background: var(--color-bg-inverse);
      color: var(--color-fg-inverse);
      border-radius: var(--radius-sm);
      font: var(--text-caption);
      white-space: nowrap;
      pointer-events: auto;
      box-shadow: var(--shadow-2);
      animation: hp-tooltip-fade-in var(--duration-fast) var(--ease-standard);
    }
    .tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: var(--tooltip-arrow-x, 50%);
      translate: -50% 0;
      border: var(--space-1) solid transparent;
      border-top-color: var(--color-bg-inverse);
    }
    .tooltip--below::after {
      top: auto;
      bottom: 100%;
      border-top-color: transparent;
      border-bottom-color: var(--color-bg-inverse);
    }
    .tooltip kbd {
      margin-left: var(--space-1);
      padding: 0.05em 0.4em;
      font: var(--text-code);
      background: transparent;
      color: inherit;
      border: var(--border-width-hairline) solid currentColor;
      border-bottom-width: var(--border-width-thick);
      border-radius: var(--radius-sm);
    }
    @keyframes hp-tooltip-fade-in {
      from {
        opacity: 0;
      }
    }
    @media (forced-colors: active) {
      .tooltip {
        border: var(--border-width-hairline) solid CanvasText;
      }
    }
  `,
})
export class Tooltip {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly focusMonitor = inject(FocusMonitor);
  private readonly modality = inject(InputModalityDetector);
  private readonly document = inject(DOCUMENT);

  /** The bubble text; for an icon-only control it equals its `aria-label`. */
  readonly text = input.required<string>();
  /** Rendered as `<kbd>` after the text when set. */
  readonly shortcut = input('');
  /** Preferred side; the CDK flips and shifts when it would leave the viewport (D-2). */
  readonly position = input<'above' | 'below'>('above');

  readonly id = `hp-tooltip-${++nextTooltipId}`;

  protected readonly below = signal(false);
  protected readonly arrowX = signal<string | null>(null);

  private readonly bubble = viewChild.required<TemplateRef<unknown>>('bubble');

  private trigger: HTMLElement | null = null;
  private overlayRef: OverlayRef | null = null;
  private portal: TemplatePortal | null = null;
  private overlaySubscriptions = new Subscription();
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    afterNextRender(() => {
      this.trigger = this.host.nativeElement.querySelector<HTMLElement>(TRIGGER_SELECTOR);
      if (!this.trigger) {
        return;
      }
      this.checkTriggerName(this.trigger);
      this.focusMonitor.monitor(this.trigger).subscribe((origin) => this.onFocusChange(origin));
    });

    inject(DestroyRef).onDestroy(() => {
      this.clearTimers();
      if (this.trigger) {
        this.focusMonitor.stopMonitoring(this.trigger);
        this.removeDescription(this.trigger);
      }
      this.overlaySubscriptions.unsubscribe();
      this.overlayRef?.dispose();
    });
  }

  /** Shows the bubble now. */
  show(): void {
    this.clearTimers();
    const trigger = this.trigger;
    if (!trigger || this.isDisabled(trigger) || this.overlayRef?.hasAttached()) {
      return;
    }
    const overlayRef = this.overlayRef ?? this.createOverlay(trigger);
    this.portal ??= new TemplatePortal(this.bubble(), this.viewContainerRef);
    overlayRef.attach(this.portal);
    overlayRef.updatePosition();
    this.updateArrow();
    this.addDescription(trigger);
  }

  /** Hides the bubble now. */
  hide(): void {
    this.clearTimers();
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    if (this.trigger) {
      this.removeDescription(this.trigger);
    }
  }

  protected onPointerEnter(event: PointerEvent): void {
    this.cancelHide();
    if (
      event.pointerType === 'touch' ||
      !this.canHover() ||
      this.overlayRef?.hasAttached() ||
      this.showTimer !== null
    ) {
      return;
    }
    this.showTimer = setTimeout(() => {
      this.showTimer = null;
      this.show();
    }, HOVER_DELAY_MS);
  }

  /** D-7: hide after the pointer has left trigger and bubble for `--duration-fast`. */
  protected scheduleHide(): void {
    if (this.showTimer !== null) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    if (!this.overlayRef?.hasAttached() || this.hideTimer !== null) {
      return;
    }
    if (this.trigger && this.document.activeElement === this.trigger && this.shownByKeyboard) {
      return;
    }
    this.hideTimer = setTimeout(() => {
      this.hideTimer = null;
      this.hide();
    }, this.hideGrace());
  }

  protected cancelHide(): void {
    if (this.hideTimer !== null) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  private shownByKeyboard = false;

  private onFocusChange(origin: FocusOrigin): void {
    if (origin === null) {
      this.shownByKeyboard = false;
      this.hide();
      return;
    }
    // D-9: keyboard focus, or programmatic focus that follows keyboard use.
    const fromKeyboard =
      origin === 'keyboard' ||
      (origin === 'program' && this.modality.mostRecentModality === 'keyboard');
    if (fromKeyboard) {
      this.shownByKeyboard = true;
      this.show();
    }
  }

  private createOverlay(trigger: HTMLElement): OverlayRef {
    const gap = this.resolveLength('--space-2');
    const above: ConnectedPosition = {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: -gap,
    };
    const below: ConnectedPosition = {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: gap,
    };
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(trigger)
      .withPositions(this.position() === 'below' ? [below, above] : [above, below])
      .withViewportMargin(gap)
      .withPush(true)
      .withFlexibleDimensions(false);
    const overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      // In the overlay container, not the top layer, so `--z-tooltip` orders it above
      // dialogs and toasts (Design: Layer).
      usePopover: false,
    });
    overlayRef.hostElement.style.zIndex = 'var(--z-tooltip)';
    this.overlaySubscriptions.add(
      positionStrategy.positionChanges.subscribe((change) => {
        this.below.set(change.connectionPair.overlayY === 'top');
        this.updateArrow();
      }),
    );
    this.overlaySubscriptions.add(
      overlayRef.keydownEvents().subscribe((event) => {
        if (event.key === 'Escape' && !event.altKey && !event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          event.stopPropagation();
          this.hide();
        }
      }),
    );
    this.overlayRef = overlayRef;
    return overlayRef;
  }

  /** D-2: keep the arrow pointing at the trigger's centre when the bubble is pushed. */
  private updateArrow(): void {
    const trigger = this.trigger;
    const bubble = this.overlayRef?.overlayElement.querySelector<HTMLElement>('.tooltip');
    if (!trigger || !bubble) {
      return;
    }
    const triggerBox = trigger.getBoundingClientRect();
    const bubbleBox = bubble.getBoundingClientRect();
    const centre = triggerBox.left + triggerBox.width / 2 - bubbleBox.left;
    const inset = this.resolveLength('--space-2');
    const clamped = Math.min(Math.max(centre, inset), bubbleBox.width - inset);
    const pushed = Math.abs(clamped - bubbleBox.width / 2) > 0.5;
    this.arrowX.set(pushed ? `${clamped}px` : null);
  }

  private addDescription(trigger: HTMLElement): void {
    const ids = (trigger.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
    if (!ids.includes(this.id)) {
      trigger.setAttribute('aria-describedby', [...ids, this.id].join(' '));
    }
  }

  private removeDescription(trigger: HTMLElement): void {
    const current = trigger.getAttribute('aria-describedby');
    if (current === null) {
      return;
    }
    const ids = current.split(/\s+/).filter((id) => id && id !== this.id);
    if (ids.length) {
      trigger.setAttribute('aria-describedby', ids.join(' '));
    } else {
      trigger.removeAttribute('aria-describedby');
    }
  }

  private isDisabled(trigger: HTMLElement): boolean {
    return trigger.matches(':disabled') || trigger.getAttribute('aria-disabled') === 'true';
  }

  private canHover(): boolean {
    const view = this.document.defaultView;
    return !!view && view.matchMedia('(hover: hover)').matches;
  }

  /** The hover grace: `--duration-fast`, read from the theme. */
  private hideGrace(): number {
    const view = this.document.defaultView;
    const raw = view
      ? view.getComputedStyle(this.document.documentElement).getPropertyValue('--duration-fast')
      : '';
    const value = parseFloat(raw);
    if (Number.isNaN(value)) {
      return MIN_HIDE_GRACE_MS;
    }
    return Math.max(raw.trim().endsWith('ms') ? value : value * 1000, MIN_HIDE_GRACE_MS);
  }

  /** Resolves a length token (rem or px) to CSS pixels. */
  private resolveLength(token: string): number {
    const view = this.document.defaultView;
    if (!view) {
      return 0;
    }
    const root = view.getComputedStyle(this.document.documentElement);
    const raw = root.getPropertyValue(token).trim();
    const value = parseFloat(raw);
    if (Number.isNaN(value)) {
      return 0;
    }
    return raw.endsWith('rem') ? value * parseFloat(root.fontSize) : value;
  }

  /** D-6: the tooltip must never become the trigger's only name. */
  private checkTriggerName(trigger: HTMLElement): void {
    if (!isDevMode()) {
      return;
    }
    const named =
      !!trigger.getAttribute('aria-label')?.trim() ||
      !!trigger.getAttribute('aria-labelledby')?.trim() ||
      !!trigger.getAttribute('title')?.trim() ||
      !!trigger.textContent?.trim();
    if (!named) {
      console.error(
        `hp-tooltip: the trigger <${trigger.tagName.toLowerCase()}> of the tooltip "${this.text()}" has no accessible name. Add aria-label or aria-labelledby to the control; the tooltip only describes it.`,
        trigger,
      );
    }
  }

  private clearTimers(): void {
    if (this.showTimer !== null) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    this.cancelHide();
  }
}
