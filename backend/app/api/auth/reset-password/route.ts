import { NextResponse } from 'next/server';
import { z } from 'zod';
import { resetPassword } from '@/application/identity/reset-password';
import { ApiError } from '@/http/api-error';
import { newPasswordField } from '@/http/fields';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const ResetBody = z
  .object({
    token: z.string().min(1).max(256),
    email: z.string().trim().min(1).max(254),
    password: newPasswordField,
    passwordConfirmation: z.string().max(256),
  })
  .refine((body) => body.password === body.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Enter the same password again.',
  });

export const POST = route(
  async (request) => {
    const result = await resetPassword(await parseBody(request, ResetBody));
    if (result.outcome === 'invalid_token') {
      throw new ApiError(422, {
        message: 'This reset link has expired or was already used. Ask for a new one.',
        code: 'invalid_token',
      });
    }
    return NextResponse.json({ email: result.email });
  },
  { anonymous: true },
);
