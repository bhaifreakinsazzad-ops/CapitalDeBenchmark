import { Link } from 'react-router-dom';
import { TrendingUp, Shield, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuthStore } from '../store';
import { useInvestmentStore } from '../lib/services/investments';
import { useBusinessStore } from '../lib/services/business';
import { Money } from '../components/shared/money';
import { EmptyState } from '../components/shared/empty-state';

export function PortfolioPage() {
  const { user, lang } = useAuthStore();
  const { investments } = useInvestmentStore();
  const { businesses } = useBusinessStore();
  const isBn = lang === 'bn';

  if (!user) return null;

  // Get user's investments
  const userInvestments = investments.filter(i => i.user_id === user.id && i.status !== 'refunded');

  // Calculate holdings with business info
  const holdings = userInvestments.map(inv => {
    const business = businesses.find(b => b.id === inv.business_id);
    if (!business) return null;

    const currentValue = inv.shares * business.share_price;
    const investedValue = inv.total_amount;
    const pl = currentValue - investedValue;
    const plPct = investedValue > 0 ? (pl / investedValue) * 100 : 0;
    const ownershipPct = (inv.shares / business.total_shares) * 100;

    return {
      investment: inv,
      business,
      shares: inv.shares,
      avgBuyPrice: inv.price_per_share,
      currentPrice: business.share_price,
      currentValue,
      investedValue,
      pl,
      plPct,
      ownershipPct,
    };
  }).filter(h => h !== null) as any[];

  // Calculate totals
  const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPl = totalValue - totalInvested;
  const totalPlPct = totalInvested > 0 ? (totalPl / totalInvested) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-brand-text mb-6">{isBn ? 'আমার পোর্টফোলিও' : 'My Portfolio'}</h1>

      {holdings.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title={isBn ? 'কোনো শেয়ার নেই' : 'No shares yet'}
          description={isBn ? 'আপনি এখনো কোনো ব্যবসায় বিনিয়োগ করেননি' : "You haven't invested in any businesses yet"}
          actionLabel={isBn ? 'ব্যবসা দেখুন' : 'Browse Ventures'}
          actionHref="/market"
        />
      ) : (
        <>
          {/* Summary Card */}
          <div className="card mb-6 bg-gradient-to-br from-brand-panel to-brand-panel2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-brand-muted mb-1">{isBn ? 'মোট বিনিয়োগ' : 'Total Invested'}</p>
                <Money amount={totalInvested} lang={lang} className="text-lg font-bold" />
              </div>
              <div>
                <p className="text-xs text-brand-muted mb-1">{isBn ? 'বর্তমান মূল্য' : 'Current Value'}</p>
                <Money amount={totalValue} lang={lang} className="text-lg font-bold" />
              </div>
              <div>
                <p className="text-xs text-brand-muted mb-1">{isBn ? 'লাভ/ক্ষতি' : 'Profit/Loss'}</p>
                <div className="flex items-center gap-1">
                  {totalPl >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-brand-accent" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-brand-bad" />
                  )}
                  <Money 
                    amount={Math.abs(totalPl)} 
                    lang={lang} 
                    className={`text-lg font-bold ${totalPl >= 0 ? 'text-brand-accent' : 'text-brand-bad'}`} 
                  />
                </div>
                <p className={`text-xs ${totalPl >= 0 ? 'text-brand-accent' : 'text-brand-bad'}`}>
                  {totalPl >= 0 ? '+' : ''}{totalPlPct.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-muted mb-1">{isBn ? 'হোল্ডিং' : 'Holdings'}</p>
                <p className="text-lg font-bold text-brand-text">{holdings.length}</p>
              </div>
            </div>
          </div>

          {/* Holdings List */}
          <div className="space-y-3">
            {holdings.map((holding) => (
              <Link
                key={holding.investment.id}
                to={`/biz/${holding.business.slug}`}
                className="card hover:border-brand-accent/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Cover photo placeholder */}
                  <div className="w-16 h-16 bg-brand-panel2 rounded-lg flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-brand-muted" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-3 h-3 text-brand-accent" />
                      <h3 className="text-base font-semibold text-brand-text truncate">
                        {holding.business.name}
                      </h3>
                    </div>
                    <p className="text-xs text-brand-muted mb-2">
                      {holding.business.category} · {holding.business.location}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div>
                        <p className="text-brand-muted">{isBn ? 'শেয়ার' : 'Shares'}</p>
                        <p className="text-brand-text font-semibold">{holding.shares}</p>
                      </div>
                      <div>
                        <p className="text-brand-muted">{isBn ? 'গড় মূল্য' : 'Avg Price'}</p>
                        <Money amount={holding.avgBuyPrice} lang={lang} className="font-semibold" />
                      </div>
                      <div>
                        <p className="text-brand-muted">{isBn ? 'মূল্য' : 'Value'}</p>
                        <Money amount={holding.currentValue} lang={lang} className="font-semibold" />
                      </div>
                      <div>
                        <p className="text-brand-muted">{isBn ? 'মালিকানা' : 'Ownership'}</p>
                        <p className="text-brand-text font-semibold">{holding.ownershipPct.toFixed(2)}%</p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      {holding.pl >= 0 ? (
                        <ArrowUpRight className="w-3 h-3 text-brand-accent" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-brand-bad" />
                      )}
                      <span className={`text-xs font-medium ${holding.pl >= 0 ? 'text-brand-accent' : 'text-brand-bad'}`}>
                        {holding.pl >= 0 ? '+' : ''}<Money amount={Math.abs(holding.pl)} lang={lang} /> ({holding.plPct >= 0 ? '+' : ''}{holding.plPct.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
