import { NextResponse } from 'next/server';
import { markRead } from '@/application/notifications/read-notifications';
import { notFound } from '@/http/api-error';
import { route } from '@/http/route';

export const POST = route(
  async (_request, { user, params }) => {
    const remaining = await markRead(user.id, String(params.id));
    if (remaining === null) throw notFound();
    return NextResponse.json({ unreadCount: remaining });
  },
  { role: 'customer' },
);
