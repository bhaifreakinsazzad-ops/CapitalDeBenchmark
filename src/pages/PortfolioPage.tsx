import { Briefcase } from 'lucide-react';
import { useAuthStore } from '../store';
import { EmptyState } from '../components/shared/empty-state';

export function PortfolioPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-brand-text mb-6">
        {isBn ? 'আমার পোর্টফোলিও' : 'My Portfolio'}
      </h1>
      <EmptyState
        icon={Briefcase}
        title={isBn ? 'কোনো শেয়ার নেই' : 'No shares yet'}
        description={isBn ? 'আপনার কেনা শেয়ারগুলো এখানে দেখাবে' : 'Shares you purchase will appear here'}
        actionLabel={isBn ? 'বাজার দেখুন' : 'Browse Market'}
        actionHref="/market"
      />
    </div>
  );
}
