import { LayoutDashboard, Shield, Users, CreditCard, ArrowUpCircle, ArrowDownCircle, FileText, ClipboardList, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store';

export function AdminOverviewPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  const stats = [
    { label: isBn ? 'মোট ব্যবহারকারী' : 'Total Users', value: '1', icon: Users, color: 'text-brand-blue' },
    { label: isBn ? 'সক্রিয় ব্যবসা' : 'Active Businesses', value: '0', icon: TrendingUp, color: 'text-brand-accent' },
    { label: isBn ? 'যাচাইকরণ সারি' : 'Verification Queue', value: '0', icon: Shield, color: 'text-brand-warn' },
    { label: isBn ? 'KYC সারি' : 'KYC Queue', value: '0', icon: Users, color: 'text-brand-accent' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-brand-text mb-6">{isBn ? 'অ্যাডমিন ওভারভিউ' : 'Admin Overview'}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="card">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className="text-2xl font-bold text-brand-text tabular-nums">{s.value}</p>
            <p className="text-xs text-brand-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <p className="text-sm text-brand-muted">{isBn ? 'সিস্টেম স্বাভাবিকভাবে চলছে। কোনো সতর্কতা নেই।' : 'System running normally. No alerts.'}</p>
      </div>
    </div>
  );
}

export function AdminVerifyPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'ব্যবসা যাচাইকরণ সারি' : 'Business Verification Queue'}</h1>
      <div className="card text-center py-12">
        <Shield className="w-8 h-8 text-brand-muted mx-auto mb-3" />
        <p className="text-sm text-brand-muted">{isBn ? 'কোনো ব্যবসা যাচাইকরণের জন্য নেই' : 'No businesses pending verification'}</p>
      </div>
    </div>
  );
}

export function AdminKycPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'KYC যাচাইকরণ সারি' : 'KYC Verification Queue'}</h1>
      <div className="card text-center py-12">
        <Users className="w-8 h-8 text-brand-muted mx-auto mb-3" />
        <p className="text-sm text-brand-muted">{isBn ? 'কোনো KYC যাচাইকরণের জন্য নেই' : 'No KYC submissions pending'}</p>
      </div>
    </div>
  );
}

export function AdminUsersPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'ব্যবহারকারী ব্যবস্থাপনা' : 'User Management'}</h1>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line">
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'নাম' : 'Name'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ফোন' : 'Phone'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ভূমিকা' : 'Role'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'KYC' : 'KYC'}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-brand-line">
                <td className="py-3 px-2 text-brand-text">Capital De Benchmark Admin</td>
                <td className="py-3 px-2 text-brand-muted" dir="ltr">01700000000</td>
                <td className="py-3 px-2"><span className="px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent text-xs">super_admin</span></td>
                <td className="py-3 px-2"><span className="px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent text-xs">verified</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminRechargePage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'রিচার্জ সারি' : 'MFS Recharge Queue'}</h1>
      <div className="card text-center py-12">
        <CreditCard className="w-8 h-8 text-brand-muted mx-auto mb-3" />
        <p className="text-sm text-brand-muted">{isBn ? 'কোনো রিচার্জ অনুরোধ নেই' : 'No recharge requests pending'}</p>
      </div>
    </div>
  );
}

export function AdminWithdrawPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'উত্তোলন সারি' : 'Withdrawal Queue'}</h1>
      <div className="card text-center py-12">
        <ArrowUpCircle className="w-8 h-8 text-brand-muted mx-auto mb-3" />
        <p className="text-sm text-brand-muted">{isBn ? 'কোনো উত্তোলন অনুরোধ নেই' : 'No withdrawal requests pending'}</p>
      </div>
    </div>
  );
}

export function AdminUpdatesPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'আপডেট অনুমোদন সারি' : 'Update Approval Queue'}</h1>
      <div className="card text-center py-12">
        <FileText className="w-8 h-8 text-brand-muted mx-auto mb-3" />
        <p className="text-sm text-brand-muted">{isBn ? 'কোনো আপডেট অনুমোদনের জন্য নেই' : 'No updates pending approval'}</p>
      </div>
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
        <p className="text-sm text-brand-muted">{isBn ? 'কোনো অডিট লগ নেই' : 'No audit log entries yet'}</p>
      </div>
    </div>
  );
}
