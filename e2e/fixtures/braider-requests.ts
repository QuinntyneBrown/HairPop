import type { BraiderRequest } from '../../frontend/projects/api/src/public-api';
import type { ApiRule } from './api';

export const mayaRequest: BraiderRequest = {
  reference: 'HP-1048',
  kind: 'booking',
  customer: { name: 'Maya Chen' },
  service: 'Medium knotless braids',
  start: '2026-10-24T10:00:00-04:00',
  previousStart: null,
  durationHours: 5,
  estimate: { min: 180, max: 240 },
  agreedAmount: null,
  hairDetails: 'Shoulder length; bringing my own extensions',
  version: 3,
};

export function braiderRequests(data: BraiderRequest[] = [mayaRequest]): ApiRule {
  return { method: 'GET', path: '/api/braider/requests', body: { data } };
}
