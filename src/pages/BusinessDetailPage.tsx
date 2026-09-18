import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Shield, TrendingUp, Heart, MapPin, Calendar, DollarSign, Target } from 'lucide-react';
import { useAuthStore } from '../store';
import { useBusinessStore } from '../lib/services/business';
import { Money } from '../components/shared/money';
import { TrustBadge } from '../components/shared/trust-badge';
import { RiskBanner } from '../components/shared/risk-banner';
import { EmptyState } from '../components/shared/empty-state';
import { formatDate } from '../lib/utils';

export function BusinessDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, lang, isAuthenticated } = useAuthStore();
  const { getBusinessBySlug, getBusinessUpdates, followBusiness, unfollowBusiness, isFollowing, photos, documents } = useBusinessStore();
  const navigate = useNavigate();
  const isBn = lang === 'bn';

  const business = slug ? getBusinessBySlug(slug) : undefined;
  const updates = business ? getBusinessUpdates(business.id, 'approved') : [];
  const businessPhotos = business ? photos.filter(p => p.business_id === business.id).sort((a, b) => a.sort_order - b.sort_order) : [];
  const businessDocs = business ? documents.filter(d => d.business_id === business.id) : [];
  const following = business ? isFollowing(business.id) : false;

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!business) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          icon={TrendingUp}
          title={isBn ? 'ব্যবসা পাওয়া যায়নি' : 'Business not found'}
          description={isBn ? 'এই ব্যবসা বিদ্যমান নেই বা সরিয়ে নেওয়া হয়েছে' : 'This business does not exist or has been removed'}
          actionLabel={isBn ? 'বাজারে ফিরুন' : 'Back to Market'}
          actionHref="/market"
        />
      </div>
    );
  }

  // Check access
  const isOwner = user && business.owner_id === user.id;
  const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin');
  const canView = business.status === 'active' || isOwner || isAdmin;

  if (!canView) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          icon={Shield}
          title={isBn ? 'অ্যাক্সেস অস্বীকৃত' : 'Access Denied'}
          description={isBn ? 'এই ব্যবসা সক্রিয় নয়' : 'This business is not active'}
          actionLabel={isBn ? 'বাজারে ফিরুন' : 'Back to Market'}
          actionHref="/market"
        />
      </div>
    );
  }

  const handleFollow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (following) {
      unfollowBusiness(business.id);
    } else {
      followBusiness(business.id);
    }
  };

  const getFundingProgress = () => {
    return Math.round((business.shares_sold / business.total_shares) * 100);
  };

  const getRaisedAmount = () => {
    return business.shares_sold * business.share_price;
  };

  const getFundingModeText = () => {
    if (business.funding_mode === 'instant') {
      return isBn
        ? 'তাৎক্ষণিক ফান্ডিং — ব্যবসা আপনার বিনিয়োগ সাথে সাথেই পায়। যে সব ব্যবসা ইতিমধ্যেই চলছে এবং বাড়ছে তাদের জন্য উপযুক্ত।'
        : 'Instant Funding — the business receives your investment immediately as it comes in. Best for businesses already operating and growing.';
    }
    return isBn
      ? 'মাইলস্টোন ফান্ডিং — ব্যবসা তার লক্ষ্যে পৌঁছানো পর্যন্ত আপনার টাকা নিরাপদে এস্ক্রোতে থাকে। লক্ষ্যে পৌঁছানো না গেলে আপনি স্বয়ংক্রিয়ভাবে ফেরত পাবেন।'
      : 'Milestone Funding — your money is held safely in escrow until the business reaches its funding target. If the target is not reached, you are refunded automatically.';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Status banner for non-active */}
      {business.status !== 'active' && (
        <div className="bg-brand-warn/10 border border-brand-warn/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-brand-warn font-medium">
            {business.status === 'pending' && (isBn ? 'এই ব্যবসা যাচাইকরণের অপেক্ষায়' : 'This business is pending verification')}
            {business.status === 'rejected' && (isBn ? `প্রত্যাখ্যাত: ${business.rejection_reason}` : `Rejected: ${business.rejection_reason}`)}
            {business.status === 'suspended' && (isBn ? `স্থগিত: ${business.suspension_reason}` : `Suspended: ${business.suspension_reason}`)}
          </p>
        </div>
      )}

      {/* Hero */}
      <div className="mb-6">
        <div className="aspect-video bg-gradient-to-br from-brand-panel2 to-brand-line rounded-xl mb-4 flex items-center justify-center">
          <TrendingUp className="w-16 h-16 text-brand-muted" />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-brand-accent" />
              <span className="text-xs text-brand-accent font-medium">{isBn ? 'যাচাইকৃত' : 'Verified'}</span>
              <TrustBadge score={business.trust_score} />
            </div>
            <h1 className="text-2xl font-bold text-brand-text mb-2">{business.name}</h1>
            <div className="flex items-center gap-3 text-sm text-brand-muted">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {business.location}
              </span>
              <span>{business.category}</span>
            </div>
          </div>

          <button
            onClick={handleFollow}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              following
                ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/30'
                : 'bg-brand-panel2 text-brand-text border border-brand-line hover:border-brand-accent/30'
            }`}
          >
            <Heart className={`w-4 h-4 ${following ? 'fill-current' : ''}`} />
            <span className="text-sm">{business.followers_count}</span>
          </button>
        </div>
      </div>

      {/* Story */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-brand-text mb-3">{isBn ? 'গল্প' : 'Story'}</h2>
        <p className="text-sm text-brand-muted leading-relaxed whitespace-pre-wrap">{business.story}</p>
      </div>

      {/* Financials */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'শেয়ার মূল্য' : 'Share Price'}</p>
          <Money amount={business.share_price} lang={lang} className="text-lg font-bold" />
        </div>
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'বিক্রিত শেয়ার' : 'Shares Sold'}</p>
          <p className="text-lg font-bold text-brand-text tabular-nums">
            {business.shares_sold} / {business.total_shares}
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'সংগৃহীত' : 'Raised'}</p>
          <Money amount={getRaisedAmount()} lang={lang} className="text-lg font-bold" />
        </div>
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'মাসিক রাজস্ব' : 'Monthly Revenue'}</p>
          <Money amount={business.revenue_monthly} lang={lang} className="text-lg font-bold" />
        </div>
      </div>

      {/* Funding mode */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-brand-accent" />
          <h2 className="text-sm font-semibold text-brand-text">
            {business.funding_mode === 'instant' ? (isBn ? 'তাৎক্ষণিক ফান্ডিং' : 'Instant Funding') : (isBn ? 'মাইলস্টোন ফান্ডিং' : 'Milestone Funding')}
          </h2>
        </div>
        <p className="text-xs text-brand-muted leading-relaxed">{getFundingModeText()}</p>
        {business.funding_mode === 'milestone' && business.milestone_target && (
          <p className="text-xs text-brand-muted mt-2">
            {isBn ? 'লক্ষ্য: ' : 'Target: '}<Money amount={business.milestone_target} lang={lang} />
          </p>
        )}
      </div>

      {/* Invest Box */}
      {business.status === 'active' && !isOwner && (
        <div className="card mb-6 border-brand-accent/20 bg-gradient-to-br from-brand-panel to-brand-panel2">
          <h2 className="text-lg font-semibold text-brand-text mb-4">
            {isBn ? `${business.name}-এ বিনিয়োগ করুন` : `Invest in ${business.name}`}
          </h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">{isBn ? 'প্রতি শেয়ার মূল্য' : 'Price per share'}</span>
              <Money amount={business.share_price} lang={lang} className="font-semibold" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">{isBn ? 'উপলব্ধ শেয়ার' : 'Shares available'}</span>
              <span className="text-brand-text font-semibold">
                {business.total_shares - business.shares_sold} / {business.total_shares}
              </span>
            </div>
            {user && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">{isBn ? 'আপনার ব্যালেন্স' : 'Your balance'}</span>
                <Money amount={user.balance} lang={lang} className="font-semibold" />
              </div>
            )}
          </div>

          {!isAuthenticated ? (
            <Link to="/login" className="btn-primary w-full text-center block">
              {isBn ? 'বিনিয়োগ করতে লগ ইন করুন' : 'Login to Invest'}
            </Link>
          ) : user?.kyc_status !== 'verified' ? (
            <div>
              <p className="text-xs text-brand-warn mb-2">{isBn ? 'বিনিয়োগের জন্য KYC প্রয়োজন' : 'KYC required to invest'}</p>
              <Link to="/wallet/kyc" className="btn-primary w-full text-center block">
                {isBn ? 'KYC সম্পন্ন করুন' : 'Complete KYC'}
              </Link>
            </div>
          ) : business.total_shares - business.shares_sold === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-brand-muted">{isBn ? 'সব শেয়ার বিক্রি হয়ে গেছে' : 'All shares sold'}</p>
            </div>
          ) : (
            <Link to={`/invest/${business.slug}`} className="btn-primary w-full text-center block">
              {isBn ? 'এখনই বিনিয়োগ করুন' : 'Invest Now'}
            </Link>
          )}
        </div>
      )}

      {/* Verification summary */}
      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-brand-text mb-3">{isBn ? 'যাচাইকরণ সারাংশ' : 'Verification Summary'}</h2>
        <p className="text-xs text-brand-muted mb-3">
          {businessDocs.length} {isBn ? 'টি নথি যাচাই করা হয়েছে' : 'documents verified'}
          {business.verified_at && ` on ${formatDate(business.verified_at, lang)}`}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {businessDocs.slice(0, 4).map((doc) => (
            <div key={doc.id} className="flex items-center gap-2 text-xs text-brand-muted">
              <Shield className="w-3 h-3 text-brand-accent" />
              <span>{doc.doc_type.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Photos */}
      {businessPhotos.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-brand-text mb-3">{isBn ? 'ছবি' : 'Photos'}</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {businessPhotos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo.file_url)}
                className="w-24 h-24 bg-brand-panel2 rounded-lg flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity"
              >
                <TrendingUp className="w-6 h-6 text-brand-muted" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Updates feed */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-brand-text mb-3">{isBn ? 'আপডেট' : 'Updates'}</h2>
        {updates.length === 0 ? (
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো আপডেট নেই' : 'No updates yet'}</p>
        ) : (
          <div className="space-y-3">
            {updates.slice(0, 20).map((update) => (
              <div key={update.id} className="card">
                <h3 className="text-sm font-semibold text-brand-text mb-1">{update.title}</h3>
                <p className="text-xs text-brand-muted mb-2">{formatDate(update.created_at, lang)}</p>
                <p className="text-sm text-brand-text leading-relaxed whitespace-pre-wrap">{update.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Risk banner */}
      <RiskBanner lang={lang} />

      {/* Photo modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="card max-w-2xl w-full">
            <p className="text-sm text-brand-muted text-center">{isBn ? 'ছবি প্রিভিউ (ডেমো)' : 'Photo preview (demo)'}</p>
            <p className="text-xs text-brand-muted text-center mt-2 font-mono break-all">{selectedPhoto}</p>
            <button onClick={() => setSelectedPhoto(null)} className="btn-ghost w-full mt-4">
              {isBn ? 'বন্ধ' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
