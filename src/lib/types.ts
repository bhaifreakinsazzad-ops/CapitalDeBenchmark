import type { Role } from './constants';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: Role;
  kyc_status: 'pending' | 'verified' | 'rejected';
  kyc_docs: Array<{ type: string; url: string; uploaded_at: string }>;
  wallet_id: string;
  balance: number;
  preferred_lang: 'bn' | 'en';
  trust_flags: Record<string, unknown>;
  kyc_submitted_at?: string;
  kyc_reviewed_by?: string;
  kyc_reviewed_at?: string;
  kyc_rejection_reason?: string;
  whatsapp_number?: string;
  present_address?: string;
  nid_number?: string;
  payout_mfs_method?: 'bkash' | 'nagad' | 'rocket' | 'upay';
  payout_mfs_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  category: string;
  location: string;
  story: string;
  share_price: number;
  total_shares: number;
  shares_sold: number;
  funding_mode: 'instant' | 'milestone';
  milestone_target?: number;
  revenue_monthly: number;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  trust_score: number;
  docs: Array<{ type: string; url: string }>;
  photos: string[];
  rejection_reason?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Holding {
  id: string;
  user_id: string;
  business_id: string;
  shares: number;
  avg_buy_price: number;
  updated_at: string;
}

export interface Receipt {
  id: string;
  receipt_code: string;
  user_id: string;
  business_id: string;
  shares: number;
  price: number;
  status: 'active' | 'transferred' | 'redeemed';
  issued_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  business_id: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  status: 'open' | 'filled' | 'cancelled';
  is_market_maker: boolean;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: string;
  business_id: string;
  buyer_id: string;
  seller_id: string;
  shares: number;
  price: number;
  buy_order_id: string;
  sell_order_id: string;
  executed_at: string;
}

export interface WalletTxn {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'trade_buy' | 'trade_sell' | 'refund' | 'fee' | 'adjustment';
  amount: number;
  balance_after: number;
  method?: string;
  trx_id?: string;
  hash: string;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  note?: string;
  created_at: string;
}

export interface Update {
  id: string;
  business_id: string;
  author_id: string;
  title: string;
  body: string;
  media: string[];
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  update_id: string;
  user_id: string;
  body: string;
  status: 'approved' | 'hidden';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  payload: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export interface Follow {
  id: string;
  user_id: string;
  business_id: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type?: string;
  target_id?: string;
  meta: Record<string, unknown>;
  created_at: string;
}

export interface Ad {
  id: string;
  image_url: string;
  link_url?: string;
  placement: string;
  active: boolean;
  impressions: number;
  clicks: number;
  created_at: string;
}

export interface PlatformSetting {
  key: string;
  value: unknown;
  updated_at: string;
}
