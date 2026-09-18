import { Bell, Check, CheckCheck } from 'lucide-react';
import { useAuthStore } from '../store';
import { useNotificationStore } from '../lib/services/notify';
import { formatDate } from '../lib/utils';
import { Money } from '../components/shared/money';
import { EmptyState } from '../components/shared/empty-state';

export function NotificationsPage() {
  const { user, lang } = useAuthStore();
  const { getUserNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const isBn = lang === 'bn';

  if (!user) return null;

  const notifications = getUserNotifications(user.id);

  const getNotificationContent = (type: string, payload: Record<string, any>) => {
    const contents: Record<string, { bn: string; en: string; icon: string }> = {
      recharge_submitted: {
        bn: `৳${payload.amount} রিচার্জ জমা দেওয়া হয়েছে`,
        en: `৳${payload.amount} recharge submitted`,
        icon: '📥',
      },
      recharge_approved: {
        bn: `৳${payload.amount} রিচার্জ অনুমোদিত হয়েছে`,
        en: `৳${payload.amount} recharge approved`,
        icon: '✅',
      },
      recharge_rejected: {
        bn: `৳${payload.amount} রিচার্জ প্রত্যাখ্যাত: ${payload.reason}`,
        en: `৳${payload.amount} recharge rejected: ${payload.reason}`,
        icon: '❌',
      },
      withdrawal_submitted: {
        bn: `৳${payload.amount} উত্তোলন জমা দেওয়া হয়েছে`,
        en: `৳${payload.amount} withdrawal submitted`,
        icon: '📤',
      },
      withdrawal_approved: {
        bn: `৳${payload.amount} উত্তোলন অনুমোদিত`,
        en: `৳${payload.amount} withdrawal approved`,
        icon: '✅',
      },
      withdrawal_paid: {
        bn: `৳${payload.amount} উত্তোলন পরিশোধিত`,
        en: `৳${payload.amount} withdrawal paid`,
        icon: '💰',
      },
      withdrawal_rejected: {
        bn: `৳${payload.amount} উত্তোলন প্রত্যাখ্যাত: ${payload.reason}`,
        en: `৳${payload.amount} withdrawal rejected: ${payload.reason}`,
        icon: '❌',
      },
      kyc_submitted: {
        bn: 'KYC জমা দেওয়া হয়েছে',
        en: 'KYC submitted',
        icon: '📋',
      },
      kyc_approved: {
        bn: 'KYC অনুমোদিত। আপনি এখন বিনিয়োগ ও উত্তোলন করতে পারবেন।',
        en: 'KYC approved. You can now invest and withdraw.',
        icon: '✅',
      },
      kyc_rejected: {
        bn: `KYC প্রত্যাখ্যাত: ${payload.reason}`,
        en: `KYC rejected: ${payload.reason}`,
        icon: '❌',
      },
      business_pending: {
        bn: `নতুন ব্যবসা যাচাইকরণের জন্য: ${payload.business_name}`,
        en: `New business pending verification: ${payload.business_name}`,
        icon: '🏢',
      },
      business_verified: {
        bn: `${payload.business_name} যাচাইকৃত হয়েছে এবং এখন সক্রিয়`,
        en: `${payload.business_name} has been verified and is now active`,
        icon: '✅',
      },
      business_rejected: {
        bn: `${payload.business_name} প্রত্যাখ্যাত: ${payload.reason}`,
        en: `${payload.business_name} rejected: ${payload.reason}`,
        icon: '❌',
      },
      business_suspended: {
        bn: `${payload.business_name} স্থগিত: ${payload.reason}`,
        en: `${payload.business_name} suspended: ${payload.reason}`,
        icon: '⚠️',
      },
      business_reactivated: {
        bn: `${payload.business_name} পুনরায় সক্রিয় করা হয়েছে`,
        en: `${payload.business_name} has been reactivated`,
        icon: '✅',
      },
      trust_score_adjusted: {
        bn: `${payload.business_name} ট্রাস্ট স্কোর পরিবর্তিত: ${payload.new_score} (${payload.reason})`,
        en: `${payload.business_name} trust score adjusted: ${payload.new_score} (${payload.reason})`,
        icon: '📊',
      },
      update_pending: {
        bn: `নতুন আপডেট অনুমোদনের জন্য: ${payload.business_name}`,
        en: `New update pending approval: ${payload.business_name}`,
        icon: '📝',
      },
      update_approved: {
        bn: `আপনার আপডেট "${payload.update_title}" অনুমোদিত হয়েছে`,
        en: `Your update "${payload.update_title}" has been approved`,
        icon: '✅',
      },
      update_rejected: {
        bn: `আপনার আপডেট "${payload.update_title}" প্রত্যাখ্যাত: ${payload.reason}`,
        en: `Your update "${payload.update_title}" rejected: ${payload.reason}`,
        icon: '❌',
      },
      new_update: {
        bn: `${payload.business_name} নতুন আপডেট posted: ${payload.update_title}`,
        en: `${payload.business_name} posted a new update: ${payload.update_title}`,
        icon: '📢',
      },
      new_follower: {
        bn: `নতুন ফলোয়ার`,
        en: `New follower`,
        icon: '👥',
      },
    };

    return contents[type] || { bn: type, en: type, icon: '🔔' };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-text">{isBn ? 'নোটিফিকেশন' : 'Notifications'}</h1>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={() => markAllAsRead(user.id)}
            className="flex items-center gap-1 text-sm text-brand-accent hover:text-brand-accentD transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            {isBn ? 'সব পড়া' : 'Mark all read'}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={isBn ? 'কোনো নোটিফিকেশন নেই' : 'No notifications'}
          description={isBn ? 'আপনার আপডেট এবং সতর্কতা এখানে দেখাবে' : 'Your updates and alerts will appear here'}
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const content = getNotificationContent(notification.type, notification.payload);
            return (
              <div
                key={notification.id}
                onClick={() => !notification.read && markAsRead(notification.id)}
                className={`card py-3 cursor-pointer transition-colors ${
                  notification.read ? 'opacity-60' : 'hover:border-brand-accent/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{content.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.read ? 'text-brand-muted' : 'text-brand-text font-medium'}`}>
                      {isBn ? content.bn : content.en}
                    </p>
                    <p className="text-[10px] text-brand-muted mt-1">
                      {formatDate(notification.created_at, lang)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-brand-accent shrink-0 mt-2" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
