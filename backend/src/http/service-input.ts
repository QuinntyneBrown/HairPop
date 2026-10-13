import { z } from 'zod';

const PRICE = 'Enter a starting price of $0 or more.';
const HOURS = 'Enter a typical time longer than 0 hours.';

/** The service fields the edit dialog sends (L2-026 AC2); the style must be one of `styles`. */
export const serviceInput = (styles: readonly string[]) =>
  z.object({
    styleSlug: z
      .string({ required_error: 'Choose a style.' })
      .refine((slug) => styles.includes(slug), 'Choose a style.'),
    name: z
      .string({ required_error: 'Enter a service name.' })
      .trim()
      .min(1, 'Enter a service name.')
      .max(100, 'Use at most 100 characters.'),
    startingPrice: z
      .number({ invalid_type_error: PRICE, required_error: PRICE })
      .int(PRICE)
      .min(0, PRICE)
      .max(100_000, PRICE),
    typicalHours: z
      .number({ invalid_type_error: HOURS, required_error: HOURS })
      .gt(0, HOURS)
      .max(24, 'Enter a typical time of 24 hours or less.'),
    preparation: z
      .string()
      .trim()
      .max(1000, 'Use at most 1,000 characters.')
      .nullable()
      .default(null)
      .transform((text) => (text ? text : null)),
    published: z.boolean().default(false),
  });

/** An edit: Publish and Unpublish send only `published` and `version`; Edit sends every field. */
export const serviceEdit = (styles: readonly string[]) =>
  serviceInput(styles)
    .partial()
    .extend({ version: z.number().int().min(1) });
