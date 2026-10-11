import { RenderMode, ServerRoute } from '@angular/ssr';

/** Render modes and statuses per route (ADR 0002). */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: 'styles/:slug', renderMode: RenderMode.Server },
  { path: 'styles/:slug/braiders', renderMode: RenderMode.Server },
  { path: 'braiders', renderMode: RenderMode.Server },
  { path: 'braiders/:slug', renderMode: RenderMode.Server },
  { path: 'sign-in', renderMode: RenderMode.Server },
  { path: 'sign-up', renderMode: RenderMode.Server },
  { path: 'help', renderMode: RenderMode.Server },
  { path: 'terms', renderMode: RenderMode.Server },
  { path: 'privacy', renderMode: RenderMode.Server },
  { path: '403', renderMode: RenderMode.Server, status: 403 },
  { path: '500', renderMode: RenderMode.Server, status: 500 },
  { path: 'offline', renderMode: RenderMode.Server },
  { path: '404', renderMode: RenderMode.Server, status: 404 },
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
