-- Add onboarding fields to brand_registrations
-- Run in Supabase SQL Editor if not using migrations

ALTER TABLE brand_registrations
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS pitch TEXT,
  ADD COLUMN IF NOT EXISTS retailer TEXT,
  ADD COLUMN IF NOT EXISTS cities TEXT,
  ADD COLUMN IF NOT EXISTS budget TEXT,
  ADD COLUMN IF NOT EXISTS ambassador_requirements JSONB DEFAULT '[]';
