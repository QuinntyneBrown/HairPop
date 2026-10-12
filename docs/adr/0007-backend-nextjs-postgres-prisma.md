# 0007 — Backend on Node.js, Next.js, PostgreSQL and Prisma

- Status: accepted
- Date: 2026-10-12

## Context

The planned backend was PHP 8.3 / Laravel 11. No backend code had landed, so the stack can change without migrating code. The frontend is Angular and the e2e suite mocks the API (ADR 0004), so the backend only has to honour the API contracts in `docs/detailed-designs/`.

## Decision

- **Runtime and framework.** Node.js 22 LTS with Next.js 15 (App Router), used only as an API: route handlers in `backend/app/api/**/route.ts`, no pages. Angular stays the only user interface.
- **Layering.** A route handler is thin: it parses input with Zod, applies auth and calls an application action. Business rules live in application actions and domain services (`backend/src/application`, `backend/src/domain`). Prisma repositories live in `backend/src/infrastructure`.
- **Cross-cutting handling.** Route handlers are composed from wrappers. Auth is deny-by-default (`withAuth`); anonymous routes opt in explicitly. The request-logging wrapper sits outside the error-mapping wrapper so handled statuses are logged. Errors are always JSON `ApiErrorBody`.
- **Database.** PostgreSQL 16 through the Prisma ORM. Migrations run explicitly with `prisma migrate deploy`, never on startup. Seeding uses `prisma db seed` with upserts so it is safe to re-run.
- **Background work.** A separate worker process uses pg-boss, a queue stored in PostgreSQL, so no extra broker is needed.
- **Tests.** Backend integration tests use Vitest and call the running API over HTTP against a test database: `docker compose exec api npm test`.

## Consequences

- Authentication can no longer use Laravel Sanctum; ADR 0008 replaces ADR 0003.
- Detailed designs name Next.js route handlers, application actions and PostgreSQL in their C4 views.
- Backend and frontend share one language (TypeScript), but API contract types are still owned by the `api` library on the frontend and by the backend separately; neither imports the other.
