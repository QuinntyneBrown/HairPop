import { ApiError } from './api-error';

export const notChangeable = () =>
  new ApiError(409, {
    message: 'This appointment can’t be changed now. Contact the braider or support.',
    code: 'not_changeable',
  });

export const slotUnavailable = () =>
  new ApiError(409, {
    message: 'This time is no longer offered. Choose another time.',
    code: 'slot_unavailable',
  });
