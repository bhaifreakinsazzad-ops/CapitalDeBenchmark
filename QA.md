# Capital De Benchmark - QA Checklist

## Testing Methodology

Test each screen in both languages (Bangla/English) on:
- Mobile (375px width)
- Desktop (1440px width)

For each screen, verify:
- [ ] Renders without console errors
- [ ] All strings localized (no English leakage in Bangla mode)
- [ ] All numbers formatted per locale (Bangla numerals in Bangla mode)
- [ ] All buttons work
- [ ] Loading states appear on slow network (throttle to 3G)
- [ ] Error states handled (simulate API failure)
- [ ] Focus rings visible, tab order logical
- [ ] Tap targets ≥ 44px
- [ ] No horizontal scroll

## Public Pages

### Landing Page (/)
- [ ] Bangla version
- [ ] English version
- [ ] Mobile responsive
- [ ] Desktop responsive
- [ ] All CTAs work

### Market (/market)
- [ ] Bangla version
- [ ] English version
- [ ] Search works
- [ ] Filters work
- [ ] Sort works
- [ ] Business cards display correctly
- [ ] Empty state shows when no businesses

### Business Detail (/biz/[slug])
- [ ] Bangla version
- [ ] English version
- [ ] Hero section displays
- [ ] Story section displays
- [ ] Financials display
- [ ] Funding mode explainer shows
- [ ] Invest box shows (for active businesses)
- [ ] Updates feed displays
- [ ] Follow button works

### Learn (/learn)
- [ ] Bangla version
- [ ] English version
- [ ] All 8 topics display
- [ ] Links work

### Learn Topics (/learn/[topic])
- [ ] What is Micro-Investing
- [ ] How to Start
- [ ] Understanding Shares
- [ ] How Prices Move
- [ ] Risks and Rights
- [ ] Wallet and Escrow
- [ ] Glossary
- [ ] FAQ
- [ ] All bilingual
- [ ] TOC works

### Legal Pages (/legal/[page])
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Risk Disclosure
- [ ] Refund Policy
- [ ] Cookie Policy
- [ ] AML/KYC Policy
- [ ] Grievance Redressal
- [ ] All bilingual

## Auth Pages

### Login (/login)
- [ ] Bangla version
- [ ] English version
- [ ] Phone input works
- [ ] Password input works
- [ ] Validation works
- [ ] Error messages show
- [ ] Redirect works

### Register (/register)
- [ ] Bangla version
- [ ] English version
- [ ] All fields work
- [ ] Validation works
- [ ] Terms checkbox required
- [ ] Redirect to onboarding

### Onboarding (/onboarding)
- [ ] 5 steps work
- [ ] Progress indicator works
- [ ] Risk acknowledgement required
- [ ] Skip button works
- [ ] Redirect to dashboard

## Authenticated Pages

### Dashboard (/dashboard)
- [ ] Bangla version
- [ ] English version
- [ ] Stats display correctly
- [ ] Quick actions work
- [ ] Recent activity shows

### Portfolio (/portfolio)
- [ ] Bangla version
- [ ] English version
- [ ] Holdings list displays
- [ ] P/L calculation correct
- [ ] Sell button works
- [ ] Tabs work (Holdings/Orders/History)
- [ ] Empty state shows

### Wallet (/wallet)
- [ ] Bangla version
- [ ] English version
- [ ] Balance displays
- [ ] Wallet ID with copy button
- [ ] Escrow notice shows
- [ ] Transaction history displays
- [ ] Recharge button works
- [ ] Withdraw button works

### Wallet Recharge (/wallet/recharge)
- [ ] Bangla version
- [ ] English version
- [ ] MFS method selection
- [ ] Payment instructions show
- [ ] Form validation
- [ ] Success screen shows

### Wallet Withdraw (/wallet/withdraw)
- [ ] Bangla version
- [ ] English version
- [ ] KYC check
- [ ] Form validation
- [ ] Success screen shows

### Wallet KYC (/wallet/kyc)
- [ ] Bangla version
- [ ] English version
- [ ] All fields work
- [ ] File upload works
- [ ] Validation works
- [ ] Success screen shows

### Invest (/invest/[slug])
- [ ] Bangla version
- [ ] English version
- [ ] Share input works
- [ ] Total calculation correct
- [ ] Balance check works
- [ ] Risk checkbox required
- [ ] Success screen shows

### Trade (/trade/[slug])
- [ ] Bangla version
- [ ] English version
- [ ] Buy/Sell toggle works
- [ ] Order form works
- [ ] Order book displays
- [ ] Recent trades show

### My Business (/mybiz)
- [ ] Bangla version
- [ ] English version
- [ ] Founder upgrade card shows (for investors)
- [ ] Business list displays
- [ ] New business button works

### New Business (/mybiz/new)
- [ ] Bangla version
- [ ] English version
- [ ] 5-step form works
- [ ] Validation works
- [ ] File uploads work
- [ ] Success screen shows

### Manage Business (/mybiz/[id])
- [ ] Bangla version
- [ ] English version
- [ ] Tabs work
- [ ] Stats display
- [ ] Edit button works
- [ ] Updates tab works
- [ ] Funds tab works

### Post Update (/mybiz/[id]/updates/new)
- [ ] Bangla version
- [ ] English version
- [ ] Form works
- [ ] Validation works
- [ ] Success screen shows

### Feed (/feed)
- [ ] Bangla version
- [ ] English version
- [ ] Updates display
- [ ] Infinite scroll works
- [ ] Empty state shows

### Search (/search)
- [ ] Bangla version
- [ ] English version
- [ ] Search works
- [ ] Filters work
- [ ] Results display
- [ ] Empty state shows

### Founder Profile (/founder/[id])
- [ ] Bangla version
- [ ] English version
- [ ] Profile displays
- [ ] Ventures list shows
- [ ] Follow button works

### Notifications (/notifications)
- [ ] Bangla version
- [ ] English version
- [ ] List displays
- [ ] Mark as read works
- [ ] Mark all read works
- [ ] Empty state shows

### Notification Settings (/settings/notifications)
- [ ] Bangla version
- [ ] English version
- [ ] All toggles work
- [ ] Changes save

## Admin Pages

### Dashboard (/admin)
- [ ] KPI cards display
- [ ] Trend chart shows
- [ ] Top lists display
- [ ] Pending queues show

### Verify (/admin/verify)
- [ ] Business list displays
- [ ] Approve button works
- [ ] Reject button works
- [ ] Reason modal works

### KYC (/admin/kyc)
- [ ] Submissions list displays
- [ ] Document viewer works
- [ ] Approve button works
- [ ] Reject button works

### Users (/admin/users)
- [ ] User list displays
- [ ] Filters work
- [ ] Search works

### Recharge (/admin/recharge)
- [ ] Request list displays
- [ ] Approve button works
- [ ] Reject button works

### Withdraw (/admin/withdraw)
- [ ] Request list displays
- [ ] Approve button works
- [ ] Mark paid button works
- [ ] Reject button works

### Orders (/admin/orders)
- [ ] Order list displays
- [ ] Filters work
- [ ] Cancel button works

### Trades (/admin/trades)
- [ ] Trade list displays
- [ ] Filters work
- [ ] Reverse button works

### Market Maker (/admin/market-maker)
- [ ] Form works
- [ ] Order placement works

### Reports (/admin/reports)
- [ ] Report list displays
- [ ] Review modal works
- [ ] Actions work

### Comments (/admin/comments)
- [ ] Comment list displays
- [ ] Hide button works
- [ ] Unhide button works
- [ ] Delete button works

### Announcements (/admin/announcements)
- [ ] Announcement list displays
- [ ] Create form works
- [ ] Toggle active works
- [ ] Delete works

### Updates (/admin/updates)
- [ ] Update list displays
- [ ] Approve button works
- [ ] Reject button works

### Audit (/admin/audit)
- [ ] Log list displays
- [ ] Filters work
- [ ] Search works
- [ ] CSV export works

### Ads (/admin/ads)
- [ ] Ad list displays
- [ ] Create button works
- [ ] Edit button works
- [ ] Toggle works
- [ ] Delete works

### Settings (/admin/settings)
- [ ] All settings display
- [ ] Edit works
- [ ] Save works
- [ ] Reset works

### Trust (/admin/trust)
- [ ] Jobs list displays
- [ ] Run now button works
- [ ] Events list shows

### Investments (/admin/investments)
- [ ] Investment list displays
- [ ] Filters work

### Release (/admin/release)
- [ ] Release request list displays
- [ ] Approve button works
- [ ] Mark paid button works
- [ ] Reject button works

### Milestone (/admin/milestone)
- [ ] Milestone businesses display
- [ ] Refund button works

## Performance

### Lighthouse (Mobile)
- [ ] /market: Performance ≥ 85, A11y ≥ 95
- [ ] /biz/[slug]: Performance ≥ 80, A11y ≥ 95
- [ ] /wallet: Performance ≥ 85, A11y ≥ 95

### Load Times
- [ ] Initial load < 3s on 3G
- [ ] Page transitions < 500ms
- [ ] API responses < 500ms (p95)

## Security

- [ ] CSRF protection on all mutating endpoints
- [ ] Rate limiting working
- [ ] 2FA works for admins
- [ ] Session management works
- [ ] Input validation on all forms
- [ ] SQL injection attempts blocked
- [ ] XSS attempts blocked

## Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Alt text on all images
- [ ] ARIA labels present

## Final Sign-Off

- [ ] All pages tested in Bangla
- [ ] All pages tested in English
- [ ] All pages tested on mobile
- [ ] All pages tested on desktop
- [ ] No console errors
- [ ] No broken links
- [ ] All features working
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Accessibility verified

**QA Completed By:** _______________
**Date:** _______________
**Status:** ☐ PASS  ☐ FAIL
