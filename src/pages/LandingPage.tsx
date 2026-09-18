import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { BrandMark } from '../components/layout/brand-mark';
import { LangToggle } from '../components/layout/lang-toggle';
import { RiskBanner } from '../components/shared/risk-banner';
import { useAuthStore } from '../store';
import { APP_FULL_NAME } from '../lib/constants';

export function LandingPage() {
  const { lang, isAuthenticated } = useAuthStore();
  const isBn = lang === 'bn';

  const content = isBn ? {
    hero: {
      title: 'আসল বাংলাদেশী ব্যবসায় বিনিয়োগ করুন',
      subtitle: 'মাত্র ৳৫ থেকে শুরু করুন। যাচাইকৃত ব্যবসা, ট্রেডযোগ্য শেয়ার, স্বচ্ছ ওয়ালেট।',
      cta: 'শুরু করুন',
      ctaSecondary: 'বাজার দেখুন',
    },
    features: [
      { icon: Shield, title: 'যাচাইকৃত ব্যবসা', desc: 'প্রতিটি ব্যবসা আমাদের টিম দ্বারা যাচাই করা হয়।' },
      { icon: TrendingUp, title: '৳৫ থেকে বিনিয়োগ', desc: 'ছোট amount থেকে শুরু করুন, বড় স্বপ্ন দেখুন।' },
      { icon: Users, title: 'ট্রেডযোগ্য শেয়ার', desc: 'আপনার শেয়ার অন্যদের কাছে বিক্রি করুন যেকোনো সময়।' },
    ],
    risk: 'ঝুঁকি সতর্কতা',
  } : {
    hero: {
      title: 'Invest in Real Bangladeshi Businesses',
      subtitle: 'Start from just ৳5. Verified businesses, tradable shares, transparent wallet.',
      cta: 'Get Started',
      ctaSecondary: 'Browse Market',
    },
    features: [
      { icon: Shield, title: 'Verified Businesses', desc: 'Every business is verified by our team before listing.' },
      { icon: TrendingUp, title: 'Invest from ৳5', desc: 'Start small, dream big. Micro-investment made simple.' },
      { icon: Users, title: 'Tradable Shares', desc: 'Sell your shares to others anytime on the exchange.' },
    ],
    risk: 'Risk Warning',
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-md border-b border-brand-line">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <BrandMark size="sm" showFull />
          <div className="flex items-center gap-3">
            <LangToggle />
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-ghost text-sm">{isBn ? 'ড্যাশবোর্ড' : 'Dashboard'}</Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">{isBn ? 'লগ ইন' : 'Login'}</Link>
                <Link to="/register" className="btn-primary text-sm">{content.hero.cta}</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-brand-text leading-tight mb-6">
              {content.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-brand-muted mb-8 leading-relaxed">
              {content.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary flex items-center gap-2">
                {content.hero.cta} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/market" className="btn-ghost">
                {content.hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {content.features.map((f, i) => (
            <div key={i} className="card hover:border-brand-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-brand-accent" />
              </div>
              <h3 className="text-lg font-semibold text-brand-text mb-2">{f.title}</h3>
              <p className="text-sm text-brand-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Risk Banner */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <RiskBanner lang={lang} />
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-16 border-t border-brand-line">
        <h2 className="text-2xl font-bold text-brand-text mb-8 text-center">
          {isBn ? 'কীভাবে কাজ করে' : 'How it works'}
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: '1', title: isBn ? 'অ্যাকাউন্ট তৈরি' : 'Create Account', desc: isBn ? 'মোবাইল নম্বর দিয়ে সাইন আপ' : 'Sign up with your phone number' },
            { step: '2', title: isBn ? 'KYC সম্পন্ন' : 'Complete KYC', desc: isBn ? 'পরিচয় যাচাই করুন' : 'Verify your identity' },
            { step: '3', title: isBn ? 'ওয়ালেট রিচার্জ' : 'Recharge Wallet', desc: isBn ? 'bKash/Nagad দিয়ে টাকা যোগ' : 'Add funds via bKash/Nagad' },
            { step: '4', title: isBn ? 'বিনিয়োগ শুরু' : 'Start Investing', desc: isBn ? 'ব্যবসা বেছে নিন, শেয়ার কিনুন' : 'Choose businesses, buy shares' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 rounded-full bg-brand-accent text-brand-bg font-bold flex items-center justify-center mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-brand-text mb-1">{item.title}</h3>
              <p className="text-sm text-brand-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-line py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <BrandMark size="sm" />
          <p className="text-xs text-brand-muted text-center">
            © 2025 {APP_FULL_NAME}. {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
          </p>
          <div className="flex gap-4 text-xs text-brand-muted">
            <Link to="/learn" className="hover:text-brand-text transition-colors">{isBn ? 'শিখুন' : 'Learn'}</Link>
            <Link to="/market" className="hover:text-brand-text transition-colors">{isBn ? 'বাজার' : 'Market'}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
