/**
 * Declarative API rules shared by the stub server (SSR requests) and the browser route handler
 * (ADR 0004). A rule answers one method and path, optionally only for matching query values.
 *
 * @typedef {{
 *   method: string, path: string, query?: Record<string, string | null>,
 *   status?: number, body?: unknown, headers?: Record<string, string>,
 *   delayMs?: number, times?: number,
 * }} ApiRule
 */

/**
 * Finds the rule for a request. Later rules win, so a test overrides the defaults by adding
 * rules. A rule with `times` is consumed; once used up it no longer matches.
 *
 * @param {ApiRule[]} rules
 * @param {string} method
 * @param {URL} url
 * @returns {ApiRule | undefined}
 */
export function match(rules, method, url) {
  for (let i = rules.length - 1; i >= 0; i--) {
    const rule = rules[i];
    if (rule.method !== method || rule.path !== url.pathname) continue;
    if (rule.query && !queryMatches(rule.query, url.searchParams)) continue;
    if (rule.times !== undefined) {
      if (rule.times <= 0) continue;
      rule.times -= 1;
    }
    return rule;
  }
  return undefined;
}

/** @param {Record<string, string | null>} expected @param {URLSearchParams} actual */
function queryMatches(expected, actual) {
  return Object.entries(expected).every(([key, value]) =>
    value === null ? !actual.has(key) : actual.get(key) === value,
  );
}

/** Rules every state starts with: CSRF cookie available, nobody signed in. */
export const DEFAULT_RULES = [
  {
    method: 'GET',
    path: '/api/auth/csrf',
    status: 204,
    headers: { 'set-cookie': 'XSRF-TOKEN=e2e-xsrf-token; Path=/' },
  },
  { method: 'GET', path: '/api/session', status: 401, body: { message: 'Unauthenticated.' } },
  { method: 'GET', path: '/api/notifications/unread-count', body: { count: 0 } },
];

/** The body sent when no rule matches, so a missing stub is obvious. */
export function unmatchedBody(method, url) {
  return { message: `No e2e rule for ${method} ${url.pathname}${url.search}` };
}
