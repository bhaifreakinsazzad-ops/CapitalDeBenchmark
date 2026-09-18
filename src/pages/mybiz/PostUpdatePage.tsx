import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useBusinessStore } from '../../lib/services/business';

export function PostUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useAuthStore();
  const { getBusinessById, postUpdate } = useBusinessStore();
  const navigate = useNavigate();
  const isBn = lang === 'bn';

  const business = id ? getBusinessById(id) : undefined;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!business) {
    navigate('/mybiz');
    return null;
  }

  const handleSubmit = () => {
    setError('');
    const result = postUpdate(business.id, { title, body });
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate(`/mybiz/${business.id}`), 2000);
    } else {
      setError(result.error || 'Failed to post update');
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-xl font-bold text-brand-text mb-2">
          {isBn ? 'জমা দেওয়া হয়েছে' : 'Submitted'}
        </h1>
        <p className="text-sm text-brand-muted">
          {isBn ? 'আপনার আপডেট অ্যাডমিন পর্যালোচনার অপেক্ষায়।' : 'Your update is pending admin review.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <button onClick={() => navigate(`/mybiz/${business.id}`)} className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text mb-4">
        <ArrowLeft className="w-4 h-4" />
        {isBn ? 'ফিরে যান' : 'Back'}
      </button>

      <h1 className="text-2xl font-bold text-brand-text mb-6">{isBn ? 'নতুন আপডেট' : 'Post Update'}</h1>

      {error && (
        <div className="bg-brand-bad/10 border border-brand-bad/30 rounded-xl p-3 text-sm text-brand-bad mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'শিরোনাম' : 'Title'}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isBn ? 'আপডেট শিরোনাম' : 'Update title'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-muted mb-1.5">
            {isBn ? 'বিবরণ' : 'Body'} ({body.length}/3000)
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            placeholder={isBn ? 'আপনার আপডেট লিখুন...' : 'Write your update...'}
          />
        </div>
        <button onClick={handleSubmit} className="btn-primary w-full">
          {isBn ? 'জমা দিন' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
