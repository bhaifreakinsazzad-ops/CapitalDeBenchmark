-- ================================================================
-- Capital De Benchmark — Phase 3: Business Listing, Market, Updates
-- Migration: 0003_business.sql
-- ================================================================

-- ================================================================
-- 1. EXTEND BUSINESSES TABLE
-- ================================================================

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS funding_option_shown boolean NOT NULL DEFAULT false;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS suspension_reason text;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS suspended_at timestamptz;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS suspended_by uuid REFERENCES users(id);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS last_update_at timestamptz;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS views_count integer NOT NULL DEFAULT 0;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS followers_count integer NOT NULL DEFAULT 0;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS initial_story text;

-- ================================================================
-- 2. EXTEND UPDATES TABLE
-- ================================================================

ALTER TABLE updates ADD COLUMN IF NOT EXISTS rejection_reason text;
ALTER TABLE updates ADD COLUMN IF NOT EXISTS media_caption text;

-- ================================================================
-- 3. BUSINESS DOCUMENTS TABLE
-- ================================================================

CREATE TABLE IF NOT EXISTS business_documents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  doc_type      text NOT NULL CHECK (doc_type IN (
                  'nid_front','nid_back','trade_license',
                  'tin_certificate','bank_statement',
                  'utility_bill','operation_photo','other')),
  file_url      text NOT NULL,
  file_name     text NOT NULL,
  uploaded_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_biz_docs_business ON business_documents(business_id);

-- ================================================================
-- 4. BUSINESS PHOTOS TABLE
-- ================================================================

CREATE TABLE IF NOT EXISTS business_photos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  file_url      text NOT NULL,
  caption       text,
  is_cover      boolean NOT NULL DEFAULT false,
  sort_order    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_biz_photos_business ON business_photos(business_id, sort_order);

-- ================================================================
-- 5. TRUST SCORE EVENTS TABLE
-- ================================================================

CREATE TABLE IF NOT EXISTS trust_score_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  delta         integer NOT NULL,
  reason        text NOT NULL,
  new_score     integer NOT NULL,
  actor_id      uuid REFERENCES users(id),
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_trust_events_business ON trust_score_events(business_id, created_at DESC);

-- ================================================================
-- 6. RLS POLICIES
-- ================================================================

ALTER TABLE business_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_score_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "owner sees own business docs" ON business_documents
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM businesses b WHERE b.id = business_id AND b.owner_id = auth.uid())
    OR EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
  );

CREATE POLICY IF NOT EXISTS "owner inserts own business docs" ON business_documents
  FOR INSERT WITH CHECK (
    EXISTS(SELECT 1 FROM businesses b WHERE b.id = business_id AND b.owner_id = auth.uid())
  );

CREATE POLICY IF NOT EXISTS "public sees active business photos" ON business_photos
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM businesses b WHERE b.id = business_id AND b.status = 'active')
    OR EXISTS(SELECT 1 FROM businesses b WHERE b.id = business_id AND b.owner_id = auth.uid())
    OR EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
  );

CREATE POLICY IF NOT EXISTS "owner inserts own business photos" ON business_photos
  FOR INSERT WITH CHECK (
    EXISTS(SELECT 1 FROM businesses b WHERE b.id = business_id AND b.owner_id = auth.uid())
  );

CREATE POLICY IF NOT EXISTS "owner or admin sees trust events" ON trust_score_events
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM businesses b WHERE b.id = business_id AND b.owner_id = auth.uid())
    OR EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin'))
  );

-- ================================================================
-- 7. FOLLOWERS COUNT TRIGGER
-- ================================================================

CREATE OR REPLACE FUNCTION refresh_followers_count()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE businesses
  SET followers_count = (SELECT COUNT(*) FROM follows WHERE business_id = 
    COALESCE(NEW.business_id, OLD.business_id))
  WHERE id = COALESCE(NEW.business_id, OLD.business_id);
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_followers_count ON follows;
CREATE TRIGGER trg_followers_count
AFTER INSERT OR DELETE ON follows
FOR EACH ROW EXECUTE FUNCTION refresh_followers_count();

-- ================================================================
-- 8. TOUCH BUSINESS ON UPDATE APPROVAL
-- ================================================================

CREATE OR REPLACE FUNCTION touch_business_on_update()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'approved' THEN
    UPDATE businesses SET last_update_at = NEW.approved_at 
    WHERE id = NEW.business_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_touch_business ON updates;
CREATE TRIGGER trg_touch_business
AFTER INSERT OR UPDATE ON updates
FOR EACH ROW EXECUTE FUNCTION touch_business_on_update();

-- ================================================================
-- 9. BUMP TRUST SCORE FUNCTION
-- ================================================================

CREATE OR REPLACE FUNCTION bump_trust_score(
  p_business_id uuid,
  p_delta integer,
  p_reason text,
  p_actor_id uuid DEFAULT NULL
) RETURNS integer LANGUAGE plpgsql AS $$
DECLARE
  v_new integer;
BEGIN
  UPDATE businesses
  SET trust_score = GREATEST(0, LEAST(100, trust_score + p_delta))
  WHERE id = p_business_id
  RETURNING trust_score INTO v_new;

  INSERT INTO trust_score_events (business_id, delta, reason, new_score, actor_id)
  VALUES (p_business_id, p_delta, p_reason, v_new, p_actor_id);

  RETURN v_new;
END;
$$;

-- ================================================================
-- 10. SLUG GENERATOR
-- ================================================================

CREATE OR REPLACE FUNCTION generate_slug(p_text text)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  base text;
  candidate text;
  i integer := 0;
BEGIN
  base := lower(regexp_replace(p_text, '[^a-zA-Z0-9]+', '-', 'g'));
  base := trim(both '-' from base);
  IF length(base) < 3 THEN
    base := 'biz';
  END IF;

  candidate := base;
  WHILE EXISTS(SELECT 1 FROM businesses WHERE slug = candidate) LOOP
    i := i + 1;
    candidate := base || '-' || i::text;
  END LOOP;
  RETURN candidate;
END;
$$;

-- ================================================================
-- COMMENTS
-- ================================================================

COMMENT ON TABLE business_documents IS 'Verification documents uploaded by business owners';
COMMENT ON TABLE business_photos IS 'Public photos for business listings';
COMMENT ON TABLE trust_score_events IS 'Audit trail of trust score changes';
COMMENT ON FUNCTION bump_trust_score IS 'Atomically adjust trust score and log the event';
COMMENT ON FUNCTION generate_slug IS 'Generate unique URL-safe slug from business name';
