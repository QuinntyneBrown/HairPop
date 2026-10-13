# HairPop API

Next.js 15 route handlers (API only), PostgreSQL 16 and Prisma. See [ADR 0007](../docs/adr/0007-backend-nextjs-postgres-prisma.md) and [ADR 0008](../docs/adr/0008-session-auth-db-sessions-csrf.md).

## Layout

| Path                  | Holds                                                                            |
| --------------------- | -------------------------------------------------------------------------------- |
| `app/api/**/route.ts` | Thin route handlers: compose wrappers, parse input with Zod, call an action      |
| `src/http/`           | Wrappers (request log, error mapping, CSRF, auth) and the `ApiErrorBody` mapping |
| `src/application/`    | Application actions — business rules                                             |
| `src/domain/`         | Domain types and services                                                        |
| `src/infrastructure/` | Prisma client, repositories, password hashing, the email outbox                  |
| `src/worker/`         | Background jobs: email delivery from the outbox                                  |
| `worker/main.ts`      | The worker process (`npm run worker`)                                            |
| `prisma/`             | Schema, migrations and the idempotent seed                                       |
| `tests/`              | Integration tests that call the API over HTTP                                    |

## Run it

```bash
docker compose up -d                                # from the repository root: Postgres on :5433, API on :8000, worker, Mailpit on :8025
docker compose exec api npx prisma migrate deploy   # migrations never run on startup
docker compose exec api npx prisma db seed          # idempotent; safe to re-run
```

The seed loads the cast from `docs/mocks/README.md`: four styles, Help/Terms/Privacy, Nia Okafor, Aisha Mensah, Jules Baptiste and Amara Adeyemi-Williams with services, Nia's portfolio, offered times, preparation and care guidance, published reviews, and the appointments HP-1048 (awaiting reply), HP-0992 (completed and reviewed), HP-1052, HP-1031 with Zara's pending change and Jules's declined request, plus Maya's notifications. Seeded accounts — `maya.chen@example.com` (customer) and `nia.okafor@example.com` (braider), among others — share the development password `hairpop-dev-password`, or `SEED_PASSWORD` when set. Passwords are hashed only when an account is first created.

## Email and the worker

Actions that send email write an `OutboundEmail` row in their own transaction; the worker delivers it over SMTP and clears its text ([ADR 0009](../docs/adr/0009-email-outbox-worker.md)). Docker compose runs the worker against Mailpit, so verification and reset links appear at http://localhost:8025. Outside Docker, set `SMTP_URL` and run `npm run worker`.

## Test it

```bash
docker compose exec api npm test
```

`npm test` applies migrations to `TEST_DATABASE_URL`, starts a test API on port 8001 against it and runs the Vitest integration tests. Each test truncates the test database and arranges its own state. Outside Docker, copy `.env.example` to `.env`, start the `db` service and run `npm test` here.

`npm run lint`, `npm run format:check` and `npm run typecheck` must pass too.
