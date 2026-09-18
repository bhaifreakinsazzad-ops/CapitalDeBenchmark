import { useState } from 'react';
import { useAuthStore, useDemoStore } from '../store';
import { useInvestmentStore } from '../lib/services/investments';
import { useBusinessStore } from '../lib/services/business';
import { Money } from '../components/shared/money';
import { formatDate } from '../lib/utils';
import { Check, X, DollarSign } from 'lucide-react';

export function AdminReleasePage() {
  const { user, lang } = useAuthStore();
  const { fundReleaseRequests, approveFundRelease, markFundReleasePaid, rejectFundRelease } = useInvestmentStore();
  const { businesses } = useBusinessStore();
  const { users } = useDemoStore();
  const isBn = lang === 'bn';

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'paid' | 'rejected'>('pending');
  const [rejectModal, setRejectModal] = useState<{ id: string; reason: string } | null>(null);
  const [approveModal, setApproveModal] = useState<string | null>(null);
  const [payoutTrxId, setPayoutTrxId] = useState('');

  const filteredRequests = fundReleaseRequests.filter(r => filter === 'all' || r.status === filter);

  const getBusinessName = (businessId: string) => {
    return businesses.find(b => b.id === businessId)?.name || 'Unknown';
  };

  const getFounderName = (founderId: string) => {
    return users.find(u => u.id === founderId)?.name || 'Unknown';
  };

  const handleApprove = (id: string) => {
    if (!user) return;
    const result = approveFundRelease(id, user.id);
    if (result.success) {
      setApproveModal(null);
      setPayoutTrxId('');
    }
  };

  const handleMarkPaid = (id: string) => {
    if (!user) return;
    const result = markFundReleasePaid(id, user.id, payoutTrxId);
    if (result.success) {
      setPayoutTrxId('');
    }
  };

  const handleReject = (id: string, reason: string) => {
    if (!user) return;
    const result = rejectFundRelease(id, user.id, reason);
    if (result.success) {
      setRejectModal(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'ফান্ড রিলিজ' : 'Fund Release'}</h1>

      <div className="flex gap-2 mb-4">
        {(['pending', 'approved', 'paid', 'rejected', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted hover:text-brand-text'
            }`}
          >
            {f === 'pending' ? (isBn ? 'অপেক্ষমান' : 'Pending') :
             f === 'approved' ? (isBn ? 'অনুমোদিত' : 'Approved') :
             f === 'paid' ? (isBn ? 'পরিশোধিত' : 'Paid') :
             f === 'rejected' ? (isBn ? 'প্রত্যাখ্যাত' : 'Rejected') :
             (isBn ? 'সব' : 'All')}
          </button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="card text-center py-12">
          <DollarSign className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো রিলিজ অনুরোধ নেই' : 'No release requests'}</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line">
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'তারিখ' : 'Date'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ব্যবসা' : 'Business'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'প্রতিষ্ঠাতা' : 'Founder'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'পরিমাণ' : 'Amount'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">MFS</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'নম্বর' : 'Number'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'কার্যক্রম' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id} className="border-b border-brand-line">
                  <td className="py-3 px-2 text-brand-muted text-xs">{formatDate(req.created_at, lang)}</td>
                  <td className="py-3 px-2 text-brand-text">{getBusinessName(req.business_id)}</td>
                  <td className="py-3 px-2 text-brand-text">{getFounderName(req.founder_id)}</td>
                  <td className="py-3 px-2">
                    <Money amount={req.amount} lang={lang} className="font-semibold" />
                  </td>
                  <td className="py-3 px-2 text-brand-muted">{req.mfs_method}</td>
                  <td className="py-3 px-2 text-brand-muted font-mono text-xs" dir="ltr">{req.mfs_number}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      req.status === 'pending' ? 'bg-brand-warn/10 text-brand-warn' :
                      req.status === 'approved' ? 'bg-brand-blue/10 text-brand-blue' :
                      req.status === 'paid' ? 'bg-brand-accent/10 text-brand-accent' :
                      'bg-brand-bad/10 text-brand-bad'
                    }`}>
                      {req.status === 'pending' ? (isBn ? 'অপেক্ষমান' : 'Pending') :
                       req.status === 'approved' ? (isBn ? 'অনুমোদিত' : 'Approved') :
                       req.status === 'paid' ? (isBn ? 'পরিশোধিত' : 'Paid') :
                       (isBn ? 'প্রত্যাখ্যাত' : 'Rejected')}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setApproveModal(req.id)}
                          className="p-1.5 rounded-lg bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setRejectModal({ id: req.id, reason: '' })}
                          className="p-1.5 rounded-lg bg-brand-bad/10 text-brand-bad hover:bg-brand-bad/20 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {req.status === 'approved' && (
                      <button
                        onClick={() => handleMarkPaid(req.id)}
                        className="px-3 py-1.5 rounded-lg bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 transition-colors text-xs font-medium"
                      >
                        {isBn ? 'পরিশোধিত' : 'Mark Paid'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {approveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h2 className="text-lg font-bold text-brand-text mb-4">{isBn ? 'অনুমোদন' : 'Approve'}</h2>
            <input
              type="text"
              value={payoutTrxId}
              onChange={(e) => setPayoutTrxId(e.target.value)}
              placeholder="Payout TrxID..."
              className="mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => { setApproveModal(null); setPayoutTrxId(''); }} className="btn-ghost flex-1">
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button onClick={() => handleApprove(approveModal)} className="btn-primary flex-1">
                {isBn ? 'অনুমোদন' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h2 className="text-lg font-bold text-brand-text mb-4">{isBn ? 'প্রত্যাখ্যান' : 'Reject'}</h2>
            <textarea
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              placeholder={isBn ? 'কারণ...' : 'Reason...'}
              rows={3}
              className="mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectModal(null)} className="btn-ghost flex-1">
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => handleReject(rejectModal.id, rejectModal.reason)}
                disabled={!rejectModal.reason.trim()}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isBn ? 'প্রত্যাখ্যান' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
