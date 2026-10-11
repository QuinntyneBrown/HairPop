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
    path: 'styles/:slug/braiders',
    title: 'Matching braiders · HairPop',
    data: { nav: 'braiders' },
    loadComponent: () =>
      import('./pages/matching-braiders/matching-braiders.page').then(
        (m) => m.MatchingBraidersPage,
      ),
  },
  {
    path: 'braiders',
    title: 'Braiders · HairPop',
    data: { nav: 'braiders' },
    loadComponent: () =>
      import('./pages/matching-braiders/matching-braiders.page').then(
        (m) => m.MatchingBraidersPage,
      ),
  },
  {
    path: 'styles/:slug',
    title: 'Style · HairPop',
    data: { nav: 'styles' },
    loadComponent: () =>
      import('./pages/style-detail/style-detail.page').then((m) => m.StyleDetailPage),
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
