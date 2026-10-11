import { DOCUMENT } from '@angular/common';
import { Injectable, afterNextRender, inject, signal } from '@angular/core';
import { CONSENT_API } from '@hairpop/api';
import { firstValueFrom } from 'rxjs';

/** The saved answer: optional usage data allowed, or essential storage only. */
export type ConsentChoice = 'allow' | 'essential';

/** The essential cookie that remembers the answer, so the banner stays away on return. */
const COOKIE = 'hp-consent';
const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

/**
 * The visitor's optional-storage choice (docs/detailed-designs/privacy/manage-cookie-choice).
 * Nothing optional is stored before a choice, and the choice is written to the essential
 * `hp-consent` cookie only after the API confirms it, so a failed save is never reported as
 * saved (L2-034 AC1–AC3). The cookie is read after the first browser render, so the server and
 * the first client render agree.
 */
@Injectable({ providedIn: 'root' })
export class ConsentStore {
  private readonly api = inject(CONSENT_API);
  private readonly document = inject(DOCUMENT);
  private readonly saved = signal<ConsentChoice | null>(null);
  private readonly read = signal(false);

  /** The saved choice; null until the visitor chooses. */
  readonly choice = this.saved.asReadonly();
  /** True once the browser has been asked, so a banner never flashes before the cookie is read. */
  readonly ready = this.read.asReadonly();

  constructor() {
    afterNextRender(() => {
      this.saved.set(this.cookie());
      this.read.set(true);
    });
  }

  /** Saves the choice, then remembers it. Rejects, saving nothing, when the API does not confirm. */
  async save(optionalUsage: boolean): Promise<void> {
    await firstValueFrom(this.api.save(optionalUsage));
    const choice: ConsentChoice = optionalUsage ? 'allow' : 'essential';
    const secure = this.document.location.protocol === 'https:' ? '; Secure' : '';
    this.document.cookie = `${COOKIE}=${choice}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax${secure}`;
    this.saved.set(choice);
  }

  private cookie(): ConsentChoice | null {
    const match = this.document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
    return match?.[1] === 'allow' || match?.[1] === 'essential' ? match[1] : null;
  }
}
