import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAccount, updateAccount } from '@/application/identity/account';
import { phoneField } from '@/http/fields';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const AccountBody = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(100, 'Use at most 100 characters.'),
  email: z
    .string()
    .trim()
    .max(254, 'Use at most 254 characters.')
    .email('Enter an email address like name@example.com.'),
  phone: phoneField,
});

export const GET = route(
  async (_request, { user }) => NextResponse.json(await getAccount(user.id)),
  { role: 'customer' },
);

export const PATCH = route(
  async (request, { user }) => {
    const body = await parseBody(request, AccountBody);
    return NextResponse.json(await updateAccount(user.id, body));
  },
  { role: 'customer' },
);
