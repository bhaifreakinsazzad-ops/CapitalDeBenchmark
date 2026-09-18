import { Link } from 'react-router-dom';
import { TrendingUp, Users, DollarSign, Globe, Rocket, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store';
import { useBusinessStore } from '../lib/services/business';
import { Money } from '../components/shared/money';
import type { Business } from '../lib/services/business';

export function FreakinStudioPage() {
  const { lang } = useAuthStore();
  const { businesses } = useBusinessStore();
  const isBn = lang === 'bn';

  // Get all Freakin Studio ventures
  const freakinVentures: Business[] = businesses.filter(
    (b: Business) => b.owner_id === 'freakin-studio-founder-001'
  );

  // Categorize ventures
  const flagship = freakinVentures.filter((v: Business) => v.name === 'Hoooplaaa');
  const liveOperational = freakinVentures.filter((v: Business) => 
    ['DhandaBuzz', 'GURUsphere Lab', 'Freakin SI', 'AI Shala', 'BhaiVibing'].includes(v.name)
  );
  const launchingSoon = freakinVentures.filter((v: Business) => 
    ['Trucky', 'Make Ally', 'Level Up', 'Bongo Vogue', 'MOONoPoly'].includes(v.name)
  );
  const inProgress = freakinVentures.filter((v: Business) => 
    ['Alore-Via', 'Mamonaa', 'Absolute Cinema', 'Kaamlaa.shop', 'Prompt Dao'].includes(v.name)
  );

  // Calculate statistics
  const totalVentures = freakinVentures.length;
  const liveVentures = freakinVentures.filter((v: Business) => v.revenue_monthly > 0).length;
  const totalRaised = freakinVentures.reduce((sum: number, v: Business) => sum + v.total_raised, 0);
  const industries = new Set(freakinVentures.map((v: Business) => v.category)).size;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-bg via-brand-panel to-brand-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-brand-blue/5" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 mb-6">
              <Globe className="w-4 h-4 text-brand-accent" />
              <span className="text-sm text-brand-accent font-medium">
                {isBn ? 'বাংলাদেশ থেকে বিশ্বব্যাপী' : 'From Bangladesh to the World'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-text mb-4">
              Freakin Studio
            </h1>
            <p className="text-xl md:text-2xl text-brand-muted mb-2">
              {isBn ? 'একটি ভেঞ্চার ইকোসিস্টেম, এজেন্সি নয়' : 'A Venture Ecosystem, not an agency'}
            </p>
            <p className="text-lg text-brand-muted max-w-3xl mx-auto">
              {isBn 
                ? 'সিন্থেটিক ইন্টেলিজেন্স-পাওয়ার্ড ভেঞ্চার-বিল্ডিং ইকোসিস্টেম যা AI, SaaS, মার্কেটপ্লেস, FinTech, EdTech, এবং মিডিয়া জুড়ে ডিজিটাল ভেঞ্চার তৈরি, আপগ্রেড এবং লঞ্চ করে।'
                : 'A synthetic-intelligence-powered venture-building ecosystem that builds, upgrades, and launches digital ventures across AI, SaaS, marketplace, FinTech, EdTech, and media.'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="card text-center">
              <Rocket className="w-8 h-8 text-brand-accent mx-auto mb-2" />
              <p className="text-3xl font-bold text-brand-text">{totalVentures}+</p>
              <p className="text-sm text-brand-muted">{isBn ? 'ভেঞ্চার' : 'Ventures'}</p>
            </div>
            <div className="card text-center">
              <TrendingUp className="w-8 h-8 text-brand-blue mx-auto mb-2" />
              <p className="text-3xl font-bold text-brand-text">{industries}</p>
              <p className="text-sm text-brand-muted">{isBn ? 'শিল্প' : 'Industries'}</p>
            </div>
            <div className="card text-center">
              <CheckCircle className="w-8 h-8 text-brand-accent mx-auto mb-2" />
              <p className="text-3xl font-bold text-brand-text">{liveVentures}+</p>
              <p className="text-sm text-brand-muted">{isBn ? 'লাইভ প্ল্যাটফর্ম' : 'Live Platforms'}</p>
            </div>
            <div className="card text-center">
              <DollarSign className="w-8 h-8 text-brand-warn mx-auto mb-2" />
              <p className="text-3xl font-bold text-brand-text">
                <Money amount={totalRaised} lang={lang} className="inline" />
              </p>
              <p className="text-sm text-brand-muted">{isBn ? 'মোট সংগৃহীত' : 'Total Raised'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Model */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-text text-center mb-12">
            {isBn ? 'অপারেটিং মডেল' : 'The Operating Model'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🏗️</span>
              </div>
              <h3 className="text-xl font-semibold text-brand-text mb-2">
                {isBn ? 'কোর ইনফ্রাস্ট্রাকচার' : 'Core Infrastructure'}
              </h3>
              <p className="text-sm text-brand-muted">
                {isBn 
                  ? 'শেয়ার্ড টেক স্ট্যাক, ডিজাইন সিস্টেম, AI ব্যাকবোন, এবং অপারেশনাল টুলিং যা ইকোসিস্টেমের প্রতিটি ভেঞ্চারকে শক্তি দেয়।'
                  : 'Shared tech stack, design system, AI backbone, and operational tooling that powers every venture under the umbrella.'}
              </p>
            </div>
            <div className="card">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🧪</span>
              </div>
              <h3 className="text-xl font-semibold text-brand-text mb-2">
                {isBn ? 'প্রোডাক্ট ল্যাব' : 'Product Labs'}
              </h3>
              <p className="text-sm text-brand-muted">
                {isBn 
                  ? 'দ্রুত পরীক্ষা এবং যাচাইকরণ। আমরা আইডিয়া পরীক্ষা করি, MVP তৈরি করি, এবং বিজয়ীদের স্ট্যান্ডঅ্যালোন ভেঞ্চারে গ্র্যাজুয়েট করি।'
                  : 'Rapid experimentation and validation. We test ideas, build MVPs, and graduate winners into standalone ventures.'}
              </p>
            </div>
            <div className="card">
              <div className="w-12 h-12 rounded-xl bg-brand-warn/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-brand-text mb-2">
                {isBn ? 'মার্কেট ভেঞ্চার' : 'Market Ventures'}
              </h3>
              <p className="text-sm text-brand-muted">
                {isBn 
                  ? 'লাইভ, রেভিনিউ-সক্রিয় প্ল্যাটফর্ম যাদের আসল ব্যবহারকারী, আসল ট্র্যাকশন, এবং স্কেল করার স্পষ্ট পথ আছে।'
                  : 'Live, revenue-active platforms with real users, real traction, and clear paths to scale.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Venture */}
      {flagship.length > 0 && (
        <section className="py-16 px-4 bg-brand-panel2/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-sm font-medium">
                {isBn ? 'ফ্ল্যাগশিপ' : 'Flagship'}
              </span>
            </div>
            {flagship.map((venture: Business) => (
              <Link
                key={venture.id}
                to={`/biz/${venture.slug}`}
                className="card hover:border-brand-accent/30 transition-all block"
              >
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-brand-accent/20 to-brand-blue/20 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp className="w-12 h-12 text-brand-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-brand-text mb-2">{venture.name}</h3>
                    <p className="text-brand-muted mb-4 line-clamp-2">{venture.story}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-brand-muted">{isBn ? 'শেয়ার মূল্য' : 'Share Price'}</p>
                        <Money amount={venture.share_price} lang={lang} className="text-lg font-bold" />
                      </div>
                      <div>
                        <p className="text-xs text-brand-muted">{isBn ? 'মাইলস্টোন' : 'Milestone'}</p>
                        <Money amount={venture.milestone_target || 0} lang={lang} className="text-lg font-bold" />
                      </div>
                      <div>
                        <p className="text-xs text-brand-muted">{isBn ? 'মাসিক রাজস্ব' : 'Monthly Revenue'}</p>
                        <Money amount={venture.revenue_monthly} lang={lang} className="text-lg font-bold" />
                      </div>
                      <div>
                        <p className="text-xs text-brand-muted">{isBn ? 'ট্রাস্ট স্কোর' : 'Trust Score'}</p>
                        <p className="text-lg font-bold text-brand-text">{venture.trust_score}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Live & Operational Ventures */}
      {liveOperational.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-sm font-medium">
                {isBn ? 'লাইভ এবং অপারেশনাল' : 'Live & Operational'}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveOperational.map((venture: Business) => (
                <Link
                  key={venture.id}
                  to={`/biz/${venture.slug}`}
                  className="card hover:border-brand-accent/30 transition-all"
                >
                  <h3 className="text-lg font-semibold text-brand-text mb-2">{venture.name}</h3>
                  <p className="text-xs text-brand-muted mb-3 line-clamp-2">{venture.story}</p>
                  <div className="flex items-center justify-between text-sm">
                    <Money amount={venture.share_price} lang={lang} className="font-semibold" />
                    <span className="text-brand-muted">{venture.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Launching Soon Ventures */}
      {launchingSoon.length > 0 && (
        <section className="py-16 px-4 bg-brand-panel2/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-medium">
                {isBn ? 'শীঘ্রই লঞ্চ হচ্ছে' : 'Launching Soon'}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {launchingSoon.map((venture: Business) => (
                <Link
                  key={venture.id}
                  to={`/biz/${venture.slug}`}
                  className="card hover:border-brand-blue/30 transition-all"
                >
                  <h3 className="text-lg font-semibold text-brand-text mb-2">{venture.name}</h3>
                  <p className="text-xs text-brand-muted mb-3 line-clamp-2">{venture.story}</p>
                  <div className="flex items-center justify-between text-sm">
                    <Money amount={venture.share_price} lang={lang} className="font-semibold" />
                    <span className="text-brand-muted">{venture.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* In Progress Ventures */}
      {inProgress.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-brand-warn/10 text-brand-warn text-sm font-medium">
                {isBn ? 'প্রগতিতে' : 'In Progress'}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgress.map((venture: Business) => (
                <Link
                  key={venture.id}
                  to={`/biz/${venture.slug}`}
                  className="card hover:border-brand-warn/30 transition-all"
                >
                  <h3 className="text-lg font-semibold text-brand-text mb-2">{venture.name}</h3>
                  <p className="text-xs text-brand-muted mb-3 line-clamp-2">{venture.story}</p>
                  <div className="flex items-center justify-between text-sm">
                    <Money amount={venture.share_price} lang={lang} className="font-semibold" />
                    <span className="text-brand-muted">{venture.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Founder Section */}
      <section className="py-16 px-4 bg-brand-panel2/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-text mb-6">
            {isBn ? 'প্রতিষ্ঠাতা' : 'Founder'}
          </h2>
          <div className="card">
            <div className="w-24 h-24 rounded-full bg-brand-accent/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-brand-accent" />
            </div>
            <h3 className="text-2xl font-bold text-brand-text mb-2">BhaiSazzaD</h3>
            <p className="text-brand-muted mb-4">
              {isBn ? 'Freakin Studio এর প্রতিষ্ঠাতা' : 'Founder of Freakin Studio'}
            </p>
            <p className="text-sm text-brand-muted mb-6">
              {isBn 
                ? 'ভেঞ্চার, সিস্টেম, AI প্রোডাক্ট এবং এক্সিকিউশন ইঞ্জিনের বিল্ডার'
                : 'Builder of ventures, systems, AI products & execution engines'}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-brand-panel2 text-brand-text text-xs">Venture Architect</span>
              <span className="px-3 py-1 rounded-full bg-brand-panel2 text-brand-text text-xs">Systems Thinker</span>
              <span className="px-3 py-1 rounded-full bg-brand-panel2 text-brand-text text-xs">AI Builder</span>
              <span className="px-3 py-1 rounded-full bg-brand-panel2 text-brand-text text-xs">Operator</span>
              <span className="px-3 py-1 rounded-full bg-brand-panel2 text-brand-text text-xs">BD → Global</span>
            </div>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:hello@freakinstudio.space"
                className="btn-primary"
              >
                {isBn ? 'যোগাযোগ করুন' : 'Contact'}
              </a>
              <a
                href="https://bhaisazzad.online"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                {isBn ? 'পোর্টফোলিও' : 'Portfolio'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-text mb-6">
            {isBn ? 'ভিশন' : 'Vision'}
          </h2>
          <div className="card">
            <p className="text-lg text-brand-muted leading-relaxed mb-6">
              {isBn 
                ? 'বাংলাদেশ থেকে বিশ্বমানের ডিজিটাল ভেঞ্চার তৈরি করা যায় এবং AI, SaaS, FinTech, মার্কেটপ্লেস, এবং মিডিয়া জুড়ে বিশ্বব্যাপী প্রতিযোগিতা করতে পারে - এই প্রমাণ তৈরি করা।'
                : 'Building proof that world-class digital ventures can emerge from Bangladesh — and compete globally across AI, SaaS, FinTech, marketplace, and media.'}
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="text-sm font-semibold text-brand-accent mb-2">
                  {isBn ? 'স্বল্পমেয়াদী' : 'Short-term'}
                </h4>
                <p className="text-sm text-brand-muted">
                  {isBn 
                    ? 'লাইভ ভেঞ্চার স্কেল করুন ·_near-launch পণ্য লঞ্চ করুন · অংশীদারিত্ব সক্রিয় করুন'
                    : 'Scale live ventures · Launch near-ready products · Activate partnerships'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-brand-accent mb-2">
                  {isBn ? 'দীর্ঘমেয়াদী' : 'Long-term'}
                </h4>
                <p className="text-sm text-brand-muted">
                  {isBn 
                    ? 'দক্ষিণ এশিয়া থেকে সবচেয়ে উৎপাদনশীল AI-প্রথম ভেঞ্চার ইকোসিস্টেম হয়ে উঠুন'
                    : 'Become the most prolific AI-first venture ecosystem from South Asia'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-accent/10 to-brand-blue/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-text mb-4">
            {isBn ? 'একসাথে তৈরি করি' : "Let's Build Together"}
          </h2>
          <p className="text-lg text-brand-muted mb-8">
            {isBn 
              ? 'বিনিয়োগকারী, অপারেটর, অংশীদার, বিল্ডার, বা সহযোগী - আপনি যদি পরবর্তী জিনিস শিপিং করার বিষয়ে গুরুতর হন, আমরা আপনার কাছ থেকে শুনতে চাই।'
              : "Investor, operator, partner, builder, or collaborator — if you're serious about shipping what's next, we'd like to hear from you."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/market" className="btn-primary">
              {isBn ? 'ভেঞ্চার এক্সপ্লোর করুন' : 'Explore Ventures'}
            </Link>
            <a href="mailto:hello@freakinstudio.space" className="btn-ghost">
              {isBn ? 'আমাদের সাথে পার্টনার করুন' : 'Partner With Us'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
