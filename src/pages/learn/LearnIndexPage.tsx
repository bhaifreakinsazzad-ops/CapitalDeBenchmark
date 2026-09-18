import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Shield, Wallet, AlertTriangle, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../../store';

export function LearnIndexPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  const topics = [
    {
      id: 'what-is-micro-investing',
      icon: TrendingUp,
      title: isBn ? 'মাইক্রো-ইনভেস্টমেন্ট কী?' : 'What is Micro-Investing?',
      desc: isBn ? '৳৫ থেকে বিনিয়োগ শুরু করুন' : 'Start investing from ৳5',
    },
    {
      id: 'how-to-start',
      icon: BookOpen,
      title: isBn ? 'কীভাবে শুরু করবেন' : 'How to Start',
      desc: isBn ? 'ধাপে ধাপে গাইড' : 'Step-by-step guide',
    },
    {
      id: 'understanding-shares',
      icon: TrendingUp,
      title: isBn ? 'শেয়ার বোঝা' : 'Understanding Shares',
      desc: isBn ? 'শেয়ার কী এবং কীভাবে কাজ করে' : 'What shares are and how they work',
    },
    {
      id: 'how-prices-move',
      icon: TrendingUp,
      title: isBn ? 'মূল্য কীভাবে পরিবর্তন হয়' : 'How Prices Move',
      desc: isBn ? 'প্রাইমারি ও সেকেন্ডারি মার্কেট' : 'Primary and secondary markets',
    },
    {
      id: 'risks-and-rights',
      icon: AlertTriangle,
      title: isBn ? 'ঝুঁকি এবং অধিকার' : 'Risks and Rights',
      desc: isBn ? 'কী জানা দরকার' : 'What you need to know',
    },
    {
      id: 'wallet-and-escrow',
      icon: Wallet,
      title: isBn ? 'ওয়ালেট এবং এসক্রো' : 'Wallet and Escrow',
      desc: isBn ? 'আপনার টাকা কীভাবে সুরক্ষিত' : 'How your money is protected',
    },
    {
      id: 'glossary',
      icon: BookOpen,
      title: isBn ? 'শব্দকোষ' : 'Glossary',
      desc: isBn ? 'গুরুত্বপূর্ণ পরিভাষা' : 'Important terms',
    },
    {
      id: 'faq',
      icon: HelpCircle,
      title: isBn ? 'প্রশ্নোত্তর' : 'FAQ',
      desc: isBn ? 'সাধারণ প্রশ্নের উত্তর' : 'Common questions answered',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-brand-text mb-3">
          {isBn ? 'শিখুন' : 'Learn'}
        </h1>
        <p className="text-brand-muted">
          {isBn ? 'বিনিয়োগ সম্পর্কে জানুন' : 'Learn about investing'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/learn/${topic.id}`}
            className="card hover:border-brand-accent/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-colors">
              <topic.icon className="w-6 h-6 text-brand-accent" />
            </div>
            <h2 className="text-lg font-semibold text-brand-text mb-2">
              {topic.title}
            </h2>
            <p className="text-sm text-brand-muted">
              {topic.desc}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12 card bg-brand-panel2 border-brand-accent/20">
        <div className="flex items-start gap-4">
          <Shield className="w-8 h-8 text-brand-accent shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-brand-text mb-2">
              {isBn ? 'আরো প্রশ্ন আছে?' : 'Still have questions?'}
            </h3>
            <p className="text-sm text-brand-muted mb-4">
              {isBn 
                ? 'আমাদের সাপোর্ট টিম আপনাকে সাহায্য করতে প্রস্তুত।'
                : 'Our support team is ready to help you.'}
            </p>
            <a
              href="mailto:support@capitaldebenchmark.com"
              className="btn-primary inline-block"
            >
              {isBn ? 'সাপোর্টে যোগাযোগ করুন' : 'Contact Support'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
