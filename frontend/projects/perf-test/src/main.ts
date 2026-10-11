import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';
import { appConfig } from './app/app.config';
import { reportFailure } from './app/perf-result';

bootstrapApplication(App, appConfig)
  .then((ref) => (ref.components[0].instance as App).run())
  .catch((error: unknown) => reportFailure(error));
