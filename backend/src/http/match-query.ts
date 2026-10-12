import { z } from 'zod';
import { DISTANCES_KM } from '@/domain/matching';
import { pageParam } from './query';

/** Query for the matching endpoints: search, maxPrice (whole dollars), distanceKm (5, 10, 25), page. */
export const MatchQuery = z.object({
  search: z.string().trim().max(80).optional(),
  maxPrice: z.coerce
    .number({ invalid_type_error: 'Enter a whole dollar amount.' })
    .int('Enter a whole dollar amount.')
    .min(0, 'Enter a whole dollar amount.')
    .optional(),
  distanceKm: z.coerce
    .number()
    .refine((km) => (DISTANCES_KM as readonly number[]).includes(km), 'Choose 5, 10 or 25 km.')
    .optional(),
  page: pageParam,
});
