-- ================================================================
-- Capital De Benchmark — Seed Data
-- ================================================================

-- NOTE: The super admin auth user must be created via Supabase Auth
-- admin API or dashboard. After creating the auth user with:
--   Email: admin@capitaldebenchmark.local
--   Phone: 01700000000
--   Password: (choose a secure one)
-- Then insert the profile row below using the auth user's UUID.

-- For now, insert the profile row (assuming you've created the auth user
-- and know their UUID, or use a placeholder):

-- INSERT INTO public.users (id, name, phone, email, role, kyc_status, wallet_id, balance, preferred_lang)
-- VALUES (
--   '<AUTH_USER_UUID>',  -- Replace with actual UUID from auth.users
--   'Capital De Benchmark Admin',
--   '01700000000',
--   'admin@capitaldebenchmark.local',
--   'super_admin',
--   'verified',
--   'CDB-ADMIN-0001',
--   0,
--   'bn'
-- );

-- Platform settings defaults
INSERT INTO public.platform_settings (key, value) VALUES
  ('min_deposit_bdt', '5'::jsonb),
  ('min_investment_bdt', '5'::jsonb),
  ('min_share_price_bdt', '5'::jsonb),
  ('withdrawals_require_admin', 'true'::jsonb),
  ('ads_enabled', 'true'::jsonb),
  ('signup_open', 'true'::jsonb),
  ('platform_full_name', '"Capital De Benchmark"'::jsonb),
  ('platform_short_name', '"CapitalDB"'::jsonb),
  ('wallet_prefix', '"CDB"'::jsonb)
ON CONFLICT (key) DO NOTHING;
