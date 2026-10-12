import { recordConsent } from '@/infrastructure/consent-repository';

export interface SavedConsent {
  readonly optionalUsage: boolean;
  readonly savedAt: string;
}

/** Records the visitor's optional-usage choice; essential storage does not depend on it (L2-034). */
export async function saveOptionalConsent(optionalUsage: boolean): Promise<SavedConsent> {
  const saved = await recordConsent(optionalUsage);
  return { optionalUsage: saved.optionalUsage, savedAt: saved.savedAt.toISOString() };
}
