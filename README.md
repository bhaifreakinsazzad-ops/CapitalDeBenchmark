# Capital De Benchmark — Micro-Investment Exchange for Verified Bangladeshi Businesses

Capital De Benchmark (short mark: **CapitalDB**) is a micro-investment and trading exchange platform designed for verified Bangladeshi businesses. Everyday users can invest in real businesses starting from as little as ৳5. Verified businesses list shares, users buy them, shares become tradable receipts, and money is held in an escrow-style internal wallet.

The platform is mobile-first, supports Bangla as the default language with English as secondary, and uses a dark theme optimized for readability. Every business must be verified by the platform admin before going live. The wallet ID prefix is **CDB** (e.g., CDB-XXXX-XXXX). Note: This is an internal ledger system — no on-chain crypto is involved.

---

## Setup

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- A Supabase project (free tier works)

### Steps

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com)

3. **Copy environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase URL, anon key, and service role key.

4. **Run the database migration:**
   - Option A: Use Supabase CLI: `supabase db push`
   - Option B: Copy the contents of `supabase/migrations/0001_init.sql` and paste into the Supabase SQL Editor

5. **Run the seed data:**
   - Copy the contents of `supabase/seed.sql` into the Supabase SQL Editor and run it

6. **Create the super admin user manually:**
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add User" → "Create New User"
   - Email: `admin@capitaldebenchmark.local`
   - Phone: `01700000000`
   - Password: Choose a secure password (e.g., `Admin@2025!`)
   - In "User Metadata" (JSON), add: `{"name": "Capital De Benchmark Admin", "phone": "01700000000", "role": "super_admin"}`
   - After creation, the trigger will auto-create the profile row
   - Then update the role in SQL:
     ```sql
     UPDATE public.users SET role = 'super_admin', kyc_status = 'verified', wallet_id = 'CDB-ADMIN-0001' WHERE phone = '01700000000';
     ```

7. **Start the dev server:**
   ```bash
   pnpm dev
   ```

8. **Login as admin:**
   - Go to `/login`
   - Phone: `01700000000`
   - Password: (the one you set in step 6)

---

## Folder Structure

```
src/
├── components/
│   ├── layout/          # TopBar, BottomNav, AdminSidebar, BrandMark, LangToggle
│   └── shared/          # Money, BanglaNumber, TrustBadge, RiskBanner, EmptyState, LoadingSkeleton
├── lib/
│   ├── constants.ts     # App constants (categories, roles, MFS methods)
│   ├── types.ts         # TypeScript interfaces for all entities
│   ├── utils.ts         # Utility functions (cn, formatMoney, toBanglaNumeral, etc.)
│   ├── validators/      # Zod schemas for form validation
│   └── supabase/        # Supabase client stubs (to be connected in Phase 2+)
├── pages/               # All page components
├── store/               # Zustand stores (auth, demo data)
├── messages/            # i18n translations (bn.json, en.json)
├── App.tsx              # Main router and layout composition
├── main.tsx             # Entry point
└── index.css            # Global styles and Tailwind theme

supabase/
├── migrations/
│   └── 0001_init.sql    # Full database schema with RLS
└── seed.sql             # Admin user + platform settings seed
```

---

## Phase Roadmap

| Phase | Description |
|-------|-------------|
| 1 | Foundation — Schema, auth, roles, design system, stub pages ✅ |
| 2 | Wallet, KYC, Recharge, Withdrawals ✅ |
| 3 | Business Listing, Market, Verification, Updates ✅ |
| 4 | Primary Investment, Share Receipts, Escrow, Portfolio ✅ |
| 5 | Secondary Market, Order Book, Buyback, Market Maker ✅ |
| 6 | Comments, Moderation, Search, Announcements ✅ |
| 7 | Localization, Learn Pages, Onboarding, Polish ✅ |
| 8 | Ads Manager, Trust Automation, Audit, Settings, Reports ✅ |
| 9 | Launch Polish — PWA, performance, legal pages |

## Phase 3 Features

### Business Listing
- Founders upgrade from investor role (requires KYC verification)
- Multi-step business creation form (5 steps)
- Required documents: NID front/back, trade license, utility bill
- 2-12 photos with cover photo selection
- Business status lifecycle: pending → active/rejected → suspended

### Public Market
- Browse all verified (active) businesses
- Search by name or location
- Filter by category
- Sort by newest, trust score, funding progress, price
- Business cards show cover photo, verification badge, trust score, followers

### Business Detail Page
- Hero with verification badge and trust score
- Founder's story
- Financial stats (share price, shares sold, raised, revenue)
- Funding mode explainer (instant vs milestone)
- Verification summary (document count, not images)
- Photo gallery with tap-to-expand
- Updates feed (approved updates only)
- Follow button with real-time count

### Updates System
- Founders post updates for active businesses
- Updates go through admin approval queue
- Approved updates appear on business page and global feed
- Trust score adjusts: +1 for approval, -1 for rejection (capped per 24h)

### Admin Verification
- Business verification queue with document viewer
- Approve/reject with reason (min 10 chars for rejection)
- Trust score +10 on verification
- Suspend/reactivate businesses with reason
- Manual trust score adjustment (-50 to +50)

### Follows
- Users follow businesses
- Real-time follower count updates
- Followed businesses notify followers of new updates

### Trust Score Algorithm
- Starts at 50 for new businesses
- +10 on verification (complete docs)
- +1 on update approval (max +1 per 24h)
- -1 on update rejection (max -3 per 24h)
- -5 on suspension
- Full audit trail in trust_score_events table

### Manual E2E Test Script (Phase 3)
1. Log in as KYC-verified investor
2. Go to /mybiz → upgrade to founder
3. Click "List New Business" → complete 5-step form
4. Log in as admin → see business in /admin/verify → approve
5. Log in as founder → see status 'active' → post an update
6. Log in as admin → approve the update in /admin/updates
7. Log out → visit /market → see the business → open detail page
8. Follow the business (as another user)
9. Visit /feed → see the approved update
10. Verify followers_count and trust_score events logged correctly

## Phase 2 Features

### Wallet System
- Internal ledger wallet with CDB-XXXX-XXXX wallet IDs
- Crypto-style transaction hashes (0x + 32 hex chars)
- Atomic credit/debit operations via Postgres functions
- Full transaction history with expandable details

### MFS Recharge
- Submit recharge via bKash, Nagad, Rocket, or Upay
- TrxID uniqueness enforced at database level
- Admin approval queue with one-click approve/reject
- Rate limited: max 10 recharges per user per hour

### KYC Verification
- Upload NID front/back, utility bill, optional selfie
- Admin review queue with document viewer
- Approve/reject with reason notifications
- Rate limited: max 3 submissions per user per day

### Withdrawals
- Request withdrawal to verified MFS number
- Balance debited immediately on submission
- Admin approval with payout TrxID tracking
- Automatic refund on rejection
- Rate limited: max 5 withdrawals per user per hour

### Notifications
- In-app notifications for all wallet/KYC events
- Unread count badge in top bar
- Mark individual or all as read

### Storage Buckets (Supabase)
- `kyc-documents` — Private bucket for KYC uploads
- `business-media` — Public bucket (for Phase 3)

### Manual E2E Test Script
1. Register a new user (phone: 01XXXXXXXXX)
2. Submit KYC with sample images
3. Login as admin (01700000000 / admin123) → Approve KYC
4. Login as user → Recharge 100 via bKash flow (use any TrxID)
5. Login as admin → Approve recharge → user balance becomes 100
6. User → Request withdrawal of 50
7. Admin → Approve, then Mark Paid
8. User → Verify balance is 50 and txn history is correct

## Phase 4 Features

### Primary Investment
- Investors can buy shares from active businesses at listed share price
- Dual funding modes: Instant (immediate) vs Milestone (escrow until target)
- Investment creates receipt with unique code
- Wallet balance debited atomically on investment
- Business shares_sold, escrow_balance, total_raised updated correctly

### Escrow System
- Milestone funding: funds held in escrow until target reached
- Instant funding: funds available to founder immediately
- Automatic escrow release when milestone target reached
- Automatic refunds when milestones fail

### Founder Fund Release
- Founders request release of raised funds
- Admin approval workflow with MFS details
- Payout tracking with TrxID
- Rejection with automatic refund to founder_balance

### Portfolio Management
- Full portfolio view with all holdings
- Average buy price calculation
- Current value and P/L tracking
- Ownership percentage display
- Investment history with receipt codes

### Admin Controls
- Fund release approval/rejection workflow
- Investment monitoring dashboard
- Milestone monitoring with deadline tracking
- Force-release escrow or refund all investors
- Trust score adjustments for funding progress

### Notifications
- Investment confirmed (to investor)
- Investment received (to founder)
- Milestone reached (to all parties)
- Investment refunded (to investor)
- Fund release approved/paid/rejected (to founder)
- Fund release pending (to admin)

### Manual E2E Test Script (Phase 4)
1. As founder: list a milestone-mode business with target ৳1000, share price ৳10, 500 shares
2. Admin verifies → business is active
3. As investor A (KYC verified): buy 30 shares (৳300)
4. Verify: A's wallet debited ৳300; business.escrow_balance = ৳300; A has 30 shares
5. As investor B: buy 70 shares (৳700)
6. Verify: milestone reached (total ৳1000 = target); escrow_balance = 0; founder_balance = ৳1000
7. As founder: request payout of ৳500 → admin approves → mark paid
8. Verify: business.founder_balance = ৳500; founder receives notification

## Phase 5 Features

### Secondary Market Trading
- Buy and sell shares between users on the secondary market
- Limit orders with price-time priority matching engine
- Market orders using last traded price
- Real-time order book showing top 5 bids and asks
- Live price ticker with 24h stats (high, low, volume, change %)

### Order Management
- Place buy/sell orders with live cost preview
- Cancel open orders anytime (full escrow refund)
- View open orders, trade history, and receipts
- Partial fills supported with automatic matching

### Price Discovery
- Primary price frozen at business verification
- Secondary price = last traded price
- Price collapse detection (-3 trust if >50% drop from primary)
- 24h volume tracking per business

### Receipt Transfer System
- FIFO consumption of seller's receipts on trade execution
- Receipt splitting when partial quantities sold
- Full audit trail of all receipt transfers
- Buyer receives new receipt for purchased shares

### Founder Buyback
- Founders can buy back their own business shares
- Uses founder_balance (raised funds)
- Shares go to treasury_shares (not re-sold)
- Admin-visible buyback orders and trades

### Market Maker (Admin)
- Admin can place orders to provide liquidity
- Separate market maker order tracking
- Admin can cancel any user's order (safety valve)
- Full trade reversal capability

### Portfolio Enhancements
- Three tabs: Holdings | Open Orders | History
- Sell button on each holding card
- Real-time P/L tracking with current market price
- Ownership percentage display

### Admin Trading Controls
- View all orders with filters (status, type, business)
- View all trades with full details
- Cancel any open order
- Market maker interface for liquidity provision
- Trade reversal for safety/compliance

### Matching Engine Rules
- Price-time priority: best price first, then earliest order
- Buy orders sorted: price DESC, time ASC
- Sell orders sorted: price ASC, time ASC
- Trade price = price of the earlier (resting) order
- Self-trade prevention enforced
- T+0 instant settlement

### Manual E2E Test Script (Phase 5)
1. User A holds 50 shares from primary investment
2. User B places buy order: 10 shares @ ৳12
3. User A places sell order: 10 shares @ ৳12
4. Verify: orders match, trade executes, B receives receipt
5. Admin places market maker buy: 5 shares @ ৳11
6. User C sells 5 shares @ ৳10 → matches with MM order at ৳11
7. Founder places buyback: 20 shares @ ৳13 → treasury increases
8. Verify: order book updates, trade history correct, receipts transferred

## Phase 6 Features

### Comments & Social Interactions
- Comment on approved business updates (KYC-verified users only)
- Reply to comments (one level of threading)
- Like comments and updates
- Comment anonymization: "Investor #ABC" / "Founder #XYZ"
- Comment moderation: hide, unhide, delete by admins
- Comment bans (per-business, temporary or permanent)

### Notification Preferences
- Granular control over notification categories
- Toggle wallet, KYC, investment, trading, follow, comment, platform announcements
- Saved per-user in notification_prefs table
- Respected by notification system

### Content Reports & Moderation
- Report comments, updates, or businesses
- Reasons: spam, abuse, misinformation, fraud, other
- Admin review queue with action options
- Actions: dismiss, hide comment, delete comment, warn author, ban author, suspend business

### Founder Public Profiles
- Public profile page at /founder/[id]
- Shows anonymized name "Founder #XYZ"
- Displays active ventures
- Shows total raised across ventures
- Follow/unfollow functionality
- Follower count display

### Business Search
- Full-text search across name, category, location, story
- Debounced search (300ms)
- Filter by category and location
- Results sorted by trust score
- Reusable search component

### Platform Announcements
- Admin-created announcements with variants (info, warning, success, critical)
- Global banner display on all pages
- Dismissible per-user (if dismissible=true)
- Date range support (starts_at, ends_at)
- Admin management interface

### Admin Moderation Tools
- /admin/reports: Content reports queue with review actions
- /admin/comments: Comment moderation (hide/unhide/delete)
- /admin/announcements: Create, toggle, delete announcements

### Database Enhancements
- comment_likes, update_likes tables
- founder_follows table
- comment_bans table
- content_reports table
- notification_prefs table
- announcements, announcement_dismissals tables
- Full-text search index on businesses (search_vector)
- Triggers for counter updates (likes_count, comments_count)

### Manual E2E Test Script (Phase 6)
1. User A (KYC verified) comments on a business update → appears publicly
2. User B replies to A's comment → one level of threading shown
3. User A likes B's reply → likes_count updates
4. Founder replies to A's comment → displayed as "Founder #XYZ"
5. Admin hides B's reply with reason → disappears from public but author still sees "Hidden by moderator"
6. User A reports the founder's comment → appears in /admin/reports
7. Admin reviews → dismisses → report marked dismissed
8. User A toggles off comment_replies in notification prefs → stops receiving reply notifications
9. User A follows a founder → founder gets notified
10. User A searches "tea" → only tea-related active businesses show
11. Admin publishes announcement → visible to all users; user dismisses → hidden for that user

## Phase 8 Features

### Ads Manager
- Upload and manage ad banners with 5 placement types
- Track impressions and clicks with CTR calculation
- Priority-based ad selection with budget enforcement
- 30-day stats visualization
- Payment tracking and audit logging
- AdSlot component for platform integration

### Trust Score Automation
- 10 automated rules for trust score updates:
  - Follower milestones (10, 100, 500)
  - Funding milestones (50%, 100%)
  - Update activity (7d, 30d, 60d)
  - Freshness (180d, 365d)
- Idempotent execution with ±5 cap per run
- Manual trigger and job logging
- Notifications on significant changes

### Audit Log Viewer
- Comprehensive admin action logging
- Advanced filtering (admin, action, target, date, search)
- CSV export with UTF-8 BOM for Bangla text
- Color-coded action types
- Pagination for large datasets

### Platform Settings UI
- Edit all platform settings from UI
- 6 categories: Money, Features, Payouts, Milestones, Branding, Trust
- Feature flags for platform control
- Type-safe settings access
- Audit logging on changes

### CSV Export Utility
- UTF-8 CSV generation with BOM
- Proper escaping for commas, quotes, newlines
- Bangla text support
- Predefined column sets for all entities
- Download helper function

### Reporting Dashboard
- 6 KPI cards (Total Raised, Trade Volume, Trades, New Users, Active Users, Ad Revenue)
- 30-day trend chart (SVG visualization)
- Top 5 businesses by raised and trade volume
- Pending queue summaries
- Daily snapshot generation

### Admin Pages
- `/admin` - Reporting dashboard with KPIs and trends
- `/admin/ads` - Ads management list
- `/admin/ads/new` - Create new ad
- `/admin/ads/:id/edit` - Edit existing ad
- `/admin/settings` - Platform settings editor
- `/admin/trust` - Trust automation dashboard
- `/admin/audit` - Full audit log viewer

### Manual E2E Test Script (Phase 8)
1. Admin uploads a market_top ad → market page shows it
2. Clicking ad increments click count → refresh increments impression count
3. Admin runs trust job → businesses with no recent updates drop by -3
4. Running trust job again produces no new event (idempotent)
5. Admin opens /admin/audit → filters to "suspend" → sees only those
6. Admin exports users CSV → opens in Excel → Bangla names render correctly
7. Admin edits min_payout_bdt from 100 to 50 → founder can now request ৳50
8. Admin toggles ads_enabled=false → all ad slots render nothing
9. Admin runs stats snapshot → dashboard shows today's numbers

---

## Important Notes

- **Wallet**: The wallet is an internal ledger system. No cryptocurrency or blockchain is involved. The prefix "CDB" is used for wallet IDs only.
- **Short Mark**: "CapitalDB" is used in the top bar, bottom nav, and anywhere horizontal space is tight.
- **Full Name**: "Capital De Benchmark" is used in metadata, legal pages, page titles, and the landing hero.
- **Currency**: All monetary values are in BDT (৳). Bangla numerals are used when the language is set to Bangla.
- **Phone OTP**: Not implemented in Phase 1. Phone + password auth is used. OTP will be added in a later phase.
- **Demo Mode**: Phase 1 uses a local Zustand store for authentication demo. Supabase Auth will be connected in Phase 2.

---

## Legal Disclaimer

*This platform is for educational and demonstration purposes. Investing in businesses carries financial risk. Users may lose their invested capital. Capital De Benchmark does not guarantee returns. All investments are subject to business performance and market conditions. Please consult a financial advisor before investing.*

---

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL) — to be connected in Phase 2
- **Auth**: Supabase Auth — to be connected in Phase 2
- **i18n**: Custom implementation (bn/en)
- **Deployment**: Vercel (target)

---

© 2025 Capital De Benchmark. All rights reserved.
