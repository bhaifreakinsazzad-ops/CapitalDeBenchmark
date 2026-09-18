import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  payload: Record<string, any>;
  read: boolean;
  created_at: string;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (userId: string, type: string, payload: Record<string, any>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  getUnreadCount: (userId: string) => number;
  getUserNotifications: (userId: string) => Notification[];
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      
      addNotification: (userId, type, payload) => {
        const notification: Notification = {
          id: crypto.randomUUID(),
          user_id: userId,
          type,
          payload,
          read: false,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllAsRead: (userId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.user_id === userId ? { ...n, read: true } : n
          ),
        }));
      },

      getUnreadCount: (userId) => {
        return get().notifications.filter(
          (n) => n.user_id === userId && !n.read
        ).length;
      },

      getUserNotifications: (userId) => {
        return get()
          .notifications.filter((n) => n.user_id === userId)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      },
    }),
    { name: 'capitaldb-notifications' }
  )
);

// Notification types for Phase 2
export const NOTIFICATION_TYPES = {
  RECHARGE_SUBMITTED: 'recharge_submitted',
  RECHARGE_APPROVED: 'recharge_approved',
  RECHARGE_REJECTED: 'recharge_rejected',
  WITHDRAWAL_SUBMITTED: 'withdrawal_submitted',
  WITHDRAWAL_APPROVED: 'withdrawal_approved',
  WITHDRAWAL_PAID: 'withdrawal_paid',
  WITHDRAWAL_REJECTED: 'withdrawal_rejected',
  KYC_SUBMITTED: 'kyc_submitted',
  KYC_APPROVED: 'kyc_approved',
  KYC_REJECTED: 'kyc_rejected',
  BUSINESS_PENDING: 'business_pending',
  BUSINESS_VERIFIED: 'business_verified',
  BUSINESS_REJECTED: 'business_rejected',
  BUSINESS_SUSPENDED: 'business_suspended',
  BUSINESS_REACTIVATED: 'business_reactivated',
  TRUST_SCORE_ADJUSTED: 'trust_score_adjusted',
  UPDATE_PENDING: 'update_pending',
  UPDATE_APPROVED: 'update_approved',
  UPDATE_REJECTED: 'update_rejected',
  NEW_UPDATE: 'new_update',
  NEW_FOLLOWER: 'new_follower',
} as const;

// Helper function to create notifications
export function notify(userId: string, type: string, payload: Record<string, any>) {
  useNotificationStore.getState().addNotification(userId, type, payload);
}
