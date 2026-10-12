import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';

describe('API request pipeline', () => {
  it('Given any request, when the API answers, then the response carries a correlation id', async () => {
    const response = await new Api().get('/api/auth/csrf');

    expect(response.headers.get('X-Correlation-Id')).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('Given a caller-supplied correlation id, when the API answers, then it echoes that id', async () => {
    const response = await new Api().get('/api/auth/csrf', {
      'X-Correlation-Id': 'trace-1234',
    });

    expect(response.headers.get('X-Correlation-Id')).toBe('trace-1234');
  });

  it('Given an unknown API path, when it is requested, then the API answers 404 with an ApiErrorBody', async () => {
    const response = await new Api().get('/api/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toMatch(/application\/json/);
    expect(response.body).toEqual({ message: 'Not found.' });
    expect(response.headers.get('X-Correlation-Id')).toBeTruthy();
  });
});
