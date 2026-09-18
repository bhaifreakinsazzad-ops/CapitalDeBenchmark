import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Ad {
  id: string;
  title: string;
  advertiser_name: string;
  advertiser_contact: string;
  image_url: string;
  link_url?: string;
  placement: 'market_top' | 'market_grid' | 'business_sidebar' | 'feed_inline' | 'dashboard_banner';
  priority: number;
  active: boolean;
  starts_at: string;
  ends_at?: string;
  daily_budget_bdt?: number;
  spent_bdt: number;
  impressions: number;
  clicks: number;
  created_by: string;
  created_at: string;
}

export interface AdEvent {
  id: string;
  ad_id: string;
  user_id?: string;
  event_type: 'impression' | 'click';
  ip_hash?: string;
  user_agent?: string;
  created_at: string;
}

interface AdsStore {
  ads: Ad[];
  adEvents: AdEvent[];
  
  // Admin actions
  createAd: (ad: Omit<Ad, 'id' | 'impressions' | 'clicks' | 'spent_bdt' | 'created_at'>) => { success: boolean; ad?: Ad };
  updateAd: (id: string, updates: Partial<Ad>) => { success: boolean };
  deleteAd: (id: string) => { success: boolean };
  toggleAd: (id: string) => { success: boolean };
  markPaymentReceived: (id: string, amount: number) => { success: boolean };
  
  // Public actions
  getActiveAd: (placement: string) => Ad | null;
  recordImpression: (adId: string, userId?: string) => void;
  recordClick: (adId: string, userId?: string) => void;
  
  // Stats
  getAdStats: (adId: string, days?: number) => { date: string; impressions: number; clicks: number }[];
  getCtr: (ad: Ad) => number;
}

export const useAdsStore = create<AdsStore>()(
  persist(
    (set, get) => ({
      ads: [],
      adEvents: [],
      
      createAd: (adData) => {
        const newAd: Ad = {
          ...adData,
          id: crypto.randomUUID(),
          impressions: 0,
          clicks: 0,
          spent_bdt: 0,
          created_at: new Date().toISOString(),
        };
        
        set((state) => ({ ads: [...state.ads, newAd] }));
        return { success: true, ad: newAd };
      },
      
      updateAd: (id, updates) => {
        set((state) => ({
          ads: state.ads.map((ad) => (ad.id === id ? { ...ad, ...updates } : ad)),
        }));
        return { success: true };
      },
      
      deleteAd: (id) => {
        set((state) => ({ ads: state.ads.filter((ad) => ad.id !== id) }));
        return { success: true };
      },
      
      toggleAd: (id) => {
        set((state) => ({
          ads: state.ads.map((ad) => 
            ad.id === id ? { ...ad, active: !ad.active } : ad
          ),
        }));
        return { success: true };
      },
      
      markPaymentReceived: (id, amount) => {
        set((state) => ({
          ads: state.ads.map((ad) => 
            ad.id === id ? { ...ad, spent_bdt: ad.spent_bdt + amount } : ad
          ),
        }));
        return { success: true };
      },
      
      getActiveAd: (placement) => {
        const now = new Date();
        const activeAds = get().ads.filter((ad) => {
          if (!ad.active || ad.placement !== placement) return false;
          if (new Date(ad.starts_at) > now) return false;
          if (ad.ends_at && new Date(ad.ends_at) < now) return false;
          if (ad.daily_budget_bdt && ad.spent_bdt >= ad.daily_budget_bdt) return false;
          return true;
        });
        
        if (activeAds.length === 0) return null;
        
        // Sort by priority desc, then random
        activeAds.sort((a, b) => b.priority - a.priority);
        return activeAds[0];
      },
      
      recordImpression: (adId, userId) => {
        const event: AdEvent = {
          id: crypto.randomUUID(),
          ad_id: adId,
          user_id: userId,
          event_type: 'impression',
          created_at: new Date().toISOString(),
        };
        
        set((state) => ({
          adEvents: [...state.adEvents, event],
          ads: state.ads.map((ad) => 
            ad.id === adId ? { ...ad, impressions: ad.impressions + 1 } : ad
          ),
        }));
      },
      
      recordClick: (adId, userId) => {
        const event: AdEvent = {
          id: crypto.randomUUID(),
          ad_id: adId,
          user_id: userId,
          event_type: 'click',
          created_at: new Date().toISOString(),
        };
        
        set((state) => ({
          adEvents: [...state.adEvents, event],
          ads: state.ads.map((ad) => 
            ad.id === adId ? { ...ad, clicks: ad.clicks + 1 } : ad
          ),
        }));
      },
      
      getAdStats: (adId, days = 30) => {
        const events = get().adEvents.filter((e) => e.ad_id === adId);
        const stats: { date: string; impressions: number; clicks: number }[] = [];
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const dayEvents = events.filter((e) => e.created_at.startsWith(dateStr));
          stats.push({
            date: dateStr,
            impressions: dayEvents.filter((e) => e.event_type === 'impression').length,
            clicks: dayEvents.filter((e) => e.event_type === 'click').length,
          });
        }
        
        return stats;
      },
      
      getCtr: (ad) => {
        if (ad.impressions === 0) return 0;
        return (ad.clicks / ad.impressions) * 100;
      },
    }),
    { name: 'capitaldb-ads' }
  )
);
