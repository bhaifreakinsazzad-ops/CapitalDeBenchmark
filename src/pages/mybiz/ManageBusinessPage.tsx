import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Eye, Edit } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useBusinessStore } from '../../lib/services/business';
import { Money } from '../../components/shared/money';
import { TrustBadge } from '../../components/shared/trust-badge';
import { EmptyState } from '../../components/shared/empty-state';
import { formatDate } from '../../lib/utils';

export function ManageBusinessPage() {
  const { id } = useParams<{ id: string }>();
  const { user, lang } = useAuthStore();
  const { getBusinessById, getBusinessUpdates, trustEvents, photos, documents } = useBusinessStore();
  const navigate = useNavigate();
  const isBn = lang === 'bn';

  const business = id ? getBusinessById(id) : undefined;
  const updates = business ? getBusinessUpdates(business.id) : [];
  const businessPhotos = business ? photos.filter(p => p.business_id === business.id) : [];
  const businessDocs = business ? documents.filter(d => d.business_id === business.id) : [];
  const businessTrustEvents = business ? trustEvents.filter(e => e.business_id === business.id) : [];

  if (!business) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          icon={Eye}
          title={isBn ? 'ব্যবসা পাওয়া যায়নি' : 'Business not found'}
          actionLabel={isBn ? 'ফিরে যান' : 'Go Back'}
          actionHref="/mybiz"
        />
      </div>
    );
  }

  const isOwner = user && business.owner_id === user.id;
  const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin');
  if (!isOwner && !isAdmin) {
    navigate('/mybiz');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <button onClick={() => navigate('/mybiz')} className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text mb-4">
        <ArrowLeft className="w-4 h-4" />
        {isBn ? 'ফিরে যান' : 'Back'}
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-text mb-1">{business.name}</h1>
          <p className="text-sm text-brand-muted">{business.category} · {business.location}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          business.status === 'active' ? 'bg-brand-accent/10 text-brand-accent' :
          business.status === 'pending' ? 'bg-brand-warn/10 text-brand-warn' :
          'bg-brand-bad/10 text-brand-bad'
        }`}>
          {business.status}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'শেয়ার মূল্য' : 'Share Price'}</p>
          <Money amount={business.share_price} lang={lang} className="text-lg font-bold" />
        </div>
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'বিক্রিত' : 'Sold'}</p>
          <p className="text-lg font-bold text-brand-text">{business.shares_sold}/{business.total_shares}</p>
        </div>
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'ফলোয়ার' : 'Followers'}</p>
          <p className="text-lg font-bold text-brand-text">{business.followers_count}</p>
        </div>
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'ট্রাস্ট' : 'Trust'}</p>
          <TrustBadge score={business.trust_score} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-6">
        <Link to={`/biz/${business.slug}`} className="btn-ghost flex items-center gap-2 text-sm">
          <Eye className="w-4 h-4" />
          {isBn ? 'পাবলিক দেখুন' : 'View Public'}
        </Link>
        {(business.status === 'pending' || business.status === 'rejected') && (
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Edit className="w-4 h-4" />
            {isBn ? 'সম্পাদনা' : 'Edit'}
          </button>
        )}
      </div>

      {/* Updates */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-brand-text">{isBn ? 'আপডেট' : 'Updates'}</h2>
          {business.status === 'active' && (
            <Link to={`/mybiz/${business.id}/updates/new`} className="btn-ghost text-sm flex items-center gap-1">
              <Plus className="w-3 h-3" />
              {isBn ? 'নতুন' : 'New'}
            </Link>
          )}
        </div>
        {updates.length === 0 ? (
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো আপডেট নেই' : 'No updates yet'}</p>
        ) : (
          <div className="space-y-2">
            {updates.slice(0, 10).map((update) => (
              <div key={update.id} className="card py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-text">{update.title}</p>
                    <p className="text-xs text-brand-muted">{formatDate(update.created_at, lang)}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    update.status === 'approved' ? 'bg-brand-accent/10 text-brand-accent' :
                    update.status === 'pending' ? 'bg-brand-warn/10 text-brand-warn' :
                    'bg-brand-bad/10 text-brand-bad'
                  }`}>
                    {update.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust Events */}
      <div>
        <h2 className="text-lg font-semibold text-brand-text mb-3">{isBn ? 'ট্রাস্ট ইতিহাস' : 'Trust History'}</h2>
        {businessTrustEvents.length === 0 ? (
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো ইতিহাস নেই' : 'No events yet'}</p>
        ) : (
          <div className="space-y-2">
            {businessTrustEvents.slice(0, 20).map((event) => (
              <div key={event.id} className="card py-2 flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text">{event.reason}</p>
                  <p className="text-xs text-brand-muted">{formatDate(event.created_at, lang)}</p>
                </div>
                <span className={`text-sm font-bold ${event.delta >= 0 ? 'text-brand-accent' : 'text-brand-bad'}`}>
                  {event.delta >= 0 ? '+' : ''}{event.delta}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
