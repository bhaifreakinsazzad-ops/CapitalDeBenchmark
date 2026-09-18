import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, ArrowUpRight, ArrowDownRight, Clock, History } from 'lucide-react';
import { useAuthStore } from '../store';
import { useBusinessStore } from '../lib/services/business';
import { useTradingStore } from '../lib/services/trading';
import { useInvestmentStore } from '../lib/services/investments';
import { Money } from '../components/shared/money';
import { EmptyState } from '../components/shared/empty-state';
import { formatDate } from '../lib/utils';

export function PortfolioPage() {
  const { user, lang } = useAuthStore();
  const { businesses } = useBusinessStore();
  const { investments } = useInvestmentStore();
  const { orders, trades, cancelOrder } = useTradingStore();
  const isBn = lang === 'bn';
  const [tab, setTab] = useState<'holdings' | 'orders' | 'history'>('holdings');

  if (!user) return null;

  // Get user's investments
  const userInvestments = investments.filter(i => i.user_id === user.id && i.status !== 'refunded');

  // Calculate holdings with business info
  const holdings = userInvestments.map(inv => {
    const business = businesses.find(b => b.id === inv.business_id);
    if (!business) return null;

    const currentValue = inv.shares * (business.current_price || business.share_price);
    const investedValue = inv.total_amount;
    const pl = currentValue - investedValue;
    const plPct = investedValue > 0 ? (pl / investedValue) * 100 : 0;
    const ownershipPct = (inv.shares / business.total_shares) * 100;

    return {
      investment: inv,
      business,
      shares: inv.shares,
      avgBuyPrice: inv.price_per_share,
      currentPrice: business.current_price || business.share_price,
      currentValue,
      investedValue,
      pl,
      plPct,
      ownershipPct,
    };
  }).filter(h => h !== null) as any[];

  // User's open orders
  const userOrders = orders.filter(o => 
    o.user_id === user.id && 
    ['open', 'partially_filled'].includes(o.status)
  );

  // User's trade history
  const userTrades = trades.filter(t => 
    t.buyer_id === user.id || t.seller_id === user.id
  );

  // Calculate totals
  const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPl = totalValue - totalInvested;
  const totalPlPct = totalInvested > 0 ? (totalPl / totalInvested) * 100 : 0;

  const getBusinessName = (businessId: string) => {
    return businesses.find(b => b.id === businessId)?.name || 'Unknown';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-brand-text mb-6">{isBn ? 'আমার পোর্টফোলিও' : 'My Portfolio'}</h1>

      {holdings.length === 0 && userOrders.length === 0 && userTrades.length === 0 ? (
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

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab('holdings')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === 'holdings' ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted'
              }`}
            >
              {isBn ? 'হোল্ডিং' : 'Holdings'}
            </button>
            <button
              onClick={() => setTab('orders')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === 'orders' ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted'
              }`}
            >
              {isBn ? 'খোলা অর্ডার' : 'Open Orders'} ({userOrders.length})
            </button>
            <button
              onClick={() => setTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === 'history' ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted'
              }`}
            >
              {isBn ? 'ইতিহাস' : 'History'} ({userTrades.length})
            </button>
          </div>

          {/* Holdings Tab */}
          {tab === 'holdings' && (
            <div className="space-y-3">
              {holdings.map((holding) => (
                <Link
                  key={holding.investment.id}
                  to={`/biz/${holding.business.slug}`}
                  className="card hover:border-brand-accent/30 transition-all"
                >
                  <div className="flex items-start gap-3">
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

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {holding.pl >= 0 ? (
                            <ArrowUpRight className="w-3 h-3 text-brand-accent" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-brand-bad" />
                          )}
                          <span className={`text-xs font-medium ${holding.pl >= 0 ? 'text-brand-accent' : 'text-brand-bad'}`}>
                            {holding.pl >= 0 ? '+' : ''}<Money amount={Math.abs(holding.pl)} lang={lang} /> ({holding.plPct >= 0 ? '+' : ''}{holding.plPct.toFixed(2)}%)
                          </span>
                        </div>
                        <Link
                          to={`/trade/${holding.business.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs px-3 py-1 bg-brand-bad/10 text-brand-bad rounded-lg hover:bg-brand-bad/20 transition-colors"
                        >
                          {isBn ? 'বিক্রয়' : 'Sell'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Orders Tab */}
          {tab === 'orders' && (
            <div className="space-y-3">
              {userOrders.length === 0 ? (
                <p className="text-sm text-brand-muted text-center py-8">{isBn ? 'কোনো খোলা অর্ডার নেই' : 'No open orders'}</p>
              ) : (
                userOrders.map((order) => (
                  <div key={order.id} className="card">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            order.type === 'buy' ? 'bg-brand-accent/10 text-brand-accent' :
                            order.type === 'sell' ? 'bg-brand-bad/10 text-brand-bad' :
                            'bg-brand-warn/10 text-brand-warn'
                          }`}>
                            {order.type === 'buy' ? (isBn ? 'কেনা' : 'Buy') :
                             order.type === 'sell' ? (isBn ? 'বিক্রয়' : 'Sell') :
                             (isBn ? 'বাইব্যাক' : 'Buyback')}
                          </span>
                          <span className="text-xs text-brand-muted">{getBusinessName(order.business_id)}</span>
                        </div>
                        <p className="text-xs text-brand-muted mt-1">{formatDate(order.created_at, lang)}</p>
                      </div>
                      <button
                        onClick={() => cancelOrder(order.id, user.id)}
                        className="text-xs px-3 py-1 bg-brand-panel2 text-brand-muted rounded-lg hover:bg-brand-bad/10 hover:text-brand-bad transition-colors"
                      >
                        {isBn ? 'বাতিল' : 'Cancel'}
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-brand-muted">{isBn ? 'শেয়ার' : 'Shares'}</p>
                        <p className="text-brand-text font-semibold">{order.filled_shares}/{order.shares}</p>
                      </div>
                      <div>
                        <p className="text-brand-muted">{isBn ? 'মূল্য' : 'Price'}</p>
                        <Money amount={order.price} lang={lang} className="font-semibold" />
                      </div>
                      <div>
                        <p className="text-brand-muted">{isBn ? 'স্ট্যাটাস' : 'Status'}</p>
                        <p className="text-brand-text font-semibold capitalize">{order.status.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* History Tab */}
          {tab === 'history' && (
            <div className="space-y-3">
              {userTrades.length === 0 ? (
                <p className="text-sm text-brand-muted text-center py-8">{isBn ? 'কোনো লেনদেন ইতিহাস নেই' : 'No trade history'}</p>
              ) : (
                userTrades.map((trade) => (
                  <div key={trade.id} className="card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {trade.buyer_id === user.id ? (
                          <ArrowDownRight className="w-4 h-4 text-brand-accent" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-brand-bad" />
                        )}
                        <span className="text-sm text-brand-text">
                          {trade.buyer_id === user.id ? (isBn ? 'কেনা' : 'Bought') : (isBn ? 'বিক্রয়' : 'Sold')}
                        </span>
                        <span className="text-xs text-brand-muted">{getBusinessName(trade.business_id)}</span>
                      </div>
                      <span className="text-xs text-brand-muted">{formatDate(trade.executed_at, lang)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-brand-muted">{isBn ? 'শেয়ার' : 'Shares'}</p>
                        <p className="text-brand-text font-semibold">{trade.shares}</p>
                      </div>
                      <div>
                        <p className="text-brand-muted">{isBn ? 'মূল্য' : 'Price'}</p>
                        <Money amount={trade.price} lang={lang} className="font-semibold" />
                      </div>
                      <div>
                        <p className="text-brand-muted">{isBn ? 'মোট' : 'Total'}</p>
                        <Money amount={trade.shares * trade.price} lang={lang} className="font-semibold" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
