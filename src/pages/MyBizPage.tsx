import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Shield, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store';
import { useBusinessStore } from '../lib/services/business';
import { EmptyState } from '../components/shared/empty-state';
import { Money } from '../components/shared/money';

export function MyBizPage() {
  const { user, lang } = useAuthStore();
  const { getOwnerBusinesses, upgradeToFounder } = useBusinessStore();
  const isBn = lang === 'bn';

  if (!user) return null;

  // If investor, show upgrade card
  if (user.role === 'investor') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <h1 className="text-2xl font-bold text-brand-text mb-6">{isBn ? 'আমার ব্যবসা' : 'My Ventures'}</h1>
        <div className="card text-center py-12">
          <TrendingUp className="w-12 h-12 text-brand-accent mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-brand-text mb-2">
            {isBn ? 'প্রতিষ্ঠাতা হন' : 'Become a Founder'}
          </h2>
          <p className="text-sm text-brand-muted mb-6">
            {isBn ? 'আপনার ব্যবসা Capital De Benchmark-এ তালিকাভুক্ত করুন' : 'List your business on Capital De Benchmark'}
          </p>
          {user.kyc_status !== 'verified' ? (
            <div>
              <p className="text-xs text-brand-warn mb-3">{isBn ? 'প্রথমে KYC সম্পন্ন করুন' : 'Complete KYC first'}</p>
              <Link to="/wallet/kyc" className="btn-primary">
                {isBn ? 'KYC সম্পন্ন করুন' : 'Complete KYC'}
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                const result = upgradeToFounder();
                if (result.success) window.location.reload();
              }}
              className="btn-primary"
            >
              {isBn ? 'তালিকা শুরু করুন' : 'Start Listing'}
            </button>
          )}
        </div>
      </div>
    );
  }

  const businesses = getOwnerBusinesses(user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-text">{isBn ? 'আমার ব্যবসা' : 'My Ventures'}</h1>
        <Link to="/mybiz/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          {isBn ? 'নতুন' : 'New'}
        </Link>
      </div>

      {businesses.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title={isBn ? 'কোনো ব্যবসা নেই' : 'No ventures yet'}
          description={isBn ? 'আপনার প্রথম ব্যবসা তালিকাভুক্ত করুন' : 'List your first business'}
          actionLabel={isBn ? 'তালিকা শুরু করুন' : 'Start Listing'}
          actionHref="/mybiz/new"
        />
      ) : (
        <div className="grid gap-4">
          {businesses.map((biz) => (
            <Link key={biz.id} to={`/mybiz/${biz.id}`} className="card hover:border-brand-accent/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-brand-text mb-1">{biz.name}</h3>
                  <p className="text-xs text-brand-muted">{biz.category} · {biz.location}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  biz.status === 'active' ? 'bg-brand-accent/10 text-brand-accent' :
                  biz.status === 'pending' ? 'bg-brand-warn/10 text-brand-warn' :
                  biz.status === 'suspended' ? 'bg-brand-bad/10 text-brand-bad' :
                  'bg-brand-bad/10 text-brand-bad'
                }`}>
                  {biz.status === 'active' ? (isBn ? 'সক্রিয়' : 'Active') :
                   biz.status === 'pending' ? (isBn ? 'অপেক্ষমান' : 'Pending') :
                   biz.status === 'suspended' ? (isBn ? 'স্থগিত' : 'Suspended') :
                   (isBn ? 'প্রত্যাখ্যাত' : 'Rejected')}
                </span>
              </div>

              {biz.status === 'rejected' && biz.rejection_reason && (
                <div className="bg-brand-bad/10 border border-brand-bad/20 rounded-lg p-2 mb-3">
                  <p className="text-xs text-brand-bad">{biz.rejection_reason}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-brand-muted">{isBn ? 'মূল্য' : 'Price'}</p>
                  <Money amount={biz.share_price} lang={lang} className="font-semibold" />
                </div>
                <div>
                  <p className="text-brand-muted">{isBn ? 'বিক্রিত' : 'Sold'}</p>
                  <p className="text-brand-text font-semibold">{biz.shares_sold}/{biz.total_shares}</p>
                </div>
                <div>
                  <p className="text-brand-muted">{isBn ? 'ট্রাস্ট' : 'Trust'}</p>
                  <p className="text-brand-text font-semibold">{biz.trust_score}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
