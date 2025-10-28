# Error Handling Specification

This document summarizes how authentication-related errors flow through the application and outlines the shared conventions for returning and rendering error information.

---

## Overview

- **Goal:** Deliver consistent, user-friendly errors while keeping transport format decoupled from UI text.
- **Key layers:** Next.js route handlers (Hono), shared error dictionaries, client endpoints, and React components.

---

## Error Data Sources

### Server (API Route Handlers)

- `app/api/v1/[[...route]]/route.ts` defines a global `onError` handler on the Hono app:
  - Maps known exceptions to a JSON payload `{ error: { code, message, details? } }`.
  - Uses shared codes from `ERROR_CODES` and minimal messages from `COMMON_ERROR_MESSAGES`.
- `app/api/v1/[[...route]]/routes/auth.ts` raises `ApiError` with the domain-specific code `"EMAIL_ALREADY_EXISTS"` when appropriate.

### Shared Dictionaries

- `errors/codes.ts` contains the canonical list of machine-friendly codes.
- `errors/messages.ts` provides reusable Japanese strings for network, validation, or internal failures.
- `features/routes/auth/errors.ts` centralizes authentication-specific UI messages and maps error codes to display strings.

### Client Endpoints

- `features/routes/auth/endpoints.ts` wraps API calls:
  - `postSignUp` inspects `response.json()` and resolves a display message using `AUTH_ERROR_CODE_MESSAGES` with a fallback (`AUTH_ERROR_MESSAGES.SIGNUP_FAILED`).
  - `postSignIn` handles NextAuth responses and reuses the same dictionary for consistency.

### UI Components

- `features/routes/auth/components/sign-in-form.tsx` & `sign-up-form.tsx` consume endpoint results and show messages via `ErrorAlert`.
- `app/auth/signin/page.tsx` translates NextAuth query parameters using `NEXTAUTH_ERROR_CODES`.

---

## Flow Summary

1. **Server Detection**
   - API logic throws `ApiError(code, message, status)` for domain-specific issues (e.g., duplicate email).
   - Framework exceptions bubble into the global `onError`, which emits standardized codes (`VALIDATION_ERROR`, `HTTP_ERROR`, `INTERNAL_SERVER_ERROR`).

2. **Response Payload**
   - Every failure returns `{ error: { code, message } }` plus optional `details` for Zod issues.
   - Messages are minimal; UI decides final wording.

3. **Client Mapping**
   - `postSignUp`/`postSignIn` map `error.code` through `AUTH_ERROR_CODE_MESSAGES`.
   - Unknown codes fall back to `AUTH_ERROR_MESSAGES.SIGNUP_FAILED` or network messaging.

4. **Display**
   - React forms keep message state and render `ErrorAlert`.
   - Initial NextAuth errors are pre-mapped on the page component before the form mounts.

---

## Guidelines

1. **Add new error codes**
   - Define them in `errors/codes.ts`.
   - Choose minimal server message in `errors/messages.ts` (if shared).
   - Extend domain mapping in `features/routes/auth/errors.ts`.

2. **Throwing errors on the server**
   - Prefer `ApiError` with a known code and HTTP status.
   - Let the global `onError` handle Zod and framework exceptions.

3. **Client handling**
   - Always access `error.code` when available. Fallback to generic messages when the code is unknown.
   - Avoid hardcoding server messages in components; rely on the shared dictionary.

4. **Future work**
   - Introduce domain-specific `error.tsx` files if page-level recovery UI is needed.
   - Extend dictionaries when new features share the same codes.

---

Following this specification keeps the transport format stable, avoids repeated literal strings across the app, and ensures the UI can localize or adjust copy without touching server logic.
