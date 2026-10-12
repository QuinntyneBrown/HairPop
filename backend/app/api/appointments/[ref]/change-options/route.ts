import { NextResponse } from 'next/server';
import { getChangeOptions } from '@/application/appointments/change-appointment';
import { notFound } from '@/http/api-error';
import { notChangeable } from '@/http/appointment-errors';
import { route } from '@/http/route';

export const GET = route(
  async (_request, { user, params }) => {
    const result = await getChangeOptions(user.id, String(params.ref));
    switch (result.outcome) {
      case 'options':
        return NextResponse.json({ slots: result.slots });
      case 'not_found':
        throw notFound();
      case 'not_changeable':
        throw notChangeable();
    }
  },
  { role: 'customer' },
);
