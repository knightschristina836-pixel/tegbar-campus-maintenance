# Tegbar Backend

Initial backend foundation for the Hawassa University Institute of Technology
campus maintenance and complaint management system.

## Current increment

This scaffold provides the modular source tree, typed runtime configuration,
PostgreSQL connection pool, an idempotent SQL migration runner, the initial
relational schema, a minimal Express health endpoint, and TypeScript/Jest
configuration. It intentionally does not yet implement authentication,
business APIs, Socket.IO events, or feature behavior; those are subsequent
increments after review of the schema and architecture.

## Requirements

- Node.js 20 or newer
- PostgreSQL 14 or newer

## Setup

1. Create a PostgreSQL database named `tegbar` (or choose another name).
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and a `JWT_SECRET` of
   at least 32 characters.
3. Install dependencies with `npm install`.
4. Apply migrations with `npm run db:migrate`.
5. Start the development server with `npm run dev`.

The API health check is available at `GET /health`. The server verifies the
PostgreSQL connection before listening.

## Scripts

- `npm run dev` — development server with TypeScript watch/reload.
- `npm run build` — compile `src` to `dist`.
- `npm start` — run the compiled production server.
- `npm run typecheck` — TypeScript check without emitting files.
- `npm run db:migrate` — apply unapplied SQL migrations.
- `npm run db:migrate:prod` — apply migrations from the compiled production
  build (run `npm run build` first).
- `npm test` — run Jest tests.

## Architecture

- `src/config` — validated environment configuration.
- `src/database` — PostgreSQL pool and versioned SQL migrations.
- `src/controllers`, `src/services`, `src/routes` — HTTP adapters, business
  logic, and route registration (to be implemented incrementally).
- `src/middleware`, `src/validators`, `src/types`, `src/utils` — shared API
  concerns.
- `src/socket` — future Socket.IO integration.
- `src/uploads` — local development upload location; uploaded files are ignored
  by Git.
- `tests` — Jest test suite.

The initial schema models the canonical location path as campus → block →
floor → room. Buildings are associated with a campus and can optionally group
blocks; the block-to-floor-to-room path remains explicit. Room QR identifiers
are stored on the room record so later QR lookup feeds directly into complaint
creation rather than forming an independent location system.

The four user roles and report statuses are PostgreSQL enums. The schema also
includes reports/images, assignments, status history, duplicate links,
notifications, schedules, notices, reporter repair verification, and
technician work records. The migration seeds the single target campus.

## Initial review boundary

Please review the schema and project structure before the next increment.
Authentication and role policy, feature routes/services, upload handling, and
real-time notification delivery are intentionally not included yet.
