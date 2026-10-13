import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { SessionStore } from '@hairpop/api';

const braiderGuard: CanActivateFn = (_, state) => {
  const session = inject(SessionStore).user();
  const router = inject(Router);
  if (session?.role === 'braider') return true;
  if (session) return router.createUrlTree(['/sign-in'], { queryParams: { denied: '1' } });
  return router.createUrlTree(['/sign-in'], { queryParams: { returnUrl: state.url } });
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'requests' },
  {
    path: 'sign-in',
    title: 'Braider sign in · HairPop',
    loadComponent: () => import('./pages/sign-in.page').then((m) => m.BraiderSignInPage),
  },
  {
    path: 'requests',
    title: 'Requests · HairPop for braiders',
    canActivate: [braiderGuard],
    loadComponent: () => import('./pages/requests.page').then((m) => m.BraiderRequestsPage),
  },
  {
    path: 'availability',
    title: 'Availability · HairPop for braiders',
    canActivate: [braiderGuard],
    loadComponent: () => import('./pages/availability.page').then((m) => m.BraiderAvailabilityPage),
  },
  {
    path: 'services',
    title: 'Services · HairPop for braiders',
    canActivate: [braiderGuard],
    loadComponent: () => import('./pages/services.page').then((m) => m.BraiderServicesPage),
  },
  {
    path: 'profile',
    title: 'Your public profile · HairPop for braiders',
    canActivate: [braiderGuard],
    loadComponent: () => import('./pages/profile.page').then((m) => m.BraiderProfileContentPage),
  },
  { path: '**', redirectTo: 'requests' },
];
