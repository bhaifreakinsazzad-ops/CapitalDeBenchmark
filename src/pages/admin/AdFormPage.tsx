import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useAdsStore } from '../../lib/services/ads';
import { useAuditStore } from '../../lib/services/audit';

export function AdminAdFormPage() {
  const { id } = useParams<{ id: string }>();
  const { user, lang } = useAuthStore();
  const { ads, createAd, updateAd } = useAdsStore();
  const { log } = useAuditStore();
  const navigate = useNavigate();
  const isBn = lang === 'bn';

  const existingAd = id ? ads.find((ad) => ad.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    advertiser_name: '',
    advertiser_contact: '',
    image_url: '',
    link_url: '',
    placement: 'market_top' as 'market_top' | 'market_grid' | 'business_sidebar' | 'feed_inline' | 'dashboard_banner',
    priority: 0,
    active: true,
    starts_at: new Date().toISOString().slice(0, 16),
    ends_at: '',
    daily_budget_bdt: 0,
  });

  useEffect(() => {
    if (existingAd) {
      setFormData({
        title: existingAd.title,
        advertiser_name: existingAd.advertiser_name,
        advertiser_contact: existingAd.advertiser_contact,
        image_url: existingAd.image_url,
        link_url: existingAd.link_url || '',
        placement: existingAd.placement,
        priority: existingAd.priority,
        active: existingAd.active,
        starts_at: existingAd.starts_at.slice(0, 16),
        ends_at: existingAd.ends_at?.slice(0, 16) || '',
        daily_budget_bdt: existingAd.daily_budget_bdt || 0,
      });
    }
  }, [existingAd]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const adData = {
      ...formData,
      starts_at: new Date(formData.starts_at).toISOString(),
      ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : undefined,
      daily_budget_bdt: formData.daily_budget_bdt || undefined,
      created_by: user.id,
    };

    if (existingAd) {
      updateAd(existingAd.id, adData);
      log(user.id, user.name, 'ad_update', 'ad', existingAd.id, adData);
    } else {
      const result = createAd(adData as any);
      if (result.success && result.ad) {
        log(user.id, user.name, 'ad_create', 'ad', result.ad.id, adData);
      }
    }

    navigate('/admin/ads');
  };

  const placements = [
    { value: 'market_top', label: isBn ? 'বাজার শীর্ষ (1200×200)' : 'Market Top (1200×200)' },
    { value: 'market_grid', label: isBn ? 'বাজার গ্রিড (600×400)' : 'Market Grid (600×400)' },
    { value: 'business_sidebar', label: isBn ? 'ব্যবসা সাইডবার (300×250)' : 'Business Sidebar (300×250)' },
    { value: 'feed_inline', label: isBn ? 'ফিড ইনলাইন (800×200)' : 'Feed Inline (800×200)' },
    { value: 'dashboard_banner', label: isBn ? 'ড্যাশবোর্ড ব্যানার (1200×150)' : 'Dashboard Banner (1200×150)' },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <button onClick={() => navigate('/admin/ads')} className="flex items-center gap-2 text-brand-muted hover:text-brand-text mb-4">
        <ArrowLeft className="w-4 h-4" />
        {isBn ? 'ফিরে যান' : 'Back'}
      </button>

      <h1 className="text-2xl font-bold text-brand-text mb-6">
        {existingAd ? (isBn ? 'বিজ্ঞাপন সম্পাদনা' : 'Edit Ad') : (isBn ? 'নতুন বিজ্ঞাপন' : 'New Ad')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-brand-text">{isBn ? 'মৌলিক তথ্য' : 'Basic Information'}</h2>
          
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'শিরোনাম' : 'Title'}</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'বিজ্ঞাপনদাতার নাম' : 'Advertiser Name'}</label>
              <input
                type="text"
                value={formData.advertiser_name}
                onChange={(e) => setFormData({ ...formData, advertiser_name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'বিজ্ঞাপনদাতার যোগাযোগ' : 'Advertiser Contact'}</label>
              <input
                type="text"
                value={formData.advertiser_contact}
                onChange={(e) => setFormData({ ...formData, advertiser_contact: e.target.value })}
                required
                className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-brand-text">{isBn ? 'বিজ্ঞাপন বিবরণ' : 'Ad Details'}</h2>
          
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'ছবির URL' : 'Image URL'}</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              required
              placeholder="https://..."
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'লিংক URL (ঐচ্ছিক)' : 'Link URL (Optional)'}</label>
            <input
              type="url"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'প্লেসমেন্ট' : 'Placement'}</label>
            <select
              value={formData.placement}
              onChange={(e) => setFormData({ ...formData, placement: e.target.value as any })}
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
            >
              {placements.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'প্রাথমিকতা (0-100)' : 'Priority (0-100)'}</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
            />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-brand-text">{isBn ? 'সময়সূচী ও বাজেট' : 'Schedule & Budget'}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'শুরু' : 'Starts At'}</label>
              <input
                type="datetime-local"
                value={formData.starts_at}
                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                required
                className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'শেষ (ঐচ্ছিক)' : 'Ends At (Optional)'}</label>
              <input
                type="datetime-local"
                value={formData.ends_at}
                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'দৈনিক বাজেট ৳ (ঐচ্ছিক)' : 'Daily Budget ৳ (Optional)'}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.daily_budget_bdt}
              onChange={(e) => setFormData({ ...formData, daily_budget_bdt: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="active" className="text-sm text-brand-text">{isBn ? 'সক্রিয়' : 'Active'}</label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/admin/ads')} className="btn-ghost flex-1">
            {isBn ? 'বাতিল' : 'Cancel'}
          </button>
          <button type="submit" className="btn-primary flex-1">
            {existingAd ? (isBn ? 'আপডেট করুন' : 'Update') : (isBn ? 'তৈরি করুন' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
}
