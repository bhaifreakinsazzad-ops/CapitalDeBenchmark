import { useParams } from 'react-router-dom';
import { Users, TrendingUp, Calendar } from 'lucide-react';
import { useAuthStore } from '../store';
import { useSocialStore } from '../lib/services/social';
import { useBusinessStore } from '../lib/services/business';
import { Money } from '../components/shared/money';
import { formatDate } from '../lib/utils';

export function FounderProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user, lang } = useAuthStore();
  const { followFounder, unfollowFounder, isFollowingFounder, getFounderFollowers } = useSocialStore();
  const { businesses } = useBusinessStore();
  const isBn = lang === 'bn';

  const founderId = id || '';
  const followers = getFounderFollowers(founderId);
  const isFollowing = user ? isFollowingFounder(user.id, founderId) : false;

  const activeVentures = businesses.filter(b => b.owner_id === founderId && b.status === 'active');
  const totalRaised = activeVentures.reduce((sum, b) => sum + b.total_raised, 0);

  const handleFollow = () => {
    if (!user) return;
    if (isFollowing) {
      unfollowFounder(user.id, founderId);
    } else {
      followFounder(user.id, founderId);
    }
  };

  const displayName = `Founder #${founderId.substring(0, 3).toUpperCase()}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Profile Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-brand-accent">F</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brand-text">{displayName}</h1>
                <div className="flex items-center gap-2 text-sm text-brand-muted">
                  <Users className="w-4 h-4" />
                  <span>{followers.length} {isBn ? 'জন ফলোয়ার' : 'followers'}</span>
                </div>
              </div>
            </div>
          </div>
          {user && user.id !== founderId && (
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isFollowing
                  ? 'bg-brand-panel2 text-brand-muted border border-brand-line'
                  : 'bg-brand-accent text-brand-bg'
              }`}
            >
              {isFollowing ? (isBn ? 'আনফলো' : 'Unfollow') : (isBn ? 'ফলো' : 'Follow')}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-brand-muted mb-1">{isBn ? 'সক্রিয় ব্যবসা' : 'Active Ventures'}</p>
            <p className="text-lg font-bold text-brand-text">{activeVentures.length}</p>
          </div>
          <div>
            <p className="text-brand-muted mb-1">{isBn ? 'মোট সংগৃহীত' : 'Total Raised'}</p>
            <Money amount={totalRaised} lang={lang} className="text-lg font-bold" />
          </div>
        </div>
      </div>

      {/* Active Ventures */}
      <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? 'সক্রিয় ব্যবসা' : 'Active Ventures'}</h2>
      {activeVentures.length === 0 ? (
        <div className="card text-center py-12">
          <TrendingUp className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো সক্রিয় ব্যবসা নেই' : 'No active ventures'}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {activeVentures.map((business) => (
            <a
              key={business.id}
              href={`/biz/${business.slug}`}
              className="card hover:border-brand-accent/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-brand-panel2 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-brand-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-brand-text truncate">{business.name}</h3>
                  <p className="text-xs text-brand-muted mb-2">{business.category} · {business.location}</p>
                  <div className="flex items-center justify-between text-xs">
                    <Money amount={business.share_price} lang={lang} className="font-semibold" />
                    <span className="text-brand-muted">{business.shares_sold}/{business.total_shares} {isBn ? 'শেয়ার' : 'shares'}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
