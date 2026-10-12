import { prisma } from './prisma';

export function recordConsent(optionalUsage: boolean) {
  return prisma.consentPreference.create({ data: { optionalUsage } });
}
