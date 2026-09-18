import { Briefcase } from 'lucide-react';
import { useAuthStore } from '../store';
import { EmptyState } from '../components/shared/empty-state';

export function MyBizPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-brand-text mb-6">
        {isBn ? 'আমার ব্যবসা' : 'My Ventures'}
      </h1>
      <EmptyState
        icon={Briefcase}
        title={isBn ? 'কোনো ব্যবসা যোগ করা হয়নি' : 'No ventures added'}
        description={isBn ? 'আপনার ব্যবসা তালিকাভুক্ত করুন এবং তহবিল সংগ্রহ শুরু করুন' : 'List your business and start raising funds'}
        actionLabel={isBn ? 'ব্যবসা যোগ করুন' : 'Add Business'}
        actionHref="#"
      />
    </div>
  );
}
