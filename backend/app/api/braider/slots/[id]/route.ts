import { NextResponse } from 'next/server';
import { withdrawSlot } from '@/application/braider/slots';
import { ApiError } from '@/http/api-error';
import { currentBraider } from '@/http/braider';
import { editFailure } from '@/http/edit-errors';
import { route } from '@/http/route';

export const DELETE = route(
  async (_request, { user, params }) => {
    const braider = await currentBraider(user.id);
    const result = await withdrawSlot(braider.id, String(params.id));
    switch (result.outcome) {
      case 'saved':
        return new NextResponse(null, { status: 204 });
      case 'requested':
        throw new ApiError(409, {
          message:
            'A customer has requested this time, so it can’t be withdrawn. Reply to the request instead.',
          code: 'requested',
        });
      default:
        throw editFailure(result.outcome, 'time');
    }
  },
  { role: 'braider' },
);
