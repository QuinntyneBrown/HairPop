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
    path: 'braiders/:slug',
    title: 'Braider · HairPop',
    data: { nav: 'braiders' },
    loadComponent: () =>
      import('./pages/braider-profile/braider-profile.page').then((m) => m.BraiderProfilePage),
  },
  {
    path: 'styles/:slug',
    title: 'Style · HairPop',
    data: { nav: 'styles' },
    loadComponent: () =>
      import('./pages/style-detail/style-detail.page').then((m) => m.StyleDetailPage),
  },
  {
    path: 'help',
    title: 'Help · HairPop',
    data: { nav: 'help' },
    loadComponent: () => import('./pages/help/help.page').then((m) => m.HelpPage),
  },
  {
    path: 'terms',
    title: 'Terms of use · HairPop',
    data: { slug: 'terms' },
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.LegalPage),
  },
  {
    path: 'privacy',
    title: 'Privacy · HairPop',
    data: { slug: 'privacy' },
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.LegalPage),
  },
  {
    path: '403',
    title: 'Access unavailable · HairPop',
    loadComponent: () => import('./pages/errors/forbidden.page').then((m) => m.ForbiddenPage),
  },
  {
    path: '500',
    title: 'Something went wrong · HairPop',
    loadComponent: () => import('./pages/errors/server-error.page').then((m) => m.ServerErrorPage),
  },
  {
    path: 'offline',
    title: 'Offline · HairPop',
    loadComponent: () => import('./pages/errors/offline.page').then((m) => m.OfflinePage),
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
