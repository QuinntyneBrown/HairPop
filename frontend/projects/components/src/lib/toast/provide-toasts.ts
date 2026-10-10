import {
  EnvironmentProviders,
  InjectionToken,
  PLATFORM_ID,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ToastService } from './toast.service';

/** Application-wide toast configuration. */
export interface ToastConfig {
  /** Builds every dismiss control's `aria-label` from the toast heading: `(h) => \`Dismiss: ${h}\``. */
  readonly dismissLabel: (heading: string) => string;
}

export const TOAST_CONFIG = new InjectionToken<ToastConfig>('TOAST_CONFIG');

/**
 * Configures toasts for an application (`app.config.ts`). In the browser it creates the CDK
 * overlay and its two live regions once, at start-up, so they exist before the first toast
 * (D-2). On the server it only provides the configuration.
 */
export function provideToasts(config: ToastConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TOAST_CONFIG, useValue: config },
    provideEnvironmentInitializer(() => {
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
        inject(ToastService).attach();
      }
    }),
  ]);
}
