import { useAuthStore } from '../store';
import { useSocialStore } from '../lib/services/social';
import { Bell, Wallet, Shield, TrendingUp, BarChart3, Users, MessageCircle, Megaphone } from 'lucide-react';

export function NotificationSettingsPage() {
  const { user, lang } = useAuthStore();
  const { getNotificationPrefs, updateNotificationPrefs } = useSocialStore();
  const isBn = lang === 'bn';

  if (!user) return null;

  const prefs = getNotificationPrefs(user.id);

  const handleToggle = (key: keyof typeof prefs) => {
    if (key === 'user_id' || key === 'updated_at') return;
    updateNotificationPrefs(user.id, { [key]: !prefs[key] });
  };

  const settings = [
    { key: 'wallet_updates', icon: Wallet, label: isBn ? 'ওয়ালেট আপডেট' : 'Wallet Updates', desc: isBn ? 'ডিপোজিট, উত্তোলন, রিচার্জ, ফেরত' : 'Deposits, withdrawals, recharges, refunds' },
    { key: 'kyc_updates', icon: Shield, label: isBn ? 'KYC আপডেট' : 'KYC Updates', desc: isBn ? 'KYC জমা, অনুমোদন, প্রত্যাখ্যান' : 'KYC submissions, approvals, rejections' },
    { key: 'investment_updates', icon: TrendingUp, label: isBn ? 'বিনিয়োগ আপডেট' : 'Investment Updates', desc: isBn ? 'বিনিয়োগ নিশ্চিতকরণ, মাইলস্টোন, তহবিল মুক্তি' : 'Investment confirmations, milestones, fund releases' },
    { key: 'trade_updates', icon: BarChart3, label: isBn ? 'ট্রেডিং আপডেট' : 'Trading Updates', desc: isBn ? 'অর্ডার স্থাপন, পূরণ, বাতিল' : 'Order placements, fills, cancellations' },
    { key: 'follow_updates', icon: Users, label: isBn ? 'ফলো আপডেট' : 'Follow Updates', desc: isBn ? 'নতুন ফলোয়ার, ফলো করা ব্যবসার আপডেট' : 'New followers, updates from followed businesses' },
    { key: 'comment_replies', icon: MessageCircle, label: isBn ? 'মন্তব্য ও উত্তর' : 'Comments & Replies', desc: isBn ? 'আপনার আপডেটে মন্তব্য, উত্তর, লাইক' : 'Comments on your updates, replies, likes' },
    { key: 'platform_announce', icon: Megaphone, label: isBn ? 'প্ল্যাটফর্ম ঘোষণা' : 'Platform Announcements', desc: isBn ? 'গুরুত্বপূর্ণ প্ল্যাটফর্ম আপডেট' : 'Important platform updates' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-brand-text mb-6">{isBn ? 'নোটিফিকেশন সেটিংস' : 'Notification Settings'}</h1>

      <div className="space-y-3">
        {settings.map(({ key, icon: Icon, label, desc }) => (
          <div key={key} className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-panel2 flex items-center justify-center">
                <Icon className="w-5 h-5 text-brand-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-text">{label}</p>
                <p className="text-xs text-brand-muted">{desc}</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle(key as any)}
              className={`w-12 h-7 rounded-full transition-colors ${prefs[key as keyof typeof prefs] ? 'bg-brand-accent' : 'bg-brand-line'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${prefs[key as keyof typeof prefs] ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
