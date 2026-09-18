-- ================================================================
-- Capital De Benchmark — Phase 2: Wallet, KYC, Recharge, Withdrawal
-- Migration: 0002_wallet_kyc.sql
-- ================================================================

-- ================================================================
-- 1. EXTEND USERS TABLE
-- ================================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_submitted_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_reviewed_by uuid REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_reviewed_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_rejection_reason text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS whatsapp_number text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS present_address text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS nid_number text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS payout_mfs_method text 
  CHECK (payout_mfs_method IN ('bkash','nagad','rocket','upay'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS payout_mfs_number text;

-- ================================================================
-- 2. TRANSACTION HASH FUNCTION
-- ================================================================

CREATE OR REPLACE FUNCTION generate_txn_hash()
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  raw text;
BEGIN
  raw := md5(random()::text || clock_timestamp()::text || gen_random_uuid()::text);
  RETURN '0x' || substr(raw, 1, 32);
END;
$$;

-- Auto-populate hash on wallet_txns insert
CREATE OR REPLACE FUNCTION auto_generate_txn_hash()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.hash IS NULL THEN
    NEW.hash := generate_txn_hash();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_wallet_txns_auto_hash ON wallet_txns;
CREATE TRIGGER trg_wallet_txns_auto_hash
  BEFORE INSERT ON wallet_txns
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_txn_hash();

-- ================================================================
-- 3. RECHARGE REQUESTS TABLE
-- ================================================================

CREATE TABLE recharge_requests (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount            numeric(14,2) NOT NULL CHECK (amount >= 5),
  mfs_method        text NOT NULL CHECK (mfs_method IN ('bkash','nagad','rocket','upay')),
  trx_id            text NOT NULL,
  sender_number     text NOT NULL,
  status            text NOT NULL DEFAULT 'pending' 
                    CHECK (status IN ('pending','approved','rejected')),
  reviewed_by       uuid REFERENCES users(id),
  reviewed_at       timestamptz,
  rejection_reason  text,
  wallet_txn_id     uuid REFERENCES wallet_txns(id),
  created_at        timestamptz DEFAULT now(),
  UNIQUE (mfs_method, trx_id)
);

CREATE INDEX idx_recharge_status ON recharge_requests(status, created_at DESC);
CREATE INDEX idx_recharge_user ON recharge_requests(user_id, created_at DESC);

COMMENT ON TABLE recharge_requests IS 'Pending MFS deposit requests awaiting admin approval';

-- ================================================================
-- 4. WITHDRAWAL REQUESTS TABLE
-- ================================================================

CREATE TABLE withdrawal_requests (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount            numeric(14,2) NOT NULL CHECK (amount >= 5),
  mfs_method        text NOT NULL CHECK (mfs_method IN ('bkash','nagad','rocket','upay')),
  mfs_number        text NOT NULL,
  status            text NOT NULL DEFAULT 'pending' 
                    CHECK (status IN ('pending','approved','rejected','paid','failed')),
  reviewed_by       uuid REFERENCES users(id),
  reviewed_at       timestamptz,
  paid_at           timestamptz,
  payout_trx_id     text,
  rejection_reason  text,
  wallet_txn_id     uuid REFERENCES wallet_txns(id),
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX idx_withdrawal_status ON withdrawal_requests(status, created_at DESC);
CREATE INDEX idx_withdrawal_user ON withdrawal_requests(user_id, created_at DESC);

COMMENT ON TABLE withdrawal_requests IS 'Withdrawal requests awaiting admin approval and payment';

-- ================================================================
-- 5. KYC SUBMISSIONS TABLE
-- ================================================================

CREATE TABLE kyc_submissions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nid_number        text NOT NULL,
  full_name         text NOT NULL,
  present_address   text NOT NULL,
  whatsapp_number   text NOT NULL,
  nid_front_url     text NOT NULL,
  nid_back_url      text NOT NULL,
  utility_bill_url  text NOT NULL,
  selfie_url        text,
  status            text NOT NULL DEFAULT 'pending' 
                    CHECK (status IN ('pending','approved','rejected')),
  reviewed_by       uuid REFERENCES users(id),
  reviewed_at       timestamptz,
  rejection_reason  text,
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX idx_kyc_status ON kyc_submissions(status, created_at DESC);
CREATE INDEX idx_kyc_user ON kyc_submissions(user_id, created_at DESC);

COMMENT ON TABLE kyc_submissions IS 'KYC document submissions for identity verification';

-- ================================================================
-- 6. RATE LIMITING TABLE
-- ================================================================

CREATE TABLE rate_limits (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action            text NOT NULL,
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX idx_rate_limits_user_action ON rate_limits(user_id, action, created_at DESC);

COMMENT ON TABLE rate_limits IS 'Tracks submission frequency for rate limiting';

-- ================================================================
-- 7. RLS POLICIES
-- ================================================================

ALTER TABLE recharge_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- recharge_requests
CREATE POLICY "users see own recharge" ON recharge_requests 
  FOR SELECT USING (auth.uid() = user_id OR 
    EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin')));

CREATE POLICY "users insert own recharge" ON recharge_requests 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- withdrawal_requests
CREATE POLICY "users see own withdrawal" ON withdrawal_requests 
  FOR SELECT USING (auth.uid() = user_id OR 
    EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin')));

CREATE POLICY "users insert own withdrawal" ON withdrawal_requests 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- kyc_submissions
CREATE POLICY "users see own kyc" ON kyc_submissions 
  FOR SELECT USING (auth.uid() = user_id OR 
    EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin')));

CREATE POLICY "users insert own kyc" ON kyc_submissions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- rate_limits
CREATE POLICY "users see own rate limits" ON rate_limits 
  FOR SELECT USING (auth.uid() = user_id OR 
    EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin')));

CREATE POLICY "users insert own rate limits" ON rate_limits 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ================================================================
-- 8. WALLET OPERATION FUNCTIONS
-- ================================================================

-- Credit wallet (add money)
CREATE OR REPLACE FUNCTION credit_wallet(
  p_user_id uuid,
  p_amount  numeric,
  p_type    text,
  p_method  text DEFAULT NULL,
  p_trx_id  text DEFAULT NULL,
  p_note    text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  v_new_balance numeric;
  v_txn_id uuid;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Credit amount must be positive';
  END IF;

  UPDATE users SET balance = balance + p_amount 
    WHERE id = p_user_id 
    RETURNING balance INTO v_new_balance;

  IF v_new_balance IS NULL THEN
    RAISE EXCEPTION 'User not found: %', p_user_id;
  END IF;

  INSERT INTO wallet_txns (user_id, type, amount, balance_after, method, trx_id, hash, note)
  VALUES (p_user_id, p_type, p_amount, v_new_balance, p_method, p_trx_id, generate_txn_hash(), p_note)
  RETURNING id INTO v_txn_id;

  RETURN v_txn_id;
END;
$$;

-- Debit wallet (remove money)
CREATE OR REPLACE FUNCTION debit_wallet(
  p_user_id uuid,
  p_amount  numeric,
  p_type    text,
  p_method  text DEFAULT NULL,
  p_trx_id  text DEFAULT NULL,
  p_note    text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  v_new_balance numeric;
  v_txn_id uuid;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Debit amount must be positive';
  END IF;

  UPDATE users SET balance = balance - p_amount 
    WHERE id = p_user_id AND balance >= p_amount
    RETURNING balance INTO v_new_balance;

  IF v_new_balance IS NULL THEN
    RAISE EXCEPTION 'Insufficient balance or user not found';
  END IF;

  INSERT INTO wallet_txns (user_id, type, amount, balance_after, method, trx_id, hash, note)
  VALUES (p_user_id, p_type, -p_amount, v_new_balance, p_method, p_trx_id, generate_txn_hash(), p_note)
  RETURNING id INTO v_txn_id;

  RETURN v_txn_id;
END;
$$;

-- Check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id uuid,
  p_action  text,
  p_max_count integer,
  p_window_hours integer
) RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM rate_limits
  WHERE user_id = p_user_id
    AND action = p_action
    AND created_at > now() - (p_window_hours || ' hours')::interval;
  
  RETURN v_count < p_max_count;
END;
$$;

-- Record rate limit
CREATE OR REPLACE FUNCTION record_rate_limit(
  p_user_id uuid,
  p_action  text
) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO rate_limits (user_id, action) VALUES (p_user_id, p_action);
END;
$$;

COMMENT ON FUNCTION credit_wallet IS 'Atomically credit user wallet and create transaction record';
COMMENT ON FUNCTION debit_wallet IS 'Atomically debit user wallet and create transaction record';
COMMENT ON FUNCTION check_rate_limit IS 'Check if user has exceeded rate limit for an action';
COMMENT ON FUNCTION record_rate_limit IS 'Record a rate-limited action for a user';
