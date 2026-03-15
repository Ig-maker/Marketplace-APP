# Testing the Shelvian Marketplace APP

## Dev Server
```bash
npm install
npm run dev    # http://localhost:3000
```

## Auth (Dev Mode)
The app uses placeholder auth in development:
- **Brand login**: Any email + any password works (e.g. `test@test.com` / `password123`)
- **Ambassador login**: Any phone number, then OTP code `123456`
- Sessions are stored in httpOnly cookies (`shelvian_session`)

## Key Test Flows
- Login: `/login` page with Brand/Ambassador tabs
- Dashboard: `/dashboard` (protected, requires auth)
- Logout: "Log Out" button in top-right header → clears session → redirects to `/`
- Middleware redirects unauthenticated users from `/` → `/login`

## Vercel Preview
- Vercel preview deployments may require Vercel SSO login
- For reliable testing, use the local dev server instead

## Lint & Build
```bash
npm run lint   # ESLint
npm run build  # Production build
```
