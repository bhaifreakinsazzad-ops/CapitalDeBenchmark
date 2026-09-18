import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useBusinessStore } from '../../lib/services/business';
import { CATEGORIES } from '../../lib/constants';

export function NewBusinessPage() {
  const { user, lang } = useAuthStore();
  const { createBusiness } = useBusinessStore();
  const navigate = useNavigate();
  const isBn = lang === 'bn';
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    story: '',
    share_price: 10,
    total_shares: 1000,
    funding_mode: 'instant' as 'instant' | 'milestone',
    milestone_target: 0,
    revenue_monthly: 0,
  });

  const [documents, setDocuments] = useState<Array<{ doc_type: string; file_name: string }>>([]);
  const [photos, setPhotos] = useState<Array<{ file_name: string; caption?: string; is_cover: boolean }>>([]);

  if (!user || (user.role !== 'founder' && user.role !== 'admin' && user.role !== 'super_admin')) {
    navigate('/mybiz');
    return null;
  }

  const handleSubmit = () => {
    setError('');
    const result = createBusiness({
      ...formData,
      documents,
      photos,
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/mybiz'), 3000);
    } else {
      setError(result.error || 'Failed to create business');
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-xl font-bold text-brand-text mb-2">
            {isBn ? 'জমা দেওয়া হয়েছে' : 'Submitted'}
          </h1>
          <p className="text-sm text-brand-muted mb-6">
            {isBn ? 'যাচাইকরণের জন্য জমা দেওয়া হয়েছে। ১ ঘণ্টার মধ্যে উত্তর পাবেন।' : 'Submitted for verification. You will hear back within 1 hour.'}
          </p>
          <button onClick={() => navigate('/mybiz')} className="btn-primary">
            {isBn ? 'আমার ব্যবসায় ফিরুন' : 'Back to My Ventures'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <button onClick={() => navigate('/mybiz')} className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text mb-4">
        <ArrowLeft className="w-4 h-4" />
        {isBn ? 'ফিরে যান' : 'Back'}
      </button>

      <h1 className="text-2xl font-bold text-brand-text mb-6">{isBn ? 'নতুন ব্যবসা তালিকা' : 'List New Business'}</h1>

      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-brand-accent' : 'bg-brand-line'}`} />
        ))}
      </div>

      {error && (
        <div className="bg-brand-bad/10 border border-brand-bad/30 rounded-xl p-3 text-sm text-brand-bad mb-4">
          {error}
        </div>
      )}

      {/* Step 1: Basics */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'নাম' : 'Name'}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={isBn ? 'ব্যবসার নাম' : 'Business name'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'ক্যাটাগরি' : 'Category'}</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">{isBn ? 'বেছে নিন' : 'Select'}</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'স্থান' : 'Location'}</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder={isBn ? 'শহর, জেলা' : 'City, District'}
            />
          </div>
          <button onClick={() => setStep(2)} className="btn-primary w-full">
            {isBn ? 'পরবর্তী' : 'Next'}
          </button>
        </div>
      )}

      {/* Step 2: Story */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">
              {isBn ? 'গল্প' : 'Story'} ({formData.story.length}/3000)
            </label>
            <textarea
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              rows={10}
              placeholder={isBn ? 'আপনার ব্যবসার গল্প বলুন (১০০-৩০০০ অক্ষর)...' : 'Tell your business story (100-3000 chars)...'}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-ghost flex-1">{isBn ? 'পেছনে' : 'Back'}</button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1">{isBn ? 'পরবর্তী' : 'Next'}</button>
          </div>
        </div>
      )}

      {/* Step 3: Financials */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'শেয়ার মূল্য (৳)' : 'Share Price (৳)'}</label>
            <input
              type="number"
              value={formData.share_price}
              onChange={(e) => setFormData({ ...formData, share_price: Number(e.target.value) })}
              min={5}
              max={10000}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'মোট শেয়ার' : 'Total Shares'}</label>
            <input
              type="number"
              value={formData.total_shares}
              onChange={(e) => setFormData({ ...formData, total_shares: Number(e.target.value) })}
              min={100}
              max={1000000}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'ফান্ডিং মোড' : 'Funding Mode'}</label>
            <select
              value={formData.funding_mode}
              onChange={(e) => setFormData({ ...formData, funding_mode: e.target.value as any })}
            >
              <option value="instant">{isBn ? 'তাৎক্ষণিক' : 'Instant'}</option>
              <option value="milestone">{isBn ? 'মাইলস্টোন' : 'Milestone'}</option>
            </select>
          </div>
          {formData.funding_mode === 'milestone' && (
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'লক্ষ্য পরিমাণ (৳)' : 'Target Amount (৳)'}</label>
              <input
                type="number"
                value={formData.milestone_target}
                onChange={(e) => setFormData({ ...formData, milestone_target: Number(e.target.value) })}
                min={1}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'মাসিক রাজস্ব (৳)' : 'Monthly Revenue (৳)'}</label>
            <input
              type="number"
              value={formData.revenue_monthly}
              onChange={(e) => setFormData({ ...formData, revenue_monthly: Number(e.target.value) })}
              min={0}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-ghost flex-1">{isBn ? 'পেছনে' : 'Back'}</button>
            <button onClick={() => setStep(4)} className="btn-primary flex-1">{isBn ? 'পরবর্তী' : 'Next'}</button>
          </div>
        </div>
      )}

      {/* Step 4: Documents */}
      {step === 4 && (
        <div className="space-y-4">
          <p className="text-sm text-brand-muted mb-4">{isBn ? '৪টি প্রয়োজনীয় নথি আপলোড করুন' : 'Upload 4 required documents'}</p>
          {['nid_front', 'nid_back', 'trade_license', 'utility_bill'].map((docType) => (
            <div key={docType}>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">
                {docType.replace('_', ' ')} {documents.find(d => d.doc_type === docType) ? '✓' : ''}
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setDocuments([...documents.filter(d => d.doc_type !== docType), { doc_type: docType, file_name: file.name }]);
                  }
                }}
              />
            </div>
          ))}
          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="btn-ghost flex-1">{isBn ? 'পেছনে' : 'Back'}</button>
            <button onClick={() => setStep(5)} className="btn-primary flex-1">{isBn ? 'পরবর্তী' : 'Next'}</button>
          </div>
        </div>
      )}

      {/* Step 5: Photos */}
      {step === 5 && (
        <div className="space-y-4">
          <p className="text-sm text-brand-muted mb-4">{isBn ? '২-১২টি ছবি আপলোড করুন' : 'Upload 2-12 photos'}</p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setPhotos(files.map((f, i) => ({ file_name: f.name, is_cover: i === 0 })));
            }}
          />
          <p className="text-xs text-brand-muted">{photos.length} {isBn ? 'টি ছবি নির্বাচিত' : 'photos selected'}</p>
          <div className="flex gap-3">
            <button onClick={() => setStep(4)} className="btn-ghost flex-1">{isBn ? 'পেছনে' : 'Back'}</button>
            <button onClick={handleSubmit} className="btn-primary flex-1">{isBn ? 'জমা দিন' : 'Submit'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
