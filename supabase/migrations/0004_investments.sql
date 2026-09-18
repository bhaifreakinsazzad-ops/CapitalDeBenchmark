-- ================================================================
-- Capital De Benchmark — Phase 4: Primary Investments
-- Migration: 0004_investments.sql
-- ================================================================

-- ================================================================
-- 1. INVESTMENTS TABLE
-- ================================================================

CREATE TABLE IF NOT EXISTS investments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_id     uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  shares          integer NOT NULL CHECK (shares > 0),
  price_per_share numeric(12,2) NOT NULL CHECK (price_per_share >= 5),
  total_amount    numeric(14,2) NOT NULL CHECK (total_amount > 0),
  wallet_txn_id   uuid REFERENCES wallet_txns(id),
  receipt_id      uuid REFERENCES receipts(id),
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active','refunded','escrowed')),
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_investments_user ON investments(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investments_business ON investments(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);

COMMENT ON TABLE investments IS 'Primary market share purchases by investors';

-- ================================================================
-- 2. EXTEND BUSINESSES TABLE WITH ESCROW FIELDS
-- ================================================================

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS escrow_balance numeric(14,2) DEFAULT 0 CHECK (escrow_balance >= 0);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS total_raised numeric(14,2) DEFAULT 0 CHECK (total_raised >= 0);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS milestone_reached_at timestamptz;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS refunded_at timestamptz;

-- ================================================================
-- 3. FUND RELEASE REQUESTS TABLE
-- ================================================================

CREATE TABLE IF NOT EXISTS fund_release_requests (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id       uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  founder_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount            numeric(14,2) NOT NULL CHECK (amount > 0),
  mfs_method        text NOT NULL CHECK (mfs_method IN ('bkash','nagad','rocket','upay')),
  mfs_number        text NOT NULL,
  status            text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','paid','rejected')),
  reviewed_by       uuid REFERENCES users(id),
  reviewed_at       timestamptz,
  paid_at           timestamptz,
  payout_trx_id     text,
  rejection_reason  text,
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fund_release_business ON fund_release_requests(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fund_release_status ON fund_release_requests(status, created_at DESC);

COMMENT ON TABLE fund_release_requests IS 'Founder requests to release raised funds from escrow';

-- ================================================================
-- 4. RLS POLICIES
-- ================================================================

ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_release_requests ENABLE ROW LEVEL SECURITY;

-- investments: owner sees own, admin sees all
CREATE POLICY IF NOT EXISTS "owner sees own investments" ON investments
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
  );

CREATE POLICY IF NOT EXISTS "owner inserts own investments" ON investments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- fund_release_requests: founder sees own, admin sees all
CREATE POLICY IF NOT EXISTS "founder sees own fund releases" ON fund_release_requests
  FOR SELECT USING (
    founder_id = auth.uid()
    OR EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
  );

CREATE POLICY IF NOT EXISTS "founder inserts own fund releases" ON fund_release_requests
  FOR INSERT WITH CHECK (founder_id = auth.uid());

-- ================================================================
-- 5. INVESTMENT FUNCTIONS
-- ================================================================

-- Record investment and update business stats
CREATE OR REPLACE FUNCTION record_investment(
  p_user_id uuid,
  p_business_id uuid,
  p_shares integer,
  p_price_per_share numeric,
  p_wallet_txn_id uuid,
  p_receipt_id uuid
) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  v_investment_id uuid;
  v_total_amount numeric;
  v_business business%ROWTYPE;
BEGIN
  -- Get business to check funding mode
  SELECT * INTO v_business FROM businesses WHERE id = p_business_id;
  IF v_business IS NULL THEN
    RAISE EXCEPTION 'Business not found';
  END IF;

  -- Calculate total amount
  v_total_amount := p_shares * p_price_per_share;

  -- Determine status based on funding mode
  -- Instant: funds available immediately
  -- Milestone: funds held in escrow
  INSERT INTO investments (user_id, business_id, shares, price_per_share, total_amount, wallet_txn_id, receipt_id, status)
  VALUES (
    p_user_id,
    p_business_id,
    p_shares,
    p_price_per_share,
    v_total_amount,
    p_wallet_txn_id,
    p_receipt_id,
    CASE WHEN v_business.funding_mode = 'instant' THEN 'active' ELSE 'escrowed' END
  )
  RETURNING id INTO v_investment_id;

  -- Update business stats
  UPDATE businesses SET
    shares_sold = shares_sold + p_shares,
    escrow_balance = CASE 
      WHEN funding_mode = 'instant' THEN escrow_balance 
      ELSE escrow_balance + v_total_amount 
    END,
    total_raised = CASE 
      WHEN funding_mode = 'instant' THEN total_raised + v_total_amount 
      ELSE total_raised 
    END,
    updated_at = now()
  WHERE id = p_business_id;

  -- Check if milestone reached (for milestone funding)
  IF v_business.funding_mode = 'milestone' AND v_business.milestone_target IS NOT NULL THEN
    IF (SELECT escrow_balance FROM businesses WHERE id = p_business_id) >= v_business.milestone_target THEN
      UPDATE businesses SET 
        milestone_reached_at = now(),
        total_raised = total_raised + escrow_balance,
        escrow_balance = 0
      WHERE id = p_business_id;
      
      -- Bump trust score for reaching milestone
      PERFORM bump_trust_score(p_business_id, 5, 'Milestone funding target reached');
    END IF;
  END IF;

  -- Bump trust score for funding progress
  IF (SELECT shares_sold FROM businesses WHERE id = p_business_id) >= 10 THEN
    PERFORM bump_trust_score(p_business_id, 2, 'Reached 10 shares sold');
  END IF;

  RETURN v_investment_id;
END;
$$;

-- Refund investment (for failed milestones)
CREATE OR REPLACE FUNCTION refund_investment(
  p_investment_id uuid,
  p_admin_id uuid
) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_investment investments%ROWTYPE;
  v_business businesses%ROWTYPE;
  v_refund_txn_id uuid;
BEGIN
  -- Get investment
  SELECT * INTO v_investment FROM investments WHERE id = p_investment_id;
  IF v_investment IS NULL THEN
    RAISE EXCEPTION 'Investment not found';
  END IF;
  IF v_investment.status != 'escrowed' THEN
    RAISE EXCEPTION 'Investment not in escrow';
  END IF;

  -- Get business
  SELECT * INTO v_business FROM businesses WHERE id = v_investment.business_id;

  -- Refund wallet
  SELECT credit_wallet(
    v_investment.user_id,
    v_investment.total_amount,
    'refund',
    NULL,
    NULL,
    'Investment refunded - milestone not reached'
  ) INTO v_refund_txn_id;

  -- Update investment status
  UPDATE investments SET status = 'refunded' WHERE id = p_investment_id;

  -- Update business stats
  UPDATE businesses SET
    shares_sold = shares_sold - v_investment.shares,
    escrow_balance = escrow_balance - v_investment.total_amount,
    refunded_at = now(),
    updated_at = now()
  WHERE id = v_investment.business_id;

  -- Notify investor
  INSERT INTO notifications (user_id, type, payload)
  VALUES (
    v_investment.user_id,
    'investment_refunded',
    jsonb_build_object(
      'business_id', v_investment.business_id,
      'business_name', v_business.name,
      'amount', v_investment.total_amount,
      'reason', 'Milestone funding target not reached'
    )
  );
END;
$$;

-- Request fund release (founder)
CREATE OR REPLACE FUNCTION request_fund_release(
  p_business_id uuid,
  p_founder_id uuid,
  p_amount numeric,
  p_mfs_method text,
  p_mfs_number text
) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  v_request_id uuid;
  v_business businesses%ROWTYPE;
BEGIN
  -- Get business
  SELECT * INTO v_business FROM businesses WHERE id = p_business_id;
  IF v_business IS NULL THEN
    RAISE EXCEPTION 'Business not found';
  END IF;
  IF v_business.owner_id != p_founder_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Check available balance
  IF v_business.total_raised < p_amount THEN
    RAISE EXCEPTION 'Insufficient available balance';
  END IF;

  -- Create request
  INSERT INTO fund_release_requests (business_id, founder_id, amount, mfs_method, mfs_number)
  VALUES (p_business_id, p_founder_id, p_amount, p_mfs_method, p_mfs_number)
  RETURNING id INTO v_request_id;

  -- Notify admins
  INSERT INTO notifications (user_id, type, payload)
  SELECT 
    id,
    'fund_release_pending',
    jsonb_build_object(
      'request_id', v_request_id,
      'business_id', p_business_id,
      'business_name', v_business.name,
      'amount', p_amount,
      'founder_name', (SELECT name FROM users WHERE id = p_founder_id)
    )
  FROM users
  WHERE role IN ('admin', 'super_admin');

  RETURN v_request_id;
END;
$$;

-- Approve fund release (admin)
CREATE OR REPLACE FUNCTION approve_fund_release(
  p_request_id uuid,
  p_admin_id uuid
) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_request fund_release_requests%ROWTYPE;
  v_business businesses%ROWTYPE;
BEGIN
  -- Get request
  SELECT * INTO v_request FROM fund_release_requests WHERE id = p_request_id;
  IF v_request IS NULL THEN
    RAISE EXCEPTION 'Request not found';
  END IF;
  IF v_request.status != 'pending' THEN
    RAISE EXCEPTION 'Request not pending';
  END IF;

  -- Get business
  SELECT * INTO v_business FROM businesses WHERE id = v_request.business_id;

  -- Check available balance
  IF v_business.total_raised < v_request.amount THEN
    RAISE EXCEPTION 'Insufficient available balance';
  END IF;

  -- Update request
  UPDATE fund_release_requests SET
    status = 'approved',
    reviewed_by = p_admin_id,
    reviewed_at = now()
  WHERE id = p_request_id;

  -- Deduct from available balance
  UPDATE businesses SET
    total_raised = total_raised - v_request.amount,
    updated_at = now()
  WHERE id = v_request.business_id;

  -- Notify founder
  INSERT INTO notifications (user_id, type, payload)
  VALUES (
    v_request.founder_id,
    'fund_release_approved',
    jsonb_build_object(
      'request_id', p_request_id,
      'business_id', v_request.business_id,
      'business_name', v_business.name,
      'amount', v_request.amount
    )
  );
END;
$$;

-- Mark fund release as paid (admin)
CREATE OR REPLACE FUNCTION mark_fund_release_paid(
  p_request_id uuid,
  p_admin_id uuid,
  p_payout_trx_id text
) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_request fund_release_requests%ROWTYPE;
  v_business businesses%ROWTYPE;
BEGIN
  -- Get request
  SELECT * INTO v_request FROM fund_release_requests WHERE id = p_request_id;
  IF v_request IS NULL THEN
    RAISE EXCEPTION 'Request not found';
  END IF;
  IF v_request.status != 'approved' THEN
    RAISE EXCEPTION 'Request not approved';
  END IF;

  -- Get business
  SELECT * INTO v_business FROM businesses WHERE id = v_request.business_id;

  -- Update request
  UPDATE fund_release_requests SET
    status = 'paid',
    paid_at = now(),
    payout_trx_id = p_payout_trx_id
  WHERE id = p_request_id;

  -- Notify founder
  INSERT INTO notifications (user_id, type, payload)
  VALUES (
    v_request.founder_id,
    'fund_release_paid',
    jsonb_build_object(
      'request_id', p_request_id,
      'business_id', v_request.business_id,
      'business_name', v_business.name,
      'amount', v_request.amount,
      'payout_trx_id', p_payout_trx_id
    )
  );
END;
$$;

-- Reject fund release (admin)
CREATE OR REPLACE FUNCTION reject_fund_release(
  p_request_id uuid,
  p_admin_id uuid,
  p_reason text
) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_request fund_release_requests%ROWTYPE;
  v_business businesses%ROWTYPE;
BEGIN
  -- Get request
  SELECT * INTO v_request FROM fund_release_requests WHERE id = p_request_id;
  IF v_request IS NULL THEN
    RAISE EXCEPTION 'Request not found';
  END IF;
  IF v_request.status != 'pending' THEN
    RAISE EXCEPTION 'Request not pending';
  END IF;

  -- Get business
  SELECT * INTO v_business FROM businesses WHERE id = v_request.business_id;

  -- Update request
  UPDATE fund_release_requests SET
    status = 'rejected',
    reviewed_by = p_admin_id,
    reviewed_at = now(),
    rejection_reason = p_reason
  WHERE id = p_request_id;

  -- Notify founder
  INSERT INTO notifications (user_id, type, payload)
  VALUES (
    v_request.founder_id,
    'fund_release_rejected',
    jsonb_build_object(
      'request_id', p_request_id,
      'business_id', v_request.business_id,
      'business_name', v_business.name,
      'amount', v_request.amount,
      'reason', p_reason
    )
  );
END;
$$;

-- ================================================================
-- COMMENTS
-- ================================================================

COMMENT ON FUNCTION record_investment IS 'Record a share purchase and update business stats';
COMMENT ON FUNCTION refund_investment IS 'Refund an escrowed investment when milestone fails';
COMMENT ON FUNCTION request_fund_release IS 'Founder requests release of raised funds';
COMMENT ON FUNCTION approve_fund_release IS 'Admin approves fund release request';
COMMENT ON FUNCTION mark_fund_release_paid IS 'Admin marks fund release as paid';
COMMENT ON FUNCTION reject_fund_release IS 'Admin rejects fund release request';
