export const AUTH_COOKIE_NAME = "shelvian_session";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const PUBLIC_ROUTES = ["/login", "/signup", "/signup/brand", "/signup/ambassador", "/auth/callback", "/auth/confirm", "/signup/brand/verify", "/forgot-password", "/reset-password", "/link-account"] as const;
export const PROTECTED_ROUTES = ["/dashboard", "/settings", "/billing", "/onboarding/brand"] as const;
export const DEFAULT_REDIRECT = "/dashboard";

export const DOMAINS = {
  marketing: "shelvian.co",
  app: "app.shelvian.co",
} as const;
