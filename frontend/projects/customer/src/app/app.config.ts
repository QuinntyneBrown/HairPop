import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import {
  AUTH_API,
  BRAIDERS_API,
  CONSENT_API,
  CONTENT_API,
  HttpAuthApi,
  HttpBraidersApi,
  HttpConsentApi,
  HttpContentApi,
  HttpMatchingApi,
  HttpStylesApi,
  MATCHING_API,
  STYLES_API,
  SessionStore,
  provideHairPopHttp,
} from '@hairpop/api';

import { provideToasts } from '@hairpop/components';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideClientHydration(withEventReplay()),
    provideHairPopHttp(),
    { provide: STYLES_API, useClass: HttpStylesApi },
    { provide: MATCHING_API, useClass: HttpMatchingApi },
    { provide: CONTENT_API, useClass: HttpContentApi },
    { provide: AUTH_API, useClass: HttpAuthApi },
    { provide: BRAIDERS_API, useClass: HttpBraidersApi },
    { provide: CONSENT_API, useClass: HttpConsentApi },
    // Know who is signed in before the first render, so the shell never flashes the wrong state.
    provideAppInitializer(() => inject(SessionStore).load()),
    provideToasts({ dismissLabel: (heading) => `Dismiss: ${heading}` }),
  ],
};
