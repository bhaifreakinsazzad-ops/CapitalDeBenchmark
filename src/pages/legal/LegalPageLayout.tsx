import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store';

interface LegalPageLayoutProps {
  title: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-accent/80 mb-6">
        <ArrowLeft className="w-4 h-4" />
        {isBn ? 'হোমে ফিরুন' : 'Back to Home'}
      </Link>

      <h1 className="text-3xl font-bold text-brand-text mb-6">{title}</h1>

      <div className="prose prose-invert max-w-none">
        {children}
      </div>

      <div className="mt-12 pt-6 border-t border-brand-line">
        <p className="text-sm text-brand-muted">
          {isBn 
            ? 'সর্বশেষ আপডেট: জানুয়ারি ২০২৫'
            : 'Last updated: January 2025'}
        </p>
      </div>
    </div>
  );
}
