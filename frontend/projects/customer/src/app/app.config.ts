import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import {
  CONTENT_API,
  HttpContentApi,
  HttpMatchingApi,
  HttpStylesApi,
  MATCHING_API,
  STYLES_API,
  provideHairPopHttp,
} from '@hairpop/api';

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
  ],
};
