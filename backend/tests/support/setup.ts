import { beforeEach } from 'vitest';
import { resetDatabase } from './db';

try {
  process.loadEnvFile('.env');
} catch {
  // docker compose and CI provide the environment instead.
}

beforeEach(async () => {
  await resetDatabase();
});
