import { Dialog as CdkDialog, DialogRef } from '@angular/cdk/dialog';
import { OVERLAY_DEFAULT_CONFIG, OverlayContainer } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { DOCUMENT, Injectable, Injector, inject } from '@angular/core';
import { take } from 'rxjs/operators';

import { DialogPanel } from './dialog-panel';
import { DIALOG_CONTEXT, DialogContext, DialogSize, DialogVariant } from './dialog-context';

/** Options for {@link DialogService.open}. */
export interface DialogOpenOptions<D = unknown> {
  /** Role, icon chip, close control and backdrop behaviour. Default `'form'`. */
  variant?: DialogVariant;
  /** Panel width cap. Default `'sm'` for destructive dialogs, otherwise `'md'`. */
  size?: DialogSize;
  /** Passed to the dialog component through the CDK `DIALOG_DATA` token. */
  data?: D;
  /**
   * Where focus goes on close. Defaults to the element focused when `open()` ran.
   * Pass a selector when the trigger will not exist after success (D-12).
   */
  returnFocusTo?: HTMLElement | string;
}

/**
 * D-5: the first enabled field in the body, otherwise the first footer button
 * (the safe action, because the footer is ordered safe-then-confirm).
 */
const INITIAL_FOCUS =
  '.dialog__body :is(input:not([type=hidden]):not(:disabled), select:not(:disabled), textarea:not(:disabled)), .dialog__footer button';

let nextDialogId = 0;

/**
 * Opens HairPop dialogs on the Angular CDK Dialog (dialog.md). The CDK owns the overlay,
 * focus trap, scroll blocking and focus restoration; this service fixes the configuration,
 * keeps one dialog open at a time (D-11), stacks the layers (D-8) and makes the page
 * behind `inert` (D-7).
 */
@Injectable({ providedIn: 'root' })
export class DialogService {
  /**
   * A CDK Dialog whose overlays stay in the overlay container instead of the browser top
   * layer, so the `z-index` layers of D-8 order dialogs, menus, toasts and tooltips.
   */
  private readonly cdkDialog = Injector.create({
    providers: [
      { provide: OVERLAY_DEFAULT_CONFIG, useValue: { usePopover: false } },
      { provide: CdkDialog, useClass: CdkDialog },
    ],
    parent: inject(Injector),
  }).get(CdkDialog);
  private readonly overlayContainer = inject(OverlayContainer);
  private readonly document = inject(DOCUMENT);

  /** Elements made inert for the open dialog, with whether each was inert before. */
  private readonly inertElements = new Map<Element, boolean>();

  /** Opens `component` as a dialog. `closed` emits the result, or `undefined` when dismissed. */
  open<C, D = unknown, R = unknown>(
    component: ComponentType<C>,
    options: DialogOpenOptions<D> = {},
  ): DialogRef<R, C> {
    // D-11: one dialog at a time; the first one restores focus to its trigger as it closes.
    for (const open of [...this.cdkDialog.openDialogs].reverse()) {
      open.close();
    }

    const variant = options.variant ?? 'form';
    const size = options.size ?? (variant === 'destructive' ? 'sm' : 'md');
    const id = `hp-dialog-${++nextDialogId}`;
    const returnFocusTo = options.returnFocusTo ?? this.focusedTrigger() ?? true;

    const context: DialogContext = {
      variant,
      size,
      titleId: `${id}-title`,
      descriptionId: `${id}-desc`,
      beforeDestroy: () => this.releasePage(),
    };

    const ref = this.cdkDialog.open<R, D, C>(component, {
      id,
      data: options.data,
      role: variant === 'destructive' ? 'alertdialog' : 'dialog',
      ariaModal: true,
      ariaLabelledBy: context.titleId,
      ariaDescribedBy: context.descriptionId,
      hasBackdrop: true,
      backdropClass: 'backdrop',
      panelClass: 'dialog',
      width: '100vw',
      height: '100dvh',
      // Esc and the backdrop are handled by hp-dialog so the busy guard applies (D-4).
      disableClose: true,
      autoFocus: INITIAL_FOCUS,
      restoreFocus: returnFocusTo,
      closeOnNavigation: true,
      container: {
        type: DialogPanel,
        providers: () => [{ provide: DIALOG_CONTEXT, useValue: context }],
      },
      providers: [{ provide: DIALOG_CONTEXT, useValue: context }],
    });

    // D-8: the layers follow the design system whichever overlay opened last.
    ref.overlayRef.hostElement.style.zIndex = 'var(--z-modal)';
    if (ref.overlayRef.backdropElement) {
      ref.overlayRef.backdropElement.style.zIndex = 'var(--z-overlay)';
    }

    // D-7: the CDK hides the page from assistive technology once focus is trapped;
    // the same elements become inert right after.
    ref.containerInstance._focusTrapped?.pipe(take(1)).subscribe(() => this.makePageInert());
    ref.closed.subscribe(() => this.releasePage());

    return ref;
  }

  /**
   * The control that opened the dialog. A menu item closes with its menu, so a dialog
   * opened from a menu returns focus to the menu's trigger (menu.md *Focus*).
   */
  private focusedTrigger(): HTMLElement | null {
    const active = this.document.activeElement;
    if (!(active instanceof HTMLElement) || active === this.document.body) {
      return null;
    }
    const menu = active.closest('[role="menu"]');
    if (menu?.id) {
      const trigger = this.document.querySelector<HTMLElement>(
        `[aria-controls="${CSS.escape(menu.id)}"]`,
      );
      if (trigger) {
        return trigger;
      }
    }
    return active;
  }

  /** Makes every sibling of the overlay container that the CDK hid `inert`. */
  private makePageInert(): void {
    const container = this.overlayContainer.getContainerElement();
    const parent = container.parentElement;
    if (!parent || !this.cdkDialog.openDialogs.length) {
      return;
    }
    for (const sibling of Array.from(parent.children)) {
      if (
        sibling === container ||
        sibling.nodeName === 'SCRIPT' ||
        sibling.nodeName === 'STYLE' ||
        sibling.hasAttribute('aria-live') ||
        sibling.hasAttribute('popover') ||
        sibling.getAttribute('aria-hidden') !== 'true' ||
        this.inertElements.has(sibling)
      ) {
        continue;
      }
      this.inertElements.set(sibling, sibling.hasAttribute('inert'));
      sibling.setAttribute('inert', '');
    }
  }

  /** Restores each element's previous `inert` state. */
  private releasePage(): void {
    this.inertElements.forEach((wasInert, element) => {
      if (!wasInert) {
        element.removeAttribute('inert');
      }
    });
    this.inertElements.clear();
  }
}
