# HairPop API

Next.js 15 route handlers (API only), PostgreSQL 16 and Prisma. See [ADR 0007](../docs/adr/0007-backend-nextjs-postgres-prisma.md) and [ADR 0008](../docs/adr/0008-session-auth-db-sessions-csrf.md).

## Layout

| Path                  | Holds                                                                            |
| --------------------- | -------------------------------------------------------------------------------- |
| `app/api/**/route.ts` | Thin route handlers: compose wrappers, parse input with Zod, call an action      |
| `src/http/`           | Wrappers (request log, error mapping, CSRF, auth) and the `ApiErrorBody` mapping |
| `src/application/`    | Application actions — business rules                                             |
| `src/domain/`         | Domain types and services                                                        |
| `src/infrastructure/` | Prisma client, repositories, password hashing                                    |
| `prisma/`             | Schema, migrations and the idempotent seed                                       |
| `tests/`              | Integration tests that call the API over HTTP                                    |

## Run it

```bash
docker compose up -d                                # from the repository root: Postgres on :5433, API on :8000
docker compose exec api npx prisma migrate deploy   # migrations never run on startup
docker compose exec api npx prisma db seed          # idempotent; safe to re-run
```

## Test it

```bash
docker compose exec api npm test
```

`npm test` applies migrations to `TEST_DATABASE_URL`, starts a test API on port 8001 against it and runs the Vitest integration tests. Each test truncates the test database and arranges its own state. Outside Docker, copy `.env.example` to `.env`, start the `db` service and run `npm test` here.

`npm run lint`, `npm run format:check` and `npm run typecheck` must pass too.
