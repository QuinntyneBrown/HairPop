import { createBraider, createBraiderUser, createService, createStyle } from './factories';

/** Nia as a signed-in-able braider account with her published profile and knotless service. */
export async function niaWithAccount() {
  const user = await createBraiderUser();
  await createStyle();
  const nia = await createBraider({ userId: user.id });
  const service = await createService(nia.id);
  return { user, nia, service };
}

export const NIA = 'nia.okafor@example.com';
