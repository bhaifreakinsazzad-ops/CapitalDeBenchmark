-- Phase 9: Launch Preparation
-- Payment gateways, OTP, 2FA, session tracking, security hardening

-- Payment intents for gateway integration
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('bkash', 'nagad', 'rocket', 'upay', 'manual')),
  amount NUMERIC(14,2) NOT NULL CHECK (amount >= 5),
  currency TEXT NOT NULL DEFAULT 'BDT',
  provider_ref TEXT,
  provider_trx_id TEXT,
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'succeeded', 'failed', 'cancelled', 'expired')),
  redirect_url TEXT,
  callback_payload JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  recharge_request_id UUID REFERENCES recharge_requests(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payment_intents_user ON payment_intents(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON payment_intents(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_intents_provider_ref ON payment_intents(provider, provider_ref);

-- Webhook logging
CREATE TABLE IF NOT EXISTS payment_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_type TEXT,
  headers JSONB DEFAULT '{}'::jsonb,
  payload JSONB NOT NULL,
  signature_ok BOOLEAN DEFAULT false,
  processed BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_webhooks_provider ON payment_webhooks(provider, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_processed ON payment_webhooks(processed, created_at);

-- OTP challenges
CREATE TABLE IF NOT EXISTS otp_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('signup', 'login', 'withdraw', 'payout', 'admin_2fa')),
  code_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  consumed BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_otp_challenges_phone_purpose ON otp_challenges(phone, purpose, created_at DESC);

-- Session events
CREATE TABLE IF NOT EXISTS session_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event TEXT NOT NULL CHECK (event IN ('login', 'logout', 'failed_login', 'password_change', '2fa_enabled', '2fa_disabled', 'session_revoked')),
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_session_events_user ON session_events(user_id, created_at DESC);

-- Extend users with 2FA fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS twofa_secret TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS twofa_enabled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS twofa_recovery_codes TEXT[];

-- RLS policies
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_sees_own_payment_intents" ON payment_intents
  FOR SELECT USING (auth.uid() = user_id OR EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "admin_reads_webhooks" ON payment_webhooks
  FOR SELECT USING (EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "admin_reads_otp" ON otp_challenges
  FOR SELECT USING (EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "admin_reads_sessions" ON session_events
  FOR SELECT USING (EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Platform settings for payments, SMS, email, 2FA
INSERT INTO platform_settings (key, value) VALUES
  ('payments_bkash_enabled', 'true'::jsonb),
  ('payments_nagad_enabled', 'false'::jsonb),
  ('payments_rocket_enabled', 'false'::jsonb),
  ('payments_upay_enabled', 'false'::jsonb),
  ('sms_otp_enabled', 'true'::jsonb),
  ('email_enabled', 'true'::jsonb),
  ('admin_2fa_required', 'false'::jsonb),
  ('session_max_days', '30'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_users_role_kyc ON users(role, kyc_status);
CREATE INDEX IF NOT EXISTS idx_businesses_status_trust ON businesses(status, trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_status_created ON businesses(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_business_status_price_desc ON orders(business_id, status, price DESC);
CREATE INDEX IF NOT EXISTS idx_orders_business_status_price_asc ON orders(business_id, status, price ASC);
CREATE INDEX IF NOT EXISTS idx_trades_business_executed ON trades(business_id, executed_at DESC);
CREATE INDEX IF NOT EXISTS idx_investments_business_created ON investments(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_txns_user_created ON wallet_txns(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON notifications(user_id, read, created_at DESC);
