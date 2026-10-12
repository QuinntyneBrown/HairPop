import { deleteSession } from '@/infrastructure/session-repository';

/** Ends this browser's session only; other signed-in browsers stay signed in. */
export async function signOut(token: string): Promise<void> {
  await deleteSession(token);
}
