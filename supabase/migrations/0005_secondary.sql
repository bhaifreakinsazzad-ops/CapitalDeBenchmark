-- ================================================================
-- Capital De Benchmark — Phase 5: Secondary Market & Trading
-- Migration: 0005_secondary.sql
-- ================================================================

-- ================================================================
-- 1. EXTEND ORDERS TABLE
-- ================================================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS filled_shares integer NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS filled_amount numeric(14,2) NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS avg_fill_price numeric(12,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_by uuid REFERENCES users(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_kind text NOT NULL DEFAULT 'limit' CHECK (order_kind IN ('limit','market'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS business_owner_id uuid REFERENCES users(id);

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('open','partially_filled','filled','cancelled'));
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_type_check;
ALTER TABLE orders ADD CONSTRAINT orders_type_check CHECK (type IN ('buy','sell','buyback'));

-- ================================================================
-- 2. EXTEND TRADES TABLE
-- ================================================================

ALTER TABLE trades ADD COLUMN IF NOT EXISTS buyer_receipt_id uuid REFERENCES receipts(id);
ALTER TABLE trades ADD COLUMN IF NOT EXISTS trade_hash text;
ALTER TABLE trades ADD COLUMN IF NOT EXISTS is_buyback boolean NOT NULL DEFAULT false;
ALTER TABLE trades ADD COLUMN IF NOT EXISTS reversed_at timestamptz;
ALTER TABLE trades ADD COLUMN IF NOT EXISTS reversed_by uuid REFERENCES users(id);
ALTER TABLE trades ADD COLUMN IF NOT EXISTS reversal_reason text;

-- ================================================================
-- 3. EXTEND RECEIPTS TABLE
-- ================================================================

ALTER TABLE receipts ADD COLUMN IF NOT EXISTS parent_receipt_id uuid REFERENCES receipts(id);
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS transferred_at timestamptz;
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS transferred_to uuid REFERENCES users(id);
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS transferred_from uuid REFERENCES users(id);
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'primary' CHECK (source IN ('primary','secondary','buyback'));

ALTER TABLE receipts DROP CONSTRAINT IF EXISTS receipts_status_check;
ALTER TABLE receipts ADD CONSTRAINT receipts_status_check CHECK (status IN ('active','transferred','redeemed','refunded','split'));

-- ================================================================
-- 4. EXTEND BUSINESSES TABLE
-- ================================================================

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS current_price numeric(12,2);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS last_trade_at timestamptz;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS volume_24h integer NOT NULL DEFAULT 0;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS trades_count integer NOT NULL DEFAULT 0;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS treasury_shares integer NOT NULL DEFAULT 0;

-- ================================================================
-- 5. RECEIPT TRANSFERS LOG
-- ================================================================

CREATE TABLE IF NOT EXISTS receipt_transfers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id      uuid REFERENCES receipts(id),
  from_user_id    uuid REFERENCES users(id),
  to_user_id      uuid REFERENCES users(id),
  business_id     uuid NOT NULL REFERENCES businesses(id),
  shares          integer NOT NULL CHECK (shares > 0),
  price_per_share numeric(12,2) NOT NULL,
  trade_id        uuid REFERENCES trades(id),
  hash            text NOT NULL UNIQUE,
  reversed_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rcpt_tr_business ON receipt_transfers(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rcpt_tr_user ON receipt_transfers(to_user_id, created_at DESC);

-- ================================================================
-- 6. RLS POLICIES
-- ================================================================

ALTER TABLE receipt_transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "user sees own transfers" ON receipt_transfers
  FOR SELECT USING (
    auth.uid() = from_user_id OR auth.uid() = to_user_id
    OR EXISTS(SELECT 1 FROM businesses b WHERE b.id = business_id AND b.owner_id = auth.uid())
    OR EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
  );

DROP POLICY IF EXISTS "users manage own orders" ON orders;
CREATE POLICY IF NOT EXISTS "user sees own orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS(SELECT 1 FROM businesses b WHERE b.id = business_id AND b.owner_id = auth.uid())
    OR EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
  );
CREATE POLICY IF NOT EXISTS "user inserts own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ================================================================
-- 7. PUBLIC ORDER BOOK VIEW
-- ================================================================

CREATE OR REPLACE VIEW public_order_book AS
SELECT o.id, o.business_id, o.type,
       o.shares - o.filled_shares AS remaining,
       o.price, o.created_at, o.is_market_maker
FROM orders o
WHERE o.status IN ('open','partially_filled');

-- ================================================================
-- COMMENTS
-- ================================================================

COMMENT ON TABLE receipt_transfers IS 'Log of share transfers between users via trades';
COMMENT ON VIEW public_order_book IS 'Anonymized order book for public viewing';
