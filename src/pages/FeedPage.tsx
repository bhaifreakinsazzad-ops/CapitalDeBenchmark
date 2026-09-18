import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { useAuthStore } from '../store';
import { useBusinessStore } from '../lib/services/business';
import { EmptyState } from '../components/shared/empty-state';
import { formatDate } from '../lib/utils';

export function FeedPage() {
  const { lang } = useAuthStore();
  const { businesses, updates } = useBusinessStore();
  const isBn = lang === 'bn';

  // Get all approved updates from active businesses
  const activeBusinessIds = businesses.filter(b => b.status === 'active').map(b => b.id);
  const approvedUpdates = updates
    .filter(u => u.status === 'approved' && activeBusinessIds.includes(u.business_id))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const getBusinessName = (businessId: string) => {
    const biz = businesses.find(b => b.id === businessId);
    return biz?.name || 'Unknown';
  };

  const getBusinessSlug = (businessId: string) => {
    const biz = businesses.find(b => b.id === businessId);
    return biz?.slug || '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-brand-text mb-6">{isBn ? 'আপডেট ফিড' : 'Updates Feed'}</h1>

      {approvedUpdates.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title={isBn ? 'কোনো আপডেট নেই' : 'No updates yet'}
          description={isBn ? 'যাচাইকৃত ব্যবসা থেকে আপডেট এখানে দেখাবে' : 'Updates from verified businesses will appear here'}
        />
      ) : (
        <div className="space-y-4">
          {approvedUpdates.map((update) => (
            <div key={update.id} className="card">
              <div className="flex items-center gap-2 mb-2">
                <Link to={`/biz/${getBusinessSlug(update.business_id)}`} className="text-sm font-medium text-brand-accent hover:underline">
                  {getBusinessName(update.business_id)}
                </Link>
                <span className="text-xs text-brand-muted">·</span>
                <span className="text-xs text-brand-muted">{formatDate(update.created_at, lang)}</span>
              </div>
              <h3 className="text-base font-semibold text-brand-text mb-2">{update.title}</h3>
              <p className="text-sm text-brand-muted leading-relaxed whitespace-pre-wrap">{update.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
