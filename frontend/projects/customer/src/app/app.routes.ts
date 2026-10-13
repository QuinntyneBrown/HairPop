import { Routes } from '@angular/router';
import { customerAuthGuard } from './shared/customer-auth.guard';

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
    path: 'sign-in',
    title: 'Sign in · HairPop',
    loadComponent: () => import('./pages/sign-in/sign-in.page').then((m) => m.SignInPage),
  },
  {
    path: 'sign-up',
    title: 'Create account · HairPop',
    loadComponent: () => import('./pages/sign-up/sign-up.page').then((m) => m.SignUpPage),
  },
  {
    path: 'forgot-password',
    title: 'Reset your password · HairPop',
    loadComponent: () =>
      import('./pages/password-recovery/forgot-password.page').then((m) => m.ForgotPasswordPage),
  },
  {
    path: 'reset-password',
    title: 'Choose a new password · HairPop',
    loadComponent: () =>
      import('./pages/password-recovery/reset-password.page').then((m) => m.ResetPasswordPage),
  },
  {
    path: 'verify-email',
    title: 'Check your email · HairPop',
    loadComponent: () =>
      import('./pages/verify-email/verify-email.page').then((m) => m.VerifyEmailPage),
  },
  {
    path: 'settings',
    title: 'Account settings · HairPop',
    canActivate: [customerAuthGuard],
    data: { nav: 'account' },
    loadComponent: () =>
      import('./pages/account-settings/account-settings.page').then((m) => m.AccountSettingsPage),
  },
  {
    path: 'book/:braiderSlug',
    title: 'Request your appointment · HairPop',
    canActivate: [customerAuthGuard],
    loadComponent: () =>
      import('./pages/booking-request/booking-request.page').then((m) => m.BookingRequestPage),
  },
  {
    path: 'appointments',
    title: 'My appointments · HairPop',
    canActivate: [customerAuthGuard],
    data: { nav: 'appointments' },
    loadComponent: () =>
      import('./pages/appointments/appointments.page').then((m) => m.AppointmentsPage),
  },
  {
    path: 'notifications',
    title: 'Notifications · HairPop',
    canActivate: [customerAuthGuard],
    loadComponent: () =>
      import('./pages/notifications/notifications.page').then((m) => m.NotificationsPage),
  },
  {
    path: 'appointments/:ref',
    title: 'Your appointment · HairPop',
    canActivate: [customerAuthGuard],
    data: { nav: 'appointments' },
    loadComponent: () =>
      import('./pages/appointments/appointment-detail.page').then((m) => m.AppointmentDetailPage),
  },
  {
    path: 'appointments/:ref/care',
    title: 'Care and review · HairPop',
    canActivate: [customerAuthGuard],
    data: { nav: 'appointments' },
    loadComponent: () =>
      import('./pages/care-and-review/care-and-review.page').then((m) => m.CareAndReviewPage),
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
