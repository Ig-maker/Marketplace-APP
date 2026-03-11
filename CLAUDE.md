# CLAUDE.md — Shelvian Marketplace APP

> Guidelines and context for AI assistants working on this codebase.

## Project Overview

**Shelvian** — a SaaS marketplace connecting CPG brands with in-store demo ambassadors. Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4.

### Domain Architecture

- `shelvian.co` — marketing/landing pages (separate deployment)
- `app.shelvian.co` — authenticated web application (this codebase)

## Development Setup

```bash
npm install
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Language**: TypeScript 5 (strict mode)
- **UI**: React 19.2.3
- **Styling**: Tailwind CSS v4 + PostCSS + CSS custom properties (design tokens in `globals.css`)
- **Fonts**: DM Serif Display (headings), DM Sans (body), DM Mono (code/numbers)
- **Auth**: Cookie-based sessions with secure httpOnly cookies
- **Path Alias**: `@/*` → `src/*`

## Project Structure

```
Marketplace-APP/
├── CLAUDE.md                          # AI assistant guidelines
├── HTMLS/                             # Static HTML prototypes / reference designs
│   ├── shelvian-login.html
│   ├── shelvian-onboarding-brand.html
│   ├── shelvian-signup-brand.html
│   └── shelvian-signup-navigation.html
├── next.config.ts                     # Next.js configuration
├── tsconfig.json                      # TypeScript config (strict, ES2017 target)
├── eslint.config.mjs                  # ESLint 9 flat config
├── postcss.config.mjs                 # PostCSS config (Tailwind plugin)
├── .env.example                       # Environment variable template
├── src/
│   ├── middleware.ts                   # Route protection and redirect logic
│   ├── app/
│   │   ├── layout.tsx                 # Root layout (fonts, global CSS)
│   │   ├── page.tsx                   # Root redirect (→ /login or /dashboard)
│   │   ├── globals.css                # Design tokens + Tailwind config
│   │   ├── (auth)/                    # Auth route group (public)
│   │   │   ├── layout.tsx             # Auth pages layout
│   │   │   ├── login/page.tsx         # Login (brand email/pw + ambassador phone/OTP)
│   │   │   └── signup/
│   │   │       ├── page.tsx           # Role selection (brand vs ambassador)
│   │   │       └── brand/page.tsx     # Brand signup form
│   │   ├── (onboarding)/             # Onboarding route group (auth required, no AppShell)
│   │   │   ├── layout.tsx             # Onboarding layout (no nav chrome)
│   │   │   └── onboarding/brand/page.tsx  # 3-step brand onboarding wizard
│   │   ├── (protected)/              # Protected route group (requires auth + AppShell)
│   │   │   ├── layout.tsx             # Server-side auth check + AppShell wrapper
│   │   │   ├── dashboard/page.tsx     # Dashboard (role-aware stats)
│   │   │   ├── settings/page.tsx      # Settings (notifications, danger zone)
│   │   │   └── billing/page.tsx       # Billing (invoices for brands, payouts for ambassadors)
│   │   └── api/auth/                  # Auth API routes
│   │       ├── login/route.ts         # POST — brand email/password login
│   │       ├── signup/route.ts        # POST — new account creation
│   │       ├── send-otp/route.ts      # POST — send OTP to phone
│   │       ├── verify-otp/route.ts    # POST — verify OTP code
│   │       ├── logout/route.ts        # POST — destroy session
│   │       └── me/route.ts            # GET — fetch current user
│   ├── components/
│   │   └── app-shell.tsx              # Authenticated app layout (nav, header, logout)
│   ├── lib/
│   │   ├── constants.ts               # Route lists, cookie config, domain config
│   │   ├── session.ts                 # Server-side session management (Node.js runtime)
│   │   └── session-edge.ts            # Edge-compatible session reader (for middleware)
│   └── types/
│       └── auth.ts                    # User, Session, LoginCredentials, OTP types
└── public/                            # Static assets (SVGs)
```

## Authentication Architecture

### Flow

1. **Middleware** (`src/middleware.ts`) intercepts all requests:
   - `/` → redirects to `/dashboard` (logged in) or `/login` (logged out)
   - `/login`, `/signup`, `/signup/brand` → if logged in, redirect to `/dashboard`
   - `/dashboard`, `/settings`, `/billing` → if logged out, redirect to `/login?redirect=<original>`
   - `/onboarding/*` → if logged out, redirect to `/login?redirect=<original>`
2. **After login**: redirects to `?redirect=` param if present, otherwise `/dashboard`
3. **Sessions**: stored in secure httpOnly cookies (`shelvian_session`), base64url-encoded, 7-day expiry, `SameSite=lax`, domain-scoped to `.shelvian.co` in production
4. **Two login flows**:
   - **Brand**: email + password + Google SSO option
   - **Ambassador**: phone number → 6-digit OTP verification
5. **Onboarding**: after signup, brands go through a 3-step wizard (Account → Brand Profile → Preferences)

### Route Groups

| Group | Auth Required | AppShell | Routes |
|-------|--------------|----------|--------|
| `(auth)` | No | No | `/login`, `/signup`, `/signup/brand` |
| `(onboarding)` | Yes | No | `/onboarding/brand` |
| `(protected)` | Yes | Yes | `/dashboard`, `/settings`, `/billing` |

### Key Files

- `src/middleware.ts` — route protection and redirect logic
- `src/lib/session.ts` — `createSession()`, `getSession()`, `destroySession()`, `getCurrentUser()`
- `src/lib/session-edge.ts` — `getSessionFromRequest()` for middleware (Edge runtime)
- `src/app/(protected)/layout.tsx` — server-side auth guard using `getCurrentUser()`
- `src/app/api/auth/me/route.ts` — GET current user endpoint

### API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | Brand email/password login |
| `/api/auth/signup` | POST | New account creation |
| `/api/auth/send-otp` | POST | Send OTP to phone number |
| `/api/auth/verify-otp` | POST | Verify OTP code (dev: accepts `123456`) |
| `/api/auth/logout` | POST | Destroy session |
| `/api/auth/me` | GET | Fetch current user |

## Design System

CSS custom properties are defined in `src/app/globals.css`:

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--off` | `#F5F5F0` | Page background |
| `--surface` | `#FFFFFF` | Cards, inputs |
| `--elevated` | `#FFFFFF` | Elevated surfaces |
| `--dark` | `#111111` | Primary text, dark buttons |
| `--border` | `#E2E2DC` | Default borders |
| `--border2` | `#D1D1C8` | Stronger borders |
| `--text` | `#111111` | Primary text |
| `--text2` | `#555550` | Secondary text |
| `--text3` | `#999994` | Muted/label text |
| `--muted` | `#BBBBB5` | Disabled/muted elements |
| `--lime` | `#CBEC45` | Brand accent, ambassador CTAs |
| `--lime-dark` | `#B5D93A` | Hover state for lime |
| `--lime-glow` | `rgba(203, 236, 69, 0.3)` | Glow/focus ring for lime |
| `--green` | `#22C55E` | Success states |
| `--red` | `#EF4444` | Error/danger states |

### Effects & Layout

| Token | Value | Usage |
|-------|-------|-------|
| `--sh` | `0 1px 2px rgba(0,0,0,0.04)` | Light shadow |
| `--sh-md` | `0 4px 12px rgba(0,0,0,0.06)` | Medium shadow |
| `--r` | `8px` | Default border radius |
| `--r-lg` | `14px` | Card border radius |
| `--ease` | `cubic-bezier(0.16, 1, 0.3, 1)` | Animation easing |

### Animations

Defined keyframes: `fadeUp`, `slideIn`, `popIn` — used for page transitions and UI feedback.

## Component Patterns

- **Server Components** (default): dashboard, settings, billing pages — data fetching and auth checks
- **Client Components** (`"use client"`): login, signup, onboarding pages — forms with interactivity
- **AppShell**: wraps all `(protected)` routes with top navigation (logo, nav items, user info, logout)
- **Role-aware rendering**: dashboard, billing, and other pages adapt content based on user role (brand vs ambassador)

## Branch Conventions

- **Main branch**: `main`
- **Feature branches**: `feature/<description>` or `claude/<session-id>`
- Always create pull requests before merging into `main`

## Coding Conventions

- **TypeScript** for all source files (strict mode enabled)
- **Functional components** with hooks
- **Named exports** preferred
- **Files**: kebab-case (`app-shell.tsx`)
- **Components**: PascalCase (`AppShell`)
- **Functions/variables**: camelCase (`getCurrentUser`)
- **Constants**: UPPER_SNAKE_CASE (`AUTH_COOKIE_NAME`)
- **Types**: PascalCase (`AuthResponse`)
- **Imports**: `@/*` alias for `src/*`; external → internal → relative order
- **Styling**: Tailwind utility classes + CSS custom properties (never raw hex in components)
- **Error handling**: try/catch at API boundaries, user-facing error messages

## Environment Variables

See `.env.example`. Key variables:

- `SESSION_SECRET` — session encryption key (required in production)
- `NEXT_PUBLIC_APP_URL` — application base URL (default: `http://localhost:3000`)
- `MARKETING_DOMAIN` / `APP_DOMAIN` — production domain config (commented out in dev)

## Implementation Status

The following areas are marked with `// TODO:` comments and use placeholder/mock implementations:

- **Database integration** — all user data is in-memory/mocked
- **Password hashing** — signup stores plaintext (needs bcrypt/argon2)
- **SMS provider** — OTP sending is a no-op (needs Twilio or similar)
- **OTP validation** — dev mode accepts `123456` as valid code
- **Google SSO** — UI exists but callback handler is not implemented
- **Ambassador signup** — role selection page exists, but `/signup/ambassador` route is not built
- **Onboarding persistence** — wizard UI works but data is not saved
- **Real data** — dashboard stats, billing transactions, shifts are all mock data

## AI Assistant Guidelines

1. **Read before writing** — always read existing files before modifying
2. **Minimal changes** — only change what's necessary
3. **Run `npm run build`** after making changes to verify no type or build errors
4. **Security first** — never expose secrets, validate inputs at boundaries
5. **Follow existing patterns** — match the auth flow, design tokens, and component structure
6. **Use design tokens** — reference CSS custom properties (`var(--lime)`) not raw color values
7. **TODO markers** — existing `// TODO:` comments mark placeholder implementations; preserve or resolve them
8. **HTMLS reference** — static prototypes in `HTMLS/` serve as visual reference for implementing pages
9. **Role awareness** — many pages render differently for brand vs ambassador users; maintain this pattern
10. **Route groups** — respect the three-group architecture: `(auth)` for public, `(onboarding)` for post-signup, `(protected)` for authenticated with nav
