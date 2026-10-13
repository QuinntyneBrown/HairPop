import { NextResponse } from 'next/server';
import { editService, offerableStyleSlugs, removeService } from '@/application/braider/services';
import { currentBraider } from '@/http/braider';
import { editFailure } from '@/http/edit-errors';
import { route } from '@/http/route';
import { serviceEdit } from '@/http/service-input';
import { parseBody } from '@/http/validation';

export const PATCH = route(
  async (request, { user, params }) => {
    const braider = await currentBraider(user.id);
    const { version, ...changes } = await parseBody(
      request,
      serviceEdit(await offerableStyleSlugs()),
    );
    const result = await editService(braider.id, String(params.id), version, changes);
    if (result.outcome !== 'saved') throw editFailure(result.outcome, 'service');
    return NextResponse.json(result.value);
  },
  { role: 'braider' },
);

export const DELETE = route(
  async (_request, { user, params }) => {
    const braider = await currentBraider(user.id);
    const result = await removeService(braider.id, String(params.id));
    if (result.outcome !== 'saved') throw editFailure(result.outcome, 'service');
    return new NextResponse(null, { status: 204 });
  },
  { role: 'braider' },
);
