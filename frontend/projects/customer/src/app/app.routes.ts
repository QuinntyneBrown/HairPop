import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '404',
    title: 'Page not found · HairPop',
    loadComponent: () => import('./pages/errors/not-found.page').then((m) => m.NotFoundPage),
  },
  {
    path: '**',
    title: 'Page not found · HairPop',
    loadComponent: () => import('./pages/errors/not-found.page').then((m) => m.NotFoundPage),
  },
];
