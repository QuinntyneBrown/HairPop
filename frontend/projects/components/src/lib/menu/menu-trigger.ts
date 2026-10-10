import { CdkMenuTrigger } from '@angular/cdk/menu';
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  OVERLAY_DEFAULT_CONFIG,
  OverlayRef,
} from '@angular/cdk/overlay';
import { DOCUMENT, Directive, ElementRef, inject } from '@angular/core';

/**
 * Below the trigger, start-aligned; then end-aligned; then the same above (menu.md
 * *Responsive*). No CDK offset: the `--space-1` gap is the panel's block margin, and an
 * offset would put a transform on the pane that breaks the sheet's `position: fixed` (D-8).
 */
const MENU_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
];

let nextTriggerId = 0;

/**
 * Turns a `button[hp-button]` into an APG menu button for the `ul[hp-menu]` held in
 * the given `ng-template` (menu.md). The CDK Menu trigger supplies `aria-haspopup`,
 * `aria-expanded`, `aria-controls`, the keyboard behaviour and the overlay.
 */
@Directive({
  selector: 'button[hpMenuTriggerFor]',
  // In the overlay container, not the browser top layer, so `--z-dropdown` orders it.
  providers: [{ provide: OVERLAY_DEFAULT_CONFIG, useValue: { usePopover: false } }],
  hostDirectives: [
    {
      directive: CdkMenuTrigger,
      inputs: ['cdkMenuTriggerFor: hpMenuTriggerFor'],
      outputs: ['cdkMenuOpened: menuOpened', 'cdkMenuClosed: menuClosed'],
    },
  ],
})
export class MenuTrigger {
  private readonly cdkTrigger = inject(CdkMenuTrigger, { self: true });
  private readonly document = inject(DOCUMENT);

  /** The trigger button. */
  readonly element: HTMLButtonElement =
    inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;

  constructor() {
    this.cdkTrigger.menuPosition = MENU_POSITIONS;
    // The scale-in grows from the corner nearest the trigger, also when flipped.
    this.cdkTrigger.transformOriginSelector = '.menu';
    // A native button already has the button role; the CDK adds it for other elements.
    if (this.element.getAttribute('role') === 'button') {
      this.element.removeAttribute('role');
    }
  }

  /** The trigger's id, generated when it has none, so the menu can be labelled by it. */
  ensureId(): string {
    if (!this.element.id) {
      this.element.id = `hp-menu-trigger-${++nextTriggerId}`;
    }
    return this.element.id;
  }

  /**
   * Called by the menu as it renders in the overlay: keeps a `--space-4` margin to the
   * viewport and stacks the overlay on the `--z-dropdown` layer (dialog D-8). A menu
   * opened from inside a dialog joins the dialog's `--z-modal` layer and, opening later,
   * stacks above it instead of behind the dialog.
   */
  configureOverlay(): void {
    const overlayRef = this.cdkTrigger['overlayRef'] as OverlayRef | null;
    if (!overlayRef) {
      return;
    }
    const strategy = overlayRef.getConfig().positionStrategy;
    if (strategy instanceof FlexibleConnectedPositionStrategy) {
      strategy.withViewportMargin(this.resolveLength('--space-4'));
    }
    const inDialog = !!this.element.closest('.cdk-overlay-pane');
    overlayRef.hostElement.style.zIndex = inDialog ? 'var(--z-modal)' : 'var(--z-dropdown)';
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
}
