# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Shelvian Marketplace APP — a Next.js 16 (App Router) web application. Single-service architecture with Supabase as the external backend (auth + database). See `CLAUDE.md` for full project context.

### Running the app

```bash
npm run dev    # http://localhost:3000
npm run build  # production build
npm run lint   # ESLint (note: exits non-zero due to pre-existing warnings/errors)
```

### Environment variables

Copy `.env.example` to `.env`. Required variables for full functionality:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — real Supabase project credentials needed for auth flows (login, signup, OTP)
- `SESSION_SECRET` — auto-generated is fine for dev
- `NEXT_PUBLIC_APP_URL` — defaults to `http://localhost:3000`

Without real Supabase credentials, auth API calls will fail. However, the session system is purely cookie-based (base64url-encoded JSON), so you can bypass Supabase auth by manually setting a `shelvian_session` cookie. See the "Testing without Supabase" section below.

### Testing without Supabase

The session cookie is not signed or encrypted — it's just base64url-encoded JSON. To access protected pages without Supabase:

```bash
# Generate a valid session cookie value
echo -n '{"user":{"id":"test-1","email":"test@test.com","name":"Test User","role":"brand"},"expiresAt":'$(($(date +%s)*1000 + 604800000))'}' | base64 -w 0 | tr '+/' '-_' | tr -d '='
```

Then set it via browser console or curl:
```bash
curl -b "shelvian_session=<cookie_value>" http://localhost:3000/dashboard
```

### Key caveats

- `npm run lint` exits with code 1 due to pre-existing lint errors (4 errors, 3 warnings in the codebase). This is expected.
- The `middleware` file convention triggers a Next.js 16 deprecation warning about migrating to `proxy`. This is cosmetic and does not affect functionality.
- No automated test suite exists (no `test` script in `package.json`).
- Auth testing instructions in `.agents/skills/testing-app/SKILL.md` reference placeholder auth that works with "any email/password" — this is outdated. The app now uses real Supabase auth; use the cookie bypass method above instead.
