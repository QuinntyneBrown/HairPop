import { ApiError, notFound } from './api-error';

export const stale = (what: string) =>
  new ApiError(409, {
    message: `This ${what} changed in another window. Refresh to load the latest version before saving.`,
    code: 'stale',
  });

export const notYours = () => new ApiError(403, { message: 'This isn’t yours to change.' });

/** Maps an edit's failure outcome to its error. */
export function editFailure(outcome: 'not_found' | 'forbidden' | 'stale', what: string): ApiError {
  if (outcome === 'not_found') return notFound();
  if (outcome === 'forbidden') return notYours();
  return stale(what);
}
