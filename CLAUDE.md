# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is a Vue 3 + TypeScript + Vite app with `vue-router` set up (`src/router/index.ts`). There is no other state management beyond Vue composables — no Vuex/Pinia.

There are two independent areas, each lazy-loaded by route so their code stays in separate chunks:

- **Store** (`src/modules/product/`): the public, unauthenticated storefront at `/`. Reads-only against the backend.
- **Admin** (`src/modules/admin/`): the product management panel, mounted at `/admin` behind a login (`/admin/login`). Client-side JWT auth only (see "Backend API" below) — the router's `beforeEach` in `src/router/index.ts` guards routes via `meta.requiresAuth`/`meta.guestOnly`, checking `isAuthenticated` from `src/modules/admin/composables/useAuth.ts`. The store never links to `/admin`; keep it that way.

Shared, non-module-specific code (e.g. the API base URL) lives in `src/shared/`.

When adding features, follow the existing per-component folder convention (`components/Name/Name.vue` + `Name.css`, `<style scoped src="./Name.css">`) rather than flat files.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`vue-tsc -b`) then build for production; **this is the only type-checking command**, there is no separate `typecheck`/`lint` script
- `npm run preview` — preview the production build locally

There is no test runner and no lint script configured in `package.json`.

## Backend API

This client talks to a separate NestJS + PostgreSQL (TypeORM) backend. Full endpoint reference, DTOs, and gotchas are documented in `API_CONTEXT.md` (in Spanish) — read it before writing any API integration code. Key points:

- Dev backend base URL: `http://localhost:8080` (falls back to 3000 if `PORT` isn't set in the backend's `.env`). All routes have the global prefix `/api` (e.g. `http://localhost:8080/api/product`).
- **CORS is not enabled on the backend.** If this frontend runs on a different origin/port, the backend needs `app.enableCors(...)` added to its `src/main.ts` before the browser can call the API. In dev this is worked around with the Vite proxy in `vite.config.ts` (`/api` → `http://localhost:8080`, same prefix on both sides, no path rewrite).
- Auth is a single stateless JWT with no refresh token, no logout endpoint, and no `/auth/me` — the admin panel decodes the JWT (`src/modules/admin/utils/jwt.ts`) to check expiry and read the email, and persists it in `localStorage` (`src/modules/admin/composables/useAuth.ts`). There's exactly one admin user for the whole system (no roles, no multi-user).
- Product IDs and user IDs are `string` (Postgres `bigint`) — never cast them to `number`.
- `GET /product` has no pagination and excludes soft-deleted products; there's no way to list or restore deleted products via the API.
- Product create/update use `multipart/form-data` (fields + optional `image` file field), not JSON.
- Validation errors come back as `{ statusCode, message, error }`, where `message` is an array of strings on validation failures (global `ValidationPipe` with `whitelist: true` + `forbidNonWhitelisted: true` — extra body fields cause a 400).
