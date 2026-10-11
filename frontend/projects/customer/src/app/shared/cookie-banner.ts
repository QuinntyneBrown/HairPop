import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Alert, Button, Link, ToastService } from '@hairpop/components';

import { ConsentPreferences } from './consent-preferences';
import { ConsentStore } from './consent.store';

/**
 * The banner above the top bar until the visitor chooses (notifications/cookie-consent,
 * L2-034). Both answers are equally easy, and neither is pre-selected.
 */
@Component({
  selector: 'hp-cookie-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Link],
  template: `
    @if (consent.ready() && consent.choice() === null) {
      <hp-alert
        tone="info"
        banner
        role="region"
        aria-label="Privacy choices"
        heading="Your privacy choices"
      >
        <p>Choose whether optional usage data may be stored.</p>
        <button
          hp-button
          slot="actions"
          size="sm"
          variant="primary"
          type="button"
          [busy]="saving()"
          (click)="choose(true)"
        >
          Allow optional data
        </button>
        <button
          hp-button
          slot="actions"
          size="sm"
          type="button"
          [busy]="saving()"
          (click)="choose(false)"
        >
          Essential only
        </button>
        <a
          hp-link
          slot="actions"
          href="/privacy"
          aria-haspopup="dialog"
          (click)="openPreferences($event)"
          >Cookie preferences</a
        >
      </hp-alert>
    }
  `,
})
export class CookieBanner {
  protected readonly consent = inject(ConsentStore);
  private readonly toasts = inject(ToastService);
  private readonly preferences = inject(ConsentPreferences);

  protected readonly saving = signal(false);

  protected openPreferences(event: Event): void {
    event.preventDefault();
    this.preferences.open();
  }

  protected async choose(optionalUsage: boolean): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    try {
      await this.consent.save(optionalUsage);
      this.preferences.confirmSaved(optionalUsage);
    } catch {
      this.toasts
        .show({
          tone: 'danger',
          heading: 'Preferences not saved',
          text: 'Your choice wasn’t stored. Please try again.',
          actionLabel: 'Retry',
          key: 'cookie-consent',
        })
        .actioned.subscribe(() => void this.choose(optionalUsage));
    } finally {
      this.saving.set(false);
    }
  }
}
