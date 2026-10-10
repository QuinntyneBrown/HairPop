import { test as base, BrowserContext, Page, Request, Route } from '@playwright/test';

import { BRAIDER_URL, CUSTOMER_URL, STUB_API_PORT } from './urls';
import { DEFAULT_RULES, match, unmatchedBody } from '../stub-api/rules.mjs';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** One declarative API answer (ADR 0004). Later rules win; `times` limits how often it answers. */
export interface ApiRule {
  method: Method;
  path: string;
  query?: Record<string, string | null>;
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
  delayMs?: number;
  times?: number;
}

/** A request the app sent, recorded for assertions. */
export interface RecordedRequest {
  method: string;
  path: string;
  query: URLSearchParams;
  headers: Record<string, string>;
  body: unknown;
}

/** Sat 10 Oct 2026, 10:00 am in Toronto: "today" in the cast (docs/mocks/README.md). */
export const TODAY = new Date('2026-10-10T10:00:00-04:00');

/**
 * The API state for one test. `given` adds rules for both the browser (page.route) and the
 * SSR stub server (keyed by the hp-e2e cookie), so server-rendered and browser requests agree.
 */
export class Api {
  private readonly rules: ApiRule[] = DEFAULT_RULES.map((r) => ({ ...r }) as ApiRule);
  private readonly recorded: RecordedRequest[] = [];
  private readonly unmatched: string[] = [];

  constructor(readonly id: string) {}

  /** Adds rules; later rules take precedence over earlier ones and over the defaults. */
  async given(...rules: (ApiRule | ApiRule[])[]): Promise<void> {
    this.rules.push(...rules.flat().map((r) => ({ ...r })));
    await this.sync();
  }

  /** Requests the browser sent matching a method and path, oldest first. */
  requests(method: Method, path: string): RecordedRequest[] {
    return this.recorded.filter((r) => r.method === method && r.path === path);
  }

  async handle(route: Route, request: Request): Promise<void> {
    const url = new URL(request.url());
    const method = request.method();
    let body: unknown = request.postData();
    try {
      body = body ? JSON.parse(body as string) : null;
    } catch {
      // multipart or text bodies stay as sent
    }
    this.recorded.push({
      method,
      path: url.pathname,
      query: url.searchParams,
      headers: request.headers(),
      body,
    });
    const rule = match(this.rules, method, url);
    if (!rule) {
      this.unmatched.push(`${method} ${url.pathname}${url.search}`);
      await route.fulfill({ status: 404, json: unmatchedBody(method, url) });
      return;
    }
    if (rule.delayMs) await new Promise((r) => setTimeout(r, rule.delayMs));
    await route.fulfill({
      status: rule.status ?? 200,
      headers: { 'content-type': 'application/json', ...rule.headers },
      body: rule.body === undefined ? '' : JSON.stringify(rule.body),
    });
  }

  async sync(): Promise<void> {
    const res = await fetch(
      `http://localhost:${STUB_API_PORT}/__e2e/state/${encodeURIComponent(this.id)}`,
      {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ rules: this.rules }),
      },
    );
    if (!res.ok) throw new Error(`stub API refused state for ${this.id}: ${res.status}`);
  }

  async dispose(): Promise<void> {
    await fetch(`http://localhost:${STUB_API_PORT}/__e2e/state/${encodeURIComponent(this.id)}`, {
      method: 'DELETE',
    });
  }

  /** Browser requests no rule answered; a test fails when this is not empty. */
  get missing(): readonly string[] {
    return this.unmatched;
  }
}

async function install(context: BrowserContext, page: Page, api: Api): Promise<void> {
  await context.addCookies(
    [CUSTOMER_URL, BRAIDER_URL].map((url) => ({ name: 'hp-e2e', value: api.id, url })),
  );
  await page.route(/\/(api|sanctum)\//, (route, request) => api.handle(route, request));
  await page.clock.setSystemTime(TODAY);
  await api.sync();
}

export const test = base.extend<{ api: Api }>({
  api: async ({ context, page }, use, testInfo) => {
    const api = new Api(`${testInfo.workerIndex}-${testInfo.testId}-${testInfo.retry}`);
    await install(context, page, api);
    await use(api);
    await api.dispose();
    if (api.missing.length) {
      throw new Error(`Requests without an e2e rule:\n${api.missing.join('\n')}`);
    }
  },
});

export { expect } from '@playwright/test';
