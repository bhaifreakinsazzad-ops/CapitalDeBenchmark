import { BookOpen, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store';
import { RiskBanner } from '../components/shared/risk-banner';

export function LearnPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-brand-text mb-6">
        {isBn ? 'শিখুন ও ঝুঁকি' : 'Learn & Risk'}
      </h1>

      <div className="mb-8">
        <RiskBanner lang={lang} />
      </div>

      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-5 h-5 text-brand-accent" />
            <h2 className="text-lg font-semibold text-brand-text">
              {isBn ? 'কীভাবে বিনিয়োগ কাজ করে' : 'How Investing Works'}
            </h2>
          </div>
          <p className="text-sm text-brand-muted leading-relaxed">
            {isBn
              ? 'Capital De Benchmark-এ আপনি যাচাইকৃত বাংলাদেশী ব্যবসায় শেয়ার কিনতে পারেন। প্রতিটি শেয়ার একটি নির্দিষ্ট মূল্যে বিক্রি হয়। আপনি যত বেশি শেয়ার কিনবেন, ব্যবসায় আপনার অংশ তত বড় হবে।'
              : 'On Capital De Benchmark, you can buy shares in verified Bangladeshi businesses. Each share is sold at a specific price. The more shares you buy, the larger your stake in the business.'}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-brand-warn" />
            <h2 className="text-lg font-semibold text-brand-text">
              {isBn ? 'ঝুঁকি বোঝা' : 'Understanding Risk'}
            </h2>
          </div>
          <p className="text-sm text-brand-muted leading-relaxed">
            {isBn
              ? 'সব বিনিয়োগে ঝুঁকি আছে। ব্যবসা ব্যর্থ হতে পারে, এবং আপনি আপনার বিনিয়োগকৃত টাকা হারাতে পারেন। শুধু সেই টাকা বিনিয়োগ করুন যা হারালেও আপনার জীবনযাত্রায় প্রভাব পড়বে না।'
              : 'All investments carry risk. Businesses can fail, and you may lose your invested money. Only invest money that you can afford to lose without affecting your lifestyle.'}
          </p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-brand-text mb-3">
            {isBn ? 'গুরুত্বপূর্ণ তথ্য' : 'Important Information'}
          </h2>
          <ul className="space-y-2 text-sm text-brand-muted">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
              {isBn ? 'ন্যূনতম বিনিয়োগ: ৳৫' : 'Minimum investment: ৳5'}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
              {isBn ? 'সমস্ত ব্যবসা প্ল্যাটফর্ম দ্বারা যাচাই করা' : 'All businesses are verified by the platform'}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
              {isBn ? 'শেয়ার ট্রেডযোগ্য রসিদ হিসেবে থাকে' : 'Shares are held as tradable receipts'}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
              {isBn ? 'ওয়ালেট একটি অভ্যন্তরীণ লেজার (ক্রিপ্টো নয়)' : 'Wallet is an internal ledger (not crypto)'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
