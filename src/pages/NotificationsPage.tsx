import { Bell } from 'lucide-react';
import { useAuthStore } from '../store';
import { EmptyState } from '../components/shared/empty-state';

export function NotificationsPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-brand-text mb-6">
        {isBn ? 'নোটিফিকেশন' : 'Notifications'}
      </h1>
      <EmptyState
        icon={Bell}
        title={isBn ? 'কোনো নোটিফিকেশন নেই' : 'No notifications'}
        description={isBn ? 'আপনার আপডেট এবং সতর্কতা এখানে দেখাবে' : 'Your updates and alerts will appear here'}
      />
    </div>
  );
}
