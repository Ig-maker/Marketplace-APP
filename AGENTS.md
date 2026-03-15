# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Shelvian is a Next.js 16 (App Router) SaaS marketplace app. Auth is stubbed (no real DB or SMS provider), so the app runs fully self-contained with zero external services.

### Quick reference

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (port 3000) |
| Build | `npm run build` |
| Lint | `npm run lint` |

### Dev environment notes

- **No `.nvmrc` or version manager config** — the project works with Node.js v20+. The system Node (v22) is fine.
- **`.env.local`** must exist for `SESSION_SECRET`. Copy `.env.example` to `.env.local`. The session module falls back to a hardcoded dev secret, so this is optional for local dev but good practice.
- **Auth is fully stubbed** — any email/password works for Brand login; Ambassador OTP is hardcoded to `123456`.
- **No automated test suite exists** — the project has no test framework or test files. Validation is done via `npm run lint` and `npm run build`.
- **Lint has pre-existing warnings/errors** (4 errors, 3 warnings as of initial setup) — these are in the existing codebase and not regressions.
- **Middleware deprecation warning** — Next.js 16 shows `The "middleware" file convention is deprecated. Please use "proxy" instead.` during build. This is expected and does not affect functionality.
