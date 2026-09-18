import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, ToggleLeft, ToggleRight, DollarSign } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useAdsStore } from '../../lib/services/ads';
import { useAuditStore } from '../../lib/services/audit';
import { formatDate, formatMoney } from '../../lib/format';

export function AdminAdsPage() {
  const { user, lang } = useAuthStore();
  const { ads, toggleAd, deleteAd } = useAdsStore();
  const { log } = useAuditStore();
  const isBn = lang === 'bn';

  const [filterPlacement, setFilterPlacement] = useState<string>('');
  const [filterActive, setFilterActive] = useState<string>('');

  const filteredAds = ads.filter((ad) => {
    if (filterPlacement && ad.placement !== filterPlacement) return false;
    if (filterActive === 'active' && !ad.active) return false;
    if (filterActive === 'inactive' && ad.active) return false;
    return true;
  });

  const handleToggle = (id: string) => {
    if (!user) return;
    toggleAd(id);
    log(user.id, user.name, 'ad_toggle', 'ad', id);
  };

  const handleDelete = (id: string) => {
    if (!user) return;
    if (confirm(isBn ? 'এই বিজ্ঞাপন মুছে ফেলতে চান?' : 'Delete this ad?')) {
      deleteAd(id);
      log(user.id, user.name, 'ad_delete', 'ad', id);
    }
  };

  const getCtr = (ad: any) => {
    if (ad.impressions === 0) return 0;
    return (ad.clicks / ad.impressions) * 100;
  };

  const placements = [
    { value: 'market_top', label: isBn ? 'বাজার শীর্ষ' : 'Market Top' },
    { value: 'market_grid', label: isBn ? 'বাজার গ্রিড' : 'Market Grid' },
    { value: 'business_sidebar', label: isBn ? 'ব্যবসা সাইডবার' : 'Business Sidebar' },
    { value: 'feed_inline', label: isBn ? 'ফিড ইনলাইন' : 'Feed Inline' },
    { value: 'dashboard_banner', label: isBn ? 'ড্যাশবোর্ড ব্যানার' : 'Dashboard Banner' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-text">{isBn ? 'বিজ্ঞাপন' : 'Ads'}</h1>
        <Link to="/admin/ads/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {isBn ? 'নতুন বিজ্ঞাপন' : 'New Ad'}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={filterPlacement}
          onChange={(e) => setFilterPlacement(e.target.value)}
          className="px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
        >
          <option value="">{isBn ? 'সব প্লেসমেন্ট' : 'All Placements'}</option>
          {placements.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
        >
          <option value="">{isBn ? 'সব স্ট্যাটাস' : 'All Status'}</option>
          <option value="active">{isBn ? 'সক্রিয়' : 'Active'}</option>
          <option value="inactive">{isBn ? 'নিষ্ক্রিয়' : 'Inactive'}</option>
        </select>
      </div>

      {filteredAds.length === 0 ? (
        <div className="card text-center py-12">
          <Eye className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো বিজ্ঞাপন নেই' : 'No ads'}</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line">
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'শিরোনাম' : 'Title'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'প্লেসমেন্ট' : 'Placement'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'সক্রিয়' : 'Active'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'প্রাথমিকতা' : 'Priority'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ইমপ্রেশন' : 'Impressions'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ক্লিক' : 'Clicks'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">CTR</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'খরচ' : 'Spent'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'কার্যক্রম' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAds.map((ad) => (
                <tr key={ad.id} className="border-b border-brand-line">
                  <td className="py-3 px-2 text-brand-text">{ad.title}</td>
                  <td className="py-3 px-2 text-brand-muted">{placements.find(p => p.value === ad.placement)?.label}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${ad.active ? 'bg-brand-accent/10 text-brand-accent' : 'bg-brand-muted/10 text-brand-muted'}`}>
                      {ad.active ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'নিষ্ক্রিয়' : 'Inactive')}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-brand-text">{ad.priority}</td>
                  <td className="py-3 px-2 text-brand-text">{ad.impressions}</td>
                  <td className="py-3 px-2 text-brand-text">{ad.clicks}</td>
                  <td className="py-3 px-2 text-brand-text">{getCtr(ad).toFixed(2)}%</td>
                  <td className="py-3 px-2">{formatMoney(ad.spent_bdt, lang)}</td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggle(ad.id)}
                        className="p-1.5 rounded-lg bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 transition-colors"
                        title={isBn ? 'টগল' : 'Toggle'}
                      >
                        {ad.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <Link
                        to={`/admin/ads/${ad.id}/edit`}
                        className="p-1.5 rounded-lg bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="p-1.5 rounded-lg bg-brand-bad/10 text-brand-bad hover:bg-brand-bad/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
