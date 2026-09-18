-- ================================================================
-- Capital De Benchmark — Phase 6: Social, Comments, Moderation
-- Migration: 0006_social.sql
-- ================================================================

-- ================================================================
-- 1. EXTEND COMMENTS TABLE
-- ================================================================

ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_comment_id uuid REFERENCES comments(id) ON DELETE CASCADE;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS likes_count integer NOT NULL DEFAULT 0;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_edited boolean NOT NULL DEFAULT false;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS edited_at timestamptz;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS hidden_by uuid REFERENCES users(id);
ALTER TABLE comments ADD COLUMN IF NOT EXISTS hidden_at timestamptz;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS hide_reason text;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS author_warned_at timestamptz;

-- ================================================================
-- 2. EXTEND UPDATES TABLE
-- ================================================================

ALTER TABLE updates ADD COLUMN IF NOT EXISTS likes_count integer NOT NULL DEFAULT 0;
ALTER TABLE updates ADD COLUMN IF NOT EXISTS comments_count integer NOT NULL DEFAULT 0;

-- ================================================================
-- 3. COMMENT LIKES
-- ================================================================

CREATE TABLE IF NOT EXISTS comment_likes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id  uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (comment_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);

-- ================================================================
-- 4. UPDATE LIKES
-- ================================================================

CREATE TABLE IF NOT EXISTS update_likes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id   uuid NOT NULL REFERENCES updates(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (update_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_update_likes_update ON update_likes(update_id);

-- ================================================================
-- 5. FOUNDER FOLLOWS
-- ================================================================

CREATE TABLE IF NOT EXISTS founder_follows (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  founder_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (follower_id, founder_id),
  CHECK (follower_id <> founder_id)
);
CREATE INDEX IF NOT EXISTS idx_founder_follows_founder ON founder_follows(founder_id);
CREATE INDEX IF NOT EXISTS idx_founder_follows_follower ON founder_follows(follower_id);

-- ================================================================
-- 6. COMMENT BANS
-- ================================================================

CREATE TABLE IF NOT EXISTS comment_bans (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_id  uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  banned_by    uuid NOT NULL REFERENCES users(id),
  reason       text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz,
  UNIQUE (user_id, business_id)
);
CREATE INDEX IF NOT EXISTS idx_comment_bans_lookup ON comment_bans(user_id, business_id);

-- ================================================================
-- 7. CONTENT REPORTS
-- ================================================================

CREATE TABLE IF NOT EXISTS content_reports (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id   uuid NOT NULL REFERENCES users(id),
  target_type   text NOT NULL CHECK (target_type IN ('comment','update','business')),
  target_id     uuid NOT NULL,
  reason        text NOT NULL CHECK (reason IN ('spam','abuse','misinformation','fraud','other')),
  detail        text,
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewed','dismissed','actioned')),
  reviewed_by   uuid REFERENCES users(id),
  reviewed_at   timestamptz,
  review_note   text,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reports_status ON content_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_target ON content_reports(target_type, target_id);

-- ================================================================
-- 8. NOTIFICATION PREFERENCES
-- ================================================================

CREATE TABLE IF NOT EXISTS notification_prefs (
  user_id             uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  wallet_updates      boolean NOT NULL DEFAULT true,
  kyc_updates         boolean NOT NULL DEFAULT true,
  investment_updates  boolean NOT NULL DEFAULT true,
  trade_updates       boolean NOT NULL DEFAULT true,
  follow_updates      boolean NOT NULL DEFAULT true,
  comment_replies     boolean NOT NULL DEFAULT true,
  platform_announce   boolean NOT NULL DEFAULT true,
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION ensure_notification_prefs() 
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO notification_prefs (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_ensure_prefs ON users;
CREATE TRIGGER trg_ensure_prefs AFTER INSERT ON users
FOR EACH ROW EXECUTE FUNCTION ensure_notification_prefs();

-- ================================================================
-- 9. PLATFORM ANNOUNCEMENTS
-- ================================================================

CREATE TABLE IF NOT EXISTS announcements (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  body          text NOT NULL,
  variant       text NOT NULL DEFAULT 'info' CHECK (variant IN ('info','warning','success','critical')),
  dismissible   boolean NOT NULL DEFAULT true,
  active        boolean NOT NULL DEFAULT true,
  starts_at     timestamptz NOT NULL DEFAULT now(),
  ends_at       timestamptz,
  created_by    uuid NOT NULL REFERENCES users(id),
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_announce_active ON announcements(active, starts_at, ends_at);

CREATE TABLE IF NOT EXISTS announcement_dismissals (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  announcement_id  uuid NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  dismissed_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, announcement_id)
);

-- ================================================================
-- 10. FULL-TEXT SEARCH ON BUSINESSES
-- ================================================================

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS 
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', COALESCE(name, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(category, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(location, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(story, '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_business_search ON businesses USING GIN(search_vector);

-- ================================================================
-- 11. COUNTER TRIGGERS
-- ================================================================

CREATE OR REPLACE FUNCTION refresh_comment_likes() 
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE comments SET likes_count = (
    SELECT COUNT(*) FROM comment_likes 
    WHERE comment_id = COALESCE(NEW.comment_id, OLD.comment_id))
  WHERE id = COALESCE(NEW.comment_id, OLD.comment_id);
  RETURN NULL;
END; $$;
DROP TRIGGER IF EXISTS trg_comment_likes ON comment_likes;
CREATE TRIGGER trg_comment_likes AFTER INSERT OR DELETE ON comment_likes
FOR EACH ROW EXECUTE FUNCTION refresh_comment_likes();

CREATE OR REPLACE FUNCTION refresh_update_likes() 
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE updates SET likes_count = (
    SELECT COUNT(*) FROM update_likes 
    WHERE update_id = COALESCE(NEW.update_id, OLD.update_id))
  WHERE id = COALESCE(NEW.update_id, OLD.update_id);
  RETURN NULL;
END; $$;
DROP TRIGGER IF EXISTS trg_update_likes ON update_likes;
CREATE TRIGGER trg_update_likes AFTER INSERT OR DELETE ON update_likes
FOR EACH ROW EXECUTE FUNCTION refresh_update_likes();

CREATE OR REPLACE FUNCTION refresh_comments_count() 
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE updates SET comments_count = (
    SELECT COUNT(*) FROM comments 
    WHERE update_id = COALESCE(NEW.update_id, OLD.update_id)
      AND status = 'approved')
  WHERE id = COALESCE(NEW.update_id, OLD.update_id);
  RETURN NULL;
END; $$;
DROP TRIGGER IF EXISTS trg_comments_count ON comments;
CREATE TRIGGER trg_comments_count 
AFTER INSERT OR UPDATE OF status OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION refresh_comments_count();

-- ================================================================
-- 12. SEARCH FUNCTION
-- ================================================================

CREATE OR REPLACE FUNCTION search_businesses(
  p_query text DEFAULT NULL,
  p_category text DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_limit integer DEFAULT 24,
  p_offset integer DEFAULT 0
) RETURNS SETOF businesses LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN QUERY
  SELECT b.*
  FROM businesses b
  WHERE b.status = 'active'
    AND (p_category IS NULL OR b.category = p_category)
    AND (p_location IS NULL OR b.location ILIKE '%' || p_location || '%')
    AND (p_query IS NULL OR p_query = '' 
         OR b.search_vector @@ websearch_to_tsquery('simple', p_query)
         OR b.name ILIKE '%' || p_query || '%'
         OR b.location ILIKE '%' || p_query || '%')
  ORDER BY b.trust_score DESC, b.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END; $$;

-- ================================================================
-- 13. RLS POLICIES
-- ================================================================

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_prefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_dismissals ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "users own comment likes" ON comment_likes FOR ALL 
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "users own update likes" ON update_likes FOR ALL 
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "users own founder follows" ON founder_follows FOR ALL 
  USING (auth.uid() = follower_id) WITH CHECK (auth.uid() = follower_id);
CREATE POLICY IF NOT EXISTS "public sees founder follows" ON founder_follows FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "user sees own bans" ON comment_bans FOR SELECT USING 
  (auth.uid() = user_id OR EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin')));
CREATE POLICY IF NOT EXISTS "user creates reports" ON content_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY IF NOT EXISTS "user sees own reports" ON content_reports FOR SELECT USING 
  (auth.uid() = reporter_id OR EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin')));
CREATE POLICY IF NOT EXISTS "users own prefs" ON notification_prefs FOR ALL 
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "public sees active announcements" ON announcements FOR SELECT 
  USING (active = true AND starts_at <= now() AND (ends_at IS NULL OR ends_at > now()));
CREATE POLICY IF NOT EXISTS "admin manages announcements" ON announcements FOR ALL 
  USING (EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin','super_admin')));
CREATE POLICY IF NOT EXISTS "users own dismissals" ON announcement_dismissals FOR ALL 
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE comment_likes IS 'User likes on comments';
COMMENT ON TABLE update_likes IS 'User likes on business updates';
COMMENT ON TABLE founder_follows IS 'User follows on founders';
COMMENT ON TABLE comment_bans IS 'Per-business comment bans';
COMMENT ON TABLE content_reports IS 'User-submitted content reports';
COMMENT ON TABLE notification_prefs IS 'Per-user notification preferences';
COMMENT ON TABLE announcements IS 'Platform-wide announcements';
COMMENT ON TABLE announcement_dismissals IS 'Per-user announcement dismissals';
