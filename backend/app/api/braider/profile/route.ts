import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getProfileContent, updateProfile } from '@/application/braider/profile';
import { currentBraider } from '@/http/braider';
import { editFailure } from '@/http/edit-errors';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Use at most ${max.toLocaleString('en-CA')} characters.`)
    .default('');

const ProfileBody = z.object({
  bio: text(600),
  area: z
    .string({ required_error: 'Enter the area you serve, like Toronto West.' })
    .trim()
    .min(1, 'Enter the area you serve, like Toronto West.')
    .max(120, 'Use at most 120 characters.'),
  studioAddress: text(200),
  preparation: text(1000),
  changePolicy: text(1000),
  cancellationPolicy: text(1000),
  version: z.number().int().min(1),
});

export const GET = route(
  async (_request, { user }) => {
    const braider = await currentBraider(user.id);
    return NextResponse.json(await getProfileContent(braider.id));
  },
  { role: 'braider' },
);

export const PATCH = route(
  async (request, { user }) => {
    const braider = await currentBraider(user.id);
    const { version, ...input } = await parseBody(request, ProfileBody);
    const result = await updateProfile(braider.id, version, input);
    if (result.outcome !== 'saved') throw editFailure(result.outcome, 'profile');
    return NextResponse.json(result.value);
  },
  { role: 'braider' },
);
