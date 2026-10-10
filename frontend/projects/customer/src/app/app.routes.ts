import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Find a style · HairPop',
    data: { nav: 'styles' },
    loadComponent: () =>
      import('./pages/style-gallery/style-gallery.page').then((m) => m.StyleGalleryPage),
  },
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
