import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Users, TrendingUp, Shield, ArrowUpDown } from 'lucide-react';
import { useAuthStore } from '../store';
import { useBusinessStore } from '../lib/services/business';
import { Money } from '../components/shared/money';
import { TrustBadge } from '../components/shared/trust-badge';
import { EmptyState } from '../components/shared/empty-state';
import { RiskBanner } from '../components/shared/risk-banner';
import { CATEGORIES } from '../lib/constants';

export function MarketPage() {
  const { lang } = useAuthStore();
  const { businesses } = useBusinessStore();
  const isBn = lang === 'bn';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [sort, setSort] = useState<'newest' | 'top_trust' | 'most_funded' | 'price_asc' | 'price_desc'>('newest');

  const activeBusinesses = businesses.filter(b => b.status === 'active');

  const filteredBusinesses = useMemo(() => {
    let result = activeBusinesses;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => b.name.toLowerCase().includes(q) || b.location.toLowerCase().includes(q));
    }

    if (category !== 'all') {
      result = result.filter(b => b.category === category);
    }

    switch (sort) {
      case 'top_trust':
        result = [...result].sort((a, b) => b.trust_score - a.trust_score);
        break;
      case 'most_funded':
        result = [...result].sort((a, b) => b.shares_sold - a.shares_sold);
        break;
      case 'price_asc':
        result = [...result].sort((a, b) => a.share_price - b.share_price);
        break;
      case 'price_desc':
        result = [...result].sort((a, b) => b.share_price - a.share_price);
        break;
      default:
        result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [activeBusinesses, search, category, sort]);

  const getFundingProgress = (b: typeof activeBusinesses[0]) => {
    return Math.round((b.shares_sold / b.total_shares) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-text">{isBn ? 'বাজার' : 'Market'}</h1>
        <span className="text-sm text-brand-muted">
          {filteredBusinesses.length} {isBn ? 'টি ব্যবসা' : 'businesses'}
        </span>
      </div>

      <div className="mb-6">
        <RiskBanner lang={lang} />
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isBn ? 'ব্যবসা বা স্থান খুঁজুন...' : 'Search businesses or locations...'}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              category === 'all' ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted hover:text-brand-text'
            }`}
          >
            {isBn ? 'সব' : 'All'}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                category === cat ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted hover:text-brand-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-brand-muted" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="text-sm"
          >
            <option value="newest">{isBn ? 'নতুন' : 'Newest'}</option>
            <option value="top_trust">{isBn ? 'সর্বোচ্চ ট্রাস্ট' : 'Top Trust'}</option>
            <option value="most_funded">{isBn ? 'সর্বাধিক ফান্ডেড' : 'Most Funded'}</option>
            <option value="price_asc">{isBn ? 'মূল্য: কম-বেশি' : 'Price: Low-High'}</option>
            <option value="price_desc">{isBn ? 'মূল্য: বেশি-কম' : 'Price: High-Low'}</option>
          </select>
        </div>
      </div>

      {/* Business Grid */}
      {filteredBusinesses.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title={isBn ? 'কোনো যাচাইকৃত ব্যবসা নেই' : 'No verified ventures yet'}
          description={isBn ? 'শীঘ্রই ফিরে আসুন অথবা কীভাবে কাজ করে তা জানুন' : 'Check back soon or learn how it works'}
          actionLabel={isBn ? 'কীভাবে কাজ করে' : 'Learn how it works'}
          actionHref="/learn"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBusinesses.map((biz) => (
            <Link
              key={biz.id}
              to={`/biz/${biz.slug}`}
              className="card hover:border-brand-accent/30 transition-all hover:scale-[1.02]"
            >
              {/* Cover photo placeholder */}
              <div className="aspect-video bg-gradient-to-br from-brand-panel2 to-brand-line rounded-lg mb-3 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-brand-muted" />
              </div>

              {/* Verification badge */}
              <div className="flex items-center gap-1 mb-2">
                <Shield className="w-3 h-3 text-brand-accent" />
                <span className="text-[10px] text-brand-accent font-medium">{isBn ? 'যাচাইকৃত' : 'Verified'}</span>
              </div>

              <h3 className="text-base font-semibold text-brand-text mb-1 line-clamp-1">{biz.name}</h3>
              <p className="text-xs text-brand-muted mb-3">
                {biz.category} · {biz.location}
              </p>

              {/* Funding progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-brand-muted">{isBn ? 'ফান্ডিং' : 'Funding'}</span>
                  <span className="text-brand-text font-medium">{getFundingProgress(biz)}%</span>
                </div>
                <div className="h-1.5 bg-brand-line rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-accent rounded-full transition-all"
                    style={{ width: `${getFundingProgress(biz)}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <Money amount={biz.share_price} lang={lang} className="text-sm font-semibold" />
                  <p className="text-[10px] text-brand-muted">{isBn ? 'প্রতি শেয়ার' : 'per share'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-brand-muted" />
                    <span className="text-xs text-brand-muted">{biz.followers_count}</span>
                  </div>
                  <TrustBadge score={biz.trust_score} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
