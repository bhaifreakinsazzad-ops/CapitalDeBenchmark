// App Constants
export const APP_FULL_NAME = 'Capital De Benchmark';
export const APP_SHORT_NAME = 'CapitalDB';
export const APP_WALLET_PREFIX = 'CDB';

export const ROLES = ['visitor', 'investor', 'founder', 'admin', 'super_admin'] as const;
export type Role = typeof ROLES[number];

export const CATEGORIES = [
  'Agriculture', 'Food & Beverage', 'Textiles', 'Retail', 'Clean Energy',
  'Services', 'Technology', 'Handicrafts', 'Transport', 'Education'
] as const;

export const MFS_METHODS = [
  { id: 'bkash', name: 'bKash', number: '01778307704', color: '#E2136E' },
  { id: 'nagad', name: 'Nagad', number: '01677975845', color: '#EC1C24' },
  { id: 'rocket', name: 'Rocket', number: '016779758453', color: '#8B1A8B' },
  { id: 'upay', name: 'Upay', number: '01677975845', color: '#00A651' },
] as const;

export const MIN_DEPOSIT_BDT = 5;
export const MIN_INVESTMENT_BDT = 5;
export const MIN_SHARE_PRICE_BDT = 5;
export const TRUST_SCORE_START = 50;

export const BUSINESS_STATUS = ['pending', 'active', 'suspended', 'rejected'] as const;
export const KYC_STATUS = ['pending', 'verified', 'rejected'] as const;
export const ORDER_STATUS = ['open', 'filled', 'cancelled'] as const;
export const ORDER_TYPE = ['buy', 'sell'] as const;
export const UPDATE_STATUS = ['pending', 'approved', 'rejected'] as const;
