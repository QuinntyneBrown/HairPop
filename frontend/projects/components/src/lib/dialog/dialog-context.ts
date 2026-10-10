import { InjectionToken } from '@angular/core';

/** The three dialog variants (dialog.md *Variants and sizes*). */
export type DialogVariant = 'form' | 'confirmation' | 'destructive';

/** Panel widths: sm 24rem, md 32rem (no modifier), lg 48rem. */
export type DialogSize = 'sm' | 'md' | 'lg';

/**
 * What `DialogService` decided for one open dialog. Provided to the container
 * (`hp-dialog-panel`) and to the consumer's dialog component, so the role, the size
 * class and the ARIA references can never disagree with what `hp-dialog` renders.
 */
export interface DialogContext {
  readonly variant: DialogVariant;
  readonly size: DialogSize;
  /** Id stamped on `h2.dialog__title`; the container's `aria-labelledby`. */
  readonly titleId: string;
  /** Id stamped on the description; the container's `aria-describedby`. */
  readonly descriptionId: string;
  /** Runs before the container restores focus, so the page is no longer inert (D-7). */
  readonly beforeDestroy?: () => void;
}

/** Injection token carrying the open dialog's {@link DialogContext}. */
export const DIALOG_CONTEXT = new InjectionToken<DialogContext>('HpDialogContext');
