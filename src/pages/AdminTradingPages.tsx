import { useState } from 'react';
import { useAuthStore, useDemoStore } from '../store';
import { useTradingStore } from '../lib/services/trading';
import { useBusinessStore } from '../lib/services/business';
import { Money } from '../components/shared/money';
import { formatDate } from '../lib/utils';
import { X, BarChart3 } from 'lucide-react';

export function AdminOrdersPage() {
  const { user, lang } = useAuthStore();
  const { orders, cancelOrder } = useTradingStore();
  const { businesses } = useBusinessStore();
  const { users } = useDemoStore();
  const isBn = lang === 'bn';
  const [filter, setFilter] = useState<'all' | 'open' | 'partially_filled' | 'filled' | 'cancelled'>('all');

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  const getBusinessName = (businessId: string) => businesses.find(b => b.id === businessId)?.name || 'Unknown';
  const getUserName = (userId: string) => users.find(u => u.id === userId)?.name || 'Unknown';

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'সকল অর্ডার' : 'All Orders'}</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 'open', 'partially_filled', 'filled', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted hover:text-brand-text'
            }`}
          >
            {f === 'all' ? (isBn ? 'সব' : 'All') :
             f === 'open' ? (isBn ? 'খোলা' : 'Open') :
             f === 'partially_filled' ? (isBn ? 'আংশিক' : 'Partial') :
             f === 'filled' ? (isBn ? 'পূর্ণ' : 'Filled') :
             (isBn ? 'বাতিল' : 'Cancelled')}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="card text-center py-12">
          <BarChart3 className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো অর্ডার নেই' : 'No orders'}</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line">
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'তারিখ' : 'Date'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ব্যবহারকারী' : 'User'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ব্যবসা' : 'Business'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ধরন' : 'Type'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'শেয়ার' : 'Shares'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'মূল্য' : 'Price'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'পূর্ণ' : 'Filled'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'কার্যক্রম' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-brand-line">
                  <td className="py-3 px-2 text-brand-muted text-xs">{formatDate(order.created_at, lang)}</td>
                  <td className="py-3 px-2 text-brand-text">{getUserName(order.user_id)}</td>
                  <td className="py-3 px-2 text-brand-text">{getBusinessName(order.business_id)}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      order.type === 'buy' ? 'bg-brand-accent/10 text-brand-accent' :
                      order.type === 'sell' ? 'bg-brand-bad/10 text-brand-bad' :
                      'bg-brand-warn/10 text-brand-warn'
                    }`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-brand-text">{order.filled_shares}/{order.shares}</td>
                  <td className="py-3 px-2"><Money amount={order.price} lang={lang} /></td>
                  <td className="py-3 px-2 text-brand-muted">{Math.round((order.filled_shares / order.shares) * 100)}%</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      order.status === 'open' ? 'bg-brand-blue/10 text-brand-blue' :
                      order.status === 'partially_filled' ? 'bg-brand-warn/10 text-brand-warn' :
                      order.status === 'filled' ? 'bg-brand-accent/10 text-brand-accent' :
                      'bg-brand-bad/10 text-brand-bad'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {['open', 'partially_filled'].includes(order.status) && (
                      <button
                        onClick={() => user && cancelOrder(order.id, user.id)}
                        className="p-1.5 rounded-lg bg-brand-bad/10 text-brand-bad hover:bg-brand-bad/20 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AdminTradesPage() {
  const { lang } = useAuthStore();
  const { trades } = useTradingStore();
  const { businesses } = useBusinessStore();
  const { users } = useDemoStore();
  const isBn = lang === 'bn';

  const getBusinessName = (businessId: string) => businesses.find(b => b.id === businessId)?.name || 'Unknown';
  const getUserName = (userId: string) => users.find(u => u.id === userId)?.name || 'Unknown';

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'সকল লেনদেন' : 'All Trades'}</h1>

      {trades.length === 0 ? (
        <div className="card text-center py-12">
          <BarChart3 className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো লেনদেন নেই' : 'No trades'}</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line">
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'তারিখ' : 'Date'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ব্যবসা' : 'Business'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ক্রেতা' : 'Buyer'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'বিক্রেতা' : 'Seller'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'শেয়ার' : 'Shares'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'মূল্য' : 'Price'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'মোট' : 'Total'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ধরন' : 'Type'}</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-brand-line">
                  <td className="py-3 px-2 text-brand-muted text-xs">{formatDate(trade.executed_at, lang)}</td>
                  <td className="py-3 px-2 text-brand-text">{getBusinessName(trade.business_id)}</td>
                  <td className="py-3 px-2 text-brand-text">{getUserName(trade.buyer_id)}</td>
                  <td className="py-3 px-2 text-brand-text">{getUserName(trade.seller_id)}</td>
                  <td className="py-3 px-2 text-brand-text">{trade.shares}</td>
                  <td className="py-3 px-2"><Money amount={trade.price} lang={lang} /></td>
                  <td className="py-3 px-2"><Money amount={trade.shares * trade.price} lang={lang} className="font-semibold" /></td>
                  <td className="py-3 px-2">
                    {trade.is_buyback ? (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-brand-warn/10 text-brand-warn">
                        {isBn ? 'বাইব্যাক' : 'Buyback'}
                      </span>
                    ) : (
                      <span className="text-xs text-brand-muted">{isBn ? 'সাধারণ' : 'Regular'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AdminMarketMakerPage() {
  const { user, lang } = useAuthStore();
  const { businesses } = useBusinessStore();
  const { placeOrder, orders } = useTradingStore();
  const isBn = lang === 'bn';

  const [businessId, setBusinessId] = useState('');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [shares, setShares] = useState(1);
  const [price, setPrice] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const activeBusinesses = businesses.filter(b => b.status === 'active');
  const mmOrders = orders.filter(o => o.is_market_maker && ['open', 'partially_filled'].includes(o.status));

  const handlePlaceOrder = () => {
    if (!user || !businessId) return;
    setError('');

    const result = placeOrder({
      business_id: businessId,
      type: orderType,
      shares,
      price,
      order_kind: 'limit',
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || 'Failed');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'মার্কেট মেকার' : 'Market Maker'}</h1>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? 'নতুন অর্ডার' : 'New Order'}</h2>

        {error && (
          <div className="bg-brand-bad/10 border border-brand-bad/30 rounded-xl p-3 text-sm text-brand-bad mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-xl p-3 text-sm text-brand-accent mb-4">
            {isBn ? 'অর্ডার সফলভাবে দেওয়া হয়েছে!' : 'Order placed successfully!'}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'ব্যবসা' : 'Business'}</label>
            <select value={businessId} onChange={(e) => setBusinessId(e.target.value)}>
              <option value="">{isBn ? 'বেছে নিন' : 'Select'}</option>
              {activeBusinesses.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setOrderType('buy')}
              className={`flex-1 py-2 rounded-lg font-medium ${orderType === 'buy' ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted'}`}
            >
              {isBn ? 'কেনা' : 'Buy'}
            </button>
            <button
              onClick={() => setOrderType('sell')}
              className={`flex-1 py-2 rounded-lg font-medium ${orderType === 'sell' ? 'bg-brand-bad text-white' : 'bg-brand-panel2 text-brand-muted'}`}
            >
              {isBn ? 'বিক্রয়' : 'Sell'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'শেয়ার' : 'Shares'}</label>
              <input type="number" value={shares} onChange={(e) => setShares(parseInt(e.target.value) || 1)} min={1} />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'মূল্য' : 'Price'}</label>
              <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 1)} min={1} step={0.01} />
            </div>
          </div>

          <button onClick={handlePlaceOrder} disabled={!businessId} className="btn-primary w-full disabled:opacity-50">
            {isBn ? 'অর্ডার দিন' : 'Place Order'}
          </button>
        </div>
      </div>

      {mmOrders.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-brand-text mb-3">{isBn ? 'আপনার MM অর্ডার' : 'Your MM Orders'}</h2>
          <div className="space-y-2">
            {mmOrders.map((order) => (
              <div key={order.id} className="card py-2 flex items-center justify-between">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded ${order.type === 'buy' ? 'bg-brand-accent/10 text-brand-accent' : 'bg-brand-bad/10 text-brand-bad'}`}>
                    {order.type}
                  </span>
                  <span className="text-sm text-brand-text ml-2">{getBusinessName(order.business_id)}</span>
                </div>
                <div className="text-right text-xs">
                  <p className="text-brand-text">{order.shares - order.filled_shares}/{order.shares} @ ৳{order.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getBusinessName(businessId: string) {
  const { businesses } = useBusinessStore.getState();
  return businesses.find(b => b.id === businessId)?.name || 'Unknown';
}
