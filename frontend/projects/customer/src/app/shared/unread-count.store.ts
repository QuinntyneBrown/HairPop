import { Injectable, inject, signal } from '@angular/core';
import { NOTIFICATIONS_API } from '@hairpop/api';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UnreadCountStore {
  private readonly api = inject(NOTIFICATIONS_API);
  private readonly value = signal(0);
  readonly count = this.value.asReadonly();

  async refresh(): Promise<void> {
    try {
      const { count } = await firstValueFrom(this.api.unreadCount());
      this.value.set(count);
    } catch {
      // Keep the last known count until another successful refresh.
    }
  }

  set(count: number): void {
    this.value.set(count);
  }
}
