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
