import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useSettingsStore } from '../../lib/services/settings';
import { useAuditStore } from '../../lib/services/audit';

export function AdminSettingsPage() {
  const { user, lang } = useAuthStore();
  const { settings, update, resetToDefaults } = useSettingsStore();
  const { log } = useAuditStore();
  const isBn = lang === 'bn';

  const [formData, setFormData] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!user) return;
    
    const changes: Record<string, { old: any; new: any }> = {};
    Object.keys(formData).forEach((key) => {
      const k = key as keyof typeof formData;
      if (formData[k] !== settings[k]) {
        changes[k] = { old: settings[k], new: formData[k] };
      }
    });

    update(formData);
    
    if (Object.keys(changes).length > 0) {
      log(user.id, user.name, 'settings_update', 'platform_settings', undefined, changes);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm(isBn ? 'সব সেটিংস ডিফল্টে রিসেট করতে চান?' : 'Reset all settings to defaults?')) {
      resetToDefaults();
      setFormData({ ...useSettingsStore.getState().settings });
      if (user) {
        log(user.id, user.name, 'settings_reset', 'platform_settings');
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-text">{isBn ? 'প্ল্যাটফর্ম সেটিংস' : 'Platform Settings'}</h1>
        <div className="flex gap-3">
          <button onClick={handleReset} className="btn-ghost flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            {isBn ? 'রিসেট' : 'Reset'}
          </button>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saved ? (isBn ? 'সংরক্ষিত!' : 'Saved!') : (isBn ? 'সংরক্ষণ' : 'Save')}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Money Minimums */}
        <div className="card">
          <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? 'ন্যূনতম অর্থ' : 'Money Minimums'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'ন্যূনতম ডিপোজিট ৳' : 'Min Deposit ৳'}</label>
              <input
                type="number"
                min="1"
                value={formData.min_deposit_bdt}
                onChange={(e) => setFormData({ ...formData, min_deposit_bdt: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'ন্যূনতম বিনিয়োগ ৳' : 'Min Investment ৳'}</label>
              <input
                type="number"
                min="1"
                value={formData.min_investment_bdt}
                onChange={(e) => setFormData({ ...formData, min_investment_bdt: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'ন্যূনতম শেয়ার মূল্য ৳' : 'Min Share Price ৳'}</label>
              <input
                type="number"
                min="1"
                value={formData.min_share_price_bdt}
                onChange={(e) => setFormData({ ...formData, min_share_price_bdt: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'ন্যূনতম পেআউট ৳' : 'Min Payout ৳'}</label>
              <input
                type="number"
                min="1"
                value={formData.min_payout_bdt}
                onChange={(e) => setFormData({ ...formData, min_payout_bdt: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="card">
          <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? 'ফিচার ফ্ল্যাগ' : 'Feature Flags'}</h2>
          <div className="space-y-3">
            {[
              { key: 'signup_open', label: isBn ? 'সাইনআপ খোলা' : 'Signup Open' },
              { key: 'ads_enabled', label: isBn ? 'বিজ্ঞাপন সক্রিয়' : 'Ads Enabled' },
              { key: 'comments_enabled', label: isBn ? 'মন্তব্য সক্রিয়' : 'Comments Enabled' },
              { key: 'secondary_market_open', label: isBn ? 'সেকেন্ডারি মার্কেট খোলা' : 'Secondary Market Open' },
              { key: 'kyc_required_to_invest', label: isBn ? 'বিনিয়োগের জন্য KYC প্রয়োজন' : 'KYC Required to Invest' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-brand-text">{label}</span>
                <input
                  type="checkbox"
                  checked={formData[key as keyof typeof formData] as boolean}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Payouts */}
        <div className="card">
          <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? 'পেআউট' : 'Payouts'}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-text">{isBn ? 'উত্তোলনের জন্য অ্যাডমিন প্রয়োজন' : 'Withdrawals Require Admin'}</span>
              <input
                type="checkbox"
                checked={formData.withdrawals_require_admin}
                onChange={(e) => setFormData({ ...formData, withdrawals_require_admin: e.target.checked })}
                className="w-4 h-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'পেআউট SLA (ঘণ্টা)' : 'Payout SLA (Hours)'}</label>
              <input
                type="number"
                min="1"
                value={formData.payout_sla_hours}
                onChange={(e) => setFormData({ ...formData, payout_sla_hours: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="card">
          <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? 'মাইলস্টোন' : 'Milestones'}</h2>
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'ডিফল্ট মাইলস্টোন দিন' : 'Default Milestone Days'}</label>
            <input
              type="number"
              min="1"
              value={formData.default_milestone_days}
              onChange={(e) => setFormData({ ...formData, default_milestone_days: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
            />
          </div>
        </div>

        {/* Branding */}
        <div className="card">
          <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? 'ব্র্যান্ডিং' : 'Branding'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'পূর্ণ নাম' : 'Full Name'}</label>
              <input
                type="text"
                value={formData.platform_full_name}
                onChange={(e) => setFormData({ ...formData, platform_full_name: e.target.value })}
                className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'সংক্ষিপ্ত নাম' : 'Short Name'}</label>
              <input
                type="text"
                value={formData.platform_short_name}
                onChange={(e) => setFormData({ ...formData, platform_short_name: e.target.value })}
                className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'ওয়ালেট প্রিফিক্স' : 'Wallet Prefix'}</label>
              <input
                type="text"
                value={formData.wallet_prefix}
                onChange={(e) => setFormData({ ...formData, wallet_prefix: e.target.value })}
                className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className="card">
          <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? 'ট্রাস্ট' : 'Trust'}</h2>
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'বাজার প্রদর্শনের জন্য ন্যূনতম ট্রাস্ট' : 'Min Trust for Market Display'}</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.trust_min_for_market_display}
              onChange={(e) => setFormData({ ...formData, trust_min_for_market_display: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
