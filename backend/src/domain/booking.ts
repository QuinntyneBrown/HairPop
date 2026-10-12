import { createHash } from 'node:crypto';
import type { Range } from './common';

/** HairPop operates in Toronto; customers see appointment times in this zone. */
export const TIME_ZONE = 'America/Toronto';

export interface BookableService {
  readonly id: string;
  readonly name: string;
  readonly startingPrice: number;
  readonly typicalHours: number;
  /** A service has a starting price, so its estimate is "from" that price. */
  readonly estimate: Range;
}

export interface BookingOptions {
  readonly braider: { readonly slug: string; readonly name: string; readonly area: string };
  readonly services: readonly BookableService[];
  readonly slots: readonly { readonly id: string; readonly start: string }[];
  readonly policy: {
    readonly version: string;
    readonly changes: string;
    readonly cancellation: string;
  };
  readonly contact: { readonly email: string; readonly phone: string | null };
  readonly timeZone: string;
}

interface PolicyInput {
  readonly changePolicy: string | null;
  readonly cancellationPolicy: string | null;
  readonly services: readonly { id: string; startingPrice: number; typicalHours: number }[];
}

/**
 * Fingerprint of the terms a customer reviews: the braider's policies and every bookable
 * service's price and duration. Any change makes a reviewed request stale (L2-016 AC3).
 */
export function policyVersion(input: PolicyInput): string {
  const services = [...input.services]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((s) => [s.id, s.startingPrice, s.typicalHours]);
  const terms = JSON.stringify([input.changePolicy, input.cancellationPolicy, services]);
  return createHash('sha256').update(terms).digest('hex').slice(0, 12);
}

export function toBookableService(service: {
  id: string;
  name: string;
  startingPrice: number;
  typicalHours: number;
}): BookableService {
  return {
    id: service.id,
    name: service.name,
    startingPrice: service.startingPrice,
    typicalHours: service.typicalHours,
    estimate: { min: service.startingPrice, max: null },
  };
}
