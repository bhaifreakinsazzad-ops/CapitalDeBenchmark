import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, Check, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useKycStore } from '../../lib/services/kyc';

interface KycFormData {
  nid_number: string;
  full_name: string;
  present_address: string;
  whatsapp_number: string;
  nid_front: FileList;
  nid_back: FileList;
  utility_bill: FileList;
  selfie: FileList;
  confirmation: boolean;
}

export function KycPage() {
  const { user, lang } = useAuthStore();
  const { submitKyc } = useKycStore();
  const navigate = useNavigate();
  const isBn = lang === 'bn';
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<KycFormData>();

  if (!user) return null;

  const onSubmit = async (data: KycFormData) => {
    setError('');
    setUploading(true);

    try {
      if (!data.confirmation) {
        setError(isBn ? 'অনুগ্রহ করে নিশ্চিত করুন যে তথ্য সঠিক' : 'Please confirm the information is accurate');
        setUploading(false);
        return;
      }

      const result = submitKyc({
        nid_number: data.nid_number,
        full_name: data.full_name,
        present_address: data.present_address,
        whatsapp_number: data.whatsapp_number,
        nid_front: data.nid_front[0],
        nid_back: data.nid_back[0],
        utility_bill: data.utility_bill[0],
        selfie: data.selfie?.[0],
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate('/wallet'), 3000);
      } else {
        setError(result.error || 'Failed to submit KYC');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setUploading(false);
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
            {isBn ? 'KYC জমা দেওয়া হয়েছে' : 'KYC Submitted'}
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

      <h1 className="text-2xl font-bold text-brand-text mb-2">{isBn ? 'KYC যাচাইকরণ' : 'KYC Verification'}</h1>
      <p className="text-sm text-brand-muted mb-6">
        {isBn ? 'বিনিয়োগ ও উত্তোলনের জন্য পরিচয় যাচাই করুন' : 'Verify your identity to invest and withdraw'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-brand-bad/10 border border-brand-bad/30 rounded-xl p-3 text-sm text-brand-bad">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-brand-muted mb-1.5">
            {isBn ? 'পূর্ণ নাম (NID অনুযায়ী)' : 'Full Name (as on NID)'}
          </label>
          <input
            {...register('full_name', { required: isBn ? 'নাম প্রয়োজন' : 'Name is required' })}
            placeholder={isBn ? 'আপনার নাম' : 'Your name'}
          />
          {errors.full_name && <p className="text-xs text-brand-bad mt-1">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-muted mb-1.5">
            {isBn ? 'NID নম্বর' : 'NID Number'}
          </label>
          <input
            {...register('nid_number', { 
              required: isBn ? 'NID প্রয়োজন' : 'NID is required',
              pattern: { value: /^\d{10}$|^\d{13}$|^\d{17}$/, message: isBn ? 'NID ১০, ১৩ বা ১৭ সংখ্যার হতে হবে' : 'NID must be 10, 13, or 17 digits' }
            })}
            type="text"
            inputMode="numeric"
            placeholder={isBn ? '১০/১৩/১৭ সংখ্যা' : '10/13/17 digits'}
            dir="ltr"
            className="text-left"
          />
          {errors.nid_number && <p className="text-xs text-brand-bad mt-1">{errors.nid_number.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-muted mb-1.5">
            {isBn ? 'বর্তমান ঠিকানা' : 'Present Address'}
          </label>
          <textarea
            {...register('present_address', { required: isBn ? 'ঠিকানা প্রয়োজন' : 'Address is required' })}
            rows={3}
            placeholder={isBn ? 'আপনার বর্তমান ঠিকানা' : 'Your present address'}
          />
          {errors.present_address && <p className="text-xs text-brand-bad mt-1">{errors.present_address.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-muted mb-1.5">
            {isBn ? 'WhatsApp নম্বর' : 'WhatsApp Number'}
          </label>
          <input
            {...register('whatsapp_number', { 
              required: isBn ? 'WhatsApp নম্বর প্রয়োজন' : 'WhatsApp number is required',
              pattern: { value: /^01[3-9]\d{8}$/, message: isBn ? 'ভুল নম্বর' : 'Invalid number' }
            })}
            type="tel"
            inputMode="numeric"
            placeholder="01XXXXXXXXX"
            dir="ltr"
            className="text-left"
          />
          {errors.whatsapp_number && <p className="text-xs text-brand-bad mt-1">{errors.whatsapp_number.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-muted mb-1.5">
            {isBn ? 'NID সামনের ছবি' : 'NID Front'}
          </label>
          <div className="border border-brand-line rounded-xl p-4 hover:border-brand-accent/30 transition-colors">
            <input
              {...register('nid_front', { required: isBn ? 'NID সামনের ছবি প্রয়োজন' : 'NID front is required' })}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              className="text-sm text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-accent/10 file:text-brand-accent hover:file:bg-brand-accent/20"
            />
          </div>
          {errors.nid_front && <p className="text-xs text-brand-bad mt-1">{errors.nid_front.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-muted mb-1.5">
            {isBn ? 'NID পেছনের ছবি' : 'NID Back'}
          </label>
          <div className="border border-brand-line rounded-xl p-4 hover:border-brand-accent/30 transition-colors">
            <input
              {...register('nid_back', { required: isBn ? 'NID পেছনের ছবি প্রয়োজন' : 'NID back is required' })}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              className="text-sm text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-accent/10 file:text-brand-accent hover:file:bg-brand-accent/20"
            />
          </div>
          {errors.nid_back && <p className="text-xs text-brand-bad mt-1">{errors.nid_back.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-muted mb-1.5">
            {isBn ? 'ইউটিলিটি বিল' : 'Utility Bill'}
          </label>
          <div className="border border-brand-line rounded-xl p-4 hover:border-brand-accent/30 transition-colors">
            <input
              {...register('utility_bill', { required: isBn ? 'ইউটিলিটি বিল প্রয়োজন' : 'Utility bill is required' })}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              className="text-sm text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-accent/10 file:text-brand-accent hover:file:bg-brand-accent/20"
            />
          </div>
          {errors.utility_bill && <p className="text-xs text-brand-bad mt-1">{errors.utility_bill.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-muted mb-1.5">
            {isBn ? 'সেলফি (ঐচ্ছিক)' : 'Selfie (Optional)'}
          </label>
          <div className="border border-brand-line rounded-xl p-4 hover:border-brand-accent/30 transition-colors">
            <input
              {...register('selfie')}
              type="file"
              accept="image/jpeg,image/png"
              className="text-sm text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-accent/10 file:text-brand-accent hover:file:bg-brand-accent/20"
            />
          </div>
        </div>

        <label className="flex items-start gap-3 p-4 rounded-xl border border-brand-line bg-brand-panel cursor-pointer">
          <input {...register('confirmation')} type="checkbox" className="mt-0.5 w-4 h-4 accent-brand-accent" />
          <span className="text-sm text-brand-muted">
            {isBn 
              ? 'আমি নিশ্চিত করছি যে তথ্য সঠিক এবং আমি নথিতে থাকা ব্যক্তি।'
              : 'I confirm the information is accurate and I am the person in the documents.'}
          </span>
        </label>

        <button type="submit" disabled={uploading} className="btn-primary w-full mt-4 disabled:opacity-50">
          {uploading ? (isBn ? 'আপলোড হচ্ছে...' : 'Uploading...') : (isBn ? 'জমা দিন' : 'Submit')}
        </button>
      </form>
    </div>
  );
}
