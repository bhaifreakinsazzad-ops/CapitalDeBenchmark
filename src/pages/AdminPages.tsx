import { useState } from 'react';
import { LayoutDashboard, Shield, Users, CreditCard, ArrowUpCircle, ArrowDownCircle, FileText, ClipboardList, TrendingUp, Check, X, Eye } from 'lucide-react';
import { useAuthStore, useDemoStore } from '../store';
import { useWalletStore } from '../lib/services/wallet';
import { useKycStore } from '../lib/services/kyc';
import { useBusinessStore } from '../lib/services/business';
import { Money } from '../components/shared/money';
import { formatDate } from '../lib/utils';
import { MFS_METHODS } from '../lib/constants';

export function AdminOverviewPage() {
  const { lang } = useAuthStore();
  const { rechargeRequests, withdrawalRequests } = useWalletStore();
  const { submissions } = useKycStore();
  const { users } = useDemoStore();
  const isBn = lang === 'bn';

  const pendingRecharges = rechargeRequests.filter((r) => r.status === 'pending').length;
  const pendingWithdrawals = withdrawalRequests.filter((w) => w.status === 'pending').length;
  const pendingKyc = submissions.filter((s) => s.status === 'pending').length;
  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);

  const stats = [
    { label: isBn ? 'মোট ব্যবহারকারী' : 'Total Users', value: users.length.toString(), icon: Users, color: 'text-brand-blue' },
    { label: isBn ? 'প্ল্যাটফর্ম ব্যালেন্স' : 'Platform Balance', value: <Money amount={totalBalance} lang={lang} />, icon: TrendingUp, color: 'text-brand-accent' },
    { label: isBn ? 'রিচার্জ সারি' : 'Recharge Queue', value: pendingRecharges.toString(), icon: CreditCard, color: 'text-brand-warn' },
    { label: isBn ? 'উত্তোলন সারি' : 'Withdrawal Queue', value: pendingWithdrawals.toString(), icon: ArrowUpCircle, color: 'text-brand-warn' },
    { label: isBn ? 'KYC সারি' : 'KYC Queue', value: pendingKyc.toString(), icon: Shield, color: 'text-brand-accent' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-brand-text mb-6">{isBn ? 'অ্যাডমিন ওভারভিউ' : 'Admin Overview'}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="card">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className="text-2xl font-bold text-brand-text tabular-nums">{s.value}</p>
            <p className="text-xs text-brand-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminRechargePage() {
  const { user, lang } = useAuthStore();
  const { rechargeRequests, approveRecharge, rejectRecharge } = useWalletStore();
  const { users } = useDemoStore();
  const isBn = lang === 'bn';
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [rejectModal, setRejectModal] = useState<{ id: string; reason: string } | null>(null);
  const [approveModal, setApproveModal] = useState<string | null>(null);

  const filteredRequests = filter === 'all' 
    ? rechargeRequests 
    : rechargeRequests.filter((r) => r.status === filter);

  const getUserInfo = (userId: string) => {
    return users.find((u) => u.id === userId);
  };

  const handleApprove = (id: string) => {
    if (!user) return;
    const result = approveRecharge(id, user.id);
    if (result.success) {
      setApproveModal(null);
    }
  };

  const handleReject = (id: string, reason: string) => {
    if (!user) return;
    const result = rejectRecharge(id, user.id, reason);
    if (result.success) {
      setRejectModal(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'রিচার্জ সারি' : 'Recharge Queue'}</h1>
      
      <div className="flex gap-2 mb-4">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted hover:text-brand-text'
            }`}
          >
            {f === 'pending' ? (isBn ? 'অপেক্ষমান' : 'Pending') :
             f === 'approved' ? (isBn ? 'অনুমোদিত' : 'Approved') :
             f === 'rejected' ? (isBn ? 'প্রত্যাখ্যাত' : 'Rejected') :
             (isBn ? 'সব' : 'All')}
          </button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="card text-center py-12">
          <CreditCard className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো রিচার্জ অনুরোধ নেই' : 'No recharge requests'}</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line">
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'তারিখ' : 'Date'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ব্যবহারকারী' : 'User'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'পরিমাণ' : 'Amount'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'পদ্ধতি' : 'Method'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">TrxID</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'কার্যক্রম' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => {
                const userInfo = getUserInfo(req.user_id);
                return (
                  <tr key={req.id} className="border-b border-brand-line">
                    <td className="py-3 px-2 text-brand-muted text-xs">{formatDate(req.created_at, lang)}</td>
                    <td className="py-3 px-2">
                      <p className="text-brand-text text-sm">{userInfo?.name}</p>
                      <p className="text-brand-muted text-xs" dir="ltr">{userInfo?.phone}</p>
                    </td>
                    <td className="py-3 px-2">
                      <Money amount={req.amount} lang={lang} className="font-semibold" />
                    </td>
                    <td className="py-3 px-2 text-brand-text">{MFS_METHODS.find((m) => m.id === req.mfs_method)?.name}</td>
                    <td className="py-3 px-2 text-brand-muted font-mono text-xs" dir="ltr">{req.trx_id}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        req.status === 'pending' ? 'bg-brand-warn/10 text-brand-warn' :
                        req.status === 'approved' ? 'bg-brand-accent/10 text-brand-accent' :
                        'bg-brand-bad/10 text-brand-bad'
                      }`}>
                        {req.status === 'pending' ? (isBn ? 'অপেক্ষমান' : 'Pending') :
                         req.status === 'approved' ? (isBn ? 'অনুমোদিত' : 'Approved') :
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {approveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h2 className="text-lg font-bold text-brand-text mb-4">{isBn ? 'অনুমোদন নিশ্চিত করুন' : 'Confirm Approval'}</h2>
            <p className="text-sm text-brand-muted mb-6">
              {isBn ? 'আপনি কি এই রিচার্জ অনুমোদন করতে চান?' : 'Do you want to approve this recharge?'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setApproveModal(null)} className="btn-ghost flex-1">
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
            <h2 className="text-lg font-bold text-brand-text mb-4">{isBn ? 'প্রত্যাখ্যান করুন' : 'Reject'}</h2>
            <textarea
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              placeholder={isBn ? 'কারণ লিখুন...' : 'Enter reason...'}
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

export function AdminWithdrawPage() {
  const { user, lang } = useAuthStore();
  const { withdrawalRequests, approveWithdrawal, markWithdrawalPaid, rejectWithdrawal } = useWalletStore();
  const { users } = useDemoStore();
  const isBn = lang === 'bn';
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'paid' | 'all'>('pending');
  const [actionModal, setActionModal] = useState<{ type: 'approve' | 'pay' | 'reject'; id: string; data: string } | null>(null);

  const filteredRequests = filter === 'all'
    ? withdrawalRequests
    : withdrawalRequests.filter((w) => w.status === filter);

  const getUserInfo = (userId: string) => {
    return users.find((u) => u.id === userId);
  };

  const handleAction = () => {
    if (!user || !actionModal) return;

    let result;
    if (actionModal.type === 'approve') {
      result = approveWithdrawal(actionModal.id, user.id, actionModal.data);
    } else if (actionModal.type === 'pay') {
      result = markWithdrawalPaid(actionModal.id, user.id, actionModal.data);
    } else {
      result = rejectWithdrawal(actionModal.id, user.id, actionModal.data);
    }

    if (result?.success) {
      setActionModal(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'উত্তোলন সারি' : 'Withdrawal Queue'}</h1>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['pending', 'approved', 'rejected', 'paid', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted hover:text-brand-text'
            }`}
          >
            {f === 'pending' ? (isBn ? 'অপেক্ষমান' : 'Pending') :
             f === 'approved' ? (isBn ? 'অনুমোদিত' : 'Approved') :
             f === 'rejected' ? (isBn ? 'প্রত্যাখ্যাত' : 'Rejected') :
             f === 'paid' ? (isBn ? 'পরিশোধিত' : 'Paid') :
             (isBn ? 'সব' : 'All')}
          </button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="card text-center py-12">
          <ArrowUpCircle className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো উত্তোলন অনুরোধ নেই' : 'No withdrawal requests'}</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line">
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'তারিখ' : 'Date'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ব্যবহারকারী' : 'User'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'পরিমাণ' : 'Amount'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'পদ্ধতি' : 'Method'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'নম্বর' : 'Number'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'কার্যক্রম' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => {
                const userInfo = getUserInfo(req.user_id);
                return (
                  <tr key={req.id} className="border-b border-brand-line">
                    <td className="py-3 px-2 text-brand-muted text-xs">{formatDate(req.created_at, lang)}</td>
                    <td className="py-3 px-2">
                      <p className="text-brand-text text-sm">{userInfo?.name}</p>
                      <p className="text-brand-muted text-xs" dir="ltr">{userInfo?.phone}</p>
                    </td>
                    <td className="py-3 px-2">
                      <Money amount={req.amount} lang={lang} className="font-semibold" />
                    </td>
                    <td className="py-3 px-2 text-brand-text">{MFS_METHODS.find((m) => m.id === req.mfs_method)?.name}</td>
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
                            onClick={() => setActionModal({ type: 'approve', id: req.id, data: '' })}
                            className="p-1.5 rounded-lg bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setActionModal({ type: 'reject', id: req.id, data: '' })}
                            className="p-1.5 rounded-lg bg-brand-bad/10 text-brand-bad hover:bg-brand-bad/20 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {req.status === 'approved' && (
                        <button
                          onClick={() => setActionModal({ type: 'pay', id: req.id, data: req.payout_trx_id || '' })}
                          className="px-3 py-1.5 rounded-lg bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 transition-colors text-xs font-medium"
                        >
                          {isBn ? 'পরিশোধিত' : 'Mark Paid'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {actionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h2 className="text-lg font-bold text-brand-text mb-4">
              {actionModal.type === 'approve' ? (isBn ? 'অনুমোদন' : 'Approve') :
               actionModal.type === 'pay' ? (isBn ? 'পরিশোধ চিহ্নিত' : 'Mark as Paid') :
               (isBn ? 'প্রত্যাখ্যান' : 'Reject')}
            </h2>
            <input
              type="text"
              value={actionModal.data}
              onChange={(e) => setActionModal({ ...actionModal, data: e.target.value })}
              placeholder={actionModal.type === 'reject' 
                ? (isBn ? 'কারণ...' : 'Reason...')
                : 'Payout TrxID...'}
              className="mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setActionModal(null)} className="btn-ghost flex-1">
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleAction}
                disabled={!actionModal.data.trim()}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isBn ? 'নিশ্চিত' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminKycPage() {
  const { user, lang } = useAuthStore();
  const { submissions, approveKyc, rejectKyc } = useKycStore();
  const { users } = useDemoStore();
  const isBn = lang === 'bn';
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [rejectModal, setRejectModal] = useState<{ id: string; reason: string } | null>(null);
  const [viewDoc, setViewDoc] = useState<string | null>(null);

  const filteredSubmissions = filter === 'all'
    ? submissions
    : submissions.filter((s) => s.status === filter);

  const getUserInfo = (userId: string) => {
    return users.find((u) => u.id === userId);
  };

  const handleApprove = (id: string) => {
    if (!user) return;
    approveKyc(id, user.id);
  };

  const handleReject = (id: string, reason: string) => {
    if (!user) return;
    const result = rejectKyc(id, user.id, reason);
    if (result.success) {
      setRejectModal(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'KYC সারি' : 'KYC Queue'}</h1>
      
      <div className="flex gap-2 mb-4">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted hover:text-brand-text'
            }`}
          >
            {f === 'pending' ? (isBn ? 'অপেক্ষমান' : 'Pending') :
             f === 'approved' ? (isBn ? 'অনুমোদিত' : 'Approved') :
             f === 'rejected' ? (isBn ? 'প্রত্যাখ্যাত' : 'Rejected') :
             (isBn ? 'সব' : 'All')}
          </button>
        ))}
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো KYC জমা নেই' : 'No KYC submissions'}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSubmissions.map((sub) => {
            const userInfo = getUserInfo(sub.user_id);
            return (
              <div key={sub.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-brand-text font-semibold">{userInfo?.name}</p>
                    <p className="text-brand-muted text-sm" dir="ltr">{userInfo?.phone}</p>
                    <p className="text-brand-muted text-xs mt-1">{formatDate(sub.created_at, lang)}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    sub.status === 'pending' ? 'bg-brand-warn/10 text-brand-warn' :
                    sub.status === 'approved' ? 'bg-brand-accent/10 text-brand-accent' :
                    'bg-brand-bad/10 text-brand-bad'
                  }`}>
                    {sub.status === 'pending' ? (isBn ? 'অপেক্ষমান' : 'Pending') :
                     sub.status === 'approved' ? (isBn ? 'অনুমোদিত' : 'Approved') :
                     (isBn ? 'প্রত্যাখ্যাত' : 'Rejected')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <p className="text-brand-muted text-xs">{isBn ? 'NID নম্বর' : 'NID Number'}</p>
                    <p className="text-brand-text font-mono" dir="ltr">{sub.nid_number}</p>
                  </div>
                  <div>
                    <p className="text-brand-muted text-xs">WhatsApp</p>
                    <p className="text-brand-text font-mono" dir="ltr">{sub.whatsapp_number}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-brand-muted text-xs">{isBn ? 'ঠিকানা' : 'Address'}</p>
                    <p className="text-brand-text">{sub.present_address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  <button
                    onClick={() => setViewDoc(sub.nid_front_url)}
                    className="aspect-square bg-brand-panel2 rounded-lg flex items-center justify-center hover:bg-brand-panel transition-colors"
                  >
                    <Eye className="w-5 h-5 text-brand-muted" />
                  </button>
                  <button
                    onClick={() => setViewDoc(sub.nid_back_url)}
                    className="aspect-square bg-brand-panel2 rounded-lg flex items-center justify-center hover:bg-brand-panel transition-colors"
                  >
                    <Eye className="w-5 h-5 text-brand-muted" />
                  </button>
                  <button
                    onClick={() => setViewDoc(sub.utility_bill_url)}
                    className="aspect-square bg-brand-panel2 rounded-lg flex items-center justify-center hover:bg-brand-panel transition-colors"
                  >
                    <Eye className="w-5 h-5 text-brand-muted" />
                  </button>
                  {sub.selfie_url && (
                    <button
                      onClick={() => setViewDoc(sub.selfie_url!)}
                      className="aspect-square bg-brand-panel2 rounded-lg flex items-center justify-center hover:bg-brand-panel transition-colors"
                    >
                      <Eye className="w-5 h-5 text-brand-muted" />
                    </button>
                  )}
                </div>

                {sub.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(sub.id)}
                      className="btn-primary flex-1 text-sm"
                    >
                      {isBn ? 'অনুমোদন' : 'Approve'}
                    </button>
                    <button
                      onClick={() => setRejectModal({ id: sub.id, reason: '' })}
                      className="btn-ghost flex-1 text-sm"
                    >
                      {isBn ? 'প্রত্যাখ্যান' : 'Reject'}
                    </button>
                  </div>
                )}

                {sub.status === 'rejected' && sub.rejection_reason && (
                  <div className="mt-3 p-2 bg-brand-bad/10 rounded-lg">
                    <p className="text-xs text-brand-bad">{sub.rejection_reason}</p>
                  </div>
                )}
              </div>
            );
          })}
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

      {viewDoc && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setViewDoc(null)}>
          <div className="card max-w-2xl w-full">
            <p className="text-sm text-brand-muted text-center">
              {isBn ? 'নথি প্রিভিউ (ডেমো)' : 'Document preview (demo)'}
            </p>
            <p className="text-xs text-brand-muted text-center mt-2 font-mono break-all">{viewDoc}</p>
            <button onClick={() => setViewDoc(null)} className="btn-ghost w-full mt-4">
              {isBn ? 'বন্ধ' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminVerifyPage() {
  const { user, lang } = useAuthStore();
  const { businesses, verifyBusiness, rejectBusiness, documents } = useBusinessStore();
  const { users } = useDemoStore();
  const isBn = lang === 'bn';
  const [filter, setFilter] = useState<'pending' | 'active' | 'suspended' | 'rejected' | 'all'>('pending');
  const [rejectModal, setRejectModal] = useState<{ id: string; reason: string } | null>(null);

  const filteredBusinesses = filter === 'all'
    ? businesses
    : businesses.filter((b) => b.status === filter);

  const getOwnerInfo = (ownerId: string) => {
    return users.find((u) => u.id === ownerId);
  };

  const handleVerify = (id: string) => {
    if (!user) return;
    verifyBusiness(id, user.id);
  };

  const handleReject = (id: string, reason: string) => {
    if (!user) return;
    const result = rejectBusiness(id, user.id, reason);
    if (result.success) {
      setRejectModal(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'ব্যবসা যাচাইকরণ' : 'Business Verification'}</h1>
      
      <div className="flex gap-2 mb-4">
        {(['pending', 'active', 'suspended', 'rejected', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted hover:text-brand-text'
            }`}
          >
            {f === 'pending' ? (isBn ? 'অপেক্ষমান' : 'Pending') :
             f === 'active' ? (isBn ? 'সক্রিয়' : 'Active') :
             f === 'suspended' ? (isBn ? 'স্থগিত' : 'Suspended') :
             f === 'rejected' ? (isBn ? 'প্রত্যাখ্যাত' : 'Rejected') :
             (isBn ? 'সব' : 'All')}
          </button>
        ))}
      </div>

      {filteredBusinesses.length === 0 ? (
        <div className="card text-center py-12">
          <Shield className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো ব্যবসা নেই' : 'No businesses'}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBusinesses.map((biz) => {
            const ownerInfo = getOwnerInfo(biz.owner_id);
            const bizDocs = documents.filter(d => d.business_id === biz.id);
            return (
              <div key={biz.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-brand-text">{biz.name}</h3>
                    <p className="text-xs text-brand-muted">{biz.category} · {biz.location}</p>
                    <p className="text-xs text-brand-muted mt-1">
                      {ownerInfo?.name} · <span dir="ltr">{ownerInfo?.phone}</span>
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    biz.status === 'active' ? 'bg-brand-accent/10 text-brand-accent' :
                    biz.status === 'pending' ? 'bg-brand-warn/10 text-brand-warn' :
                    'bg-brand-bad/10 text-brand-bad'
                  }`}>
                    {biz.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-brand-muted">{isBn ? 'মূল্য: ' : 'Price: '}</span>
                    <span className="text-brand-text">৳{biz.share_price}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted">{isBn ? 'শেয়ার: ' : 'Shares: '}</span>
                    <span className="text-brand-text">{biz.total_shares}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-brand-muted mb-1">{isBn ? 'গল্প' : 'Story'}:</p>
                  <p className="text-xs text-brand-text line-clamp-3">{biz.story}</p>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-brand-muted mb-1">{isBn ? 'নথি' : 'Documents'} ({bizDocs.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {bizDocs.map((doc) => (
                      <span key={doc.id} className="px-2 py-0.5 bg-brand-panel2 rounded text-[10px] text-brand-muted">
                        {doc.doc_type}
                      </span>
                    ))}
                  </div>
                </div>

                {biz.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify(biz.id)}
                      className="btn-primary flex-1 text-sm"
                    >
                      {isBn ? 'অনুমোদন' : 'Approve'}
                    </button>
                    <button
                      onClick={() => setRejectModal({ id: biz.id, reason: '' })}
                      className="btn-ghost flex-1 text-sm"
                    >
                      {isBn ? 'প্রত্যাখ্যান' : 'Reject'}
                    </button>
                  </div>
                )}

                {biz.status === 'rejected' && biz.rejection_reason && (
                  <div className="mt-2 p-2 bg-brand-bad/10 rounded-lg">
                    <p className="text-xs text-brand-bad">{biz.rejection_reason}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h2 className="text-lg font-bold text-brand-text mb-4">{isBn ? 'প্রত্যাখ্যান' : 'Reject'}</h2>
            <textarea
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              placeholder={isBn ? 'কারণ (কমপক্ষে ১০ অক্ষর)...' : 'Reason (min 10 chars)...'}
              rows={3}
              className="mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectModal(null)} className="btn-ghost flex-1">
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => handleReject(rejectModal.id, rejectModal.reason)}
                disabled={rejectModal.reason.length < 10}
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

export function AdminUsersPage() {
  const { lang } = useAuthStore();
  const { users } = useDemoStore();
  const isBn = lang === 'bn';
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'ব্যবহারকারী' : 'Users'}</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-line">
              <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'নাম' : 'Name'}</th>
              <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ফোন' : 'Phone'}</th>
              <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ভূমিকা' : 'Role'}</th>
              <th className="text-left py-3 px-2 text-brand-muted font-medium">KYC</th>
              <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ব্যালেন্স' : 'Balance'}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-brand-line">
                <td className="py-3 px-2 text-brand-text">{u.name}</td>
                <td className="py-3 px-2 text-brand-muted" dir="ltr">{u.phone}</td>
                <td className="py-3 px-2">
                  <span className="px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent text-xs">{u.role}</span>
                </td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    u.kyc_status === 'verified' ? 'bg-brand-accent/10 text-brand-accent' :
                    u.kyc_status === 'rejected' ? 'bg-brand-bad/10 text-brand-bad' :
                    'bg-brand-warn/10 text-brand-warn'
                  }`}>
                    {u.kyc_status}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <Money amount={u.balance} lang={lang} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminUpdatesPage() {
  const { user, lang } = useAuthStore();
  const { updates, businesses, approveUpdate, rejectUpdate } = useBusinessStore();
  const { users } = useDemoStore();
  const isBn = lang === 'bn';
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [rejectModal, setRejectModal] = useState<{ id: string; reason: string } | null>(null);

  const filteredUpdates = filter === 'all'
    ? updates
    : updates.filter((u) => u.status === filter);

  const getBusinessName = (businessId: string) => {
    return businesses.find((b) => b.id === businessId)?.name || 'Unknown';
  };

  const getAuthorName = (authorId: string) => {
    return users.find((u) => u.id === authorId)?.name || 'Unknown';
  };

  const handleApprove = (id: string) => {
    if (!user) return;
    approveUpdate(id, user.id);
  };

  const handleReject = (id: string, reason: string) => {
    if (!user) return;
    const result = rejectUpdate(id, user.id, reason);
    if (result.success) {
      setRejectModal(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'আপডেট অনুমোদন' : 'Update Approval'}</h1>
      
      <div className="flex gap-2 mb-4">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted hover:text-brand-text'
            }`}
          >
            {f === 'pending' ? (isBn ? 'অপেক্ষমান' : 'Pending') :
             f === 'approved' ? (isBn ? 'অনুমোদিত' : 'Approved') :
             f === 'rejected' ? (isBn ? 'প্রত্যাখ্যাত' : 'Rejected') :
             (isBn ? 'সব' : 'All')}
          </button>
        ))}
      </div>

      {filteredUpdates.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো আপডেট নেই' : 'No updates'}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUpdates.map((update) => (
            <div key={update.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-brand-text">{update.title}</h3>
                  <p className="text-xs text-brand-muted">
                    {getBusinessName(update.business_id)} · {getAuthorName(update.author_id)}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  update.status === 'approved' ? 'bg-brand-accent/10 text-brand-accent' :
                  update.status === 'pending' ? 'bg-brand-warn/10 text-brand-warn' :
                  'bg-brand-bad/10 text-brand-bad'
                }`}>
                  {update.status}
                </span>
              </div>
              <p className="text-sm text-brand-muted mb-3 line-clamp-3">{update.body}</p>

              {update.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(update.id)}
                    className="btn-primary flex-1 text-sm"
                  >
                    {isBn ? 'অনুমোদন' : 'Approve'}
                  </button>
                  <button
                    onClick={() => setRejectModal({ id: update.id, reason: '' })}
                    className="btn-ghost flex-1 text-sm"
                  >
                    {isBn ? 'প্রত্যাখ্যান' : 'Reject'}
                  </button>
                </div>
              )}

              {update.status === 'rejected' && update.rejection_reason && (
                <div className="mt-2 p-2 bg-brand-bad/10 rounded-lg">
                  <p className="text-xs text-brand-bad">{update.rejection_reason}</p>
                </div>
              )}
            </div>
          ))}
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

export function AdminAuditPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'অডিট লগ' : 'Audit Log'}</h1>
      <div className="card text-center py-12">
        <ClipboardList className="w-8 h-8 text-brand-muted mx-auto mb-3" />
        <p className="text-sm text-brand-muted">{isBn ? 'কোনো লগ নেই' : 'No audit entries'}</p>
      </div>
    </div>
  );
}
