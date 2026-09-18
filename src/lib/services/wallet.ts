import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore, useDemoStore } from '../../store';
import { notify, NOTIFICATION_TYPES } from '../services/notify';
import { generateId } from '../utils';

export interface RechargeRequest {
  id: string;
  user_id: string;
  amount: number;
  mfs_method: 'bkash' | 'nagad' | 'rocket' | 'upay';
  trx_id: string;
  sender_number: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  wallet_txn_id?: string;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  mfs_method: 'bkash' | 'nagad' | 'rocket' | 'upay';
  mfs_number: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'failed';
  reviewed_by?: string;
  reviewed_at?: string;
  paid_at?: string;
  payout_trx_id?: string;
  rejection_reason?: string;
  wallet_txn_id?: string;
  created_at: string;
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

interface WalletStore {
  rechargeRequests: RechargeRequest[];
  withdrawalRequests: WithdrawalRequest[];
  walletTxns: WalletTxn[];
  rateLimits: Array<{ user_id: string; action: string; created_at: string }>;
  
  // User actions
  submitRecharge: (data: { amount: number; mfs_method: string; trx_id: string; sender_number: string }) => { success: boolean; error?: string; request_id?: string };
  submitWithdrawal: (data: { amount: number; mfs_method: string; mfs_number: string }) => { success: boolean; error?: string; request_id?: string };
  getUserRecharges: (userId: string) => RechargeRequest[];
  getUserWithdrawals: (userId: string) => WithdrawalRequest[];
  getUserTransactions: (userId: string) => WalletTxn[];
  
  // Admin actions
  approveRecharge: (requestId: string, adminId: string) => { success: boolean; error?: string };
  rejectRecharge: (requestId: string, adminId: string, reason: string) => { success: boolean; error?: string };
  approveWithdrawal: (requestId: string, adminId: string, payoutTrxId: string) => { success: boolean; error?: string };
  markWithdrawalPaid: (requestId: string, adminId: string, payoutTrxId?: string) => { success: boolean; error?: string };
  rejectWithdrawal: (requestId: string, adminId: string, reason: string) => { success: boolean; error?: string };
  
  // Helpers
  generateTxnHash: () => string;
  checkRateLimit: (userId: string, action: string, maxCount: number, windowHours: number) => boolean;
  recordRateLimit: (userId: string, action: string) => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      rechargeRequests: [],
      withdrawalRequests: [],
      walletTxns: [],
      rateLimits: [],

      generateTxnHash: () => {
        const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const hash = '0x' + random.substring(0, 32);
        return hash;
      },

      checkRateLimit: (userId, action, maxCount, windowHours) => {
        const cutoff = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString();
        const count = get().rateLimits.filter(
          (r) => r.user_id === userId && r.action === action && r.created_at > cutoff
        ).length;
        return count < maxCount;
      },

      recordRateLimit: (userId, action) => {
        set((state) => ({
          rateLimits: [...state.rateLimits, { user_id: userId, action, created_at: new Date().toISOString() }],
        }));
      },

      submitRecharge: (data) => {
        const { user } = useAuthStore.getState();
        if (!user) return { success: false, error: 'Not authenticated' };

        // Check rate limit (10 per hour)
        if (!get().checkRateLimit(user.id, 'recharge', 10, 1)) {
          return { success: false, error: 'Too many recharge requests. Please try again later.' };
        }

        // Check for duplicate TrxID
        const existing = get().rechargeRequests.find(
          (r) => r.mfs_method === data.mfs_method && r.trx_id === data.trx_id
        );
        if (existing) {
          return { success: false, error: 'This TrxID has already been used' };
        }

        const request: RechargeRequest = {
          id: generateId(),
          user_id: user.id,
          amount: data.amount,
          mfs_method: data.mfs_method as any,
          trx_id: data.trx_id,
          sender_number: data.sender_number,
          status: 'pending',
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          rechargeRequests: [request, ...state.rechargeRequests],
        }));

        get().recordRateLimit(user.id, 'recharge');
        notify(user.id, NOTIFICATION_TYPES.RECHARGE_SUBMITTED, { amount: data.amount });

        return { success: true, request_id: request.id };
      },

      submitWithdrawal: (data) => {
        const { user } = useAuthStore.getState();
        if (!user) return { success: false, error: 'Not authenticated' };

        // Check KYC status
        if (user.kyc_status !== 'verified') {
          return { success: false, error: 'KYC verification required' };
        }

        // Check rate limit (5 per hour)
        if (!get().checkRateLimit(user.id, 'withdrawal', 5, 1)) {
          return { success: false, error: 'Too many withdrawal requests. Please try again later.' };
        }

        // Check balance
        if (user.balance < data.amount) {
          return { success: false, error: 'Insufficient balance' };
        }

        // Debit wallet immediately
        const txnHash = get().generateTxnHash();
        const newBalance = user.balance - data.amount;
        const txnId = generateId();

        const txn: WalletTxn = {
          id: txnId,
          user_id: user.id,
          type: 'withdrawal',
          amount: -data.amount,
          balance_after: newBalance,
          method: data.mfs_method,
          hash: txnHash,
          status: 'pending',
          note: 'Withdrawal request pending approval',
          created_at: new Date().toISOString(),
        };

        const request: WithdrawalRequest = {
          id: generateId(),
          user_id: user.id,
          amount: data.amount,
          mfs_method: data.mfs_method as any,
          mfs_number: data.mfs_number,
          status: 'pending',
          wallet_txn_id: txnId,
          created_at: new Date().toISOString(),
        };

        // Update user balance
        useAuthStore.getState().updateUser({ balance: newBalance });

        set((state) => ({
          withdrawalRequests: [request, ...state.withdrawalRequests],
          walletTxns: [txn, ...state.walletTxns],
        }));

        get().recordRateLimit(user.id, 'withdrawal');
        notify(user.id, NOTIFICATION_TYPES.WITHDRAWAL_SUBMITTED, { amount: data.amount });

        return { success: true, request_id: request.id };
      },

      getUserRecharges: (userId) => {
        return get().rechargeRequests
          .filter((r) => r.user_id === userId)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 50);
      },

      getUserWithdrawals: (userId) => {
        return get().withdrawalRequests
          .filter((r) => r.user_id === userId)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 50);
      },

      getUserTransactions: (userId) => {
        return get().walletTxns
          .filter((t) => t.user_id === userId)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 100);
      },

      approveRecharge: (requestId, adminId) => {
        const request = get().rechargeRequests.find((r) => r.id === requestId);
        if (!request) return { success: false, error: 'Request not found' };
        if (request.status !== 'pending') return { success: false, error: 'Request already processed' };

        // Credit wallet
        const { user } = useAuthStore.getState();
        const targetUser = useDemoStore.getState().users.find((u) => u.id === request.user_id);
        if (!targetUser) return { success: false, error: 'User not found' };

        const txnHash = get().generateTxnHash();
        const newBalance = targetUser.balance + request.amount;
        const txnId = generateId();

        const txn: WalletTxn = {
          id: txnId,
          user_id: request.user_id,
          type: 'deposit',
          amount: request.amount,
          balance_after: newBalance,
          method: request.mfs_method,
          trx_id: request.trx_id,
          hash: txnHash,
          status: 'completed',
          note: 'MFS recharge approved',
          created_at: new Date().toISOString(),
        };

        // Update user balance in demo store
        useDemoStore.setState((state) => ({
          users: state.users.map((u) =>
            u.id === request.user_id ? { ...u, balance: newBalance } : u
          ),
        }));

        // Update auth store if it's the current user
        if (user && user.id === request.user_id) {
          useAuthStore.getState().updateUser({ balance: newBalance });
        }

        // Update request
        set((state) => ({
          rechargeRequests: state.rechargeRequests.map((r) =>
            r.id === requestId
              ? { ...r, status: 'approved', reviewed_by: adminId, reviewed_at: new Date().toISOString(), wallet_txn_id: txnId }
              : r
          ),
          walletTxns: [txn, ...state.walletTxns],
        }));

        notify(request.user_id, NOTIFICATION_TYPES.RECHARGE_APPROVED, { amount: request.amount });

        return { success: true };
      },

      rejectRecharge: (requestId, adminId, reason) => {
        const request = get().rechargeRequests.find((r) => r.id === requestId);
        if (!request) return { success: false, error: 'Request not found' };
        if (request.status !== 'pending') return { success: false, error: 'Request already processed' };

        set((state) => ({
          rechargeRequests: state.rechargeRequests.map((r) =>
            r.id === requestId
              ? { ...r, status: 'rejected', reviewed_by: adminId, reviewed_at: new Date().toISOString(), rejection_reason: reason }
              : r
          ),
        }));

        notify(request.user_id, NOTIFICATION_TYPES.RECHARGE_REJECTED, { amount: request.amount, reason });

        return { success: true };
      },

      approveWithdrawal: (requestId, adminId, payoutTrxId) => {
        const request = get().withdrawalRequests.find((r) => r.id === requestId);
        if (!request) return { success: false, error: 'Request not found' };
        if (request.status !== 'pending') return { success: false, error: 'Request already processed' };

        set((state) => ({
          withdrawalRequests: state.withdrawalRequests.map((r) =>
            r.id === requestId
              ? { ...r, status: 'approved', reviewed_by: adminId, reviewed_at: new Date().toISOString(), payout_trx_id: payoutTrxId }
              : r
          ),
        }));

        notify(request.user_id, NOTIFICATION_TYPES.WITHDRAWAL_APPROVED, { amount: request.amount });

        return { success: true };
      },

      markWithdrawalPaid: (requestId, adminId, payoutTrxId) => {
        const request = get().withdrawalRequests.find((r) => r.id === requestId);
        if (!request) return { success: false, error: 'Request not found' };
        if (request.status !== 'approved') return { success: false, error: 'Request must be approved first' };

        set((state) => ({
          withdrawalRequests: state.withdrawalRequests.map((r) =>
            r.id === requestId
              ? { ...r, status: 'paid', paid_at: new Date().toISOString(), payout_trx_id: payoutTrxId || r.payout_trx_id }
              : r
          ),
        }));

        notify(request.user_id, NOTIFICATION_TYPES.WITHDRAWAL_PAID, { amount: request.amount });

        return { success: true };
      },

      rejectWithdrawal: (requestId, adminId, reason) => {
        const request = get().withdrawalRequests.find((r) => r.id === requestId);
        if (!request) return { success: false, error: 'Request not found' };
        if (request.status !== 'pending') return { success: false, error: 'Request already processed' };

        // Refund the amount
        const targetUser = useDemoStore.getState().users.find((u) => u.id === request.user_id);
        if (!targetUser) return { success: false, error: 'User not found' };

        const txnHash = get().generateTxnHash();
        const newBalance = targetUser.balance + request.amount;
        const txnId = generateId();

        const txn: WalletTxn = {
          id: txnId,
          user_id: request.user_id,
          type: 'refund',
          amount: request.amount,
          balance_after: newBalance,
          hash: txnHash,
          status: 'completed',
          note: 'Withdrawal rejected — refund',
          created_at: new Date().toISOString(),
        };

        // Update user balance
        useDemoStore.setState((state) => ({
          users: state.users.map((u) =>
            u.id === request.user_id ? { ...u, balance: newBalance } : u
          ),
        }));

        const { user } = useAuthStore.getState();
        if (user && user.id === request.user_id) {
          useAuthStore.getState().updateUser({ balance: newBalance });
        }

        set((state) => ({
          withdrawalRequests: state.withdrawalRequests.map((r) =>
            r.id === requestId
              ? { ...r, status: 'rejected', reviewed_by: adminId, reviewed_at: new Date().toISOString(), rejection_reason: reason }
              : r
          ),
          walletTxns: [txn, ...state.walletTxns],
        }));

        notify(request.user_id, NOTIFICATION_TYPES.WITHDRAWAL_REJECTED, { amount: request.amount, reason });

        return { success: true };
      },
    }),
    { name: 'capitaldb-wallet' }
  )
);
