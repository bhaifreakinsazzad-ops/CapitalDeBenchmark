import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, Check, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useWalletStore } from '../../lib/services/wallet';
import { rechargeSchema, type RechargeInput } from '../../lib/validators/wallet';
import { MFS_METHODS, MIN_DEPOSIT_BDT } from '../../lib/constants';
import { Money } from '../../components/shared/money';

export function RechargePage() {
  const { user, lang } = useAuthStore();
  const { submitRecharge } = useWalletStore();
  const navigate = useNavigate();
  const isBn = lang === 'bn';

  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<RechargeInput>({
    resolver: zodResolver(rechargeSchema),
  });

  const amount = watch('amount');

  if (!user) return null;

  const selectedMfs = MFS_METHODS.find((m) => m.id === selectedMethod);

  const copyNumber = () => {
    if (selectedMfs) {
      navigator.clipboard.writeText(selectedMfs.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const onSubmit = (data: RechargeInput) => {
    setError('');
    const result = submitRecharge({
      amount: data.amount,
      mfs_method: selectedMethod!,
      trx_id: data.trx_id,
      sender_number: data.sender_number,
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/wallet'), 3000);
    } else {
      setError(result.error || 'Failed to submit recharge');
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-brand-accent" />
          </div>
          <h1 className="text-xl font-bold text-brand-text mb-2">
            {isBn ? 'রিচার্জ জমা দেওয়া হয়েছে' : 'Recharge Submitted'}
          </h1>
          <p className="text-sm text-brand-muted mb-6">
            {isBn ? 'আমরা ১ ঘণ্টার মধ্যে যাচাই করব।' : 'We will verify within 1 hour.'}
          </p>
          <button onClick={() => navigate('/wallet')} className="btn-primary">
            {isBn ? 'ওয়ালেটে ফিরুন' : 'Back to Wallet'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <button onClick={() => navigate('/wallet')} className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text mb-4">
        <ArrowLeft className="w-4 h-4" />
        {isBn ? 'ফিরে যান' : 'Back'}
      </button>

      <h1 className="text-2xl font-bold text-brand-text mb-6">{isBn ? 'রিচার্জ' : 'Recharge'}</h1>

      {/* Step 1: Choose MFS */}
      {step === 1 && (
        <div>
          <h2 className="text-sm font-semibold text-brand-text mb-3">
            {isBn ? 'পদ্ধতি বেছে নিন' : 'Choose Method'}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {MFS_METHODS.map((mfs) => (
              <button
                key={mfs.id}
                onClick={() => {
                  setSelectedMethod(mfs.id);
                  setStep(2);
                }}
                className="card flex flex-col items-center gap-2 hover:border-brand-accent/30 transition-colors py-6"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${mfs.color}20` }}>
                  <span className="text-2xl font-bold" style={{ color: mfs.color }}>{mfs.name[0]}</span>
                </div>
                <span className="text-sm font-medium text-brand-text">{mfs.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Show payment details */}
      {step === 2 && selectedMfs && (
        <div>
          <div className="card mb-6">
            <p className="text-sm text-brand-muted mb-2">{isBn ? 'এই নম্বরে পাঠান' : 'Send to this number'}</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-brand-text font-mono" dir="ltr">{selectedMfs.number}</span>
              <button onClick={copyNumber} className="text-brand-muted hover:text-brand-accent transition-colors">
                {copied ? <Check className="w-5 h-5 text-brand-accent" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <div className="bg-brand-panel2 rounded-lg p-3 mb-3">
              <p className="text-xs text-brand-muted mb-1">{isBn ? 'রেফারেন্সে লিখুন' : 'Put in reference'}</p>
              <p className="text-sm font-mono text-brand-text">{user.wallet_id}</p>
            </div>
            <div className="bg-brand-warn/10 border border-brand-warn/20 rounded-lg p-3">
              <p className="text-xs text-brand-warn">
                {isBn
                  ? '⚠️ আপনার নিজের MFS অ্যাকাউন্ট ব্যবহার করুন। তৃতীয় পক্ষের পেমেন্ট প্রত্যাখ্যাত হবে।'
                  : '⚠️ Use your own MFS account. Third-party payments will be rejected.'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-ghost flex-1">
              {isBn ? 'পেছনে' : 'Back'}
            </button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1">
              {isBn ? 'পরবর্তী' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Submit form */}
      {step === 3 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-brand-bad/10 border border-brand-bad/30 rounded-xl p-3 text-sm text-brand-bad">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">
              {isBn ? 'পরিমাণ (৳)' : 'Amount (৳)'}
            </label>
            <input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              inputMode="numeric"
              min={MIN_DEPOSIT_BDT}
              placeholder={isBn ? 'ন্যূনতম ৫' : 'Minimum 5'}
            />
            {errors.amount && <p className="text-xs text-brand-bad mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">
              {isBn ? 'প্রেরক নম্বর' : 'Sender Number'}
            </label>
            <input
              {...register('sender_number')}
              type="tel"
              inputMode="numeric"
              placeholder="01XXXXXXXXX"
              dir="ltr"
              className="text-left"
            />
            {errors.sender_number && <p className="text-xs text-brand-bad mt-1">{errors.sender_number.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">
              {isBn ? 'TrxID' : 'Transaction ID'}
            </label>
            <input
              {...register('trx_id')}
              type="text"
              placeholder={isBn ? 'SMS থেকে TrxID লিখুন' : 'Enter TrxID from SMS'}
              dir="ltr"
              className="text-left font-mono"
            />
            {errors.trx_id && <p className="text-xs text-brand-bad mt-1">{errors.trx_id.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setStep(2)} className="btn-ghost flex-1">
              {isBn ? 'পেছনে' : 'Back'}
            </button>
            <button type="submit" className="btn-primary flex-1">
              {isBn ? 'জমা দিন' : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
