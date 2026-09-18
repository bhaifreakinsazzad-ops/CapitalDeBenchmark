import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import { BrandMark } from '../components/layout/brand-mark';
import { LangToggle } from '../components/layout/lang-toggle';
import { useAuthStore, useDemoStore } from '../store';
import { registerSchema, type RegisterInput } from '../lib/validators/auth';
import { generateWalletId, generateId } from '../lib/utils';
import { APP_SHORT_NAME } from '../lib/constants';

export function RegisterPage() {
  const { lang, login } = useAuthStore();
  const { addUser, findByPhone } = useDemoStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const isBn = lang === 'bn';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'investor' },
  });

  const onSubmit = (data: RegisterInput) => {
    setError('');
    
    if (findByPhone(data.phone)) {
      setError(isBn ? 'এই নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে' : 'An account with this phone already exists');
      return;
    }

    const id = generateId();
    const walletId = generateWalletId();

    addUser({
      id,
      name: data.name,
      phone: data.phone,
      password: data.password,
      role: data.role,
      kyc_status: 'pending',
      wallet_id: walletId,
      balance: 0,
      preferred_lang: lang,
    });

    login({
      id,
      name: data.name,
      phone: data.phone,
      role: data.role,
      kyc_status: 'pending',
      kyc_docs: [],
      wallet_id: walletId,
      balance: 0,
      preferred_lang: lang,
      trust_flags: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex items-center justify-between">
        <Link to="/"><BrandMark size="sm" /></Link>
        <LangToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-7 h-7 text-brand-accent" />
            </div>
            <h1 className="text-xl font-bold text-brand-text">
              {isBn ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create a new account'}
            </h1>
            <p className="text-sm text-brand-muted mt-1">{APP_SHORT_NAME}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-brand-bad/10 border border-brand-bad/30 rounded-xl p-3 text-sm text-brand-bad">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">
                {isBn ? 'পূর্ণ নাম' : 'Full Name'}
              </label>
              <input
                {...register('name')}
                placeholder={isBn ? 'আপনার নাম লিখুন' : 'Enter your name'}
              />
              {errors.name && <p className="text-xs text-brand-bad mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">
                {isBn ? 'মোবাইল নম্বর' : 'Phone Number'}
              </label>
              <input
                {...register('phone')}
                placeholder="01XXXXXXXXX"
                dir="ltr"
                className="text-left"
              />
              {errors.phone && <p className="text-xs text-brand-bad mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">
                {isBn ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••"
                  dir="ltr"
                  className="text-left pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-brand-bad mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">
                {isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••"
                dir="ltr"
                className="text-left"
              />
              {errors.confirmPassword && <p className="text-xs text-brand-bad mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-muted mb-2">
                {isBn ? 'আমি চাই' : 'I want to'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${errors.role ? 'border-brand-line' : ''}`}>
                  <input {...register('role')} type="radio" value="investor" className="w-4 h-4 accent-brand-accent" defaultChecked />
                  <span className="text-sm text-brand-text">{isBn ? 'বিনিয়োগকারী' : 'Investor'}</span>
                </label>
                <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${errors.role ? 'border-brand-line' : ''}`}>
                  <input {...register('role')} type="radio" value="founder" className="w-4 h-4 accent-brand-accent" />
                  <span className="text-sm text-brand-text">{isBn ? 'প্রতিষ্ঠাতা' : 'Founder'}</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? (isBn ? 'লোড হচ্ছে...' : 'Loading...') : (isBn ? 'রেজিস্টার করুন' : 'Register')}
            </button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-6">
            {isBn ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
            <Link to="/login" className="text-brand-accent font-medium hover:underline">
              {isBn ? 'লগ ইন করুন' : 'Login'}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
