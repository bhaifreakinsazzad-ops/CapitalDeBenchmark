# Capital De Benchmark - Launch Checklist

## Pre-Launch

### Infrastructure
- [ ] Domain registered and DNS pointing to Vercel
- [ ] SSL certificate active (Vercel auto)
- [ ] NEXT_PUBLIC_APP_URL set to production domain
- [ ] Supabase production project created
- [ ] All migrations (0001-0009) applied
- [ ] Supabase backups enabled
- [ ] Storage buckets created with correct policies:
  - `kyc-documents` (private)
  - `business-documents` (private)
  - `business-media` (public)
  - `db-backups` (private)

### Environment Variables
- [ ] All variables from `.env.local.example` configured in Vercel
- [ ] Supabase credentials (URL, anon key, service role key)
- [ ] bKash merchant credentials (if enabled)
- [ ] SMS provider credentials (BulkSMSBD)
- [ ] Resend API key for emails
- [ ] Sentry DSN for error tracking

### Accounts & Integrations
- [ ] bKash merchant account live with callback URL whitelisted
- [ ] SMS provider account live with sender ID approved
- [ ] Resend domain verified (SPF, DKIM, DMARC)
- [ ] Sentry project created, DSN set, alerts configured
- [ ] Uptime monitor configured on `/api/health`

### Cron Jobs (vercel.json)
- [ ] Trust score automation: every 6 hours
- [ ] Daily stats snapshot: daily at 00:15
- [ ] Database backup: daily at 02:00
- [ ] Rate limit cleanup: nightly

### Admin Setup
- [ ] Super admin account created
- [ ] 2FA enabled for super admin
- [ ] Initial platform settings configured
- [ ] Legal pages reviewed (or marked as draft)

### Support
- [ ] Support email published: support@capitaldebenchmark.com
- [ ] Support phone published
- [ ] Status page or status channel created (optional)

## Launch Day

### Testing
- [ ] Run full E2E test suite on production
- [ ] Verify one real bKash recharge (৳5 test payment)
- [ ] Verify one real SMS OTP delivery
- [ ] Verify one real welcome email
- [ ] Smoke test: register → KYC → invest → receive receipt → see update
- [ ] Confirm audit log captures every admin action

### Monitoring
- [ ] Check Sentry for errors
- [ ] Verify all cron jobs running
- [ ] Check database connections
- [ ] Monitor API response times
- [ ] Verify backup completed

## Post-Launch (First Week)

### Daily
- [ ] Review Sentry for new issues
- [ ] Review audit log for suspicious activity
- [ ] Check pending queues (recharges, withdrawals, KYC)
- [ ] Verify backup ran successfully
- [ ] Check payment reconciliation

### Weekly
- [ ] Review slow queries (pg_stat_statements)
- [ ] Check database size and growth
- [ ] Review storage usage
- [ ] Reconcile payment_intents vs wallet_txns
- [ ] Review user feedback and support tickets

## Incident Runbook

### Payment Stuck Pending
1. Check payment_intent status
2. Query provider status manually
3. If succeeded: manually credit wallet via credit_wallet()
4. If failed: mark intent as failed, notify user
5. Log action in audit_log with action 'payment_reconciled'

### Wallet Balance Discrepancy
1. Identify affected user and transaction
2. Use credit_wallet() or debit_wallet() with type 'adjustment'
3. Include detailed note in audit_log
4. Notify user of adjustment

### Trade Reversal
1. Go to /admin/trades
2. Find the trade to reverse
3. Click "Reverse" with strong confirmation
4. System will:
   - Reverse wallet transactions
   - Restore holdings
   - Mark trade as reversed
5. Notify affected users

### Business Fraud Suspected
1. Suspend business immediately via /admin/businesses
2. Freeze founder_balance (set to 0, move to holding)
3. Notify all investors
4. Investigate and document
5. Decide: reactivate or permanently close

### Data Breach
1. Rotate all secrets immediately:
   - Supabase keys
   - Payment provider keys
   - SMS/Email API keys
   - Sentry DSN
2. Force logout all users (revoke sessions)
3. Notify affected users
4. Report to authorities as required by law
5. Document incident and response

### On-Call Contacts
- Primary: [Name] - [Phone] - [Email]
- Secondary: [Name] - [Phone] - [Email]
- Escalation: [Name] - [Phone] - [Email]

## Success Metrics (First 30 Days)

- [ ] 100+ registered users
- [ ] 50+ KYC verified users
- [ ] 10+ active businesses
- [ ] ৳50,000+ total raised
- [ ] <1% payment failure rate
- [ ] <0.1% critical error rate
- [ ] >95% uptime

## Notes

- Start with manual processes where possible
- Automate gradually as volume increases
- Document everything for future team members
- Prioritize user feedback and iterate quickly
