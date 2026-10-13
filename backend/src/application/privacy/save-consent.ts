import { recordConsent } from '@/infrastructure/consent-repository';
import { recordNotification } from '@/infrastructure/notification-repository';
import { prisma } from '@/infrastructure/prisma';

export interface SavedConsent {
  readonly optionalUsage: boolean;
  readonly savedAt: string;
}

/**
 * Records the visitor's optional-usage choice; essential storage does not depend on it (L2-034).
 * A signed-in customer also gets the saved choice in their updates (L2-029).
 */
export async function saveOptionalConsent(
  optionalUsage: boolean,
  customerId: string | null = null,
): Promise<SavedConsent> {
  const saved = await recordConsent(optionalUsage);
  if (customerId) {
    await recordNotification(prisma, {
      userId: customerId,
      title: 'Preferences saved',
      body: optionalUsage
        ? 'Optional usage data allowed. You can change this in Cookie preferences.'
        : 'Essential only. You can change this in Cookie preferences.',
      link: null,
    });
  }
  return { optionalUsage: saved.optionalUsage, savedAt: saved.savedAt.toISOString() };
}
