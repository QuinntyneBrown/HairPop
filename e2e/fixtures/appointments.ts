import type {
  AppointmentDetail,
  AppointmentSummary,
} from '../../frontend/projects/api/src/public-api';
import type { ApiRule } from './api';

export const pendingAppointment: AppointmentDetail = {
  reference: 'HP-1048',
  status: 'awaiting_reply',
  service: 'Medium knotless braids',
  braider: { slug: 'nia-okafor', name: 'Nia Okafor' },
  start: '2026-10-24T10:00:00-04:00',
  timeZone: 'America/Toronto',
  price: { kind: 'estimate', min: 180, max: 240 },
  durationHours: 5,
  location: { area: 'Toronto', address: null },
  contact: { email: 'maya.chen@example.com', phone: '416-555-0148' },
  policy: {
    changes: 'Request a change at least 48 hours ahead.',
    cancellation: 'Cancel before the visit starts.',
  },
  preparation: ['Bring extensions.'],
  pendingChange: null,
  allowed: { change: true, cancel: true, rebook: false, review: false },
  unavailable: [],
  updatedAt: '2026-10-10T10:00:00-04:00',
};

export const confirmedAppointment: AppointmentDetail = {
  ...pendingAppointment,
  status: 'confirmed',
  price: { kind: 'agreed', min: 205, max: 205 },
  location: { area: 'Toronto', address: '42 Queen Street West' },
};

export function appointmentList(data: AppointmentSummary[] = [pendingAppointment]): ApiRule {
  return {
    method: 'GET',
    path: '/api/appointments',
    body: { data, meta: { page: 1, perPage: 12, total: data.length, lastPage: 1 } },
  };
}

export function appointmentDetail(detail = pendingAppointment): ApiRule {
  return { method: 'GET', path: `/api/appointments/${detail.reference}`, body: detail };
}
