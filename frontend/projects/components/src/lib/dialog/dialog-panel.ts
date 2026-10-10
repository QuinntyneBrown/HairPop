import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewEncapsulation,
  inject,
} from '@angular/core';

import { DIALOG_CONTEXT } from './dialog-context';

/**
 * Dialog styles, ported from the design system's `components.css` (*Dialog*). They are
 * global (`ViewEncapsulation.None`) because the backdrop and the pane live outside any
 * component view. `hp-dialog` loads the same string, so the inline documentation frame
 * (`.dialog--inline`) works without a container; Angular adds identical styles once.
 */
export const DIALOG_STYLES = `
  .cdk-overlay-backdrop.backdrop {
    position: fixed;
    inset: 0;
    background: var(--color-bg-backdrop);
    z-index: var(--z-overlay);
    opacity: 1;
    transition: none;
    animation: fade-in var(--duration-base) var(--ease-enter);
  }

  .cdk-overlay-pane.dialog,
  .dialog {
    position: fixed;
    inset: 0;
    z-index: var(--z-modal);
    display: grid;
    place-items: end center;
    box-sizing: border-box;
    max-width: none;
    max-height: none;
    padding: 0;
  }

  .dialog__panel {
    --dialog-width: 32rem;
    --dialog-bg: var(--color-bg-surface-raised);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    max-width: var(--dialog-width);
    max-height: calc(100dvh - var(--space-12));
    overflow: auto;
    padding-bottom: env(safe-area-inset-bottom);
    background: var(--dialog-bg);
    color: var(--color-fg-default);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    box-shadow: var(--shadow-4);
    animation: slide-up var(--duration-slow) var(--ease-enter);
  }

  .dialog__panel--sm {
    --dialog-width: 24rem;
  }

  .dialog__panel--lg {
    --dialog-width: 48rem;
  }

  .dialog__panel:focus:not(:focus-visible) {
    outline: none;
  }

  /* The consumer's dialog component and hp-dialog do not break the panel's flex column. */
  hp-dialog-panel > *,
  .dialog__panel hp-dialog {
    display: contents;
  }

  .dialog__header {
    display: flex;
    align-items: flex-start;
    gap: var(--space-4);
    padding: var(--space-6) var(--space-6) 0;
  }

  .dialog__header > div {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .dialog__title {
    flex: 1;
    margin: 0;
    font: var(--text-h3);
    letter-spacing: var(--letter-spacing-normal);
    overflow-wrap: anywhere;
  }

  .dialog__header p {
    margin: 0;
    font: var(--text-body);
    overflow-wrap: anywhere;
  }

  .dialog__header .btn--icon {
    margin: calc(-1 * var(--space-2)) calc(-1 * var(--space-2)) 0 0;
  }

  .dialog__icon {
    display: grid;
    place-items: center;
    flex: none;
    width: var(--control-height-md);
    height: var(--control-height-md);
    border-radius: var(--radius-full);
  }

  .dialog__icon--danger {
    background: var(--color-danger-bg);
    color: var(--color-danger-icon);
  }

  .dialog__icon--info {
    background: var(--color-info-bg);
    color: var(--color-info-icon);
  }

  .dialog__body {
    flex: 1;
    padding: var(--space-4) var(--space-6);
  }

  .dialog__body:empty {
    display: none;
  }

  .dialog__footer {
    position: sticky;
    bottom: 0;
    display: flex;
    flex-wrap: wrap-reverse;
    justify-content: flex-end;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-6) var(--space-6);
    border-top: var(--border-width-hairline) solid var(--color-border-default);
    background: var(--dialog-bg);
  }

  .dialog__footer .btn {
    flex: 1 1 auto;
  }

  @media (min-width: 40rem) {
    .cdk-overlay-pane.dialog,
    .dialog {
      place-items: center;
      padding: var(--space-6);
    }

    .dialog__panel {
      padding-bottom: 0;
      border-radius: var(--radius-lg);
      animation-name: scale-in;
    }

    .dialog__footer .btn {
      flex: none;
    }
  }

  /* Documentation frame: shows a dialog in flow instead of fixed over the page. */
  .dialog--inline {
    position: relative;
    inset: auto;
    z-index: auto;
    padding: var(--space-6);
    background: var(--color-bg-backdrop);
    border-radius: var(--radius-lg);
    place-items: center;
  }

  .dialog--inline .dialog__panel {
    animation: none;
    border-radius: var(--radius-lg);
  }

  /* D-9: the shadow vanishes in forced colours, so the panel keeps an edge. */
  @media (forced-colors: active) {
    .dialog__panel {
      border: var(--border-width-hairline) solid CanvasText;
    }
  }
`;

/**
 * The CDK dialog container, carrying `.dialog__panel` and the dialog's role and ARIA
 * references on one element (dialog.md D-2). `DialogService` passes it as the CDK
 * `container`; it is not used in templates.
 */
@Component({
  selector: 'hp-dialog-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CdkPortalOutlet],
  template: '<ng-template cdkPortalOutlet />',
  host: {
    class: 'dialog__panel',
    '[class.dialog__panel--sm]': "size === 'sm'",
    '[class.dialog__panel--lg]': "size === 'lg'",
  },
  styles: DIALOG_STYLES,
})
export class DialogPanel extends CdkDialogContainer implements OnDestroy {
  private readonly context = inject(DIALOG_CONTEXT, { optional: true });

  protected readonly size = this.context?.size ?? 'md';

  override ngOnDestroy(): void {
    // D-7: lift `inert` from the page first, or focus could not return to the trigger.
    this.context?.beforeDestroy?.();
    super.ngOnDestroy();
  }
}
