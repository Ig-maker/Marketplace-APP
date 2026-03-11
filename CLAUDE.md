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
npm run lint       # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + CSS custom properties (Shelvian design tokens in `globals.css`)
- **Fonts**: DM Serif Display (headings), DM Sans (body), DM Mono (code/numbers)
- **Auth**: Cookie-based sessions with secure httpOnly cookies

## Project Structure

```
Marketplace-APP/
├── CLAUDE.md                          # AI assistant guidelines
├── HTMLS/                             # Static HTML prototypes / reference designs
├── next.config.ts                     # Next.js configuration
├── .env.example                       # Environment variable template
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout (fonts, global CSS)
│   │   ├── page.tsx                   # Root redirect (→ /login or /dashboard)
│   │   ├── globals.css                # Design tokens + Tailwind config
│   │   ├── (auth)/                    # Auth route group (public)
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx         # Login (brand email/pw + ambassador phone/OTP)
│   │   │   └── signup/page.tsx        # Signup
│   │   ├── (protected)/              # Protected route group (requires auth)
│   │   │   ├── layout.tsx             # Server-side auth check + AppShell wrapper
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── billing/page.tsx
│   │   └── api/auth/                  # Auth API routes
│   │       ├── login/route.ts         # POST — brand email/password login
│   │       ├── signup/route.ts        # POST — new account creation
│   │       ├── send-otp/route.ts      # POST — send OTP to phone
│   │       ├── verify-otp/route.ts    # POST — verify OTP code
│   │       └── logout/route.ts        # POST — destroy session
│   ├── components/
│   │   └── app-shell.tsx              # Authenticated app layout (nav, header, logout)
│   ├── lib/
│   │   ├── constants.ts               # Route lists, cookie config, domain config
│   │   ├── session.ts                 # Server-side session management (Node.js runtime)
│   │   └── session-edge.ts            # Edge-compatible session reader (for middleware)
│   └── types/
│       └── auth.ts                    # User, Session, AuthResponse types
└── public/                            # Static assets
```

## Authentication Architecture

### Flow

1. **Middleware** (`src/middleware.ts`) intercepts all requests:
   - `/` → redirects to `/dashboard` (logged in) or `/login` (logged out)
   - `/login`, `/signup` → if logged in, redirect to `/dashboard`
   - `/dashboard`, `/settings`, `/billing` → if logged out, redirect to `/login?redirect=<original>`
2. **After login**: redirects to `?redirect=` param if present, otherwise `/dashboard`
3. **Sessions**: stored in secure httpOnly cookies (`shelvian_session`), 7-day expiry
4. **Two login flows**:
   - **Brand**: email + password + Google SSO option
   - **Ambassador**: phone number → 6-digit OTP verification

### Key Files

- `src/middleware.ts` — route protection and redirect logic
- `src/lib/session.ts` — `createSession()`, `getSession()`, `destroySession()`, `getCurrentUser()`
- `src/lib/session-edge.ts` — `getSessionFromRequest()` for middleware (Edge runtime)
- `src/app/(protected)/layout.tsx` — server-side auth guard using `getCurrentUser()`

## Design System

CSS custom properties are defined in `src/app/globals.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--off` | `#F5F5F0` | Page background |
| `--surface` | `#FFFFFF` | Cards, inputs |
| `--dark` | `#111111` | Primary text, dark buttons |
| `--lime` | `#CBEC45` | Brand accent, ambassador CTAs |
| `--lime-dark` | `#B5D93A` | Hover state for lime |
| `--border` | `#E2E2DC` | Default borders |
| `--text3` | `#999994` | Muted/label text |
| `--r` | `8px` | Default border radius |
| `--r-lg` | `14px` | Card border radius |

## Branch Conventions

- **Main branch**: `main`
- **Feature branches**: `feature/<description>` or `claude/<session-id>`
- Always create pull requests before merging into `main`

## Coding Conventions

- **TypeScript** for all source files
- **Functional components** with hooks
- **Named exports** preferred
- **Files**: kebab-case (`app-shell.tsx`)
- **Components**: PascalCase (`AppShell`)
- **Functions/variables**: camelCase (`getCurrentUser`)
- **Constants**: UPPER_SNAKE_CASE (`AUTH_COOKIE_NAME`)
- **Types**: PascalCase (`AuthResponse`)
- **Imports**: `@/*` alias for `src/*`; external → internal → relative order
- **Styling**: Tailwind utility classes + CSS custom properties
- **Error handling**: try/catch at API boundaries, user-facing error messages

## Environment Variables

See `.env.example`. Key variables:

- `SESSION_SECRET` — session encryption key (required in production)
- `NEXT_PUBLIC_APP_URL` — application base URL

## AI Assistant Guidelines

1. **Read before writing** — always read existing files before modifying
2. **Minimal changes** — only change what's necessary
3. **Run `npm run build`** after making changes to verify
4. **Security first** — never expose secrets, validate inputs at boundaries
5. **Follow existing patterns** — match the auth flow, design tokens, and component structure
6. **TODO markers** — existing `// TODO:` comments mark placeholder implementations (e.g., database integration, SMS provider)
