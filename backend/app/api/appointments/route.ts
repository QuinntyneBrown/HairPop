import { NextResponse } from 'next/server';
import { z } from 'zod';
import { listOwnedAppointments } from '@/application/appointments/read-appointments';
import { pageParam } from '@/http/query';
import { route } from '@/http/route';
import { parseQuery } from '@/http/validation';

const AppointmentsQuery = z.object({
  filter: z.enum(['all', 'upcoming', 'past']).default('all'),
  search: z.string().trim().max(80).optional(),
  page: pageParam,
});

export const GET = route(
  async (request, { user }) => {
    const query = parseQuery(request, AppointmentsQuery);
    return NextResponse.json(await listOwnedAppointments(user.id, query));
  },
  { role: 'customer' },
);
