# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is a fresh Vue 3 + TypeScript + Vite scaffold (still close to the default `create-vue` template — `App.vue` only renders `HelloWorld`). There is no routing, state management, or API client set up yet. When adding features, you're establishing the initial architecture, not following an existing pattern.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`vue-tsc -b`) then build for production; **this is the only type-checking command**, there is no separate `typecheck`/`lint` script
- `npm run preview` — preview the production build locally

There is no test runner and no lint script configured in `package.json`.

## Backend API

This client talks to a separate NestJS + PostgreSQL (TypeORM) backend. Full endpoint reference, DTOs, and gotchas are documented in `API_CONTEXT.md` (in Spanish) — read it before writing any API integration code. Key points:

- Dev backend base URL: `http://localhost:8080` (falls back to 3000 if `PORT` isn't set in the backend's `.env`).
- **CORS is not enabled on the backend.** If this frontend runs on a different origin/port, the backend needs `app.enableCors(...)` added to its `src/main.ts` before the browser can call the API.
- Auth is a single stateless JWT with no refresh token, no logout endpoint, and no `/auth/me` — if the UI needs to know who's logged in, decode the JWT from login or store the email client-side. There's exactly one admin user for the whole system (no roles, no multi-user).
- Product IDs and user IDs are `string` (Postgres `bigint`) — never cast them to `number`.
- `GET /product` has no pagination and excludes soft-deleted products; there's no way to list or restore deleted products via the API.
- Product create/update use `multipart/form-data` (fields + optional `image` file field), not JSON.
- Validation errors come back as `{ statusCode, message, error }`, where `message` is an array of strings on validation failures (global `ValidationPipe` with `whitelist: true` + `forbidNonWhitelisted: true` — extra body fields cause a 400).
