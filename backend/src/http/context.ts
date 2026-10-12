import type { NextRequest } from 'next/server';

export interface RequestContext {
  readonly correlationId: string;
  readonly params: Readonly<Record<string, string | string[]>>;
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
