import { NextResponse } from 'next/server';
import { listBraiderRequests } from '@/application/braider/requests';
import { currentBraider } from '@/http/braider';
import { route } from '@/http/route';

export const GET = route(
  async (_request, { user }) => {
    const braider = await currentBraider(user.id);
    return NextResponse.json({ data: await listBraiderRequests(braider.id) });
  },
  { role: 'braider' },
);
