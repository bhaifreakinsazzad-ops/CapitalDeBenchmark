import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ================================================================
// TYPES
// ================================================================

export interface Comment {
  id: string;
  update_id: string;
  user_id: string;
  body: string;
  status: 'approved' | 'hidden';
  parent_comment_id?: string;
  likes_count: number;
  is_edited: boolean;
  edited_at?: string;
  hidden_by?: string;
  hidden_at?: string;
  hide_reason?: string;
  created_at: string;
}

export interface CommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}

export interface UpdateLike {
  id: string;
  update_id: string;
  user_id: string;
  created_at: string;
}

export interface FounderFollow {
  id: string;
  follower_id: string;
  founder_id: string;
  created_at: string;
}

export interface CommentBan {
  id: string;
  user_id: string;
  business_id: string;
  banned_by: string;
  reason?: string;
  created_at: string;
  expires_at?: string;
}

export interface ContentReport {
  id: string;
  reporter_id: string;
  target_type: 'comment' | 'update' | 'business';
  target_id: string;
  reason: 'spam' | 'abuse' | 'misinformation' | 'fraud' | 'other';
  detail?: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'actioned';
  reviewed_by?: string;
  reviewed_at?: string;
  review_note?: string;
  created_at: string;
}

export interface NotificationPrefs {
  user_id: string;
  wallet_updates: boolean;
  kyc_updates: boolean;
  investment_updates: boolean;
  trade_updates: boolean;
  follow_updates: boolean;
  comment_replies: boolean;
  platform_announce: boolean;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  variant: 'info' | 'warning' | 'success' | 'critical';
  dismissible: boolean;
  active: boolean;
  starts_at: string;
  ends_at?: string;
  created_by: string;
  created_at: string;
}

export interface AnnouncementDismissal {
  id: string;
  user_id: string;
  announcement_id: string;
  dismissed_at: string;
}

// ================================================================
// STORE
// ================================================================

interface SocialStore {
  comments: Comment[];
  commentLikes: CommentLike[];
  updateLikes: UpdateLike[];
  founderFollows: FounderFollow[];
  commentBans: CommentBan[];
  contentReports: ContentReport[];
  notificationPrefs: Record<string, NotificationPrefs>;
  announcements: Announcement[];
  announcementDismissals: AnnouncementDismissal[];

  // Comments
  addComment: (update_id: string, user_id: string, body: string, parent_comment_id?: string) => { success: boolean; error?: string; comment?: Comment };
  editComment: (comment_id: string, user_id: string, body: string) => { success: boolean; error?: string };
  deleteComment: (comment_id: string, user_id: string, is_admin: boolean) => { success: boolean };
  hideComment: (comment_id: string, admin_id: string, reason: string) => { success: boolean };
  unhideComment: (comment_id: string, admin_id: string) => { success: boolean };
  getComments: (update_id: string) => Comment[];
  getCommentReplies: (comment_id: string) => Comment[];

  // Comment Likes
  likeComment: (comment_id: string, user_id: string) => { success: boolean };
  unlikeComment: (comment_id: string, user_id: string) => { success: boolean };
  hasLikedComment: (comment_id: string, user_id: string) => boolean;

  // Update Likes
  likeUpdate: (update_id: string, user_id: string) => { success: boolean };
  unlikeUpdate: (update_id: string, user_id: string) => { success: boolean };
  hasLikedUpdate: (update_id: string, user_id: string) => boolean;

  // Founder Follows
  followFounder: (follower_id: string, founder_id: string) => { success: boolean; error?: string };
  unfollowFounder: (follower_id: string, founder_id: string) => { success: boolean };
  isFollowingFounder: (follower_id: string, founder_id: string) => boolean;
  getFounderFollowers: (founder_id: string) => FounderFollow[];

  // Comment Bans
  banUserFromComments: (user_id: string, business_id: string, banned_by: string, reason?: string, days?: number) => { success: boolean };
  unbanUserFromComments: (user_id: string, business_id: string) => { success: boolean };
  isUserBanned: (user_id: string, business_id: string) => boolean;

  // Content Reports
  reportContent: (reporter_id: string, target_type: 'comment' | 'update' | 'business', target_id: string, reason: string, detail?: string) => { success: boolean; error?: string };
  getReports: (status?: string) => ContentReport[];
  reviewReport: (report_id: string, admin_id: string, status: 'dismissed' | 'actioned', note?: string) => { success: boolean };

  // Notification Preferences
  getNotificationPrefs: (user_id: string) => NotificationPrefs;
  updateNotificationPrefs: (user_id: string, prefs: Partial<Omit<NotificationPrefs, 'user_id' | 'updated_at'>>) => { success: boolean };

  // Announcements
  createAnnouncement: (title: string, body: string, variant: string, dismissible: boolean, created_by: string, starts_at?: string, ends_at?: string) => { success: boolean; announcement?: Announcement };
  updateAnnouncement: (id: string, updates: Partial<Omit<Announcement, 'id' | 'created_at' | 'created_by'>>) => { success: boolean };
  deleteAnnouncement: (id: string) => { success: boolean };
  getActiveAnnouncements: () => Announcement[];
  dismissAnnouncement: (user_id: string, announcement_id: string) => { success: boolean };
  isAnnouncementDismissed: (user_id: string, announcement_id: string) => boolean;

  // Search
  searchBusinesses: (query: string, category?: string, location?: string) => any[];
}

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      comments: [],
      commentLikes: [],
      updateLikes: [],
      founderFollows: [],
      commentBans: [],
      contentReports: [],
      notificationPrefs: {},
      announcements: [],
      announcementDismissals: [],

      // ================================================================
      // COMMENTS
      // ================================================================

      addComment: (update_id, user_id, body, parent_comment_id) => {
        if (body.length < 2 || body.length > 1000) {
          return { success: false, error: 'Comment must be 2-1000 characters' };
        }

        const comment: Comment = {
          id: crypto.randomUUID(),
          update_id,
          user_id,
          body,
          status: 'approved',
          parent_comment_id,
          likes_count: 0,
          is_edited: false,
          created_at: new Date().toISOString(),
        };

        set((state) => ({ comments: [...state.comments, comment] }));
        return { success: true, comment };
      },

      editComment: (comment_id, user_id, body) => {
        const comment = get().comments.find(c => c.id === comment_id);
        if (!comment) return { success: false, error: 'Comment not found' };
        if (comment.user_id !== user_id) return { success: false, error: 'Not authorized' };
        
        const createdAt = new Date(comment.created_at);
        const now = new Date();
        const diffMinutes = (now.getTime() - createdAt.getTime()) / 60000;
        if (diffMinutes > 15) return { success: false, error: 'Cannot edit after 15 minutes' };

        set((state) => ({
          comments: state.comments.map(c =>
            c.id === comment_id ? { ...c, body, is_edited: true, edited_at: new Date().toISOString() } : c
          ),
        }));
        return { success: true };
      },

      deleteComment: (comment_id, user_id, is_admin) => {
        const comment = get().comments.find(c => c.id === comment_id);
        if (!comment) return { success: false };
        if (comment.user_id !== user_id && !is_admin) return { success: false };

        set((state) => ({
          comments: state.comments.filter(c => c.id !== comment_id && c.parent_comment_id !== comment_id),
        }));
        return { success: true };
      },

      hideComment: (comment_id, admin_id, reason) => {
        set((state) => ({
          comments: state.comments.map(c =>
            c.id === comment_id ? { ...c, status: 'hidden', hidden_by: admin_id, hidden_at: new Date().toISOString(), hide_reason: reason } : c
          ),
        }));
        return { success: true };
      },

      unhideComment: (comment_id, admin_id) => {
        set((state) => ({
          comments: state.comments.map(c =>
            c.id === comment_id ? { ...c, status: 'approved', hidden_by: undefined, hidden_at: undefined, hide_reason: undefined } : c
          ),
        }));
        return { success: true };
      },

      getComments: (update_id) => {
        return get().comments.filter(c => c.update_id === update_id && c.status === 'approved' && !c.parent_comment_id);
      },

      getCommentReplies: (comment_id) => {
        return get().comments.filter(c => c.parent_comment_id === comment_id && c.status === 'approved');
      },

      // ================================================================
      // COMMENT LIKES
      // ================================================================

      likeComment: (comment_id, user_id) => {
        if (get().hasLikedComment(comment_id, user_id)) return { success: false };

        const like: CommentLike = {
          id: crypto.randomUUID(),
          comment_id,
          user_id,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          commentLikes: [...state.commentLikes, like],
          comments: state.comments.map(c =>
            c.id === comment_id ? { ...c, likes_count: c.likes_count + 1 } : c
          ),
        }));
        return { success: true };
      },

      unlikeComment: (comment_id, user_id) => {
        const like = get().commentLikes.find(l => l.comment_id === comment_id && l.user_id === user_id);
        if (!like) return { success: false };

        set((state) => ({
          commentLikes: state.commentLikes.filter(l => l.id !== like.id),
          comments: state.comments.map(c =>
            c.id === comment_id ? { ...c, likes_count: Math.max(0, c.likes_count - 1) } : c
          ),
        }));
        return { success: true };
      },

      hasLikedComment: (comment_id, user_id) => {
        return get().commentLikes.some(l => l.comment_id === comment_id && l.user_id === user_id);
      },

      // ================================================================
      // UPDATE LIKES
      // ================================================================

      likeUpdate: (update_id, user_id) => {
        if (get().hasLikedUpdate(update_id, user_id)) return { success: false };

        const like: UpdateLike = {
          id: crypto.randomUUID(),
          update_id,
          user_id,
          created_at: new Date().toISOString(),
        };

        set((state) => ({ updateLikes: [...state.updateLikes, like] }));
        return { success: true };
      },

      unlikeUpdate: (update_id, user_id) => {
        const like = get().updateLikes.find(l => l.update_id === update_id && l.user_id === user_id);
        if (!like) return { success: false };

        set((state) => ({ updateLikes: state.updateLikes.filter(l => l.id !== like.id) }));
        return { success: true };
      },

      hasLikedUpdate: (update_id, user_id) => {
        return get().updateLikes.some(l => l.update_id === update_id && l.user_id === user_id);
      },

      // ================================================================
      // FOUNDER FOLLOWS
      // ================================================================

      followFounder: (follower_id, founder_id) => {
        if (follower_id === founder_id) return { success: false, error: 'Cannot follow yourself' };
        if (get().isFollowingFounder(follower_id, founder_id)) return { success: false };

        const follow: FounderFollow = {
          id: crypto.randomUUID(),
          follower_id,
          founder_id,
          created_at: new Date().toISOString(),
        };

        set((state) => ({ founderFollows: [...state.founderFollows, follow] }));
        return { success: true };
      },

      unfollowFounder: (follower_id, founder_id) => {
        set((state) => ({
          founderFollows: state.founderFollows.filter(f => !(f.follower_id === follower_id && f.founder_id === founder_id)),
        }));
        return { success: true };
      },

      isFollowingFounder: (follower_id, founder_id) => {
        return get().founderFollows.some(f => f.follower_id === follower_id && f.founder_id === founder_id);
      },

      getFounderFollowers: (founder_id) => {
        return get().founderFollows.filter(f => f.founder_id === founder_id);
      },

      // ================================================================
      // COMMENT BANS
      // ================================================================

      banUserFromComments: (user_id, business_id, banned_by, reason, days) => {
        const ban: CommentBan = {
          id: crypto.randomUUID(),
          user_id,
          business_id,
          banned_by,
          reason,
          created_at: new Date().toISOString(),
          expires_at: days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString() : undefined,
        };

        set((state) => ({
          commentBans: [...state.commentBans.filter(b => !(b.user_id === user_id && b.business_id === business_id)), ban],
        }));
        return { success: true };
      },

      unbanUserFromComments: (user_id, business_id) => {
        set((state) => ({
          commentBans: state.commentBans.filter(b => !(b.user_id === user_id && b.business_id === business_id)),
        }));
        return { success: true };
      },

      isUserBanned: (user_id, business_id) => {
        const ban = get().commentBans.find(b => b.user_id === user_id && b.business_id === business_id);
        if (!ban) return false;
        if (ban.expires_at && new Date(ban.expires_at) < new Date()) return false;
        return true;
      },

      // ================================================================
      // CONTENT REPORTS
      // ================================================================

      reportContent: (reporter_id, target_type, target_id, reason, detail) => {
        const existing = get().contentReports.find(r => r.reporter_id === reporter_id && r.target_type === target_type && r.target_id === target_id && r.status === 'pending');
        if (existing) return { success: false, error: 'You already reported this' };

        const report: ContentReport = {
          id: crypto.randomUUID(),
          reporter_id,
          target_type,
          target_id,
          reason: reason as any,
          detail,
          status: 'pending',
          created_at: new Date().toISOString(),
        };

        set((state) => ({ contentReports: [...state.contentReports, report] }));
        return { success: true };
      },

      getReports: (status) => {
        const reports = get().contentReports;
        if (status) return reports.filter(r => r.status === status);
        return reports;
      },

      reviewReport: (report_id, admin_id, status, note) => {
        set((state) => ({
          contentReports: state.contentReports.map(r =>
            r.id === report_id ? { ...r, status, reviewed_by: admin_id, reviewed_at: new Date().toISOString(), review_note: note } : r
          ),
        }));
        return { success: true };
      },

      // ================================================================
      // NOTIFICATION PREFERENCES
      // ================================================================

      getNotificationPrefs: (user_id) => {
        const prefs = get().notificationPrefs[user_id];
        if (!prefs) {
          const defaultPrefs: NotificationPrefs = {
            user_id,
            wallet_updates: true,
            kyc_updates: true,
            investment_updates: true,
            trade_updates: true,
            follow_updates: true,
            comment_replies: true,
            platform_announce: true,
            updated_at: new Date().toISOString(),
          };
          set((state) => ({ notificationPrefs: { ...state.notificationPrefs, [user_id]: defaultPrefs } }));
          return defaultPrefs;
        }
        return prefs;
      },

      updateNotificationPrefs: (user_id, prefs) => {
        const current = get().getNotificationPrefs(user_id);
        const updated: NotificationPrefs = {
          ...current,
          ...prefs,
          updated_at: new Date().toISOString(),
        };

        set((state) => ({ notificationPrefs: { ...state.notificationPrefs, [user_id]: updated } }));
        return { success: true };
      },

      // ================================================================
      // ANNOUNCEMENTS
      // ================================================================

      createAnnouncement: (title, body, variant, dismissible, created_by, starts_at, ends_at) => {
        const announcement: Announcement = {
          id: crypto.randomUUID(),
          title,
          body,
          variant: variant as any,
          dismissible,
          active: true,
          starts_at: starts_at || new Date().toISOString(),
          ends_at,
          created_by,
          created_at: new Date().toISOString(),
        };

        set((state) => ({ announcements: [...state.announcements, announcement] }));
        return { success: true, announcement };
      },

      updateAnnouncement: (id, updates) => {
        set((state) => ({
          announcements: state.announcements.map(a => a.id === id ? { ...a, ...updates } : a),
        }));
        return { success: true };
      },

      deleteAnnouncement: (id) => {
        set((state) => ({ announcements: state.announcements.filter(a => a.id !== id) }));
        return { success: true };
      },

      getActiveAnnouncements: () => {
        const now = new Date();
        return get().announcements.filter(a => 
          a.active && 
          new Date(a.starts_at) <= now && 
          (!a.ends_at || new Date(a.ends_at) > now)
        );
      },

      dismissAnnouncement: (user_id, announcement_id) => {
        const dismissal: AnnouncementDismissal = {
          id: crypto.randomUUID(),
          user_id,
          announcement_id,
          dismissed_at: new Date().toISOString(),
        };

        set((state) => ({ announcementDismissals: [...state.announcementDismissals, dismissal] }));
        return { success: true };
      },

      isAnnouncementDismissed: (user_id, announcement_id) => {
        return get().announcementDismissals.some(d => d.user_id === user_id && d.announcement_id === announcement_id);
      },

      // ================================================================
      // SEARCH
      // ================================================================

      searchBusinesses: (query, category, location) => {
        // This will be implemented by importing from business store
        // For now, return empty array
        return [];
      },
    }),
    {
      name: 'capitaldb-social',
    }
  )
);
