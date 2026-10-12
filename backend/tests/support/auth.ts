import { Api } from './api';
import { PASSWORD } from './factories';

/** A browser signed in through the real sign-in endpoint. */
export async function signedIn(
  email: string,
  audience: 'customer' | 'braider' = 'customer',
): Promise<Api> {
  const api = new Api();
  await api.csrf();
  const response = await api.post('/api/auth/sign-in', { email, password: PASSWORD, audience });
  if (response.status !== 200) throw new Error(`Sign-in failed with ${response.status}`);
  return api;
}
