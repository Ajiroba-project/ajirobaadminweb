# Security Audit & Recommendations

This document summarizes the security review of the ajirobaadminweb project and the measures taken to reduce exposure and vulnerability.

---

## Fixes Applied

### 1. **Secrets & environment**
- **`.gitignore`**: Added `.env`, `.env.development`, and `.env.production` so environment files (and secrets) are not committed. Only `.env*.local` was ignored before.
- **Action**: Ensure `.env` is never committed. Use `.env.example` (without real values) for documentation.

### 2. **Hardcoded API / image URLs**
- **Issue**: Hardcoded base URLs (`https://ajiroba.onrender.com/v1`, `https://staging.ajiroba.ng`) in:
  - `AuctionDealsTable.tsx` – confirm redeemed ticket
  - `RechargeDealsTable.tsx` – confirm redeemed ticket
  - `RegularsDealTable.tsx` – confirm redeemed ticket
  - `ProductsbillCard.tsx`, `ProductsCard.tsx`, `UserSearch.tsx` – image URLs
- **Fix**: All these now use `process.env.NEXT_PUBLIC_BASE_URL` or `process.env.NEXT_PUBLIC_BASE_URL_IMG`. Backend auth header was also aligned to `Token` (was `Bearer` in some places).

### 3. **Cookie security**
- **Issue**: Token and “remembered email” cookies were set without `sameSite` or `secure`.
- **Fix**: In `signin/page.tsx`, cookies are now set with:
  - `sameSite: 'strict'` to reduce CSRF risk.
  - `secure: true` when the page is served over HTTPS (so cookies are not sent over plain HTTP).

### 4. **API route input validation**
- **Issue**: `read_notification/[notif_id]/route.ts` forwarded `notif_id` to the backend without validation, which could allow unexpected values or path-like input.
- **Fix**: Added `isValidNotifId()` so only numeric or UUID-style IDs are accepted. Invalid IDs return 400 before any backend call.

---

## Recommendations (ongoing)

### Authentication & tokens
- **Token in request body**: `likepost/route.js` sends the token in the JSON body (`body.tkn`). Prefer sending auth only via the `Authorization` header and avoid putting tokens in request bodies or URLs.
- **Token storage**: Tokens are stored in cookies (js-cookie). For maximum security, the backend should set the auth cookie with `HttpOnly` and `Secure` so JavaScript cannot read it. That requires backend changes; the frontend already uses `sameSite` and `secure` where applicable.
- **Consistency**: Use one auth scheme everywhere (e.g. `Authorization: Token <token>` or `Authorization: Bearer <token>`) and match what the backend expects.

### Environment variables
- **`BASE_URL` vs `NEXT_PUBLIC_BASE_URL`**: Some API routes use `process.env.BASE_URL` (server-only), others `process.env.NEXT_PUBLIC_BASE_URL`. Document which env vars are required and use them consistently. Do not expose server-only URLs to the client.
- **Fallbacks**: `customerpointshistory/route.js` falls back to `https://staging.ajiroba.ng/v1` if `NEXT_PUBLIC_BASE_URL` is missing. Prefer failing or warning in development instead of hardcoding a live URL.

### API routes (Next.js)
- **Auth on every protected route**: Ensure all routes that access admin or user data validate the token (e.g. from `Authorization` header or server-side cookie) and return 401 when missing or invalid.
- **IDs in URLs**: Validate all dynamic segments (e.g. `id`, `notif_id`, `slug`) before calling the backend: type, format, and length. Reject invalid values with 400.
- **Error handling**: Avoid returning stack traces or internal details to the client. Log details server-side and return generic messages.

### Client-side
- **XSS**: The only `innerHTML` usage found is in `exportUtils.ts` with a fixed string (“Generating PDF…”). Keep it that way; never assign user-controlled or unsanitized content to `innerHTML` or `dangerouslySetInnerHTML`.
- **Sensitive data**: Do not log tokens, passwords, or full request/response bodies in production. Remove or guard any `console.log` that might expose them.

### Infrastructure & deployment
- **HTTPS**: Use HTTPS in production so `secure` cookies and token transmission are safe.
- **CORS**: Configure the backend to allow only your frontend origin(s). Relying on “any origin” increases risk.
- **Rate limiting**: Protect auth and sensitive API routes (login, password reset, OTP, etc.) with rate limiting on the backend or edge to reduce brute-force and abuse.

### Dependencies
- Run `npm audit` (or `yarn audit`) regularly and fix high/critical issues.
- Keep Next.js and other dependencies up to date for security patches.

---

## Summary

- **Done**: Env files ignored by git; hardcoded URLs removed in favor of env vars; cookie options hardened; notification ID validated.
- **Recommended**: Prefer Authorization header over body for tokens; standardize env vars and auth scheme; validate all route params; avoid logging secrets; use HTTPS and CORS; add rate limiting on sensitive endpoints; maintain dependencies.

If you discover a vulnerability, please report it privately to the maintainers rather than opening a public issue.

---

## npm audit status (dependency vulnerabilities)

### Applied (reduced 17 → 6 reported issues)

- **Next.js**: Pinned to `14.2.35` (latest 14.x security patch).
- **eslint-config-next**: Pinned to `14.2.35` to match Next.
- **overrides**: `d3-color` → `^3.1.0` and `minimatch` → `^9.0.7` to address ReDoS in transitive deps.
- **npm audit fix**: Applied safe updates (e.g. axios, ajv, js-yaml and other transitive fixes).

Install command used: `npm install --legacy-peer-deps` and `npm audit fix --legacy-peer-deps` (peer conflicts exist with e.g. react-leaflet vs React 18).

### Remaining (require trade-offs or no fix)

| Package | Severity | Reason |
|--------|----------|--------|
| **jspdf** | Critical | Upgrade to 4.x would fix issues but `jspdf-autotable` only supports jspdf ^2 \|\| ^3. Mitigation: use jspdf only for client-side PDF generation with trusted input; avoid passing user-controlled paths or untrusted data into jspdf. |
| **next** | High | Some advisories (e.g. Image Optimizer DoS, RSC deserialization DoS) may be fully addressed only in Next 15+. Staying on 14.2.35 is the best patch level for 14.x. Plan an upgrade to 15+ when feasible. |
| **glob** (via eslint-config-next) | High | Patched in eslint-config-next@16; upgrading would be a breaking change. Low runtime impact (dev/lint only). |
| **xlsx** | High | **No fix available** from upstream. Mitigation: avoid parsing untrusted Excel files; if possible, consider replacing with a maintained alternative (e.g. exceljs) long term. |

Run `npm audit` and `npm audit fix --legacy-peer-deps` periodically. Use `npm audit fix --force` only after testing; it can introduce breaking changes.

---

## SEO (layout and metadata)

- **Root layout** (`src/app/layout.tsx`): Exports `metadata` and `viewport` for the whole app.
  - **metadata**: `title` (with template), `description`, `keywords`, `openGraph`, `twitter`, `robots` (admin app set to no-index).
  - **viewport**: `width`, `initialScale`, `maximumScale`, `themeColor`.
  - **metadataBase** uses `NEXT_PUBLIC_SITE_URL` (fallback: `https://ajiroba.ng`). Set this in production for correct canonical and OG URLs.
- **Per-route SEO**: Use the `metadata` export or `generateMetadata` in any `layout.tsx` or `page.tsx` to override or extend title/description for that route.

---

## Security headers (attack surface reduction)

- **Middleware** (`src/middleware.ts`): Adds security headers on matching requests:
  - `X-Frame-Options: DENY` – reduces clickjacking.
  - `X-Content-Type-Options: nosniff` – prevents MIME sniffing.
  - `Referrer-Policy: strict-origin-when-cross-origin` – limits referrer leakage.
  - `X-XSS-Protection: 1; mode=block` – legacy XSS filter.
  - `Permissions-Policy` – disables camera, microphone, geolocation, FLoC.
  - `Strict-Transport-Security` (HSTS) in production only.
- **next.config.mjs**: Same headers applied via `headers()` so static assets and API routes also get them. `poweredByHeader: false` to hide Next.js version.

---

## Slow-network and resilience

- **Loading UI**: `src/app/loading.tsx` (root) and `src/app/dashboard/loading.tsx` show a spinner during navigation or initial load so users on slow networks see feedback instead of a blank screen.
- **Error boundaries**: `src/app/error.tsx` (root) and `src/app/global-error.tsx` catch runtime errors and offer a “Try again” button; copy explains that slow or unstable connections can cause errors.
- **404**: `src/app/not-found.tsx` for unknown routes with a link back to the dashboard.
- **React Query** (in `src/utils/provider.tsx`): `staleTime: 60 * 1000` (1 min) to reduce refetches on slow networks; `retry: 2` with exponential backoff (`retryDelay`) so failed requests are retried briefly.
- **Next.js**: `compress: true` in `next.config.mjs` for gzip/brotli; fonts use `display: "swap"` to avoid invisible text while loading.
- **Optional**: For very slow or offline use, consider a service worker (e.g. next-pwa) or a simple “You’re offline” banner; not implemented by default.
