import { API_URL } from './env';

export interface ApiResponse<T = unknown> {
  readonly status: number;
  readonly headers: Headers;
  readonly body: T;
  /** Set-Cookie headers from this response, keyed by cookie name. */
  readonly cookies: ReadonlyMap<string, string>;
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * A browser-like API client: it keeps cookies between requests and echoes the
 * XSRF-TOKEN cookie as X-XSRF-TOKEN on mutating requests, as Angular does.
 */
export class Api {
  private readonly jar = new Map<string, string>();

  cookie(name: string): string | undefined {
    return this.jar.get(name);
  }

  setCookie(name: string, value: string): void {
    this.jar.set(name, value);
  }

  get<T = unknown>(path: string, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    return this.send<T>('GET', path, undefined, headers);
  }

  post<T = unknown>(path: string, body?: unknown, headers: Record<string, string> = {}) {
    return this.send<T>('POST', path, body, headers);
  }

  put<T = unknown>(path: string, body?: unknown, headers: Record<string, string> = {}) {
    return this.send<T>('PUT', path, body, headers);
  }

  /** Fetches the CSRF cookie the way `Csrf.ensure()` does before a mutation. */
  async csrf(): Promise<void> {
    await this.get('/api/auth/csrf');
  }

  async send<T>(
    method: Method,
    path: string,
    body?: unknown,
    extraHeaders: Record<string, string> = {},
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (this.jar.size > 0) {
      headers.Cookie = [...this.jar].map(([k, v]) => `${k}=${v}`).join('; ');
    }
    const xsrf = this.jar.get('XSRF-TOKEN');
    if (method !== 'GET' && xsrf) headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrf);
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: { ...headers, ...extraHeaders },
      body: body === undefined ? undefined : JSON.stringify(body),
      redirect: 'manual',
    });

    const cookies = new Map<string, string>();
    for (const header of response.headers.getSetCookie()) {
      const [pair = ''] = header.split(';');
      const index = pair.indexOf('=');
      const name = pair.slice(0, index).trim();
      const value = pair.slice(index + 1).trim();
      cookies.set(name, header);
      if (value === '' || /max-age=0/i.test(header)) this.jar.delete(name);
      else this.jar.set(name, value);
    }

    const text = await response.text();
    const parsed = text === '' ? null : safeJson(text);
    return { status: response.status, headers: response.headers, body: parsed as T, cookies };
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
