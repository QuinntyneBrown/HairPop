import { NextResponse } from 'next/server';
import { removePortfolioItem } from '@/application/braider/profile';
import { currentBraider } from '@/http/braider';
import { editFailure } from '@/http/edit-errors';
import { route } from '@/http/route';

export const DELETE = route(
  async (_request, { user, params }) => {
    const braider = await currentBraider(user.id);
    const result = await removePortfolioItem(braider.id, String(params.id));
    if (result.outcome !== 'saved') throw editFailure(result.outcome, 'photo');
    return new NextResponse(null, { status: 204 });
  },
  { role: 'braider' },
);
