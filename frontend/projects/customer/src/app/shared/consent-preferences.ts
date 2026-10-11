import { Injectable, inject } from '@angular/core';
import { DialogService, ToastService } from '@hairpop/components';

import { CookiePreferencesDialog } from './cookie-preferences.dialog';

/**
 * Opens Cookie preferences from the banner, the footer and the saved toast, and confirms a
 * saved choice the same way wherever it was made (docs/detailed-designs/privacy/manage-cookie-choice).
 */
@Injectable({ providedIn: 'root' })
export class ConsentPreferences {
  private readonly dialog = inject(DialogService);
  private readonly toasts = inject(ToastService);

  /** Opens the dialog; a choice saved in it is confirmed with the Change toast. */
  open(): void {
    this.dialog
      .open<CookiePreferencesDialog, void, boolean>(CookiePreferencesDialog, { size: 'lg' })
      .closed.subscribe((optionalUsage) => {
        if (optionalUsage !== undefined) this.confirmSaved(optionalUsage);
      });
  }

  /** Tells the visitor the choice was saved, with a way back to change it. */
  confirmSaved(optionalUsage: boolean): void {
    this.toasts
      .show({
        tone: 'success',
        heading: 'Preferences saved',
        text: `${optionalUsage ? 'Optional usage data allowed' : 'Essential only'}. You can change this in Cookie preferences.`,
        actionLabel: 'Change',
        key: 'cookie-consent',
      })
      .actioned.subscribe(() => this.open());
  }
}
