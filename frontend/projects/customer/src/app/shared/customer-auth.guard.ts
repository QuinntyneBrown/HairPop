import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '@hairpop/api';

/** Protected customer screens never request private data before session authorization. */
export const customerAuthGuard: CanActivateFn = async (_route, state) => {
  const session = inject(SessionStore);
  const router = inject(Router);
  await session.load();
  const user = session.user();
  if (user?.role === 'customer') return true;
  if (user?.role === 'braider') return router.createUrlTree(['/403']);
  return router.createUrlTree(['/sign-in'], { queryParams: { returnUrl: state.url } });
};
