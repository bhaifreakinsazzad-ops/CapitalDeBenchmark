import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, ArrowUpRight, ArrowDownRight, Users, BarChart3 } from 'lucide-react';
import { useAuthStore } from '../store';
import { useBusinessStore } from '../lib/services/business';
import { useTradingStore } from '../lib/services/trading';
import { Money } from '../components/shared/money';
import { TrustBadge } from '../components/shared/trust-badge';
import { EmptyState } from '../components/shared/empty-state';
import { formatDate } from '../lib/utils';

export function TradingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, lang } = useAuthStore();
  const { getBusinessBySlug } = useBusinessStore();
  const { placeOrder, getBusinessOrders, getBusinessTrades } = useTradingStore();
  const navigate = useNavigate();
  const isBn = lang === 'bn';

  const business = slug ? getBusinessBySlug(slug) : undefined;
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [shares, setShares] = useState(1);
  const [price, setPrice] = useState(business?.current_price || business?.share_price || 0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!business || business.status !== 'active') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          icon={TrendingUp}
          title={isBn ? 'ব্যবসা পাওয়া যায়নি' : 'Business not found'}
          actionLabel={isBn ? 'বাজারে ফিরুন' : 'Back to Market'}
          actionHref="/market"
        />
      </div>
    );
  }

  const { buys, sells } = getBusinessOrders(business.id);
  const trades = getBusinessTrades(business.id, 10);

  const totalCost = shares * price;
  const canAfford = user.balance >= totalCost;

  const handlePlaceOrder = () => {
    setError('');
    
    if (shares <= 0) {
      setError(isBn ? 'শেয়ার সংখ্যা ধনাত্মক হতে হবে' : 'Shares must be positive');
      return;
    }
    if (price < 1) {
      setError(isBn ? 'মূল্য কমপক্ষে ৳১ হতে হবে' : 'Price must be at least ৳1');
      return;
    }

    const result = placeOrder({
      business_id: business.id,
      type: orderType,
      shares,
      price,
      order_kind: 'limit',
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/portfolio'), 2000);
    } else {
      setError(result.error || 'Order failed');
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-brand-accent" />
          </div>
          <h1 className="text-xl font-bold text-brand-text mb-2">
            {isBn ? 'অর্ডার দেওয়া হয়েছে!' : 'Order Placed!'}
          </h1>
          <p className="text-sm text-brand-muted mb-6">
            {isBn 
              ? `আপনার ${orderType === 'buy' ? 'কেনার' : 'বিক্রয়ের'} অর্ডার ${shares}টি শেয়ার @ ৳${price} জমা হয়েছে`
              : `Your ${orderType} order for ${shares} shares @ ৳${price} has been placed`}
          </p>
          <button onClick={() => navigate('/portfolio')} className="btn-primary">
            {isBn ? 'পোর্টফোলিও দেখুন' : 'View Portfolio'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <button onClick={() => navigate(`/biz/${business.slug}`)} className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text mb-4">
        <ArrowLeft className="w-4 h-4" />
        {isBn ? 'ফিরে যান' : 'Back'}
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-brand-panel2 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-brand-muted" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-text">{business.name}</h1>
          <div className="flex items-center gap-2">
            {business.current_price ? (
              <>
                <Money amount={business.current_price} lang={lang} className="text-lg font-bold text-brand-accent" />
                {business.current_price > business.share_price && (
                  <ArrowUpRight className="w-4 h-4 text-brand-accent" />
                )}
                {business.current_price < business.share_price && (
                  <ArrowDownRight className="w-4 h-4 text-brand-bad" />
                )}
              </>
            ) : (
              <Money amount={business.share_price} lang={lang} className="text-lg font-bold" />
            )}
            <span className="text-xs text-brand-muted">
              {business.current_price ? (isBn ? 'শেষ মূল্য' : 'Last Price') : (isBn ? 'প্রাথমিক মূল্য' : 'Primary Price')}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-brand-bad/10 border border-brand-bad/30 rounded-xl p-3 text-sm text-brand-bad mb-4">
          {error}
        </div>
      )}

      {/* Order Form */}
      <div className="card mb-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setOrderType('buy')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              orderType === 'buy' ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted'
            }`}
          >
            {isBn ? 'কিনুন' : 'Buy'}
          </button>
          <button
            onClick={() => setOrderType('sell')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              orderType === 'sell' ? 'bg-brand-bad text-white' : 'bg-brand-panel2 text-brand-muted'
            }`}
          >
            {isBn ? 'বিক্রয়' : 'Sell'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">
              {isBn ? 'শেয়ার সংখ্যা' : 'Shares'}
            </label>
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">
              {isBn ? 'প্রতি শেয়ার মূল্য (৳)' : 'Price per Share (৳)'}
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Math.max(1, parseFloat(e.target.value) || 1))}
              min={1}
              step={0.01}
              inputMode="decimal"
            />
          </div>

          <div className="border-t border-brand-line pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">{isBn ? 'মোট' : 'Total'}</span>
              <Money amount={totalCost} lang={lang} className="font-bold" />
            </div>
            {orderType === 'buy' && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">{isBn ? 'আপনার ব্যালেন্স' : 'Your Balance'}</span>
                <Money amount={user.balance} lang={lang} className={canAfford ? 'text-brand-text' : 'text-brand-bad'} />
              </div>
            )}
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={orderType === 'buy' && !canAfford}
            className={`w-full py-3 rounded-xl font-medium transition-colors ${
              orderType === 'buy'
                ? 'bg-brand-accent text-brand-bg hover:bg-brand-accentD disabled:opacity-50'
                : 'bg-brand-bad text-white hover:bg-brand-bad/90'
            }`}
          >
            {orderType === 'buy' 
              ? (isBn ? 'কেনার অর্ডার দিন' : 'Place Buy Order')
              : (isBn ? 'বিক্রয়ের অর্ডার দিন' : 'Place Sell Order')}
          </button>
        </div>
      </div>

      {/* Order Book */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-brand-text mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {isBn ? 'অর্ডার বুক' : 'Order Book'}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Bids (Buys) */}
          <div>
            <h3 className="text-sm font-medium text-brand-accent mb-2">{isBn ? 'কেনার অর্ডার' : 'Buy Orders'}</h3>
            {buys.length === 0 ? (
              <p className="text-xs text-brand-muted">{isBn ? 'কোনো অর্ডার নেই' : 'No orders'}</p>
            ) : (
              <div className="space-y-1">
                {buys.map((order) => (
                  <div key={order.id} className="flex justify-between text-xs bg-brand-accent/5 rounded px-2 py-1">
                    <span className="text-brand-accent font-mono">৳{order.price.toFixed(2)}</span>
                    <span className="text-brand-muted">{order.shares - order.filled_shares} {isBn ? 'শেয়ার' : 'shares'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Asks (Sells) */}
          <div>
            <h3 className="text-sm font-medium text-brand-bad mb-2">{isBn ? 'বিক্রয়ের অর্ডার' : 'Sell Orders'}</h3>
            {sells.length === 0 ? (
              <p className="text-xs text-brand-muted">{isBn ? 'কোনো অর্ডার নেই' : 'No orders'}</p>
            ) : (
              <div className="space-y-1">
                {sells.map((order) => (
                  <div key={order.id} className="flex justify-between text-xs bg-brand-bad/5 rounded px-2 py-1">
                    <span className="text-brand-bad font-mono">৳{order.price.toFixed(2)}</span>
                    <span className="text-brand-muted">{order.shares - order.filled_shares} {isBn ? 'শেয়ার' : 'shares'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="card">
        <h2 className="text-lg font-semibold text-brand-text mb-4">
          {isBn ? 'সাম্প্রতিক লেনদেন' : 'Recent Trades'}
        </h2>
        {trades.length === 0 ? (
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো লেনদেন নেই' : 'No trades yet'}</p>
        ) : (
          <div className="space-y-2">
            {trades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between text-sm border-b border-brand-line pb-2">
                <div className="flex items-center gap-2">
                  {trade.is_buyback ? (
                    <span className="text-xs px-2 py-0.5 bg-brand-warn/10 text-brand-warn rounded">
                      {isBn ? 'বাইব্যাক' : 'Buyback'}
                    </span>
                  ) : (
                    <span className="text-xs text-brand-muted">
                      {isBn ? 'বিনিয়োগকারী' : 'Investor'} → {isBn ? 'বিনিয়োগকারী' : 'Investor'}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-mono text-brand-text">৳{trade.price.toFixed(2)}</p>
                  <p className="text-xs text-brand-muted">{trade.shares} {isBn ? 'শেয়ার' : 'shares'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
