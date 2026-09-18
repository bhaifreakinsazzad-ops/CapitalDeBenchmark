import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore, useDemoStore } from '../../store';
import { useWalletStore } from '../services/wallet';
import { useBusinessStore } from '../services/business';
import { notify, NOTIFICATION_TYPES } from '../services/notify';
import { generateId } from '../utils';

export interface Investment {
  id: string;
  user_id: string;
  business_id: string;
  shares: number;
  price_per_share: number;
  total_amount: number;
  wallet_txn_id?: string;
  receipt_id?: string;
  status: 'active' | 'refunded' | 'escrowed';
  created_at: string;
}

export interface FundReleaseRequest {
  id: string;
  business_id: string;
  founder_id: string;
  amount: number;
  mfs_method: 'bkash' | 'nagad' | 'rocket' | 'upay';
  mfs_number: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  paid_at?: string;
  payout_trx_id?: string;
  rejection_reason?: string;
  created_at: string;
}

interface InvestmentStore {
  investments: Investment[];
  fundReleaseRequests: FundReleaseRequest[];

  // Investor actions
      investInBusiness: (data: {
    business_id: string;
    shares: number;
  }) => { success: boolean; error?: string; investment_id?: string };
  getUserInvestments: (userId: string) => Investment[];
  getBusinessInvestments: (businessId: string) => Investment[];

  // Founder actions
  requestFundRelease: (data: {
    business_id: string;
    amount: number;
    mfs_method: 'bkash' | 'nagad' | 'rocket' | 'upay';
    mfs_number: string;
  }) => { success: boolean; error?: string; request_id?: string };

  getFounderFundReleases: (founderId: string) => FundReleaseRequest[];

  // Admin actions
  approveFundRelease: (requestId: string, adminId: string) => { success: boolean; error?: string };
  markFundReleasePaid: (requestId: string, adminId: string, payoutTrxId: string) => { success: boolean; error?: string };
  rejectFundRelease: (requestId: string, adminId: string, reason: string) => { success: boolean; error?: string };
  refundInvestment: (investmentId: string, adminId: string) => { success: boolean; error?: string };
}

export const useInvestmentStore = create<InvestmentStore>()(
  persist(
    (set, get) => ({
      investments: [],
      fundReleaseRequests: [],

      investInBusiness: (data) => {
        const { user, updateUser } = useAuthStore.getState();
        if (!user) return { success: false, error: 'Not authenticated' };

        const { businesses, bumpTrustScore } = useBusinessStore.getState();
        const business = businesses.find(b => b.id === data.business_id);
        if (!business) return { success: false, error: 'Business not found' };
        if (business.status !== 'active') return { success: false, error: 'Business not active' };

        // Check shares available
        const sharesAvailable = business.total_shares - business.shares_sold;
        if (data.shares > sharesAvailable) {
          return { success: false, error: `Only ${sharesAvailable} shares available` };
        }

        const totalAmount = data.shares * business.share_price;

        // Check wallet balance
        if (user.balance < totalAmount) {
          return { success: false, error: 'Insufficient wallet balance' };
        }

        // Debit wallet
        const walletStore = useWalletStore.getState();
        const debitResult = walletStore.submitWithdrawal({
          amount: totalAmount,
          mfs_method: 'bkash', // Internal transfer
          mfs_number: '00000000000', // Platform account
        });

        if (!debitResult.success) {
          return { success: false, error: 'Wallet debit failed' };
        }

        // Determine status based on funding mode
        const status = business.funding_mode === 'instant' ? 'active' : 'escrowed';

        const investmentId = generateId();
        const investment: Investment = {
          id: investmentId,
          user_id: user.id,
          business_id: data.business_id,
          shares: data.shares,
          price_per_share: business.share_price,
          total_amount: totalAmount,
          wallet_txn_id: debitResult.request_id,
          status,
          created_at: new Date().toISOString(),
        };

        // Update business stats
        useBusinessStore.setState((state) => ({
          businesses: state.businesses.map(b => {
            if (b.id !== data.business_id) return b;
            
            const newSharesSold = b.shares_sold + data.shares;
            let newEscrowBalance = b.escrow_balance;
            let newTotalRaised = b.total_raised;
            let milestoneReachedAt = b.milestone_reached_at;

            if (business.funding_mode === 'instant') {
              newTotalRaised += totalAmount;
            } else {
              newEscrowBalance += totalAmount;
              
              // Check if milestone reached
              if (b.milestone_target && newEscrowBalance >= b.milestone_target && !milestoneReachedAt) {
                milestoneReachedAt = new Date().toISOString();
                newTotalRaised += newEscrowBalance;
                newEscrowBalance = 0;
                bumpTrustScore(b.id, 5, 'Milestone funding target reached');
              }
            }

            return {
              ...b,
              shares_sold: newSharesSold,
              escrow_balance: newEscrowBalance,
              total_raised: newTotalRaised,
              milestone_reached_at: milestoneReachedAt,
              updated_at: new Date().toISOString(),
            };
          }),
        }));

        // Bump trust score for funding progress
        const updatedBusiness = useBusinessStore.getState().businesses.find(b => b.id === data.business_id);
        if (updatedBusiness && updatedBusiness.shares_sold >= 10) {
          bumpTrustScore(data.business_id, 2, 'Reached 10 shares sold');
        }

        set((state) => ({
          investments: [investment, ...state.investments],
        }));

        // Notify founder
        notify(business.owner_id, 'new_investment', {
          business_id: data.business_id,
          business_name: business.name,
          investor_name: user.name,
          shares: data.shares,
          amount: totalAmount,
        });

        return { success: true, investment_id: investmentId };
      },

      getUserInvestments: (userId) => {
        return get().investments
          .filter(i => i.user_id === userId)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      },

      getBusinessInvestments: (businessId) => {
        return get().investments
          .filter(i => i.business_id === businessId)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      },

      requestFundRelease: (data) => {
        const { user } = useAuthStore.getState();
        if (!user) return { success: false, error: 'Not authenticated' };

        const { businesses } = useBusinessStore.getState();
        const business = businesses.find(b => b.id === data.business_id);
        if (!business) return { success: false, error: 'Business not found' };
        if (business.owner_id !== user.id) return { success: false, error: 'Not authorized' };

        // Check available balance
        if (business.total_raised < data.amount) {
          return { success: false, error: 'Insufficient available balance' };
        }

        const requestId = generateId();
        const request: FundReleaseRequest = {
          id: requestId,
          business_id: data.business_id,
          founder_id: user.id,
          amount: data.amount,
          mfs_method: data.mfs_method,
          mfs_number: data.mfs_number,
          status: 'pending',
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          fundReleaseRequests: [request, ...state.fundReleaseRequests],
        }));

        // Notify admins
        const { users } = useDemoStore.getState();
        users.filter(u => u.role === 'admin' || u.role === 'super_admin').forEach(admin => {
          notify(admin.id, 'fund_release_pending', {
            request_id: requestId,
            business_id: data.business_id,
            business_name: business.name,
            amount: data.amount,
            founder_name: user.name,
          });
        });

        return { success: true, request_id: requestId };
      },

      getFounderFundReleases: (founderId) => {
        return get().fundReleaseRequests
          .filter(r => r.founder_id === founderId)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      },

      approveFundRelease: (requestId, adminId) => {
        const request = get().fundReleaseRequests.find(r => r.id === requestId);
        if (!request) return { success: false, error: 'Request not found' };
        if (request.status !== 'pending') return { success: false, error: 'Request not pending' };

        const { businesses } = useBusinessStore.getState();
        const business = businesses.find(b => b.id === request.business_id);
        if (!business) return { success: false, error: 'Business not found' };

        // Check available balance
        if (business.total_raised < request.amount) {
          return { success: false, error: 'Insufficient available balance' };
        }

        // Deduct from available balance
        useBusinessStore.setState((state) => ({
          businesses: state.businesses.map(b =>
            b.id === request.business_id
              ? { ...b, total_raised: b.total_raised - request.amount, updated_at: new Date().toISOString() }
              : b
          ),
        }));

        set((state) => ({
          fundReleaseRequests: state.fundReleaseRequests.map(r =>
            r.id === requestId
              ? { ...r, status: 'approved', reviewed_by: adminId, reviewed_at: new Date().toISOString() }
              : r
          ),
        }));

        notify(request.founder_id, 'fund_release_approved', {
          request_id: requestId,
          business_id: request.business_id,
          business_name: business.name,
          amount: request.amount,
        });

        return { success: true };
      },

      markFundReleasePaid: (requestId, adminId, payoutTrxId) => {
        const request = get().fundReleaseRequests.find(r => r.id === requestId);
        if (!request) return { success: false, error: 'Request not found' };
        if (request.status !== 'approved') return { success: false, error: 'Request not approved' };

        const { businesses } = useBusinessStore.getState();
        const business = businesses.find(b => b.id === request.business_id);

        set((state) => ({
          fundReleaseRequests: state.fundReleaseRequests.map(r =>
            r.id === requestId
              ? { ...r, status: 'paid', paid_at: new Date().toISOString(), payout_trx_id: payoutTrxId }
              : r
          ),
        }));

        if (business) {
          notify(request.founder_id, 'fund_release_paid', {
            request_id: requestId,
            business_id: request.business_id,
            business_name: business.name,
            amount: request.amount,
            payout_trx_id: payoutTrxId,
          });
        }

        return { success: true };
      },

      rejectFundRelease: (requestId, adminId, reason) => {
        const request = get().fundReleaseRequests.find(r => r.id === requestId);
        if (!request) return { success: false, error: 'Request not found' };
        if (request.status !== 'pending') return { success: false, error: 'Request not pending' };

        const { businesses } = useBusinessStore.getState();
        const business = businesses.find(b => b.id === request.business_id);

        set((state) => ({
          fundReleaseRequests: state.fundReleaseRequests.map(r =>
            r.id === requestId
              ? { ...r, status: 'rejected', reviewed_by: adminId, reviewed_at: new Date().toISOString(), rejection_reason: reason }
              : r
          ),
        }));

        if (business) {
          notify(request.founder_id, 'fund_release_rejected', {
            request_id: requestId,
            business_id: request.business_id,
            business_name: business.name,
            amount: request.amount,
            reason,
          });
        }

        return { success: true };
      },

      refundInvestment: (investmentId, adminId) => {
        const investment = get().investments.find(i => i.id === investmentId);
        if (!investment) return { success: false, error: 'Investment not found' };
        if (investment.status !== 'escrowed') return { success: false, error: 'Investment not in escrow' };

        const { businesses } = useBusinessStore.getState();
        const business = businesses.find(b => b.id === investment.business_id);
        if (!business) return { success: false, error: 'Business not found' };

        // Refund wallet
        const { user, updateUser } = useAuthStore.getState();
        if (user && user.id === investment.user_id) {
          updateUser({ balance: user.balance + investment.total_amount });
        }

        // Update investment status
        set((state) => ({
          investments: state.investments.map(i =>
            i.id === investmentId ? { ...i, status: 'refunded' } : i
          ),
        }));

        // Update business stats
        useBusinessStore.setState((state) => ({
          businesses: state.businesses.map(b =>
            b.id === investment.business_id
              ? {
                  ...b,
                  shares_sold: b.shares_sold - investment.shares,
                  escrow_balance: b.escrow_balance - investment.total_amount,
                  refunded_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }
              : b
          ),
        }));

        notify(investment.user_id, 'investment_refunded', {
          business_id: investment.business_id,
          business_name: business.name,
          amount: investment.total_amount,
          reason: 'Milestone funding target not reached',
        });

        return { success: true };
      },
    }),
    { name: 'capitaldb-investments' }
  )
);
