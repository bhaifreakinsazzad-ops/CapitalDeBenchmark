-- ================================================================
-- Capital De Benchmark — Phase 8: Admin Operations
-- Migration: 0008_admin_ops.sql
-- ================================================================

-- ================================================================
-- 1. EXTEND ADS TABLE
-- ================================================================

ALTER TABLE ads ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS advertiser_name text;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS advertiser_contact text;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS 
  placement text NOT NULL DEFAULT 'market_top'
  CHECK (placement IN ('market_top','market_grid','business_sidebar',
                       'feed_inline','dashboard_banner'));
ALTER TABLE ads ADD COLUMN IF NOT EXISTS priority integer NOT NULL DEFAULT 0;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS starts_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE ads ADD COLUMN IF NOT EXISTS ends_at timestamptz;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS daily_budget_bdt numeric(12,2);
ALTER TABLE ads ADD COLUMN IF NOT EXISTS spent_bdt numeric(14,2) NOT NULL DEFAULT 0;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES users(id);

ALTER TABLE ads DROP CONSTRAINT IF EXISTS ads_placement_check;
ALTER TABLE ads ADD CONSTRAINT ads_placement_check 
  CHECK (placement IN ('market_top','market_grid','business_sidebar',
                       'feed_inline','dashboard_banner'));

CREATE INDEX IF NOT EXISTS idx_ads_active_placement ON ads(active, placement, priority DESC);

-- ================================================================
-- 2. AD EVENTS
-- ================================================================

CREATE TABLE IF NOT EXISTS ad_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id       uuid NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES users(id) ON DELETE SET NULL,
  event_type  text NOT NULL CHECK (event_type IN ('impression','click')),
  ip_hash     text,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ad_events_ad ON ad_events(ad_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ad_events_type ON ad_events(event_type, created_at DESC);

-- ================================================================
-- 3. TRUST JOBS LOG
-- ================================================================

CREATE TABLE IF NOT EXISTS trust_jobs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at    timestamptz NOT NULL DEFAULT now(),
  finished_at   timestamptz,
  businesses_scanned integer NOT NULL DEFAULT 0,
  events_created integer NOT NULL DEFAULT 0,
  error_message text
);
CREATE INDEX IF NOT EXISTS idx_trust_jobs_started ON trust_jobs(started_at DESC);

-- ================================================================
-- 4. DAILY STATS
-- ================================================================

CREATE TABLE IF NOT EXISTS daily_stats (
  stat_date        date PRIMARY KEY,
  active_users     integer NOT NULL DEFAULT 0,
  new_users        integer NOT NULL DEFAULT 0,
  total_raised_bdt numeric(14,2) NOT NULL DEFAULT 0,
  trade_volume_bdt numeric(14,2) NOT NULL DEFAULT 0,
  trades_count     integer NOT NULL DEFAULT 0,
  investments_count integer NOT NULL DEFAULT 0,
  deposits_bdt     numeric(14,2) NOT NULL DEFAULT 0,
  withdrawals_bdt  numeric(14,2) NOT NULL DEFAULT 0,
  ad_revenue_bdt   numeric(14,2) NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ================================================================
-- 5. RLS
-- ================================================================

ALTER TABLE ad_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "public insert ad events" ON ad_events FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "admin reads ad events" ON ad_events FOR SELECT 
  USING (EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin')));
CREATE POLICY IF NOT EXISTS "admin reads trust jobs" ON trust_jobs FOR SELECT 
  USING (EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin')));
CREATE POLICY IF NOT EXISTS "admin reads daily stats" ON daily_stats FOR SELECT 
  USING (EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin')));

-- ================================================================
-- 6. PICK ACTIVE AD FUNCTION
-- ================================================================

CREATE OR REPLACE FUNCTION pick_active_ad(p_placement text) 
RETURNS uuid LANGUAGE plpgsql STABLE AS $$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM ads
  WHERE active = true
    AND placement = p_placement
    AND starts_at <= now()
    AND (ends_at IS NULL OR ends_at > now())
    AND (daily_budget_bdt IS NULL OR spent_bdt < daily_budget_bdt)
  ORDER BY priority DESC, random()
  LIMIT 1;
  RETURN v_id;
END; $$;

COMMENT ON TABLE ad_events IS 'Impression and click events for ads';
COMMENT ON TABLE trust_jobs IS 'Log of trust score automation runs';
COMMENT ON TABLE daily_stats IS 'Daily aggregate statistics for reporting';
COMMENT ON FUNCTION pick_active_ad IS 'Select a random active ad for a placement';
