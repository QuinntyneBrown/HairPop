#!/usr/bin/env node
// Component perf test runner.
//
// Serves the perf-test scenario app (`frontend/projects/perf-test`), renders each scenario in
// Chromium with the V8 CPU profiler running, and compares the branch against a baseline build.
// See AGENTS.md, "Component perf tests — mandatory".
//
//   node perf-test/run.mjs [--dist <dir>] [--baseline <dir>] [--scenarios A,B] [--runs 5]
//                          [--fail-on-regression] [--out perf-results]

import { chromium } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const e2eRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_ITERATIONS = 50;
const LOAD_TIMEOUT_MS = 60_000;
/** A Possible regression is a median more than this fraction slower... */
const REGRESSION_RATIO = 0.1;
/** ...and at least this many milliseconds slower, with no overlap between runs. */
const REGRESSION_MIN_MS = 1;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

const USAGE = `Usage: node perf-test/run.mjs [options]

  --dist <dir>            perf-test browser build of the branch
                          (default ../frontend/dist/perf-test/browser)
  --baseline <dir>        perf-test browser build of the base branch (optional)
  --scenarios <A,B>       only run these scenarios
  --runs <n>              runs per scenario and build (default 5)
  --fail-on-regression    exit non-zero on a Possible regression or a failed scenario
  --out <dir>             where profiles and summary.md go (default perf-results)
  --help                  show this help`;

const { values: options } = parseArgs({
  options: {
    dist: { type: 'string' },
    baseline: { type: 'string' },
    scenarios: { type: 'string' },
    runs: { type: 'string', default: '5' },
    'fail-on-regression': { type: 'boolean', default: false },
    out: { type: 'string' },
    help: { type: 'boolean', default: false },
  },
});

if (options.help) {
  console.log(USAGE);
  process.exit(0);
}

const distDir = options.dist
  ? resolve(options.dist)
  : resolve(e2eRoot, '../frontend/dist/perf-test/browser');
const baselineDir = options.baseline ? resolve(options.baseline) : null;
const outDir = options.out ? resolve(options.out) : resolve(e2eRoot, 'perf-results');
const runs = Number(options.runs);
const filter = options.scenarios
  ? options.scenarios
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
  : null;

if (!Number.isInteger(runs) || runs < 1) {
  fail(`--runs must be a positive integer, got "${options.runs}"`);
}

const iterationsConfig = (
  await import(pathToFileURL(join(e2eRoot, 'perf-test/config/scenario-iterations.mjs')).href)
).default;

await assertBuild(distDir, '--dist');
if (baselineDir) {
  await assertBuild(baselineDir, '--baseline');
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const builds = [{ label: 'branch', dir: distDir }];
if (baselineDir) {
  builds.push({ label: 'base', dir: baselineDir });
}

const browser = await chromium.launch();
try {
  for (const build of builds) {
    build.server = await serve(build.dir);
    build.origin = build.server.origin;
    build.scenarios = await discover(build.origin);
    console.error(`${build.label}: ${build.scenarios.length} scenarios at ${build.dir}`);
  }

  const branch = builds[0];
  const base = builds[1] ?? null;
  let names = branch.scenarios;
  if (filter) {
    const unknown = filter.filter((name) => !branch.scenarios.includes(name));
    if (unknown.length > 0) {
      fail(`Unknown scenario(s): ${unknown.join(', ')}`);
    }
    names = names.filter((name) => filter.includes(name));
  }
  const removed = base
    ? base.scenarios.filter(
        (name) => !branch.scenarios.includes(name) && (!filter || filter.includes(name)),
      )
    : [];

  const rows = [];
  for (const name of names) {
    const iterations = iterationsFor(name);
    const samples = { branch: [], base: [] };
    const errors = { branch: null, base: null };
    const inBase = base?.scenarios.includes(name) ?? false;

    for (let run = 1; run <= runs; run++) {
      // Alternate which build goes first so drift on the machine affects both equally.
      const order = run % 2 === 1 ? [branch, base] : [base, branch];
      for (const build of order) {
        if (!build || (build === base && !inBase)) continue;
        if (errors[build.label]) continue;
        const result = await measure(build, name, iterations, run);
        if (result.error) {
          errors[build.label] = result.error;
        } else {
          samples[build.label].push(result.renderMs);
        }
      }
    }

    const row = classify({ name, iterations, samples, errors, hasBase: Boolean(base), inBase });
    rows.push(row);
    console.error(
      `${name.padEnd(24)} ${String(iterations).padStart(5)}x  ` +
        `branch ${formatMs(row.branch.median)}  base ${formatMs(row.base.median)}  ${row.result}`,
    );
  }

  for (const name of removed) {
    rows.push({
      name,
      iterations: iterationsFor(name),
      branch: summarize([]),
      base: summarize([]),
      result: 'Removed from branch',
      failure: true,
      regression: false,
    });
  }

  const summary = renderSummary(rows, { runs, hasBase: Boolean(base) });
  console.log(summary);
  await writeFile(join(outDir, 'summary.md'), summary);
  await writeFile(
    join(outDir, 'results.json'),
    JSON.stringify({ runs, dist: distDir, baseline: baselineDir, rows }, null, 2),
  );

  const renderFailures = rows.filter((row) => row.renderFailure);
  const flagged = rows.filter((row) => row.regression || row.failure);
  if (renderFailures.length > 0) {
    console.error(`${renderFailures.length} scenario(s) failed to render.`);
    process.exitCode = 1;
  }
  if (options['fail-on-regression'] && flagged.length > 0) {
    console.error(
      `${flagged.length} scenario(s) flagged: ${flagged.map((row) => row.name).join(', ')}`,
    );
    process.exitCode = 1;
  }
} finally {
  await browser.close();
  for (const build of builds) {
    build.server?.close();
  }
}

// ---------------------------------------------------------------------------------------------

function iterationsFor(name) {
  const value = iterationsConfig[name];
  return Number.isInteger(value) && value > 0 ? value : DEFAULT_ITERATIONS;
}

async function discover(origin) {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto(`${origin}/?list=1`);
    await page.waitForFunction(() => window.__perf?.done === true, null, {
      timeout: LOAD_TIMEOUT_MS,
    });
    const names = await page.evaluate(() => window.__perfScenarios ?? null);
    if (!Array.isArray(names)) {
      const perf = await page.evaluate(() => window.__perf);
      throw new Error(`Scenario discovery failed at ${origin}: ${perf?.error ?? 'no list'}`);
    }
    return names;
  } finally {
    await context.close();
  }
}

async function measure(build, name, iterations, run) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const cdp = await context.newCDPSession(page);
  try {
    await cdp.send('Profiler.enable');
    await cdp.send('Profiler.start');
    const url = `${build.origin}/?scenario=${encodeURIComponent(name)}&iterations=${iterations}`;
    await page.goto(url);
    await page.waitForFunction(() => window.__perf?.done === true, null, {
      timeout: LOAD_TIMEOUT_MS,
    });
    const perf = await page.evaluate(() => window.__perf);
    const { profile } = await cdp.send('Profiler.stop');
    const dir = join(outDir, build.label);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, `${name}-run${run}.cpuprofile`), JSON.stringify(profile));

    if (perf.error) {
      return { error: perf.error };
    }
    if (typeof perf.renderMs !== 'number' || !Number.isFinite(perf.renderMs)) {
      return { error: pageErrors[0] ?? 'No render time was reported' };
    }
    return { renderMs: perf.renderMs };
  } catch (error) {
    return { error: pageErrors[0] ?? (error instanceof Error ? error.message : String(error)) };
  } finally {
    await cdp.detach().catch(() => {});
    await context.close();
  }
}

function summarize(values) {
  if (values.length === 0) {
    return { samples: [], median: null, min: null, max: null };
  }
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  return { samples: values, median, min: sorted[0], max: sorted[sorted.length - 1] };
}

function classify({ name, iterations, samples, errors, hasBase, inBase }) {
  const branch = summarize(samples.branch);
  const base = summarize(samples.base);
  const row = { name, iterations, branch, base, regression: false, failure: false };

  if (errors.branch) {
    return {
      ...row,
      result: `Failed: ${errors.branch}`,
      failure: true,
      renderFailure: true,
    };
  }
  if (!hasBase) {
    return { ...row, result: 'measured' };
  }
  if (!inBase) {
    return { ...row, result: 'new' };
  }
  if (errors.base) {
    return { ...row, result: `new (base failed: ${errors.base})` };
  }

  const delta = branch.median - base.median;
  row.deltaMs = delta;
  row.deltaPct = base.median > 0 ? delta / base.median : 0;
  if (
    delta > base.median * REGRESSION_RATIO &&
    delta >= REGRESSION_MIN_MS &&
    branch.min > base.max
  ) {
    return { ...row, result: 'Possible regression', regression: true };
  }
  if (
    -delta > base.median * REGRESSION_RATIO &&
    -delta >= REGRESSION_MIN_MS &&
    branch.max < base.min
  ) {
    return { ...row, result: 'Faster' };
  }
  return { ...row, result: 'No change' };
}

function formatMs(value) {
  return value === null || value === undefined ? '–' : `${value.toFixed(1)} ms`;
}

function formatDelta(row) {
  if (row.deltaMs === undefined) return '–';
  const sign = row.deltaMs >= 0 ? '+' : '−';
  const pct = (Math.abs(row.deltaPct) * 100).toFixed(1);
  return `${sign}${Math.abs(row.deltaMs).toFixed(1)} ms (${sign}${pct}%)`;
}

function renderSummary(rows, { runs, hasBase }) {
  const lines = [
    '## Component perf test',
    '',
    hasBase
      ? `Median render time of ${runs} runs per scenario, branch against base. A **Possible regression** is a median more than 10% and at least 1 ms slower, with no overlap between runs.`
      : `Median render time of ${runs} runs per scenario. No baseline was given.`,
    '',
    '| Scenario | Iterations | Base median | Branch median | Δ | Result |',
    '| --- | ---: | ---: | ---: | ---: | --- |',
  ];
  for (const row of rows) {
    const result = row.regression ? `**${row.result}**` : row.result;
    lines.push(
      `| ${row.name} | ${row.iterations} | ${formatMs(row.base.median)} | ${formatMs(row.branch.median)} | ${formatDelta(row)} | ${result.replaceAll('|', '\\|')} |`,
    );
  }
  const regressions = rows.filter((row) => row.regression).length;
  const failures = rows.filter((row) => row.failure).length;
  lines.push(
    '',
    `${rows.length} scenarios · ${regressions} possible regressions · ${failures} failures`,
    '',
  );
  return lines.join('\n');
}

async function assertBuild(dir, flag) {
  try {
    await stat(join(dir, 'index.html'));
  } catch {
    fail(
      `${flag}: no index.html in ${dir}. Build it with: NG_BUILD_MANGLE=0 npx ng build perf-test`,
    );
  }
}

/** A static file server with an index.html fallback, on a free port. */
function serve(root) {
  const server = createServer(async (request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    let file = normalize(join(root, pathname));
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    let info = await stat(file).catch(() => null);
    if (info?.isDirectory()) {
      file = join(file, 'index.html');
      info = await stat(file).catch(() => null);
    }
    if (!info?.isFile()) {
      file = join(root, 'index.html');
    }
    response.writeHead(200, {
      'Content-Type': MIME_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    createReadStream(file).pipe(response);
  });
  return new Promise((resolveServer, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolveServer({ origin: `http://127.0.0.1:${port}`, close: () => server.close() });
    });
  });
}

function fail(message) {
  console.error(message);
  console.error('');
  console.error(USAGE);
  process.exit(2);
}
