import { RESPONSE_INIT, effect, inject } from '@angular/core';

/**
 * Sets the server response status from a page whose data decides it (an unknown style is a
 * 404). In the browser the token is absent and nothing happens (ADR 0002).
 */
export function responseStatus(status: () => number | null): void {
  const init = inject(RESPONSE_INIT, { optional: true });
  if (!init) return;
  effect(() => {
    const value = status();
    if (value !== null) init.status = value;
  });
}
