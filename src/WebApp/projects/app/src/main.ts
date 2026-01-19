// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { importProvidersFrom, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { RouterModule } from '@angular/router';

bootstrapApplication(App, {
  providers: [
    { provide: 'BASE_URL', useValue: 'https://localhost:7023/' },
    importProvidersFrom(
      RouterModule.forRoot([

      ]),
    )
  ]
}).catch((err) => console.error(err));
