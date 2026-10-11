import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { API_ORIGIN } from '@hairpop/api';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // ADR 0002: server-side requests go to the API origin; the browser stays same-origin.
    { provide: API_ORIGIN, useFactory: () => process.env['API_ORIGIN'] ?? 'http://localhost:8000' },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
