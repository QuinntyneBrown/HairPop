import { z } from 'zod';

/** An email address field with the copy the forms show. */
export const emailField = z
  .string()
  .trim()
  .max(254, 'Use at most 254 characters.')
  .email('Enter a full email address, like name@example.com.');

/** A new password: at least 12 characters (L2-010, L2-012). */
export const newPasswordField = z
  .string()
  .min(12, 'Use at least 12 characters.')
  .max(256, 'Use at most 256 characters.');

/** An optional phone number; blank means none. */
export const phoneField = z
  .string()
  .trim()
  .max(30, 'Enter a phone number, like 416-555-0148.')
  .nullable()
  .transform((phone) => (phone ? phone : null))
  .refine(
    (phone) =>
      phone === null || (/^\+?[\d\s().-]+$/.test(phone) && phone.replace(/\D/g, '').length >= 7),
    'Enter a phone number, like 416-555-0148.',
  );
