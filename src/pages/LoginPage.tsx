import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import { BrandMark } from '../components/layout/brand-mark';
import { LangToggle } from '../components/layout/lang-toggle';
import { useAuthStore, useDemoStore } from '../store';
import { loginSchema, type LoginInput } from '../lib/validators/auth';
import { generateWalletId } from '../lib/utils';
import { APP_SHORT_NAME } from '../lib/constants';

export function LoginPage() {
  const { lang, login } = useAuthStore();
  const { findUser } = useDemoStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const isBn = lang === 'bn';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    setError('');
    const user = findUser(data.phone, data.password);
    if (!user) {
      setError(isBn ? 'ভুল ফোন নম্বর বা পাসওয়ার্ড' : 'Invalid phone number or password');
      return;
    }

    login({
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      kyc_status: user.kyc_status,
      kyc_docs: [],
      wallet_id: user.wallet_id,
      balance: user.balance,
      preferred_lang: user.preferred_lang,
      trust_flags: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (user.role === 'admin' || user.role === 'super_admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
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
              {isBn ? 'আপনার অ্যাকাউন্টে লগ ইন করুন' : 'Sign in to your account'}
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

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? (isBn ? 'লোড হচ্ছে...' : 'Loading...') : (isBn ? 'লগ ইন' : 'Login')}
            </button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-6">
            {isBn ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?"}{' '}
            <Link to="/register" className="text-brand-accent font-medium hover:underline">
              {isBn ? 'রেজিস্টার করুন' : 'Register'}
            </Link>
          </p>

          {/* Demo hint */}
          <div className="mt-6 p-3 bg-brand-panel2 rounded-xl border border-brand-line">
            <p className="text-xs text-brand-muted text-center">
              {isBn ? 'ডেমো অ্যাডমিন:' : 'Demo admin:'} 01700000000 / admin123
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
