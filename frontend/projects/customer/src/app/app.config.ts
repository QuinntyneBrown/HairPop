import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import {
  BRAIDERS_API,
  CONSENT_API,
  CONTENT_API,
  HttpBraidersApi,
  HttpConsentApi,
  HttpContentApi,
  HttpMatchingApi,
  HttpStylesApi,
  MATCHING_API,
  STYLES_API,
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
    { provide: BRAIDERS_API, useClass: HttpBraidersApi },
    { provide: CONSENT_API, useClass: HttpConsentApi },
    provideToasts({ dismissLabel: (heading) => `Dismiss: ${heading}` }),
  ],
};
