import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useBusinessStore } from '../../lib/services/business';
import { useInvestmentStore } from '../../lib/services/investments';
import { Money } from '../../components/shared/money';

export function InvestPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, lang } = useAuthStore();
  const { getBusinessBySlug } = useBusinessStore();
  const { investInBusiness } = useInvestmentStore();
  const navigate = useNavigate();
  const isBn = lang === 'bn';

  const business = slug ? getBusinessBySlug(slug) : undefined;
  const [shares, setShares] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [riskAccepted, setRiskAccepted] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!business) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-brand-muted text-center">{isBn ? 'ব্যবসা পাওয়া যায়নি' : 'Business not found'}</p>
      </div>
    );
  }

  if (business.status !== 'active') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-brand-muted text-center">{isBn ? 'এই ব্যবসা বিনিয়োগের জন্য সক্রিয় নয়' : 'This business is not active for investment'}</p>
      </div>
    );
  }

  const sharesAvailable = business.total_shares - business.shares_sold;
  const totalAmount = shares * business.share_price;
  const canAfford = user.balance >= totalAmount;

  const handleInvest = () => {
    setError('');
    
    if (shares < 1) {
      setError(isBn ? 'কমপক্ষে ১টি শেয়ার কিনুন' : 'Buy at least 1 share');
      return;
    }
    if (shares > sharesAvailable) {
      setError(isBn ? `মাত্র ${sharesAvailable}টি শেয়ার উপলব্ধ` : `Only ${sharesAvailable} shares available`);
      return;
    }
    if (!canAfford) {
      setError(isBn ? 'অপর্যাপ্ত ব্যালেন্স' : 'Insufficient balance');
      return;
    }
    if (!riskAccepted) {
      setError(isBn ? 'ঝুঁকি প্রকাশ পড়েছেন এবং মেনে নিয়েছেন তা নিশ্চিত করুন' : 'Please confirm you have read and accepted the risk disclosure');
      return;
    }

    const result = investInBusiness({
      business_id: business.id,
      shares,
    });

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Investment failed');
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-brand-accent" />
          </div>
          <h1 className="text-xl font-bold text-brand-text mb-2">
            {isBn ? 'বিনিয়োগ সফল!' : 'Investment Successful!'}
          </h1>
          <p className="text-sm text-brand-muted mb-2">
            {isBn ? `আপনি ${business.name}-এ ${shares}টি শেয়ার কিনেছেন` : `You purchased ${shares} shares in ${business.name}`}
          </p>
          <p className="text-lg font-bold text-brand-accent mb-6">
            <Money amount={totalAmount} lang={lang} />
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/portfolio')} className="btn-primary">
              {isBn ? 'পোর্টফোলিও দেখুন' : 'View Portfolio'}
            </button>
            <button onClick={() => navigate(`/biz/${business.slug}`)} className="btn-ghost">
              {isBn ? 'ব্যবসায় ফিরুন' : 'Back to Business'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <button onClick={() => navigate(`/biz/${business.slug}`)} className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text mb-4">
        <ArrowLeft className="w-4 h-4" />
        {isBn ? 'ফিরে যান' : 'Back'}
      </button>

      <h1 className="text-2xl font-bold text-brand-text mb-2">{isBn ? 'বিনিয়োগ করুন' : 'Invest'}</h1>
      <p className="text-sm text-brand-muted mb-6">{business.name}</p>

      {error && (
        <div className="bg-brand-bad/10 border border-brand-bad/30 rounded-xl p-3 text-sm text-brand-bad mb-4">
          {error}
        </div>
      )}

      {/* Investment form */}
      <div className="card mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">
              {isBn ? 'শেয়ার সংখ্যা' : 'Number of Shares'}
            </label>
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={sharesAvailable}
              inputMode="numeric"
            />
            <p className="text-xs text-brand-muted mt-1">
              {isBn ? `উপলব্ধ: ${sharesAvailable}` : `Available: ${sharesAvailable}`}
            </p>
          </div>

          <div className="border-t border-brand-line pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">{isBn ? 'প্রতি শেয়ার মূল্য' : 'Price per share'}</span>
              <Money amount={business.share_price} lang={lang} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">{isBn ? 'শেয়ার সংখ্যা' : 'Shares'}</span>
              <span className="text-brand-text">{shares}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-brand-line pt-2">
              <span className="text-brand-text">{isBn ? 'মোট' : 'Total'}</span>
              <Money amount={totalAmount} lang={lang} className="text-brand-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Balance check */}
      <div className={`card mb-6 ${canAfford ? 'border-brand-accent/20' : 'border-brand-bad/20'}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-muted">{isBn ? 'আপনার ব্যালেন্স' : 'Your Balance'}</span>
          <Money amount={user.balance} lang={lang} className="font-semibold" />
        </div>
        {!canAfford && (
          <div className="mt-2 flex items-center gap-2 text-xs text-brand-bad">
            <AlertCircle className="w-3 h-3" />
            <span>{isBn ? 'অপর্যাপ্ত ব্যালেন্স। ওয়ালেট রিচার্জ করুন।' : 'Insufficient balance. Recharge your wallet.'}</span>
          </div>
        )}
      </div>

      {/* Funding mode info */}
      <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-xl p-3 mb-6">
        <p className="text-xs text-brand-muted">
          {business.funding_mode === 'instant'
            ? (isBn
              ? 'তাৎক্ষণিক ফান্ডিং — আপনার বিনিয়োগ সাথে সাথেই ব্যবসায় যোগ হবে।'
              : 'Instant Funding — your investment goes to the business immediately.')
            : (isBn
              ? `মাইলস্টোন ফান্ডিং — লক্ষ্য ${business.milestone_target ? '৳' + business.milestone_target : ''} পূরণ না হলে আপনি স্বয়ংক্রিয়ভাবে ফেরত পাবেন।`
              : `Milestone Funding — if the target of ${business.milestone_target ? '৳' + business.milestone_target : ''} is not reached, you will be automatically refunded.`)}
        </p>
      </div>

      {/* Risk acknowledgment */}
      <div className="bg-brand-warn/10 border border-brand-warn/20 rounded-xl p-4 mb-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={riskAccepted}
            onChange={(e) => setRiskAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 accent-brand-accent"
          />
          <span className="text-sm text-brand-muted">
            {isBn ? (
              <>
                আমি <a href="/legal/risk" target="_blank" className="text-brand-accent hover:underline">ঝুঁকি প্রকাশ</a> পড়েছি এবং বিনিয়োগের ঝুঁকি বুঝি। আমি জানি যে আমি আমার বিনিয়োগকৃত টাকা হারাতে পারি।
              </>
            ) : (
              <>
                I have read the <a href="/legal/risk" target="_blank" className="text-brand-accent hover:underline">Risk Disclosure</a> and understand the risks of investing. I acknowledge that I may lose my invested money.
              </>
            )}
          </span>
        </label>
      </div>

      <button
        onClick={handleInvest}
        disabled={!canAfford || shares > sharesAvailable || !riskAccepted}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isBn ? 'বিনিয়োগ নিশ্চিত করুন' : 'Confirm Investment'}
      </button>
    </div>
  );
}
