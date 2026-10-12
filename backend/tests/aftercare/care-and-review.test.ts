// Acceptance Test
// Traces to: L2-008, L2-023, L2-024, L2-025, L2-029, L2-038, L2-039
import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { signedIn } from '../support/auth';
import { db } from '../support/db';
import {
  createAppointment,
  createBraider,
  createCustomer,
  createService,
  createStyle,
  daysFromNow,
} from '../support/factories';

const MAYA = 'maya.chen@example.com';

async function completedVisit() {
  const maya = await createCustomer();
  await createStyle();
  const nia = await createBraider();
  const service = await createService(nia.id);
  await db().braiderService.update({
    where: { id: service.id },
    data: {
      careGuidance: [
        'Keep your scalp moisturized with a light oil twice a week.',
        'Sleep with a satin bonnet or pillowcase.',
        'Book a take-down within 8 weeks.',
      ],
    },
  });
  // Sat 3 Oct 2026, 10:00 am in Toronto.
  const visit = await createAppointment(maya.id, service, {
    number: 992,
    status: 'confirmed',
    start: new Date('2026-10-03T14:00:00Z'),
    agreedAmount: 205,
  });
  return { maya, nia, service, visit };
}

function review(api: Api, body: Record<string, unknown>, key = randomUUID(), ref = 'HP-0992') {
  return api.post<{ reviewId: string; status: string }>(`/api/appointments/${ref}/review`, body, {
    'Idempotency-Key': key,
  });
}

describe('GET /api/appointments/{ref}/repeat-booking', () => {
  it('Given a completed visit whose service is still offered, when its owner books again, then the braider and service are preselected', async () => {
    const { service } = await completedVisit();

    const response = await (await signedIn(MAYA)).get('/api/appointments/HP-0992/repeat-booking');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ braiderSlug: 'nia-okafor', serviceId: service.id });
  });

  it('Given the service is no longer offered, when its owner books again, then they are guided to current services', async () => {
    const { service } = await completedVisit();
    await db().braiderService.update({ where: { id: service.id }, data: { published: false } });

    const response = await (await signedIn(MAYA)).get('/api/appointments/HP-0992/repeat-booking');

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({ code: 'service_unavailable' });
  });

  it('Given a visit that is not completed, when booking again is asked, then it is refused', async () => {
    const { maya, service } = await completedVisit();
    await createAppointment(maya.id, service, { number: 1048 });

    const response = await (await signedIn(MAYA)).get('/api/appointments/HP-1048/repeat-booking');

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({ code: 'not_completed' });
  });
});

describe('GET /api/appointments/{ref}/care', () => {
  it('Given a completed visit with care guidance, when its owner opens Care and Review, then the guidance and its source are shown and review is open', async () => {
    await completedVisit();

    const response = await (await signedIn(MAYA)).get('/api/appointments/HP-0992/care');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      reference: 'HP-0992',
      service: 'Medium knotless braids',
      braider: { slug: 'nia-okafor', name: 'Nia Okafor' },
      date: '2026-10-03',
      guidance: {
        items: [
          'Keep your scalp moisturized with a light oil twice a week.',
          'Sleep with a satin bonnet or pillowcase.',
          'Book a take-down within 8 weeks.',
        ],
        source: 'Nia Okafor, for medium knotless braids',
      },
      review: 'open',
    });
  });

  it('Given no care guidance, when Care and Review opens, then guidance is null and review stays available', async () => {
    const { service } = await completedVisit();
    await db().braiderService.update({ where: { id: service.id }, data: { careGuidance: [] } });

    const response = await (await signedIn(MAYA)).get('/api/appointments/HP-0992/care');

    expect(response.body).toMatchObject({ guidance: null, review: 'open' });
  });

  it('Given a pending request, when its care page opens, then no guidance is shown and review is not allowed', async () => {
    const { maya, service } = await completedVisit();
    await createAppointment(maya.id, service, { number: 1048, start: daysFromNow(14) });

    const response = await (await signedIn(MAYA)).get('/api/appointments/HP-1048/care');

    expect(response.body).toMatchObject({ guidance: null, review: 'not_allowed' });
  });

  it('Given another customer’s visit, when its care page is requested, then nothing is disclosed', async () => {
    await completedVisit();
    await createCustomer({ name: 'Kemi Adebayo', email: 'kemi.adebayo@example.com' });

    expect(
      (await (await signedIn('kemi.adebayo@example.com')).get('/api/appointments/HP-0992/care'))
        .status,
    ).toBe(404);
  });
});

describe('POST /api/appointments/{ref}/review', () => {
  it('Given a completed unreviewed visit, when its owner submits a rating and review, then one published review is recorded for the braider and appointment', async () => {
    const { maya, nia, service, visit } = await completedVisit();
    const api = await signedIn(MAYA);

    const response = await review(api, {
      rating: 5,
      text: '  The parts were so neat and Nia checked that nothing felt too tight. ',
    });

    expect(response.status).toBe(201);
    const stored = await db().review.findFirstOrThrow({ where: { appointmentId: visit.id } });
    expect(response.body).toEqual({ reviewId: stored.id, status: 'published' });
    expect(stored).toMatchObject({
      braiderId: nia.id,
      serviceId: service.id,
      authorId: maya.id,
      rating: 5,
      text: 'The parts were so neat and Nia checked that nothing felt too tight.',
      status: 'published',
    });
    expect((await api.get('/api/appointments/HP-0992/care')).body).toMatchObject({
      review: 'submitted',
    });
    expect((await api.get('/api/appointments/HP-0992')).body).toMatchObject({
      allowed: { review: false },
    });
    const profile = await new Api().get('/api/braiders/nia-okafor');
    expect(profile.body).toMatchObject({ rating: { average: 5, count: 1 } });
    expect(await db().customerNotification.findMany({ where: { userId: maya.id } })).toMatchObject([
      {
        title: 'Review posted',
        body: 'Thank you for helping others choose.',
        link: '/braiders/nia-okafor',
      },
    ]);
  });

  it('Given review text with contact details, when it is submitted, then it is held for checks and not public', async () => {
    const { maya } = await completedVisit();

    const response = await review(await signedIn(MAYA), {
      rating: 4,
      text: 'Great work! Book her directly at nia@example.net to save fees.',
    });

    expect(response.body).toMatchObject({ status: 'pending' });
    expect((await new Api().get('/api/braiders/nia-okafor')).body).toMatchObject({ rating: null });
    expect(await db().customerNotification.findMany({ where: { userId: maya.id } })).toMatchObject([
      { title: 'Review held for checks', body: 'It appears once our team has checked it.' },
    ]);
  });

  it('Given a repeated submission, when it uses the same key, then the same review is returned; with a new key it is refused', async () => {
    await completedVisit();
    const api = await signedIn(MAYA);
    const key = randomUUID();
    const body = { rating: 5, text: 'Lovely visit.' };

    const first = await review(api, body, key);
    const retry = await review(api, body, key);
    const again = await review(api, body);

    expect(retry.status).toBe(201);
    expect(retry.body).toEqual(first.body);
    expect(again.status).toBe(409);
    expect(again.body).toMatchObject({ code: 'already_reviewed' });
    expect(await db().review.count()).toBe(1);
  });

  it('Given a rating outside 1 to 5 or a blank review, when it is submitted, then the fields are named and nothing is recorded', async () => {
    await completedVisit();
    const api = await signedIn(MAYA);

    const response = await review(api, { rating: 6, text: '   ' });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      errors: {
        rating: ['Choose a rating from 1 to 5 stars.'],
        text: ['Tell others how your visit went.'],
      },
    });
    expect(await db().review.count()).toBe(0);
  });

  it('Given a pending or cancelled appointment, when a review is submitted, then it is denied', async () => {
    const { maya, service } = await completedVisit();
    await createAppointment(maya.id, service, { number: 1048 });
    await createAppointment(maya.id, service, {
      number: 1049,
      status: 'cancelled',
      start: daysFromNow(-3),
    });
    const api = await signedIn(MAYA);

    for (const ref of ['HP-1048', 'HP-1049']) {
      const response = await review(api, { rating: 5, text: 'Great.' }, randomUUID(), ref);
      expect(response.status).toBe(403);
      expect(response.body).toMatchObject({ code: 'not_completed' });
    }
    expect(await db().review.count()).toBe(0);
  });

  it('Given another customer’s visit, when they submit a review, then nothing is disclosed or recorded', async () => {
    await completedVisit();
    await createCustomer({ name: 'Kemi Adebayo', email: 'kemi.adebayo@example.com' });

    const response = await review(await signedIn('kemi.adebayo@example.com'), {
      rating: 1,
      text: 'Bad.',
    });

    expect(response.status).toBe(404);
    expect(await db().review.count()).toBe(0);
  });
});
