import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useWalletStore } from '../../lib/services/wallet';
import { withdrawSchema, type WithdrawInput } from '../../lib/validators/wallet';
import { MFS_METHODS, MIN_DEPOSIT_BDT } from '../../lib/constants';
import { Money } from '../../components/shared/money';

export function WithdrawPage() {
  const { user, lang } = useAuthStore();
  const { submitWithdrawal } = useWalletStore();
  const navigate = useNavigate();
  const isBn = lang === 'bn';
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<WithdrawInput>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      mfs_number: user?.payout_mfs_number || '',
      mfs_method: user?.payout_mfs_method || 'bkash',
    },
  });

  if (!user) return null;

  if (user.kyc_status !== 'verified') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate('/wallet')} className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text mb-4">
          <ArrowLeft className="w-4 h-4" />
          {isBn ? 'ফিরে যান' : 'Back'}
        </button>
        <div className="card text-center py-12">
          <AlertCircle className="w-12 h-12 text-brand-warn mx-auto mb-4" />
          <h1 className="text-lg font-bold text-brand-text mb-2">
            {isBn ? 'KYC প্রয়োজন' : 'KYC Required'}
          </h1>
          <p className="text-sm text-brand-muted mb-6">
            {isBn ? 'উত্তোলনের জন্য KYC যাচাইকরণ প্রয়োজন।' : 'KYC verification is required for withdrawals.'}
          </p>
          <button onClick={() => navigate('/wallet/kyc')} className="btn-primary">
            {isBn ? 'KYC সম্পন্ন করুন' : 'Complete KYC'}
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = (data: WithdrawInput) => {
    setError('');
    
    if (data.amount > user.balance) {
      setError(isBn ? 'অপর্যাপ্ত ব্যালেন্স' : 'Insufficient balance');
      return;
    }

    const result = submitWithdrawal(data);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/wallet'), 3000);
    } else {
      setError(result.error || 'Failed to submit withdrawal');
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
            {isBn ? 'উত্তোলন জমা দেওয়া হয়েছে' : 'Withdrawal Submitted'}
          </h1>
          <p className="text-sm text-brand-muted mb-6">
            {isBn ? 'অ্যাডমিন অনুমোদনের পর ২৪ ঘণ্টার মধ্যে আপনি টাকা পাবেন।' : 'You will receive funds within 24 hours after admin approval.'}
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

      <h1 className="text-2xl font-bold text-brand-text mb-2">{isBn ? 'উত্তোলন' : 'Withdraw'}</h1>
      <p className="text-sm text-brand-muted mb-6">
        {isBn ? 'উপলব্ধ ব্যালেন্স: ' : 'Available: '}
        <Money amount={user.balance} lang={lang} className="font-semibold" />
      </p>

      <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-xl p-3 mb-6">
        <p className="text-xs text-brand-muted">
          {isBn
            ? 'ℹ️ উত্তোলনের জন্য KYC যাচাইকরণ প্রয়োজন। যদি আপনার KYC এখনও পর্যালোচনাধীন হয়, অনুগ্রহ করে অপেক্ষা করুন।'
            : 'ℹ️ Withdrawals require KYC verification. If your KYC is still under review, please wait.'}
        </p>
      </div>

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
            max={user.balance}
            placeholder={isBn ? 'ন্যূনতম ৫' : 'Minimum 5'}
          />
          {errors.amount && <p className="text-xs text-brand-bad mt-1">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-muted mb-1.5">
            {isBn ? 'পদ্ধতি' : 'Method'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {MFS_METHODS.map((mfs) => (
              <label key={mfs.id} className="flex items-center gap-2 p-3 rounded-xl border border-brand-line cursor-pointer hover:border-brand-accent/30 transition-colors">
                <input {...register('mfs_method')} type="radio" value={mfs.id} className="w-4 h-4 accent-brand-accent" />
                <span className="text-sm text-brand-text">{mfs.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-muted mb-1.5">
            {isBn ? 'MFS নম্বর' : 'MFS Number'}
          </label>
          <input
            {...register('mfs_number')}
            type="tel"
            inputMode="numeric"
            placeholder="01XXXXXXXXX"
            dir="ltr"
            className="text-left"
          />
          {errors.mfs_number && <p className="text-xs text-brand-bad mt-1">{errors.mfs_number.message}</p>}
        </div>

        <button type="submit" className="btn-primary w-full mt-4">
          {isBn ? 'উত্তোলন অনুরোধ' : 'Request Withdrawal'}
        </button>
      </form>
    </div>
  );
}
