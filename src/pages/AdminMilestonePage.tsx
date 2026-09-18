import { useAuthStore } from '../store';
import { useBusinessStore } from '../lib/services/business';
import { useInvestmentStore } from '../lib/services/investments';
import { Money } from '../components/shared/money';
import { formatDate } from '../lib/utils';
import { Target, AlertTriangle, CheckCircle } from 'lucide-react';

export function AdminMilestonePage() {
  const { user, lang } = useAuthStore();
  const { businesses, bumpTrustScore } = useBusinessStore();
  const { refundInvestment } = useInvestmentStore();
  const isBn = lang === 'bn';

  const milestoneBusinesses = businesses.filter(b => b.funding_mode === 'milestone' && b.status === 'active');

  const getProgress = (b: typeof businesses[0]) => {
    if (!b.milestone_target) return 0;
    return Math.min(100, Math.round((b.escrow_balance / b.milestone_target) * 100));
  };

  const getDaysLeft = (b: typeof businesses[0]) => {
    if (!b.milestone_reached_at) return null;
    const deadline = new Date(b.milestone_reached_at);
    deadline.setDate(deadline.getDate() + 90); // 90 days from verification
    const now = new Date();
    const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const handleRefundMilestone = (businessId: string) => {
    if (!user) return;
    const business = businesses.find(b => b.id === businessId);
    if (!business) return;

    const confirmed = window.confirm(
      isBn 
        ? `আপনি কি নিশ্চিত যে আপনি "${business.name}" এর সব বিনিয়োগকারীকে ফেরত দিতে চান? এটি অপরিবর্তনীয়।`
        : `Are you sure you want to refund all investors for "${business.name}"? This is irreversible.`
    );

    if (!confirmed) return;

    // Refund all escrowed investments for this business
    const { investments } = useInvestmentStore.getState();
    const escrowedInvestments = investments.filter(i => i.business_id === businessId && i.status === 'escrowed');
    
    escrowedInvestments.forEach(inv => {
      refundInvestment(inv.id, user.id);
    });

    // Suspend the business
    useBusinessStore.setState((state) => ({
      businesses: state.businesses.map(b =>
        b.id === businessId
          ? { 
              ...b, 
              status: 'suspended' as const, 
              suspension_reason: isBn ? 'মাইলস্টোন অর্জিত হয়নি' : 'Milestone not reached',
              suspended_at: new Date().toISOString(),
              suspended_by: user.id,
              escrow_balance: 0,
            }
          : b
      ),
    }));

    // Bump trust score down
    bumpTrustScore(businessId, -20, 'Milestone failed - all investors refunded', user.id);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'মাইলস্টোন মনিটরিং' : 'Milestone Monitoring'}</h1>

      {milestoneBusinesses.length === 0 ? (
        <div className="card text-center py-12">
          <Target className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো সক্রিয় মাইলস্টোন ব্যবসা নেই' : 'No active milestone businesses'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {milestoneBusinesses.map((biz) => {
            const progress = getProgress(biz);
            const daysLeft = getDaysLeft(biz);
            const isReached = biz.escrow_balance >= (biz.milestone_target || 0) && biz.milestone_target;

            return (
              <div key={biz.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-brand-text">{biz.name}</h3>
                    <p className="text-xs text-brand-muted">{biz.category} · {biz.location}</p>
                  </div>
                  {isReached ? (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-brand-accent/10 text-brand-accent flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {isBn ? 'লক্ষ্য অর্জিত' : 'Target Reached'}
                    </span>
                  ) : daysLeft !== null && daysLeft < 30 ? (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-brand-bad/10 text-brand-bad flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {isBn ? `${daysLeft} দিন বাকি` : `${daysLeft} days left`}
                    </span>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs">
                  <div>
                    <p className="text-brand-muted">{isBn ? 'এসক্রো ব্যালেন্স' : 'Escrow Balance'}</p>
                    <Money amount={biz.escrow_balance} lang={lang} className="font-semibold" />
                  </div>
                  <div>
                    <p className="text-brand-muted">{isBn ? 'লক্ষ্য' : 'Target'}</p>
                    <Money amount={biz.milestone_target || 0} lang={lang} className="font-semibold" />
                  </div>
                  <div>
                    <p className="text-brand-muted">{isBn ? 'অগ্রগতি' : 'Progress'}</p>
                    <p className="text-brand-text font-semibold">{progress}%</p>
                  </div>
                  <div>
                    <p className="text-brand-muted">{isBn ? 'বিক্রিত শেয়ার' : 'Shares Sold'}</p>
                    <p className="text-brand-text font-semibold">{biz.shares_sold} / {biz.total_shares}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="h-2 bg-brand-line rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isReached ? 'bg-brand-accent' : 'bg-brand-warn'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {!isReached && (
                  <button
                    onClick={() => handleRefundMilestone(biz.id)}
                    className="btn-ghost w-full text-sm text-brand-bad border-brand-bad/30 hover:bg-brand-bad/10"
                  >
                    {isBn ? 'সব বিনিয়োগকারীকে ফেরত দিন (মাইলস্টোন ব্যর্থ)' : 'Refund All Investors (Milestone Failed)'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
