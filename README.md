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
| 3 | Business Listing — Founders create businesses, admin verifies |
| 4 | Investment Flow — Buy shares, create receipts, update holdings |
| 5 | Trading Exchange — Order book, matching engine, tradable receipts |
| 6 | Advanced KYC — Enhanced verification, compliance |
| 7 | Updates & Social — Founder posts, comments, notifications |
| 8 | Admin Operations — Full admin dashboard enhancements |
| 9 | Launch Polish — PWA, performance, analytics, legal pages |

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
