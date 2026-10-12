import { z } from 'zod';

/** `page` query parameter: a whole number from 1, defaulting to the first page. */
export const pageParam = z.coerce.number().int().min(1).default(1);
