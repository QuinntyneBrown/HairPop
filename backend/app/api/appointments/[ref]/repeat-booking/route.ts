import { NextResponse } from 'next/server';
import { prepareRepeatBooking } from '@/application/aftercare/repeat-booking';
import { ApiError, notFound } from '@/http/api-error';
import { route } from '@/http/route';

export const GET = route(
  async (_request, { user, params }) => {
    const result = await prepareRepeatBooking(user.id, String(params.ref));
    switch (result.outcome) {
      case 'ready':
        return NextResponse.json({ braiderSlug: result.braiderSlug, serviceId: result.serviceId });
      case 'not_found':
        throw notFound();
      case 'not_completed':
        throw new ApiError(409, {
          message: 'Only a completed visit can be booked again.',
          code: 'not_completed',
        });
      case 'service_unavailable':
        throw new ApiError(409, {
          message: 'This service is no longer offered. Choose from the braider’s current services.',
          code: 'service_unavailable',
        });
    }
  },
  { role: 'customer' },
);
