import { NextResponse } from 'next/server';
import { getOwnedAppointment } from '@/application/appointments/read-appointments';
import { notFound } from '@/http/api-error';
import { route } from '@/http/route';

export const GET = route(
  async (_request, { user, params }) => {
    const detail = await getOwnedAppointment(user.id, String(params.ref));
    if (!detail) throw notFound();
    return NextResponse.json(detail);
  },
  { role: 'customer' },
);
