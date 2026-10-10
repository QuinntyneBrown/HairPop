import { RenderMode, ServerRoute } from '@angular/ssr';

/** Render modes and statuses per route (ADR 0002). */
export const serverRoutes: ServerRoute[] = [
  { path: '404', renderMode: RenderMode.Server, status: 404 },
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
