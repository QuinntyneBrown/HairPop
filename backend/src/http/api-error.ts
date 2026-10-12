/** JSON error body every API failure uses; mirrors `ApiErrorBody` in the frontend `api` library. */
export interface ApiErrorBody {
  readonly message: string;
  readonly code?: string;
  readonly errors?: Readonly<Record<string, readonly string[]>>;
  readonly reference?: string;
  readonly retryAfter?: number;
}

/** A handled failure: `withErrors` turns it into an `ApiErrorBody` response with this status. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: ApiErrorBody,
    readonly headers: Readonly<Record<string, string>> = {},
  ) {
    super(body.message);
  }
}

export const notFound = () => new ApiError(404, { message: 'Not found.' });
export const unauthenticated = () => new ApiError(401, { message: 'Unauthenticated.' });
export const tooManyAttempts = (retryAfter: number) =>
  new ApiError(
    429,
    { message: 'Too many attempts.', retryAfter },
    { 'Retry-After': String(retryAfter) },
  );
