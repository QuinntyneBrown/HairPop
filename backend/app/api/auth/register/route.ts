import { NextResponse } from 'next/server';
import { z } from 'zod';
import { registerCustomer } from '@/application/auth/register';
import { tooManyAttempts } from '@/http/api-error';
import { emailField, newPasswordField } from '@/http/fields';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const RegisterBody = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(100, 'Use at most 100 characters.'),
  email: emailField,
  password: newPasswordField,
});

export const POST = route(
  async (request) => {
    const result = await registerCustomer(await parseBody(request, RegisterBody));
    if (result.outcome === 'rate_limited') throw tooManyAttempts(result.retryAfter);
    return NextResponse.json({ email: result.email }, { status: 202 });
  },
  { anonymous: true },
);
