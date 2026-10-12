import { NextResponse } from 'next/server';
import { cancelAppointment } from '@/application/appointments/cancel-appointment';
import { ApiError, notFound } from '@/http/api-error';
import { route } from '@/http/route';

export const POST = route(
  async (_request, { user, params }) => {
    const result = await cancelAppointment(user.id, String(params.ref));
    switch (result.outcome) {
      case 'cancelled':
        return NextResponse.json({ status: 'cancelled' });
      case 'not_found':
        throw notFound();
      case 'not_cancellable':
        throw new ApiError(409, {
          message: 'This appointment can’t be cancelled now. Contact support if you need help.',
          code: 'not_cancellable',
        });
    }
  },
  { role: 'customer' },
);
