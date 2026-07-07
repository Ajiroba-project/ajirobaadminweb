# Ajiroba Admin Web — Handover

Admin dashboard for the **Ajiroba** platform (Nigerian e-commerce / auctions / bill payments / raffles / community). Admins sign in to manage products, auction deals, transactions, customers, reports, and community content.

---

## 1. Tech Stack

| Area | Choice |
|------|--------|
| Framework | Next.js **14.2** (App Router) |
| Language | TypeScript + some `.js`/`.jsx` files |
| Data fetching | `@tanstack/react-query` (v5) + `axios` / native `fetch` |
| State | `zustand` (see `src/store/`) |
| Auth | Token stored in cookies via `js-cookie` |
| Styling | Tailwind CSS + `tailwindcss-animate` |
| UI libs | NextUI, MUI, Ant Design, Radix, lucide/react-icons (mixed) |
| Charts / maps | chart.js, react-leaflet, react-simple-maps, d3 |
| Exports | xlsx, jspdf, jspdf-autotable, html2canvas |
| Notifications | react-toastify |

> Note: several UI libraries are used together. Prefer following the pattern already in the file you're editing rather than introducing a new one.

---

## 2. Getting Started

```bash
npm install        # package-lock.json is the source of truth
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve production build
npm run lint       # eslint (next lint)
```

App entry redirects `/` → `/signin`. Log in with admin credentials to reach `/dashboard`.

---

## 3. Environment (`.env`)

The repo currently points at **staging**. `.env` is git-ignored — recreate it if missing.

```bash
NEXT_PUBLIC_BASE_URL=https://staging.ajiroba.ng/v1      # API base used by client-side hooks
BASE_URL=https://staging.ajiroba.ng/v1                  # API base used by server-side API routes
NEXT_PUBLIC_BASE_URL_IMG=https://staging.ajiroba.ng     # image/asset host
NEXT_PUBLIC_SITE_URL=https://staging.ajiroba.ng         # site URL (metadata)
```

- `NEXT_PUBLIC_*` vars are exposed to the browser; `BASE_URL` (no prefix) is server-only.
- For production, swap these to the production API host.
- Backend API is a versioned REST API (`/v1/...`). This app is only the **frontend admin**; the backend lives elsewhere.

---

## 4. Project Structure

```
src/
├── app/                      # Next.js App Router (pages + API routes)
│   ├── page.tsx              # → redirects to /signin
│   ├── layout.tsx            # root layout: fonts, providers, ToastContainer
│   ├── Provider.tsx          # NextUI provider
│   │
│   ├── signin / signup / forgotpassword / setnewpass /
│   │   otpverification / resendotp / verification ...   # auth flow pages
│   │
│   ├── dashboard/            # ⭐ main admin area (auth-guarded)
│   │   ├── page.tsx          # dashboard home (analytics + overview)
│   │   ├── components/       # all dashboard feature components (tables, cards, modals, maps)
│   │   ├── product / product-details / category / upload
│   │   ├── auctiondeals / regulardeals / rechargedeals
│   │   ├── *transactionreport / revenuesummaryreport / customersreport
│   │   ├── raffletickets / winningdetails / redemption
│   │   ├── analytics / reports / ticketdetails
│   │   └── userprofile / userdetails
│   │
│   ├── community / livechat / ...    # community & support features
│   └── api/                  # server-side route handlers (proxy to backend)
│
├── components/ui/            # shared shadcn-style UI primitives
├── app/components/           # shared app components (Header, SideNav, Sidebar, Navbar, Pagination…)
├── hooks/                    # data-fetching + auth hooks (see §6)
├── store/                    # zustand stores (auth, nav, purchase flows)
├── utils/                    # provider, currency format, export helpers
├── helper/validation.tsx     # form validation schemas
└── lib/utils.ts              # cn() + misc helpers
```

Dynamic routes use `[id]` / `[slug]` (e.g. `dashboard/productdetails-auction/[id]`).

---

## 5. Authentication Flow

- **Login:** page posts to `/api/signin` → the API route proxies to `BASE_URL/auth/signin_admin/`. On success the token + user are saved to cookies via `useAuthStore.setAuthCookie(token, user, expiry)`.
- **State:** `useAuthStore` (`src/store/store.js`) reads `token` / `user` from cookies on init and exposes `setLoggedIn`, `setUser`, `setAuthCookie`, `clearAuthCookies`.
- **Guarding pages:** call `useAuthMiddleware(router)` inside a page — it redirects to `/signin` when not logged in. `useAuth(router)` is the variant used on entry/auth pages.
- **Authorized requests:** hooks attach the token header. Note the header casing varies across the codebase:
  - `useGetData.tsx` (axios) → `Authorization: Token <token>`
  - `useQueryDatawithToken.ts` (fetch) → `Authorization: token <token>`
  Match whatever the endpoint you're calling expects.

---

## 6. Data-fetching Hooks (`src/hooks/`)

| Hook | Use |
|------|-----|
| `useGetData.tsx` | axios GET hooks (`useGetDatanew`, `useGetOrderData`, `useGetProductData`, `useGetBidData`…) with token auth. Most dashboard reads use these. |
| `useQueryData.tsx` / `useQueryDatawithToken.ts` / `useQueryDataCat.ts` | react-query GET wrappers (native fetch) |
| `useMutateData.tsx` / `useMutateNewData.tsx` / `usePutMutateData.tsx` | POST / PUT mutations |
| `useAuth.tsx` / `useAuthMiddleware.tsx` | auth redirects |
| `useLocalStorage.tsx` | local storage helper |

**Two ways the app talks to the backend:**
1. **Direct** — client hooks call `NEXT_PUBLIC_BASE_URL/...` with the token header (most GET reads).
2. **Proxied** — pages call an internal route in `src/app/api/*`, which forwards to `BASE_URL/...` server-side (used for auth and several writes, e.g. `signin`, `auth` (signup), `uploadauction`, `editproduct`, `createcategory`, community actions). These routes add a `cache=Date.now()` cache-buster and return `{ data, status }`.

---

## 7. State Stores (`src/store/`)

- `store.js` — `useAuthStore` (auth), `userNavStore` (sidebar/navbar toggles + header title), `profilePhoto`, `userOTPStore`, `userProfile`, and purchase-flow stores (`DataPurchase`, `AirtimePurchase`, `CablePurchase`, `ElectricityPurchase`).
- `nav-store.js` — `useStore` for navbar open state & heading text.

---

## 8. Feature Map (dashboard)

- **Products:** list, details, create/edit (`product`, `product-details`, `upload`, `category` + subcategories).
- **Deals:** regular / auction / recharge deals + their transaction reports.
- **Auctions:** active + completed lists, bid/winning details, notify winner.
- **Reports:** revenue summary, customers, service uptime, per-type transaction reports — with **PDF/Excel export** (`utils/exportUtils.ts`, jspdf/xlsx).
- **Raffles:** tickets, winning details, redemption.
- **Customers:** regular & auction customer masters, user profiles, points history/gifting.
- **Community & Support:** posts (create/like/comment/bookmark), notifications, live chat, ticket details.
- **Analytics:** charts + geo maps (Nigeria states, leaflet / simple-maps).

---

## 9. Config Files

| File | Purpose |
|------|---------|
| `next.config.mjs` | image `remotePatterns` (allowed hosts incl. `staging.ajiroba.ng`), security headers (X-Frame-Options DENY, nosniff, etc.), compression, `poweredByHeader: false` |
| `tailwind.config.ts` | Tailwind theme/paths |
| `components.json` | shadcn/ui config for `src/components/ui` |
| `tsconfig.json` | path alias `@/*` → `src/*` |
| `.eslintrc.json` | extends `next/core-web-vitals` |
| `SECURITY.md` | security policy/notes — read before touching auth |

---

## 10. Things to Know / Gotchas

- **`robots` is set to `noindex`** in `layout.tsx` — intended (admin app), don't "fix" it.
- **Mixed UI libraries** (NextUI + MUI + AntD) — bundle is large; be consistent within a screen.
- **Auth header casing** differs between hooks (`Token` vs `token`) — see §5.
- **Two lockfiles present** (`package-lock.json` and `pnpm-lock.yaml`). Standardize on npm (or pick one) and delete the other to avoid drift.
- **No test suite** currently. Verify changes manually against staging.
- **`.env` is git-ignored** — never commit it; keep secrets out of the repo.
- Adding an external image host? Add it to `next.config.mjs` `remotePatterns` or `next/image` will reject it.

---

## 11. Deploy

Standard Next.js deploy (Vercel-ready per README). Set the four env vars in the hosting dashboard, point `BASE_URL`/`NEXT_PUBLIC_BASE_URL` at the **production** API, then `npm run build` → `npm run start` (or Vercel auto-build).
