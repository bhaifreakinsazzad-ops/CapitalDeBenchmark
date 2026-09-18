import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore, useDemoStore } from '../../store';
import { notify, NOTIFICATION_TYPES } from '../services/notify';
import { generateId } from '../utils';
import { CATEGORIES } from '../constants';

export interface BusinessDocument {
  id: string;
  business_id: string;
  doc_type: 'nid_front' | 'nid_back' | 'trade_license' | 'tin_certificate' | 'bank_statement' | 'utility_bill' | 'operation_photo' | 'other';
  file_url: string;
  file_name: string;
  uploaded_at: string;
}

export interface BusinessPhoto {
  id: string;
  business_id: string;
  file_url: string;
  caption?: string;
  is_cover: boolean;
  sort_order: number;
  created_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  category: string;
  location: string;
  story: string;
  share_price: number;
  total_shares: number;
  shares_sold: number;
  funding_mode: 'instant' | 'milestone';
  milestone_target?: number;
  revenue_monthly: number;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  trust_score: number;
  docs: any[];
  photos: any[];
  rejection_reason?: string;
  suspension_reason?: string;
  suspended_at?: string;
  suspended_by?: string;
  verified_by?: string;
  verified_at?: string;
  initial_story?: string;
  views_count: number;
  followers_count: number;
  last_update_at?: string;
  funding_option_shown: boolean;
  escrow_balance: number;
  total_raised: number;
  milestone_reached_at?: string;
  refunded_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessUpdate {
  id: string;
  business_id: string;
  author_id: string;
  title: string;
  body: string;
  media: string[];
  media_caption?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export interface TrustScoreEvent {
  id: string;
  business_id: string;
  delta: number;
  reason: string;
  new_score: number;
  actor_id?: string;
  created_at: string;
}

export interface Follow {
  id: string;
  user_id: string;
  business_id: string;
  created_at: string;
}

// Slug generator
function generateSlug(text: string, existingSlugs: string[]): string {
  let base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (base.length < 3) base = 'biz';
  
  let candidate = base;
  let i = 0;
  while (existingSlugs.includes(candidate)) {
    i++;
    candidate = `${base}-${i}`;
  }
  return candidate;
}

interface BusinessStore {
  businesses: Business[];
  documents: BusinessDocument[];
  photos: BusinessPhoto[];
  updates: BusinessUpdate[];
  trustEvents: TrustScoreEvent[];
  follows: Follow[];

  // Founder actions
  upgradeToFounder: () => { success: boolean; error?: string };
  createBusiness: (data: {
    name: string;
    category: string;
    location: string;
    story: string;
    share_price: number;
    total_shares: number;
    funding_mode: 'instant' | 'milestone';
    milestone_target?: number;
    revenue_monthly: number;
    documents: Array<{ doc_type: string; file_name: string }>;
    photos: Array<{ file_name: string; caption?: string; is_cover: boolean }>;
  }) => { success: boolean; error?: string; business_id?: string; slug?: string };

  editBusiness: (id: string, updates: Partial<Business>) => { success: boolean; error?: string };
  
  getOwnerBusinesses: (ownerId: string) => Business[];
  getBusinessBySlug: (slug: string) => Business | undefined;
  getBusinessById: (id: string) => Business | undefined;

  // Updates
  postUpdate: (businessId: string, data: { title: string; body: string; media?: string[]; media_caption?: string }) => { success: boolean; error?: string; update_id?: string };
  getBusinessUpdates: (businessId: string, status?: string) => BusinessUpdate[];

  // Follows
  followBusiness: (businessId: string) => { success: boolean; followers_count: number };
  unfollowBusiness: (businessId: string) => { success: boolean; followers_count: number };
  isFollowing: (businessId: string) => boolean;

  // Admin actions
  verifyBusiness: (id: string, adminId: string) => { success: boolean; error?: string };
  rejectBusiness: (id: string, adminId: string, reason: string) => { success: boolean; error?: string };
  suspendBusiness: (id: string, adminId: string, reason: string) => { success: boolean; error?: string };
  reactivateBusiness: (id: string, adminId: string) => { success: boolean; error?: string };
  adjustTrustScore: (id: string, adminId: string, delta: number, reason: string) => { success: boolean; error?: string };

  approveUpdate: (id: string, adminId: string) => { success: boolean; error?: string };
  rejectUpdate: (id: string, adminId: string, reason: string) => { success: boolean; error?: string };

  // Helpers
  bumpTrustScore: (businessId: string, delta: number, reason: string, actorId?: string) => number;
}

export const useBusinessStore = create<BusinessStore>()(
  persist(
    (set, get) => ({
      businesses: [],
      documents: [],
      photos: [],
      updates: [],
      trustEvents: [],
      follows: [],

      upgradeToFounder: () => {
        const { user, updateUser } = useAuthStore.getState();
        if (!user) return { success: false, error: 'Not authenticated' };
        if (user.kyc_status !== 'verified') return { success: false, error: 'KYC verification required' };
        if (user.role === 'founder' || user.role === 'admin' || user.role === 'super_admin') {
          return { success: true };
        }
        updateUser({ role: 'founder' });
        return { success: true };
      },

      createBusiness: (data) => {
        const { user } = useAuthStore.getState();
        if (!user) return { success: false, error: 'Not authenticated' };
        if (user.role !== 'founder' && user.role !== 'admin' && user.role !== 'super_admin') {
          return { success: false, error: 'Founder role required' };
        }

        // Validation
        if (data.name.length < 3 || data.name.length > 80) return { success: false, error: 'Name must be 3-80 characters' };
        if (!CATEGORIES.includes(data.category as any)) return { success: false, error: 'Invalid category' };
        if (data.location.length < 2 || data.location.length > 60) return { success: false, error: 'Location must be 2-60 characters' };
        if (data.story.length < 100 || data.story.length > 3000) return { success: false, error: 'Story must be 100-3000 characters' };
        if (data.share_price < 5 || data.share_price > 10000) return { success: false, error: 'Share price must be 5-10000' };
        if (data.total_shares < 100 || data.total_shares > 1000000) return { success: false, error: 'Total shares must be 100-1000000' };
        if (data.funding_mode === 'milestone' && (!data.milestone_target || data.milestone_target <= 0)) {
          return { success: false, error: 'Milestone target required' };
        }

        const requiredDocs = ['nid_front', 'nid_back', 'trade_license', 'utility_bill'];
        const hasAllDocs = requiredDocs.every(type => data.documents.some(d => d.doc_type === type));
        if (!hasAllDocs) return { success: false, error: 'All 4 required documents must be uploaded' };
        if (data.photos.length < 2 || data.photos.length > 12) return { success: false, error: '2-12 photos required' };

        const existingSlugs = get().businesses.map(b => b.slug);
        const slug = generateSlug(data.name, existingSlugs);
        const businessId = generateId();
        const now = new Date().toISOString();

        const business: Business = {
          id: businessId,
          owner_id: user.id,
          name: data.name,
          slug,
          category: data.category,
          location: data.location,
          story: data.story,
          share_price: data.share_price,
          total_shares: data.total_shares,
          shares_sold: 0,
          funding_mode: data.funding_mode,
          milestone_target: data.milestone_target,
          revenue_monthly: data.revenue_monthly,
          status: 'pending',
          trust_score: 50,
          docs: [],
          photos: [],
          views_count: 0,
          followers_count: 0,
          funding_option_shown: false,
          escrow_balance: 0,
          total_raised: 0,
          created_at: now,
          updated_at: now,
        };

        // Create document records
        const docs: BusinessDocument[] = data.documents.map(d => ({
          id: generateId(),
          business_id: businessId,
          doc_type: d.doc_type as any,
          file_url: `biz-docs/${businessId}/${d.doc_type}-${generateId()}.jpg`,
          file_name: d.file_name,
          uploaded_at: now,
        }));

        // Create photo records
        const photos: BusinessPhoto[] = data.photos.map((p, i) => ({
          id: generateId(),
          business_id: businessId,
          file_url: `biz-photos/${businessId}/${generateId()}.jpg`,
          caption: p.caption,
          is_cover: p.is_cover,
          sort_order: i,
          created_at: now,
        }));

        set((state) => ({
          businesses: [business, ...state.businesses],
          documents: [...docs, ...state.documents],
          photos: [...photos, ...state.photos],
        }));

        // Notify admins
        const { users } = useDemoStore.getState();
        users.filter(u => u.role === 'admin' || u.role === 'super_admin').forEach(admin => {
          notify(admin.id, 'business_pending', { business_id: businessId, business_name: data.name });
        });

        return { success: true, business_id: businessId, slug };
      },

      editBusiness: (id, updates) => {
        const { user } = useAuthStore.getState();
        if (!user) return { success: false, error: 'Not authenticated' };

        const business = get().businesses.find(b => b.id === id);
        if (!business) return { success: false, error: 'Business not found' };

        const isOwner = business.owner_id === user.id;
        const isAdmin = user.role === 'admin' || user.role === 'super_admin';
        if (!isOwner && !isAdmin) return { success: false, error: 'Not authorized' };

        // If active, only allow story, photos, revenue edits
        if (business.status === 'active' && isOwner && !isAdmin) {
          const allowed = ['story', 'revenue_monthly'];
          const disallowed = Object.keys(updates).filter(k => !allowed.includes(k));
          if (disallowed.length > 0) {
            return { success: false, error: 'Share price and total shares are frozen after listing' };
          }
        }

        // If rejected, reset to pending
        const newStatus = business.status === 'rejected' ? 'pending' : business.status;

        set((state) => ({
          businesses: state.businesses.map(b =>
            b.id === id ? { ...b, ...updates, status: newStatus, rejection_reason: newStatus === 'pending' ? undefined : b.rejection_reason, updated_at: new Date().toISOString() } : b
          ),
        }));

        return { success: true };
      },

      getOwnerBusinesses: (ownerId) => {
        return get().businesses
          .filter(b => b.owner_id === ownerId)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      },

      getBusinessBySlug: (slug) => {
        return get().businesses.find(b => b.slug === slug);
      },

      getBusinessById: (id) => {
        return get().businesses.find(b => b.id === id);
      },

      postUpdate: (businessId, data) => {
        const { user } = useAuthStore.getState();
        if (!user) return { success: false, error: 'Not authenticated' };

        const business = get().businesses.find(b => b.id === businessId);
        if (!business) return { success: false, error: 'Business not found' };
        if (business.owner_id !== user.id && user.role !== 'admin' && user.role !== 'super_admin') {
          return { success: false, error: 'Not authorized' };
        }
        if (business.status !== 'active' && business.status !== 'suspended') {
          return { success: false, error: 'Business must be active to post updates' };
        }

        if (data.title.length < 3 || data.title.length > 120) return { success: false, error: 'Title must be 3-120 characters' };
        if (data.body.length < 10 || data.body.length > 3000) return { success: false, error: 'Body must be 10-3000 characters' };
        if (data.media && data.media.length > 4) return { success: false, error: 'Maximum 4 images' };

        const updateId = generateId();
        const now = new Date().toISOString();
        const update: BusinessUpdate = {
          id: updateId,
          business_id: businessId,
          author_id: user.id,
          title: data.title,
          body: data.body,
          media: data.media || [],
          media_caption: data.media_caption,
          status: 'pending',
          created_at: now,
        };

        set((state) => ({
          updates: [update, ...state.updates],
        }));

        // Notify admins
        const { users } = useDemoStore.getState();
        users.filter(u => u.role === 'admin' || u.role === 'super_admin').forEach(admin => {
          notify(admin.id, 'update_pending', { update_id: updateId, business_name: business.name });
        });

        return { success: true, update_id: updateId };
      },

      getBusinessUpdates: (businessId, status) => {
        let updates = get().updates.filter(u => u.business_id === businessId);
        if (status) updates = updates.filter(u => u.status === status);
        return updates.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      },

      followBusiness: (businessId) => {
        const { user } = useAuthStore.getState();
        if (!user) return { success: false, followers_count: 0 };

        const existing = get().follows.find(f => f.user_id === user.id && f.business_id === businessId);
        if (existing) {
          const count = get().follows.filter(f => f.business_id === businessId).length;
          return { success: true, followers_count: count };
        }

        const follow: Follow = {
          id: generateId(),
          user_id: user.id,
          business_id: businessId,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          follows: [follow, ...state.follows],
          businesses: state.businesses.map(b =>
            b.id === businessId ? { ...b, followers_count: b.followers_count + 1 } : b
          ),
        }));

        const count = get().follows.filter(f => f.business_id === businessId).length;
        return { success: true, followers_count: count };
      },

      unfollowBusiness: (businessId) => {
        const { user } = useAuthStore.getState();
        if (!user) return { success: false, followers_count: 0 };

        set((state) => ({
          follows: state.follows.filter(f => !(f.user_id === user.id && f.business_id === businessId)),
          businesses: state.businesses.map(b =>
            b.id === businessId ? { ...b, followers_count: Math.max(0, b.followers_count - 1) } : b
          ),
        }));

        const count = get().follows.filter(f => f.business_id === businessId).length;
        return { success: true, followers_count: count };
      },

      isFollowing: (businessId) => {
        const { user } = useAuthStore.getState();
        if (!user) return false;
        return get().follows.some(f => f.user_id === user.id && f.business_id === businessId);
      },

      verifyBusiness: (id, adminId) => {
        const business = get().businesses.find(b => b.id === id);
        if (!business) return { success: false, error: 'Business not found' };
        if (business.status !== 'pending') return { success: false, error: 'Business not pending' };

        const now = new Date().toISOString();
        set((state) => ({
          businesses: state.businesses.map(b =>
            b.id === id ? { ...b, status: 'active', verified_by: adminId, verified_at: now, initial_story: b.story, updated_at: now } : b
          ),
        }));

        // Bump trust score +10 for complete docs
        get().bumpTrustScore(id, 10, 'Verification complete with all required documents', adminId);

        notify(business.owner_id, 'business_verified', { business_id: id, business_name: business.name });
        return { success: true };
      },

      rejectBusiness: (id, adminId, reason) => {
        const business = get().businesses.find(b => b.id === id);
        if (!business) return { success: false, error: 'Business not found' };
        if (business.status !== 'pending') return { success: false, error: 'Business not pending' };

        set((state) => ({
          businesses: state.businesses.map(b =>
            b.id === id ? { ...b, status: 'rejected', rejection_reason: reason, updated_at: new Date().toISOString() } : b
          ),
        }));

        notify(business.owner_id, 'business_rejected', { business_id: id, business_name: business.name, reason });
        return { success: true };
      },

      suspendBusiness: (id, adminId, reason) => {
        const business = get().businesses.find(b => b.id === id);
        if (!business) return { success: false, error: 'Business not found' };
        if (business.status !== 'active') return { success: false, error: 'Business not active' };

        const now = new Date().toISOString();
        set((state) => ({
          businesses: state.businesses.map(b =>
            b.id === id ? { ...b, status: 'suspended', suspension_reason: reason, suspended_by: adminId, suspended_at: now, updated_at: now } : b
          ),
        }));

        get().bumpTrustScore(id, -5, 'Suspended by admin', adminId);
        notify(business.owner_id, 'business_suspended', { business_id: id, business_name: business.name, reason });
        return { success: true };
      },

      reactivateBusiness: (id, adminId) => {
        const business = get().businesses.find(b => b.id === id);
        if (!business) return { success: false, error: 'Business not found' };
        if (business.status !== 'suspended') return { success: false, error: 'Business not suspended' };

        set((state) => ({
          businesses: state.businesses.map(b =>
            b.id === id ? { ...b, status: 'active', suspension_reason: undefined, suspended_by: undefined, suspended_at: undefined, updated_at: new Date().toISOString() } : b
          ),
        }));

        notify(business.owner_id, 'business_reactivated', { business_id: id, business_name: business.name });
        return { success: true };
      },

      adjustTrustScore: (id, adminId, delta, reason) => {
        const business = get().businesses.find(b => b.id === id);
        if (!business) return { success: false, error: 'Business not found' };
        if (delta < -50 || delta > 50) return { success: false, error: 'Delta must be between -50 and +50' };

        get().bumpTrustScore(id, delta, reason, adminId);
        const updated = get().businesses.find(b => b.id === id);
        notify(business.owner_id, 'trust_score_adjusted', { business_id: id, business_name: business.name, new_score: updated?.trust_score, reason });
        return { success: true };
      },

      approveUpdate: (id, adminId) => {
        const update = get().updates.find(u => u.id === id);
        if (!update) return { success: false, error: 'Update not found' };
        if (update.status !== 'pending') return { success: false, error: 'Update not pending' };

        const now = new Date().toISOString();
        set((state) => ({
          updates: state.updates.map(u =>
            u.id === id ? { ...u, status: 'approved', approved_by: adminId, approved_at: now } : u
          ),
          businesses: state.businesses.map(b =>
            b.id === update.business_id ? { ...b, last_update_at: now, updated_at: now } : b
          ),
        }));

        // Check 24h cap: only +1 per 24h
        const last24h = get().updates.filter(u => 
          u.business_id === update.business_id && 
          u.status === 'approved' && 
          u.approved_at && 
          new Date(u.approved_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        );
        if (last24h.length <= 1) {
          get().bumpTrustScore(update.business_id, 1, 'Update approved', adminId);
        }

        const business = get().businesses.find(b => b.id === update.business_id);
        if (business) {
          notify(business.owner_id, 'update_approved', { business_id: business.id, business_name: business.name, update_title: update.title });
          // Notify followers
          get().follows.filter(f => f.business_id === update.business_id).forEach(f => {
            notify(f.user_id, 'new_update', { business_id: business.id, business_name: business.name, update_title: update.title });
          });
        }
        return { success: true };
      },

      rejectUpdate: (id, adminId, reason) => {
        const update = get().updates.find(u => u.id === id);
        if (!update) return { success: false, error: 'Update not found' };
        if (update.status !== 'pending') return { success: false, error: 'Update not pending' };

        set((state) => ({
          updates: state.updates.map(u =>
            u.id === id ? { ...u, status: 'rejected', rejection_reason: reason } : u
          ),
        }));

        // Check 24h cap: only -3 per 24h
        const last24h = get().updates.filter(u => 
          u.business_id === update.business_id && 
          u.status === 'rejected' && 
          new Date(u.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        );
        if (last24h.length <= 3) {
          get().bumpTrustScore(update.business_id, -1, 'Update rejected', adminId);
        }

        const business = get().businesses.find(b => b.id === update.business_id);
        if (business) {
          notify(business.owner_id, 'update_rejected', { business_id: business.id, business_name: business.name, update_title: update.title, reason });
        }
        return { success: true };
      },

      bumpTrustScore: (businessId, delta, reason, actorId) => {
        const business = get().businesses.find(b => b.id === businessId);
        if (!business) return 0;

        const newScore = Math.max(0, Math.min(100, business.trust_score + delta));
        const event: TrustScoreEvent = {
          id: generateId(),
          business_id: businessId,
          delta,
          reason,
          new_score: newScore,
          actor_id: actorId,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          businesses: state.businesses.map(b =>
            b.id === businessId ? { ...b, trust_score: newScore } : b
          ),
          trustEvents: [event, ...state.trustEvents],
        }));

        return newScore;
      },
    }),
    { name: 'capitaldb-business' }
  )
);
