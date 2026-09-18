import { Wallet, ArrowDownCircle, ArrowUpCircle, CreditCard } from 'lucide-react';
import { useAuthStore } from '../store';
import { Money } from '../components/shared/money';
import { MFS_METHODS } from '../lib/constants';

export function WalletPage() {
  const { user, lang } = useAuthStore();
  const isBn = lang === 'bn';

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-brand-text mb-6">{isBn ? 'ওয়ালেট' : 'Wallet'}</h1>

      {/* Balance Card */}
      <div className="card mb-6 bg-gradient-to-br from-brand-panel to-brand-panel2">
        <p className="text-sm text-brand-muted mb-1">{isBn ? 'উপলব্ধ ব্যালেন্স' : 'Available Balance'}</p>
        <Money amount={user.balance} lang={lang} className="text-3xl font-bold" />
        <p className="text-xs text-brand-muted mt-2">{user.wallet_id}</p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button className="card flex flex-col items-center gap-2 hover:border-brand-accent/30 transition-colors">
          <ArrowDownCircle className="w-6 h-6 text-brand-accent" />
          <span className="text-sm font-medium text-brand-text">{isBn ? 'রিচার্জ' : 'Recharge'}</span>
        </button>
        <button className="card flex flex-col items-center gap-2 hover:border-brand-accent/30 transition-colors">
          <ArrowUpCircle className="w-6 h-6 text-brand-warn" />
          <span className="text-sm font-medium text-brand-text">{isBn ? 'উত্তোলন' : 'Withdraw'}</span>
        </button>
      </div>

      {/* MFS Methods */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-brand-text mb-3">{isBn ? 'রিচার্জ পদ্ধতি' : 'Recharge Methods'}</h2>
        <div className="grid grid-cols-2 gap-3">
          {MFS_METHODS.map((mfs) => (
            <div key={mfs.id} className="card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${mfs.color}20` }}>
                <CreditCard className="w-5 h-5" style={{ color: mfs.color }} />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-text">{mfs.name}</p>
                <p className="text-xs text-brand-muted" dir="ltr">{mfs.number}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-lg font-semibold text-brand-text mb-3">{isBn ? 'লেনদেন ইতিহাস' : 'Transaction History'}</h2>
        <div className="card text-center py-8">
          <Wallet className="w-8 h-8 text-brand-muted mx-auto mb-2" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো লেনদেন নেই' : 'No transactions yet'}</p>
        </div>
      </div>
    </div>
  );
}
