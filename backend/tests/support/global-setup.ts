import { execFileSync, spawn, type ChildProcess } from 'node:child_process';
import { createRequire } from 'node:module';
import { API_PORT, API_URL, testDatabaseUrl } from './env';

const require = createRequire(import.meta.url);

let server: ChildProcess | undefined;

export async function setup(): Promise<void> {
  try {
    process.loadEnvFile('.env');
  } catch {
    // docker compose and CI provide the environment instead.
  }
  const env = { ...process.env, DATABASE_URL: testDatabaseUrl(), NEXT_DIST_DIR: '.next-test' };

  execFileSync(process.execPath, [require.resolve('prisma/build/index.js'), 'migrate', 'deploy'], {
    env,
    stdio: 'inherit',
  });

  server = spawn(
    process.execPath,
    [require.resolve('next/dist/bin/next'), 'dev', '-p', String(API_PORT)],
    { env, stdio: ['ignore', 'inherit', 'inherit'] },
  );
  await waitForServer();
}

export async function teardown(): Promise<void> {
  if (!server?.pid) return;
  if (process.platform === 'win32') {
    execFileSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    server.kill('SIGTERM');
  }
}

async function waitForServer(): Promise<void> {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    try {
      await fetch(`${API_URL}/api/health-probe`);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error(`The test API did not start on ${API_URL}.`);
}
