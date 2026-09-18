import { useEffect } from 'react';
import { useAdsStore } from '../lib/services/ads';
import { useAuthStore } from '../store';

interface AdSlotProps {
  placement: 'market_top' | 'market_grid' | 'business_sidebar' | 'feed_inline' | 'dashboard_banner';
  className?: string;
}

export function AdSlot({ placement, className = '' }: AdSlotProps) {
  const { user } = useAuthStore();
  const { getActiveAd, recordImpression, recordClick } = useAdsStore();

  const ad = getActiveAd(placement);

  useEffect(() => {
    if (ad) {
      recordImpression(ad.id, user?.id);
    }
  }, [ad, user]);

  if (!ad) return null;

  const handleClick = () => {
    recordClick(ad.id, user?.id);
    if (ad.link_url) {
      window.open(ad.link_url, '_blank');
    }
  };

  const sizeClasses = {
    market_top: 'h-[200px] w-full',
    market_grid: 'h-[400px] w-[600px]',
    business_sidebar: 'h-[250px] w-[300px]',
    feed_inline: 'h-[200px] w-full',
    dashboard_banner: 'h-[150px] w-full',
  };

  return (
    <div className={`relative ${sizeClasses[placement]} ${className}`}>
      <div
        onClick={handleClick}
        className="w-full h-full cursor-pointer overflow-hidden rounded-xl border border-brand-line hover:border-brand-accent/30 transition-colors"
      >
        <img
          src={ad.image_url}
          alt={ad.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
        Ad
      </div>
    </div>
  );
}
