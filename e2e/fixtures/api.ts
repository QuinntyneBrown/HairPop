import { fileURLToPath } from 'node:url';

import { test as base, BrowserContext, Page, Request, Route } from '@playwright/test';

import { BRAIDER_URL, CUSTOMER_URL, MEDIA_ORIGIN, STUB_API_PORT } from './urls';
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

  constructor(
    readonly id: string,
    private readonly context: BrowserContext,
  ) {}

  /** Cuts or restores the browser's connection (offline states, L2-036 AC5). */
  async setOffline(offline: boolean): Promise<void> {
    this.offline = offline;
    await this.context.setOffline(offline);
  }

  private offline = false;

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
    if (this.offline) {
      // Route handlers run before the network, so an offline context must fail requests here.
      await route.abort('internetdisconnected');
      return;
    }
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
  // Fixture media URLs resolve to the mock photos (docs/mocks/assets/photos).
  await page.route(`${MEDIA_ORIGIN}/**`, (route, request) => {
    const name = new URL(request.url()).pathname.split('/').pop() ?? '';
    const file = new URL(`../../docs/mocks/assets/photos/${name}`, import.meta.url);
    return route.fulfill({ path: fileURLToPath(file) });
  });
  await page.clock.setSystemTime(TODAY);
  await api.sync();
}

export const test = base.extend<{ api: Api }>({
  // A navigation resolves once the server-rendered document loads, but the app is only
  // interactive after hydration: input sent earlier is lost to a native form submit or a full
  // page load. Wait for the marker the shell sets once the browser has rendered.
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page);
    page.goto = async (...args: Parameters<typeof goto>) => {
      const response = await goto(...args);
      await page.locator('hp-root[data-hydrated]').waitFor({ state: 'attached' });
      return response;
    };
    await use(page);
  },
  api: async ({ context, page }, use, testInfo) => {
    const api = new Api(`${testInfo.workerIndex}-${testInfo.testId}-${testInfo.retry}`, context);
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      // Error statuses a test asks for are logged by the browser; anything else is a defect.
      if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
        consoleErrors.push(message.text());
      }
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));
    await install(context, page, api);
    await use(api);
    await api.dispose();
    if (api.missing.length) {
      throw new Error(`Requests without an e2e rule:\n${api.missing.join('\n')}`);
    }
    if (consoleErrors.length) {
      throw new Error(`Console errors:\n${consoleErrors.join('\n')}`);
    }
  },
});

export { expect } from '@playwright/test';
