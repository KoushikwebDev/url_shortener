# Project Context for LLMs
**State as of:** 2026-09-15

This document summarizes the current architecture, features, and design patterns implemented in this URL Shortener backend project. Provide this file to any LLM to quickly get it up to speed.

## Tech Stack
- **Environment:** Node.js (ES Modules enabled `"type": "module"`)
- **Framework:** Express.js
- **Database:** MySQL (via `mysql2` connection pool)
- **Security:** `bcrypt`, `jsonwebtoken`, `helmet`, `express-rate-limit`

## Architectural Patterns
- **Layered Architecture:** Routes (`src/routes`) -> Controllers (`src/controllers`) -> Services (`src/services`) -> Repositories (`src/repositories`).
- **Error Handling:** 
  - Flat controllers using a custom `asyncHandler` wrapper (no manual `try-catch` blocks).
  - Custom `ApiError` class to throw standardized HTTP errors.
  - Global `errorHandler` middleware at the end of the Express pipeline to intercept and format all errors into a consistent JSON response.
- **SQL Execution:** Parameterized queries via `pool.execute()` to prevent SQL injection. Specific field projection constants (`USER_PUBLIC_FIELDS`, `USER_LOGIN_FIELDS`) are used for `SELECT` queries.

## Completed Features
1. **Server Foundation:** Express app configured with `cors`, `helmet`, `cookie-parser`, and JSON body parsing.
2. **Dual-Token Authentication (JWT):**
   - **Access Token:** Short-lived (15m), stored in HTTP-only cookies, used to protect API routes via `verifyJWT` middleware.
   - **Refresh Token:** Long-lived (7d), stored in HTTP-only cookies and in the database, used for silent session renewals.
   - **Endpoints:** `/create-user`, `/login`, `/refresh-token`, `/logout`.
3. **Rate Limiting:**
   - **Global Limiter:** 10 requests per 15 minutes per IP applied to all `/api` routes.
   - **Auth Limiter:** Stricter limit of 5 requests per 15 minutes per IP applied to `/login` and `/create-user` routes to prevent credential stuffing.
4. **URL Module:**
   - Endpoints for `createUrl` and `deleteUrl`.
   - Global redirection handler (`GET /:shortCode`) at the app level.

## Knowledge Base
- **Learnings & Scalability:** Architectural notes (such as scaling the rate limiter with Redis) are maintained in `LEARNINGS.md`.

<!-- Docker -->
docker run --name url-shortener-redis \
  -p 6379:6379 \
  -d redis
  
docker exec -it url-shortener-redis redis-cli

