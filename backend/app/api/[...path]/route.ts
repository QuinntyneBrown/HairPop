import { notFound } from '@/http/api-error';
import { route } from '@/http/route';

/** Any `/api/*` path without its own route answers a JSON 404. */
const unknown = route(
  async () => {
    throw notFound();
  },
  { anonymous: true },
);

export { unknown as GET, unknown as POST, unknown as PUT, unknown as PATCH, unknown as DELETE };
