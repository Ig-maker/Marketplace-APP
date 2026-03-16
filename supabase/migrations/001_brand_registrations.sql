-- Brand registrations table
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)

CREATE TABLE IF NOT EXISTS brand_registrations (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_user_id  TEXT        UNIQUE,                       -- Supabase Auth user ID (Google)
  email             TEXT        NOT NULL,
  full_name         TEXT,
  first_name        TEXT,
  last_name         TEXT,
  phone             TEXT,
  brand_name        TEXT,
  company_website   TEXT,
  ip_address        TEXT,
  device_type       TEXT        CHECK (device_type IN ('mobile', 'desktop', 'unknown')),
  auth_provider     TEXT        NOT NULL DEFAULT 'google',    -- 'google' | 'email'
  registered_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  profile_completed BOOLEAN     NOT NULL DEFAULT FALSE,       -- TRUE after phone/brand step
  raw_metadata      JSONB,                                    -- full Google user_metadata
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brand_registrations_updated_at
  BEFORE UPDATE ON brand_registrations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Row-level security (service role bypasses RLS, so only restrict anon access)
ALTER TABLE brand_registrations ENABLE ROW LEVEL SECURITY;

-- No public SELECT/INSERT/UPDATE — all access is via service role key from the server
