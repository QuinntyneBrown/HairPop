import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  AUTH_API,
  BRAIDER_PROFILE_API,
  BRAIDER_REQUESTS_API,
  BRAIDER_SERVICES_API,
  BRAIDER_SLOTS_API,
  HttpAuthApi,
  HttpBraiderProfileApi,
  HttpBraiderRequestsApi,
  HttpBraiderServicesApi,
  HttpBraiderSlotsApi,
  SessionStore,
  provideHairPopHttp,
} from '@hairpop/api';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHairPopHttp(),
    { provide: AUTH_API, useClass: HttpAuthApi },
    { provide: BRAIDER_REQUESTS_API, useClass: HttpBraiderRequestsApi },
    { provide: BRAIDER_SLOTS_API, useClass: HttpBraiderSlotsApi },
    { provide: BRAIDER_SERVICES_API, useClass: HttpBraiderServicesApi },
    { provide: BRAIDER_PROFILE_API, useClass: HttpBraiderProfileApi },
    provideAppInitializer(() => inject(SessionStore).load()),
  ],
};
