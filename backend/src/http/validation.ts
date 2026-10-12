import type { NextRequest } from 'next/server';
import type { z } from 'zod';
import { ApiError } from './api-error';

const INVALID = 'The given data was invalid.';

/** Parses a JSON body with a Zod schema; failures answer 422 with field errors. */
export async function parseBody<S extends z.ZodTypeAny>(
  request: NextRequest,
  schema: S,
): Promise<z.infer<S>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ApiError(422, { message: INVALID });
  }
  return parse(schema, body);
}

/** Parses query parameters with a Zod schema; empty values count as absent. */
export function parseQuery<S extends z.ZodTypeAny>(request: NextRequest, schema: S): z.infer<S> {
  const query: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    if (value !== '') query[key] = value;
  });
  return parse(schema, query);
}

function parse<S extends z.ZodTypeAny>(schema: S, input: unknown): z.infer<S> {
  const result = schema.safeParse(input);
  if (result.success) return result.data;
  const errors = result.error.flatten().fieldErrors as Record<string, string[]>;
  throw new ApiError(422, { message: INVALID, errors });
}
