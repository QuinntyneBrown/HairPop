import { NextResponse } from 'next/server';
import {
  addService,
  listManagedServices,
  offerableStyleSlugs,
} from '@/application/braider/services';
import { currentBraider } from '@/http/braider';
import { route } from '@/http/route';
import { serviceInput } from '@/http/service-input';
import { parseBody } from '@/http/validation';

export const GET = route(
  async (_request, { user }) => {
    const braider = await currentBraider(user.id);
    return NextResponse.json(await listManagedServices(braider.id));
  },
  { role: 'braider' },
);

export const POST = route(
  async (request, { user }) => {
    const braider = await currentBraider(user.id);
    const input = await parseBody(request, serviceInput(await offerableStyleSlugs()));
    return NextResponse.json(await addService(braider.id, input), { status: 201 });
  },
  { role: 'braider' },
);
