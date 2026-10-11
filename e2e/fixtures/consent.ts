import type { ApiRule } from './api';

/** PUT /api/consent: the API confirms the saved choice. */
export function saveConsent(optionalUsage: boolean, extra: Partial<ApiRule> = {}): ApiRule {
  return {
    method: 'PUT',
    path: '/api/consent',
    body: { optionalUsage, savedAt: '2026-10-10T10:00:00-04:00' },
    ...extra,
  };
}
