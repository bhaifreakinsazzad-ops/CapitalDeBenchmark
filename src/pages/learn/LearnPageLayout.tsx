import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../store';

interface LearnPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function LearnPageLayout({ title, children }: LearnPageLayoutProps) {
  const { lang } = useAuthStore();
  const { topic } = useParams<{ topic: string }>();
  const isBn = lang === 'bn';

  const topics = [
    { id: 'what-is-micro-investing', title: isBn ? 'মাইক্রো-ইনভেস্টমেন্ট কী?' : 'What is Micro-Investing?' },
    { id: 'how-to-start', title: isBn ? 'কীভাবে শুরু করবেন' : 'How to Start' },
    { id: 'understanding-shares', title: isBn ? 'শেয়ার বোঝা' : 'Understanding Shares' },
    { id: 'how-prices-move', title: isBn ? 'মূল্য কীভাবে পরিবর্তন হয়' : 'How Prices Move' },
    { id: 'risks-and-rights', title: isBn ? 'ঝুঁকি এবং অধিকার' : 'Risks and Rights' },
    { id: 'wallet-and-escrow', title: isBn ? 'ওয়ালেট এবং এসক্রো' : 'Wallet and Escrow' },
    { id: 'glossary', title: isBn ? 'শব্দকোষ' : 'Glossary' },
    { id: 'faq', title: isBn ? 'প্রশ্নোত্তর' : 'FAQ' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/learn" className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-accent/80 mb-6">
        <ArrowLeft className="w-4 h-4" />
        {isBn ? 'শিখুন-এ ফিরুন' : 'Back to Learn'}
      </Link>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Table of Contents - Desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold text-brand-text mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {isBn ? 'বিষয়বস্তু' : 'Contents'}
            </h3>
            <nav className="space-y-1">
              {topics.map((t) => (
                <Link
                  key={t.id}
                  to={`/learn/${t.id}`}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    topic === t.id
                      ? 'bg-brand-accent/10 text-brand-accent font-medium'
                      : 'text-brand-muted hover:text-brand-text hover:bg-brand-panel2'
                  }`}
                >
                  {t.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <h1 className="text-3xl font-bold text-brand-text mb-6">{title}</h1>
          <div className="prose prose-invert max-w-none">
            {children}
          </div>

          {/* Mobile TOC */}
          <div className="lg:hidden mt-8">
            <h3 className="text-sm font-semibold text-brand-text mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {isBn ? 'অন্যান্য বিষয়' : 'Other Topics'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {topics.filter(t => t.id !== topic).map((t) => (
                <Link
                  key={t.id}
                  to={`/learn/${t.id}`}
                  className="px-3 py-2 rounded-lg text-sm text-brand-muted hover:text-brand-text hover:bg-brand-panel2 transition-colors"
                >
                  {t.title}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 card bg-brand-panel2 border-brand-accent/20">
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
        </main>
      </div>
    </div>
  );
}
