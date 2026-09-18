-- ================================================================
-- Capital De Benchmark — Phase 1: Database Schema
-- Migration: 0001_init.sql
-- ================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- HELPER FUNCTIONS
-- ================================================================

-- Generate wallet ID: CDB-XXXX-XXXX
CREATE OR REPLACE FUNCTION generate_wallet_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  part1 TEXT := '';
  part2 TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..4 LOOP
    part1 := part1 || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    part2 := part2 || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN 'CDB-' || part1 || '-' || part2;
END;
$$;

-- Generate receipt code: RCPT-YYYY-NNNNNN
CREATE OR REPLACE FUNCTION generate_receipt_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  year_part TEXT;
  num_part TEXT;
BEGIN
  year_part := to_char(now(), 'YYYY');
  num_part := lpad(floor(random() * 999999)::text, 6, '0');
  RETURN 'RCPT-' || year_part || '-' || num_part;
END;
$$;

-- ================================================================
-- TABLES
-- ================================================================

-- Users (profile table, linked to auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'investor' CHECK (role IN ('investor','founder','admin','super_admin')),
  kyc_status TEXT NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending','verified','rejected')),
  kyc_docs JSONB DEFAULT '[]'::jsonb,
  wallet_id TEXT UNIQUE NOT NULL,
  balance NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
  preferred_lang TEXT NOT NULL DEFAULT 'bn' CHECK (preferred_lang IN ('bn','en')),
  trust_flags JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Businesses
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  story TEXT NOT NULL,
  share_price NUMERIC(12,2) NOT NULL CHECK (share_price >= 5),
  total_shares INTEGER NOT NULL CHECK (total_shares > 0),
  shares_sold INTEGER NOT NULL DEFAULT 0 CHECK (shares_sold >= 0 AND shares_sold <= total_shares),
  funding_mode TEXT NOT NULL DEFAULT 'instant' CHECK (funding_mode IN ('instant','milestone')),
  milestone_target NUMERIC(14,2),
  revenue_monthly NUMERIC(14,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','suspended','rejected')),
  trust_score INTEGER NOT NULL DEFAULT 50 CHECK (trust_score BETWEEN 0 AND 100),
  docs JSONB DEFAULT '[]'::jsonb,
  photos JSONB DEFAULT '[]'::jsonb,
  rejection_reason TEXT,
  verified_by UUID REFERENCES public.users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Holdings
CREATE TABLE public.holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  shares INTEGER NOT NULL CHECK (shares >= 0),
  avg_buy_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, business_id)
);

-- Receipts (tradable share certificates)
CREATE TABLE public.receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id),
  business_id UUID REFERENCES public.businesses(id),
  shares INTEGER NOT NULL CHECK (shares > 0),
  price NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','transferred','redeemed')),
  issued_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  business_id UUID REFERENCES public.businesses(id),
  type TEXT NOT NULL CHECK (type IN ('buy','sell')),
  shares INTEGER NOT NULL CHECK (shares > 0),
  price NUMERIC(12,2) NOT NULL CHECK (price > 0),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','filled','cancelled')),
  is_market_maker BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trades
CREATE TABLE public.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id),
  buyer_id UUID REFERENCES public.users(id),
  seller_id UUID REFERENCES public.users(id),
  shares INTEGER NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  buy_order_id UUID REFERENCES public.orders(id),
  sell_order_id UUID REFERENCES public.orders(id),
  executed_at TIMESTAMPTZ DEFAULT now()
);

-- Wallet transactions
CREATE TABLE public.wallet_txns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  type TEXT NOT NULL CHECK (type IN ('deposit','withdrawal','investment','trade_buy','trade_sell','refund','fee','adjustment')),
  amount NUMERIC(14,2) NOT NULL,
  balance_after NUMERIC(14,2) NOT NULL,
  method TEXT,
  trx_id TEXT,
  hash TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending','completed','failed','reversed')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Updates (founder posts)
CREATE TABLE public.updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.users(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  media JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id UUID REFERENCES public.updates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved','hidden')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Follows
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, business_id)
);

-- Audit log
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ads
CREATE TABLE public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  link_url TEXT,
  placement TEXT NOT NULL DEFAULT 'market_top',
  active BOOLEAN NOT NULL DEFAULT true,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Platform settings
CREATE TABLE public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================================
-- INDEXES
-- ================================================================

CREATE INDEX idx_users_phone ON public.users(phone);
CREATE INDEX idx_users_wallet_id ON public.users(wallet_id);
CREATE INDEX idx_businesses_owner_id ON public.businesses(owner_id);
CREATE INDEX idx_businesses_status ON public.businesses(status);
CREATE INDEX idx_businesses_category ON public.businesses(category);
CREATE INDEX idx_holdings_user_id ON public.holdings(user_id);
CREATE INDEX idx_holdings_business_id ON public.holdings(business_id);
CREATE INDEX idx_orders_business_status ON public.orders(business_id, status);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_trades_business_executed ON public.trades(business_id, executed_at DESC);
CREATE INDEX idx_wallet_txns_user_created ON public.wallet_txns(user_id, created_at DESC);
CREATE INDEX idx_wallet_txns_trx_id ON public.wallet_txns(trx_id);
CREATE INDEX idx_updates_business_status_created ON public.updates(business_id, status, created_at DESC);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX idx_audit_log_created ON public.audit_log(created_at DESC);

-- ================================================================
-- TRIGGERS — Auto-update updated_at
-- ================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- TRIGGER — Auto-create user profile on auth signup
-- ================================================================

CREATE OR REPLACE FUNCTION on_auth_user_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, name, phone, wallet_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone),
    generate_wallet_id()
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION on_auth_user_created();

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_txns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
END;
$$;

-- USERS policies
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "users_admin_all" ON public.users FOR ALL USING (is_admin());

-- BUSINESSES policies
CREATE POLICY "businesses_public_select_active" ON public.businesses FOR SELECT USING (status = 'active' OR owner_id = auth.uid() OR is_admin());
CREATE POLICY "businesses_owner_insert" ON public.businesses FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "businesses_owner_update" ON public.businesses FOR UPDATE USING (owner_id = auth.uid() OR is_admin());
CREATE POLICY "businesses_admin_all" ON public.businesses FOR ALL USING (is_admin());

-- HOLDINGS policies
CREATE POLICY "holdings_select_own" ON public.holdings FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "holdings_admin_all" ON public.holdings FOR ALL USING (is_admin());

-- RECEIPTS policies
CREATE POLICY "receipts_select_own" ON public.receipts FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "receipts_admin_all" ON public.receipts FOR ALL USING (is_admin());

-- ORDERS policies
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "orders_update_own" ON public.orders FOR UPDATE USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "orders_admin_all" ON public.orders FOR ALL USING (is_admin());

-- TRADES policies
CREATE POLICY "trades_select_parties" ON public.trades FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid() OR is_admin());
CREATE POLICY "trades_admin_all" ON public.trades FOR ALL USING (is_admin());

-- WALLET_TXNS policies
CREATE POLICY "wallet_txns_select_own" ON public.wallet_txns FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "wallet_txns_admin_all" ON public.wallet_txns FOR ALL USING (is_admin());

-- UPDATES policies
CREATE POLICY "updates_public_approved" ON public.updates FOR SELECT USING (status = 'approved' OR author_id = auth.uid() OR is_admin());
CREATE POLICY "updates_owner_update" ON public.updates FOR UPDATE USING (author_id = auth.uid() OR is_admin());
CREATE POLICY "updates_admin_all" ON public.updates FOR ALL USING (is_admin());

-- COMMENTS policies
CREATE POLICY "comments_public_approved" ON public.comments FOR SELECT USING (status = 'approved' OR user_id = auth.uid() OR is_admin());
CREATE POLICY "comments_auth_insert" ON public.comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "comments_admin_all" ON public.comments FOR ALL USING (is_admin());

-- NOTIFICATIONS policies
CREATE POLICY "notifications_own" ON public.notifications FOR ALL USING (user_id = auth.uid());

-- FOLLOWS policies
CREATE POLICY "follows_own" ON public.follows FOR ALL USING (user_id = auth.uid());

-- AUDIT_LOG policies
CREATE POLICY "audit_admin_select" ON public.audit_log FOR SELECT USING (is_admin());

-- ADS policies
CREATE POLICY "ads_public_active" ON public.ads FOR SELECT USING (active = true OR is_admin());
CREATE POLICY "ads_admin_all" ON public.ads FOR ALL USING (is_admin());

-- PLATFORM_SETTINGS policies
CREATE POLICY "settings_public_select" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_all" ON public.platform_settings FOR ALL USING (is_admin());

-- ================================================================
-- COMMENTS
-- ================================================================

COMMENT ON TABLE public.users IS 'User profiles linked to auth.users';
COMMENT ON TABLE public.businesses IS 'Verified businesses listed on the platform';
COMMENT ON TABLE public.holdings IS 'Shares held by users in businesses';
COMMENT ON TABLE public.receipts IS 'Tradable share certificates';
COMMENT ON TABLE public.orders IS 'Buy/sell orders on the exchange';
COMMENT ON TABLE public.trades IS 'Executed trade matches';
COMMENT ON TABLE public.wallet_txns IS 'All wallet money movements';
COMMENT ON TABLE public.updates IS 'Founder posts about their businesses';
COMMENT ON TABLE public.comments IS 'Comments on updates';
COMMENT ON TABLE public.notifications IS 'User notifications';
COMMENT ON TABLE public.follows IS 'User follows on businesses';
COMMENT ON TABLE public.audit_log IS 'Admin action audit trail';
COMMENT ON TABLE public.ads IS 'Platform advertisements';
COMMENT ON TABLE public.platform_settings IS 'Single-row platform configuration';
