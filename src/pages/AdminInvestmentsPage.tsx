import { useState } from 'react';
import { useAuthStore, useDemoStore } from '../store';
import { useInvestmentStore } from '../lib/services/investments';
import { useBusinessStore } from '../lib/services/business';
import { Money } from '../components/shared/money';
import { formatDate } from '../lib/utils';
import { TrendingUp } from 'lucide-react';

export function AdminInvestmentsPage() {
  const { lang } = useAuthStore();
  const { investments } = useInvestmentStore();
  const { businesses } = useBusinessStore();
  const { users } = useDemoStore();
  const isBn = lang === 'bn';

  const [filter, setFilter] = useState<'all' | 'active' | 'escrowed' | 'refunded'>('all');

  const filteredInvestments = investments.filter(i => filter === 'all' || i.status === filter);

  const getBusinessName = (businessId: string) => {
    return businesses.find(b => b.id === businessId)?.name || 'Unknown';
  };

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Unknown';
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'সকল বিনিয়োগ' : 'All Investments'}</h1>

      <div className="flex gap-2 mb-4">
        {(['all', 'active', 'escrowed', 'refunded'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted hover:text-brand-text'
            }`}
          >
            {f === 'all' ? (isBn ? 'সব' : 'All') :
             f === 'active' ? (isBn ? 'সক্রিয়' : 'Active') :
             f === 'escrowed' ? (isBn ? 'এসক্রো' : 'Escrowed') :
             (isBn ? 'ফেরত' : 'Refunded')}
          </button>
        ))}
      </div>

      {filteredInvestments.length === 0 ? (
        <div className="card text-center py-12">
          <TrendingUp className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো বিনিয়োগ নেই' : 'No investments'}</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line">
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'তারিখ' : 'Date'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'বিনিয়োগকারী' : 'Investor'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ব্যবসা' : 'Business'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'শেয়ার' : 'Shares'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'পরিমাণ' : 'Amount'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestments.map((inv) => (
                <tr key={inv.id} className="border-b border-brand-line">
                  <td className="py-3 px-2 text-brand-muted text-xs">{formatDate(inv.created_at, lang)}</td>
                  <td className="py-3 px-2 text-brand-text">{getUserName(inv.user_id)}</td>
                  <td className="py-3 px-2 text-brand-text">{getBusinessName(inv.business_id)}</td>
                  <td className="py-3 px-2 text-brand-text">{inv.shares}</td>
                  <td className="py-3 px-2">
                    <Money amount={inv.total_amount} lang={lang} className="font-semibold" />
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      inv.status === 'active' ? 'bg-brand-accent/10 text-brand-accent' :
                      inv.status === 'escrowed' ? 'bg-brand-warn/10 text-brand-warn' :
                      'bg-brand-bad/10 text-brand-bad'
                    }`}>
                      {inv.status === 'active' ? (isBn ? 'সক্রিয়' : 'Active') :
                       inv.status === 'escrowed' ? (isBn ? 'এসক্রো' : 'Escrowed') :
                       (isBn ? 'ফেরত' : 'Refunded')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
