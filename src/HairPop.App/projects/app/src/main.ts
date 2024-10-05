// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { importProvidersFrom, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { RouterModule } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: 'BASE_URL', useValue: 'https://localhost:7023/' },
    importProvidersFrom(
      RouterModule.forRoot([

      ]),     
    )
  ]
}).catch((err) => console.error(err));