# 0009 — Email through a transactional outbox drained by the worker

- Status: accepted
- Date: 2026-10-12
- Amends: [0007](0007-backend-nextjs-postgres-prisma.md) (background work)

## Context

Verification links, password resets and sign-in reminders (L2-010, L2-012, L2-013) must be sent by email. Sending from a route handler ties the request to a mail server's latency and failures, and an email sent before its transaction commits can carry a token that was never stored. ADR 0007 planned a pg-boss worker for background work; email is the only job so far.

## Decision

- An action that sends mail inserts an `OutboundEmail` row in the same transaction as the state it describes. Nothing is sent from the API.
- A separate worker process (`npm run worker`, `backend/worker/main.ts`) claims due rows with `SELECT … FOR UPDATE SKIP LOCKED`, sends them over SMTP (`SMTP_URL`, `MAIL_FROM`) with Nodemailer, and stamps `sentAt`. Several workers can run at once without sending a row twice.
- A failed send is retried with exponential backoff (one minute doubling to an hour) up to eight attempts; `lastError` keeps the transport's message, never the email text.
- Once sent, the row's text is cleared, so a link token does not stay readable in the database (L2-039 AC3). Tokens themselves are stored only as SHA-256 hashes.
- Links point at `APP_ORIGIN`, the customer app's origin.
- pg-boss is not added: the outbox needs no broker or scheduler. It can be introduced when a job needs scheduling.
- Development runs Mailpit in docker compose; its inbox is at http://localhost:8025.

## Consequences

- Integration tests read queued emails from the `OutboundEmail` table; the worker's delivery is tested by calling its drain function with an in-memory transport.
- An email can be delayed by up to the worker's poll interval (two seconds) after its transaction commits, but it is never sent for a rolled-back change.
