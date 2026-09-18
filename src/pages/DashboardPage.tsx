import { Link } from 'react-router-dom';
import { TrendingUp, Briefcase, Wallet, ArrowUpRight, Shield } from 'lucide-react';
import { useAuthStore } from '../store';
import { Money } from '../components/shared/money';
import { TrustBadge } from '../components/shared/trust-badge';
import { EmptyState } from '../components/shared/empty-state';
import bnMessages from '../messages/bn.json';
import enMessages from '../messages/en.json';

export function DashboardPage() {
  const { user, lang } = useAuthStore();
  const t = lang === 'bn' ? bnMessages : enMessages;

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text">
          {lang === 'bn' ? `স্বাগতম, ${user.name}` : `Welcome, ${user.name}`}
        </h1>
        <p className="text-sm text-brand-muted mt-1">{user.wallet_id}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{t.nav.wallet}</p>
          <Money amount={user.balance} lang={lang} className="text-lg font-bold" />
        </div>
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{t.nav.portfolio}</p>
          <p className="text-lg font-bold text-brand-text tabular-nums">
            {lang === 'bn' ? '০' : '0'}
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{lang === 'bn' ? 'মোট লাভ/ক্ষতি' : 'Total P&L'}</p>
          <Money amount={0} lang={lang} className="text-lg font-bold" />
        </div>
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{lang === 'bn' ? 'KYC' : 'KYC'}</p>
          <TrustBadge score={user.kyc_status === 'verified' ? 100 : user.kyc_status === 'rejected' ? 20 : 50} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Link to="/wallet" className="card flex flex-col items-center gap-2 hover:border-brand-accent/30 transition-colors">
          <Wallet className="w-6 h-6 text-brand-accent" />
          <span className="text-xs font-medium text-brand-text">{lang === 'bn' ? 'রিচার্জ' : 'Recharge'}</span>
        </Link>
        <Link to="/market" className="card flex flex-col items-center gap-2 hover:border-brand-accent/30 transition-colors">
          <TrendingUp className="w-6 h-6 text-brand-blue" />
          <span className="text-xs font-medium text-brand-text">{t.nav.market}</span>
        </Link>
        <Link to="/portfolio" className="card flex flex-col items-center gap-2 hover:border-brand-accent/30 transition-colors">
          <Briefcase className="w-6 h-6 text-brand-warn" />
          <span className="text-xs font-medium text-brand-text">{t.nav.portfolio}</span>
        </Link>
        {user.role === 'founder' && (
          <Link to="/mybiz" className="card flex flex-col items-center gap-2 hover:border-brand-accent/30 transition-colors">
            <ArrowUpRight className="w-6 h-6 text-brand-accent" />
            <span className="text-xs font-medium text-brand-text">{t.nav.myBiz}</span>
          </Link>
        )}
      </div>

      {/* Holdings */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-brand-text mb-3">{t.nav.portfolio}</h2>
        <EmptyState
          icon={Briefcase}
          title={lang === 'bn' ? 'কোনো হোল্ডিং নেই' : 'No holdings yet'}
          description={lang === 'bn' ? 'বাজার থেকে শেয়ার কিনে শুরু করুন' : 'Start by buying shares from the market'}
          actionLabel={lang === 'bn' ? 'বাজার দেখুন' : 'Browse Market'}
          actionHref="/market"
        />
      </div>
    </div>
  );
}
