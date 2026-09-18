import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, ArrowDownCircle, ArrowUpCircle, Shield, Clock, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useWalletStore } from '../../lib/services/wallet';
import { Money } from '../../components/shared/money';
import { TrustBadge } from '../../components/shared/trust-badge';
import { EmptyState } from '../../components/shared/empty-state';
import { formatDate } from '../../lib/utils';
import { MFS_METHODS } from '../../lib/constants';

export function WalletPage() {
  const { user, lang } = useAuthStore();
  const { getUserTransactions, getUserRecharges, getUserWithdrawals } = useWalletStore();
  const isBn = lang === 'bn';
  const [copied, setCopied] = useState(false);
  const [expandedTxn, setExpandedTxn] = useState<string | null>(null);
  const [showAllTxns, setShowAllTxns] = useState(false);

  if (!user) return null;

  const txns = getUserTransactions(user.id);
  const recharges = getUserRecharges(user.id).filter((r) => r.status === 'pending');
  const withdrawals = getUserWithdrawals(user.id).filter((w) => w.status === 'pending' || w.status === 'approved');
  const displayedTxns = showAllTxns ? txns : txns.slice(0, 10);

  const copyWalletId = () => {
    navigator.clipboard.writeText(user.wallet_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
  };

  const getMfsName = (method: string) => {
    return MFS_METHODS.find((m) => m.id === method)?.name || method;
  };

  const getTxnIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownCircle className="w-4 h-4 text-brand-accent" />;
      case 'withdrawal': return <ArrowUpCircle className="w-4 h-4 text-brand-warn" />;
      case 'refund': return <ArrowDownCircle className="w-4 h-4 text-brand-blue" />;
      default: return <Info className="w-4 h-4 text-brand-muted" />;
    }
  };

  const getTxnLabel = (type: string) => {
    const labels: Record<string, [string, string]> = {
      deposit: ['জমা', 'Deposit'],
      withdrawal: ['উত্তোলন', 'Withdrawal'],
      refund: ['ফেরত', 'Refund'],
      investment: ['বিনিয়োগ', 'Investment'],
      trade_buy: ['ক্রয়', 'Buy'],
      trade_sell: ['বিক্রয়', 'Sell'],
      fee: ['ফি', 'Fee'],
      adjustment: ['সমন্বয়', 'Adjustment'],
    };
    return labels[type] ? (isBn ? labels[type][0] : labels[type][1]) : type;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-brand-text mb-6">{isBn ? 'ওয়ালেট' : 'Wallet'}</h1>

      {/* Balance Card */}
      <div className="card mb-4 bg-gradient-to-br from-brand-panel to-brand-panel2 border-brand-accent/20">
        <p className="text-sm text-brand-muted mb-1">{isBn ? 'উপলব্ধ ব্যালেন্স' : 'Available Balance'}</p>
        <Money amount={user.balance} lang={lang} className="text-3xl font-bold" />
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-brand-muted font-mono">{user.wallet_id}</span>
          <button onClick={copyWalletId} className="text-brand-muted hover:text-brand-accent transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-brand-accent" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Escrow Notice */}
      <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-xl p-3 mb-4 flex items-start gap-2">
        <Shield className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
        <p className="text-xs text-brand-muted leading-relaxed">
          {isBn
            ? 'আপনার টাকা Capital De Benchmark দ্বারা এসক্রোতে সংরক্ষিত। উত্তোলনের জন্য ২৪ ঘণ্টার মধ্যে অ্যাডমিন অনুমোদন প্রয়োজন।'
            : 'Your money is held in escrow by Capital De Benchmark. Withdrawals require admin approval within 24 hours.'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link to="/wallet/recharge" className="card flex flex-col items-center gap-2 hover:border-brand-accent/30 transition-colors py-4">
          <ArrowDownCircle className="w-6 h-6 text-brand-accent" />
          <span className="text-sm font-medium text-brand-text">{isBn ? 'রিচার্জ' : 'Recharge'}</span>
        </Link>
        <Link
          to={user.kyc_status === 'verified' ? '/wallet/withdraw' : '#'}
          className={`card flex flex-col items-center gap-2 transition-colors py-4 ${
            user.kyc_status === 'verified' ? 'hover:border-brand-accent/30' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={(e) => user.kyc_status !== 'verified' && e.preventDefault()}
        >
          <ArrowUpCircle className="w-6 h-6 text-brand-warn" />
          <span className="text-sm font-medium text-brand-text">{isBn ? 'উত্তোলন' : 'Withdraw'}</span>
          {user.kyc_status !== 'verified' && (
            <span className="text-[10px] text-brand-bad">{isBn ? 'KYC প্রয়োজন' : 'KYC required'}</span>
          )}
        </Link>
      </div>

      {/* KYC Status Card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-brand-text">{isBn ? 'KYC স্ট্যাটাস' : 'KYC Status'}</h2>
          <TrustBadge score={user.kyc_status === 'verified' ? 100 : user.kyc_status === 'rejected' ? 20 : 50} />
        </div>
        {user.kyc_status === 'pending' && (
          <div className="flex items-center gap-2 text-sm text-brand-warn">
            <Clock className="w-4 h-4" />
            <span>{isBn ? 'আপনার KYC পর্যালোচনাধীন। সাধারণত ১ ঘণ্টার মধ্যে।' : 'Your KYC is under review. Usually within 1 hour.'}</span>
          </div>
        )}
        {user.kyc_status === 'verified' && (
          <div className="flex items-center gap-2 text-sm text-brand-accent">
            <Check className="w-4 h-4" />
            <span>{isBn ? 'যাচাইকৃত' : 'Verified'}</span>
          </div>
        )}
        {user.kyc_status === 'rejected' && (
          <div>
            <div className="flex items-center gap-2 text-sm text-brand-bad mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>{isBn ? 'প্রত্যাখ্যাত' : 'Rejected'}</span>
            </div>
            <Link to="/wallet/kyc" className="btn-primary text-sm inline-block">
              {isBn ? 'পুনরায় আবেদন করুন' : 'Re-apply'}
            </Link>
          </div>
        )}
        {!['pending', 'verified', 'rejected'].includes(user.kyc_status) && (
          <div>
            <p className="text-sm text-brand-muted mb-2">
              {isBn ? 'বিনিয়োগ ও উত্তোলনের জন্য পরিচয় যাচাই করুন' : 'Verify your identity to invest and withdraw'}
            </p>
            <Link to="/wallet/kyc" className="btn-primary text-sm inline-block">
              {isBn ? 'KYC সম্পন্ন করুন' : 'Complete KYC'}
            </Link>
          </div>
        )}
      </div>

      {/* Pending Activity */}
      {(recharges.length > 0 || withdrawals.length > 0) && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-brand-text mb-3">{isBn ? 'চলমান কার্যক্রম' : 'Pending Activity'}</h2>
          <div className="space-y-2">
            {recharges.map((r) => (
              <div key={r.id} className="card py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowDownCircle className="w-4 h-4 text-brand-accent" />
                  <span className="text-sm text-brand-text">{isBn ? 'রিচার্জ' : 'Recharge'}</span>
                </div>
                <div className="text-right">
                  <Money amount={r.amount} lang={lang} className="text-sm font-semibold" />
                  <p className="text-[10px] text-brand-warn">{isBn ? 'অপেক্ষমান' : 'Pending'}</p>
                </div>
              </div>
            ))}
            {withdrawals.map((w) => (
              <div key={w.id} className="card py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpCircle className="w-4 h-4 text-brand-warn" />
                  <span className="text-sm text-brand-text">{isBn ? 'উত্তোলন' : 'Withdrawal'}</span>
                </div>
                <div className="text-right">
                  <Money amount={w.amount} lang={lang} className="text-sm font-semibold" />
                  <p className="text-[10px] text-brand-warn">
                    {w.status === 'approved' ? (isBn ? 'অনুমোদিত' : 'Approved') : (isBn ? 'অপেক্ষমান' : 'Pending')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div>
        <h2 className="text-sm font-semibold text-brand-text mb-3">{isBn ? 'লেনদেন ইতিহাস' : 'Transaction History'}</h2>
        {txns.length === 0 ? (
          <EmptyState
            icon={Info}
            title={isBn ? 'কোনো লেনদেন নেই' : 'No transactions yet'}
            description={isBn ? 'আপনার লেনদেন এখানে দেখাবে' : 'Your transactions will appear here'}
          />
        ) : (
          <div className="space-y-2">
            {displayedTxns.map((txn) => (
              <div key={txn.id} className="card py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTxnIcon(txn.type)}
                    <div>
                      <p className="text-sm font-medium text-brand-text">{getTxnLabel(txn.type)}</p>
                      {txn.note && <p className="text-[10px] text-brand-muted">{txn.note}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold tabular-nums ${txn.amount >= 0 ? 'text-brand-accent' : 'text-brand-bad'}`}>
                      {txn.amount >= 0 ? '+' : ''}<Money amount={Math.abs(txn.amount)} lang={lang} />
                    </p>
                    <p className="text-[10px] text-brand-muted">{formatDate(txn.created_at, lang)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedTxn(expandedTxn === txn.id ? null : txn.id)}
                  className="flex items-center gap-1 mt-2 text-[10px] text-brand-muted hover:text-brand-text transition-colors"
                >
                  {expandedTxn === txn.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {isBn ? 'বিস্তারিত' : 'Details'}
                </button>
                {expandedTxn === txn.id && (
                  <div className="mt-2 pt-2 border-t border-brand-line space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-brand-muted">{isBn ? 'হ্যাশ' : 'Hash'}</span>
                      <button onClick={() => copyHash(txn.hash)} className="flex items-center gap-1 text-[10px] text-brand-accent">
                        <Copy className="w-2.5 h-2.5" />
                        <span className="font-mono">{txn.hash.substring(0, 12)}...</span>
                      </button>
                    </div>
                    {txn.trx_id && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-brand-muted">TrxID</span>
                        <span className="text-[10px] text-brand-text font-mono">{txn.trx_id}</span>
                      </div>
                    )}
                    {txn.method && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-brand-muted">{isBn ? 'পদ্ধতি' : 'Method'}</span>
                        <span className="text-[10px] text-brand-text">{getMfsName(txn.method)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-brand-muted">{isBn ? 'লেনদেনের পর ব্যালেন্স' : 'Balance after'}</span>
                      <Money amount={txn.balance_after} lang={lang} className="text-[10px]" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {txns.length > 10 && !showAllTxns && (
              <button onClick={() => setShowAllTxns(true)} className="btn-ghost w-full text-sm">
                {isBn ? `আরো ${txns.length - 10}টি দেখুন` : `Show ${txns.length - 10} more`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
