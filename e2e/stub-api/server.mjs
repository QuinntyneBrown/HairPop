/**
 * Stub HTTP API for server-side rendering in e2e tests (ADR 0004). The customer SSR server
 * runs with API_ORIGIN pointing here. Each test registers its rules under an id and sets the
 * `hp-e2e` cookie to that id; SSR forwards the cookie, so every test gets its own answers.
 *
 *   PUT    /__e2e/state/:id   body { rules: ApiRule[] }
 *   DELETE /__e2e/state/:id
 *   GET    /__e2e/health
 */
import { createServer } from 'node:http';

import { DEFAULT_RULES, match, unmatchedBody } from './rules.mjs';

const PORT = Number(process.env.STUB_API_PORT ?? 4430);
const states = new Map();

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function send(res, status, body, headers = {}) {
  const payload = body === undefined ? '' : JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  res.end(payload);
}

function testId(req) {
  const cookie = req.headers.cookie ?? '';
  const found = cookie
    .split(';')
    .map((p) => p.trim())
    .find((p) => p.startsWith('hp-e2e='));
  return found ? decodeURIComponent(found.slice('hp-e2e='.length)) : null;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const control = url.pathname.match(/^\/__e2e\/state\/(.+)$/);
  if (url.pathname === '/__e2e/health') return send(res, 200, { ok: true });
  if (control && req.method === 'PUT') {
    const { rules } = JSON.parse(await readBody(req));
    states.set(decodeURIComponent(control[1]), rules);
    return send(res, 204);
  }
  if (control && req.method === 'DELETE') {
    states.delete(decodeURIComponent(control[1]));
    return send(res, 204);
  }
  await readBody(req);
  const id = testId(req);
  const rules = (id && states.get(id)) || DEFAULT_RULES;
  const rule = match(rules, req.method ?? 'GET', url);
  if (!rule) {
    console.warn(
      `[stub-api] ${id ?? 'no test id'}: ${req.method} ${url.pathname}${url.search} has no rule`,
    );
    return send(res, 404, unmatchedBody(req.method, url));
  }
  if (rule.delayMs) await new Promise((r) => setTimeout(r, rule.delayMs));
  send(res, rule.status ?? 200, rule.body, rule.headers);
});

server.listen(PORT, () => console.log(`stub API listening on http://localhost:${PORT}`));
