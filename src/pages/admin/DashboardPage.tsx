import { TrendingUp, Users, DollarSign, BarChart3, Briefcase, Eye } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useStatsStore } from '../../lib/services/stats';
import { useBusinessStore } from '../../lib/services/business';
import { useWalletStore } from '../../lib/services/wallet';
import { useTradingStore } from '../../lib/services/trading';
import { useAdsStore } from '../../lib/services/ads';
import { formatMoney, formatNumber } from '../../lib/format';

export function AdminDashboardPage() {
  const { user, lang } = useAuthStore();
  const { getKPIs, getTrend, generateSnapshot } = useStatsStore();
  const { businesses } = useBusinessStore();
  const { rechargeRequests, withdrawalRequests } = useWalletStore();
  const { trades } = useTradingStore();
  const { ads } = useAdsStore();
  const isBn = lang === 'bn';

  const kpis = getKPIs();
  const trendData = getTrend('total_raised_bdt', 30);

  // Top businesses
  const topByRaised = [...businesses]
    .filter((b) => b.status === 'active')
    .sort((a, b) => b.total_raised - a.total_raised)
    .slice(0, 5);

  const topByVolume = [...businesses]
    .filter((b) => b.status === 'active')
    .sort((a, b) => b.trades_count - a.trades_count)
    .slice(0, 5);

  // Pending queues
  const pendingQueues = {
    recharges: rechargeRequests.filter((r) => r.status === 'pending').length,
    withdrawals: withdrawalRequests.filter((w) => w.status === 'pending').length,
    businesses: businesses.filter((b) => b.status === 'pending').length,
  };

  const handleRefreshSnapshot = () => {
    generateSnapshot();
  };

  // Simple SVG chart
  const maxVal = Math.max(...trendData.map((d) => d.value), 1);
  const chartWidth = 800;
  const chartHeight = 200;
  const points = trendData.map((d, i) => {
    const x = (i / (trendData.length - 1)) * chartWidth;
    const y = chartHeight - (d.value / maxVal) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-text">{isBn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}</h1>
        <button onClick={handleRefreshSnapshot} className="btn-ghost flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          {isBn ? 'স্ন্যাপশট রিফ্রেশ' : 'Refresh Snapshot'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="card">
          <DollarSign className="w-5 h-5 text-brand-accent mb-2" />
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'মোট সংগৃহীত' : 'Total Raised'}</p>
          <p className="text-lg font-bold text-brand-text">{formatMoney(kpis.total_raised, lang)}</p>
        </div>
        <div className="card">
          <BarChart3 className="w-5 h-5 text-brand-blue mb-2" />
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'ট্রেড ভলিউম' : 'Trade Volume'}</p>
          <p className="text-lg font-bold text-brand-text">{formatMoney(kpis.trade_volume, lang)}</p>
        </div>
        <div className="card">
          <TrendingUp className="w-5 h-5 text-brand-warn mb-2" />
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'ট্রেড সংখ্যা' : 'Trades Count'}</p>
          <p className="text-lg font-bold text-brand-text">{formatNumber(kpis.trades_count, lang)}</p>
        </div>
        <div className="card">
          <Users className="w-5 h-5 text-brand-accent mb-2" />
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'নতুন ব্যবহারকারী' : 'New Users'}</p>
          <p className="text-lg font-bold text-brand-text">{formatNumber(kpis.new_users, lang)}</p>
        </div>
        <div className="card">
          <Users className="w-5 h-5 text-brand-blue mb-2" />
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'সক্রিয় ব্যবহারকারী' : 'Active Users'}</p>
          <p className="text-lg font-bold text-brand-text">{formatNumber(kpis.active_users, lang)}</p>
        </div>
        <div className="card">
          <Eye className="w-5 h-5 text-brand-warn mb-2" />
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'বিজ্ঞাপন রাজস্ব' : 'Ad Revenue'}</p>
          <p className="text-lg font-bold text-brand-text">{formatMoney(kpis.ad_revenue, lang)}</p>
        </div>
      </div>

      {/* 30-Day Trend Chart */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? '৩০ দিনের ট্রেন্ড' : '30-Day Trend'}</h2>
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full">
          <polyline
            points={points}
            fill="none"
            stroke="#00d09c"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Top Lists & Pending Queues */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Top by Raised */}
        <div className="card">
          <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? 'সর্বাধিক সংগৃহীত' : 'Top by Raised'}</h2>
          <div className="space-y-2">
            {topByRaised.map((biz, idx) => (
              <div key={biz.id} className="flex items-center justify-between p-2 bg-brand-panel2 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-brand-muted">#{idx + 1}</span>
                  <span className="text-sm text-brand-text">{biz.name}</span>
                </div>
                <span className="text-sm font-semibold text-brand-accent">{formatMoney(biz.total_raised, lang)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top by Volume */}
        <div className="card">
          <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? 'সর্বাধিক ট্রেড' : 'Top by Trades'}</h2>
          <div className="space-y-2">
            {topByVolume.map((biz, idx) => (
              <div key={biz.id} className="flex items-center justify-between p-2 bg-brand-panel2 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-brand-muted">#{idx + 1}</span>
                  <span className="text-sm text-brand-text">{biz.name}</span>
                </div>
                <span className="text-sm font-semibold text-brand-blue">{biz.trades_count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Queues */}
        <div className="card">
          <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? 'অপেক্ষমান সারি' : 'Pending Queues'}</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-brand-panel2 rounded-lg">
              <span className="text-sm text-brand-text">{isBn ? 'রিচার্জ' : 'Recharges'}</span>
              <span className="text-sm font-bold text-brand-warn">{pendingQueues.recharges}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-brand-panel2 rounded-lg">
              <span className="text-sm text-brand-text">{isBn ? 'উত্তোলন' : 'Withdrawals'}</span>
              <span className="text-sm font-bold text-brand-warn">{pendingQueues.withdrawals}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-brand-panel2 rounded-lg">
              <span className="text-sm text-brand-text">{isBn ? 'ব্যবসা' : 'Businesses'}</span>
              <span className="text-sm font-bold text-brand-warn">{pendingQueues.businesses}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
