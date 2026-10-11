import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AUTH_API, SessionUser, SignInCredentials } from './auth';

/** Session-storage keys the apps write all start with this, so sign-out can remove them (L2-045). */
const STORAGE_PREFIX = 'hp-';

/**
 * Who is signed in (ADR 0003). The session itself is an HTTP-only cookie the API owns; this
 * signal store only mirrors the answer so guards, the shell and pages can read it.
 */
@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly api = inject(AUTH_API);
  private readonly current = signal<SessionUser | null>(null);
  private loading: Promise<void> | null = null;

  /** The signed-in person, or null. */
  readonly user = this.current.asReadonly();
  readonly signedIn = computed(() => this.current() !== null);

  /** Asks the API who is signed in, once; a 401 or a failure leaves nobody signed in. */
  load(): Promise<void> {
    this.loading ??= firstValueFrom(this.api.session()).then(
      ({ user }) => this.current.set(user),
      () => this.current.set(null),
    );
    return this.loading;
  }

  /** Signs in and remembers who. Rejects with the API's error, creating no session. */
  async signIn(credentials: SignInCredentials): Promise<SessionUser> {
    const { user } = await firstValueFrom(this.api.signIn(credentials));
    this.current.set(user);
    return user;
  }

  /** Ends the session and forgets everything this app stored for it. */
  async signOut(): Promise<void> {
    await firstValueFrom(this.api.signOut());
    this.clear();
  }

  /** Forgets the session here: it ended, by sign-out or because the API said 401. */
  clear(): void {
    this.current.set(null);
    this.loading = Promise.resolve();
    this.clearStorage();
  }

  private clearStorage(): void {
    try {
      const storage = globalThis.sessionStorage;
      for (const key of Object.keys(storage)) {
        if (key.startsWith(STORAGE_PREFIX)) storage.removeItem(key);
      }
    } catch {
      // No storage on the server, or blocked: nothing was written.
    }
  }
}
