import { NextResponse } from 'next/server';
import { getBookingOptions } from '@/application/booking/get-booking-options';
import { notFound } from '@/http/api-error';
import { route } from '@/http/route';

export const GET = route(
  async (_request, { user, params }) => {
    const options = await getBookingOptions(String(params.slug), user.id);
    if (!options) throw notFound();
    return NextResponse.json(options);
  },
  { role: 'customer' },
);
