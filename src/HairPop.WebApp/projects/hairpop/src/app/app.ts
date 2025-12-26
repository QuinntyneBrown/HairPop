// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import { Braider } from './components/braider/braider';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Header,
    Braider,
    Footer
  ]
})
export class App {
  title = 'app';
}
