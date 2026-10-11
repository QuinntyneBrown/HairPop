import { RenderMode, ServerRoute } from '@angular/ssr';

/** Render modes and statuses per route (ADR 0002). */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: 'styles/:slug', renderMode: RenderMode.Server },
  { path: 'styles/:slug/braiders', renderMode: RenderMode.Server },
  { path: 'braiders', renderMode: RenderMode.Server },
  { path: '404', renderMode: RenderMode.Server, status: 404 },
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
