import type { NextRequest } from 'next/server';
import type { SessionUser } from '@/domain/session-user';

export interface RequestContext {
  readonly correlationId: string;
  readonly params: Readonly<Record<string, string | string[]>>;
}

export interface AuthenticatedContext extends RequestContext {
  readonly user: SessionUser;
}

export type Handler<C extends RequestContext = RequestContext> = (
  request: NextRequest,
  context: C,
) => Promise<Response>;

/** The shape Next.js calls a route handler with. */
export type NextHandler = (
  request: NextRequest,
  segment: { params: Promise<Record<string, string | string[]>> },
) => Promise<Response>;
