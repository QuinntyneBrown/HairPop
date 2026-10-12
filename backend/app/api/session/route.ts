import { NextResponse } from 'next/server';
import { route } from '@/http/route';

export const GET = route(async (_request, { user }) => NextResponse.json({ user }));
