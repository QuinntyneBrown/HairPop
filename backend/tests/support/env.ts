export const API_PORT = Number(process.env.API_TEST_PORT ?? 8001);
export const API_URL = `http://localhost:${API_PORT}`;

export function testDatabaseUrl(): string {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error(
      'TEST_DATABASE_URL is not set. Copy .env.example to .env or run in docker compose.',
    );
  }
  return url;
}
