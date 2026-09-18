import { Store, MapPin, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import { TrustBadge } from '../components/shared/trust-badge';
import { Money } from '../components/shared/money';
import { RiskBanner } from '../components/shared/risk-banner';
import { EmptyState } from '../components/shared/empty-state';
import { CATEGORIES } from '../lib/constants';

export function MarketPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-text">{isBn ? 'বাজার' : 'Market'}</h1>
      </div>

      <div className="mb-6">
        <RiskBanner lang={lang} />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        <button className="px-3 py-1.5 rounded-full bg-brand-accent text-brand-bg text-xs font-semibold whitespace-nowrap">
          {isBn ? 'সব' : 'All'}
        </button>
        {CATEGORIES.map((cat) => (
          <button key={cat} className="px-3 py-1.5 rounded-full border border-brand-line text-xs font-medium text-brand-muted hover:text-brand-text hover:border-brand-accent whitespace-nowrap transition-colors">
            {cat}
          </button>
        ))}
      </div>

      {/* Business Grid - Empty for now */}
      <EmptyState
        icon={Store}
        title={isBn ? 'কোনো ব্যবসা নেই' : 'No businesses yet'}
        description={isBn ? 'যাচাইকৃত ব্যবসা শীঘ্রই এখানে যোগ করা হবে' : 'Verified businesses will be listed here soon'}
      />
    </div>
  );
}

export function BusinessDetailPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="mb-6">
        <RiskBanner lang={lang} />
      </div>
      <EmptyState
        icon={Store}
        title={isBn ? 'ব্যবসার বিস্তারিত' : 'Business Details'}
        description={isBn ? 'ব্যবসা শীঘ্রই এখানে দেখাবে' : 'Business details will appear here'}
      />
    </div>
  );
}
