import { getMedia } from '@/application/media/get-media';
import { notFound } from '@/http/api-error';
import { route } from '@/http/route';

/** Public portfolio images; the stored type was checked from the file's bytes on upload. */
export const GET = route(
  async (_request, { params }) => {
    const media = await getMedia(String(params.id));
    if (!media) throw notFound();
    return new Response(new Uint8Array(media.bytes), {
      headers: {
        'Content-Type': media.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  },
  { anonymous: true },
);
