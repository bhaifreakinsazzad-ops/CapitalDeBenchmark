import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface RiskBannerProps {
  lang?: 'bn' | 'en';
}

export function RiskBanner({ lang = 'bn' }: RiskBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const content = lang === 'bn' 
    ? {
        title: 'ঝুঁকি সতর্কতা',
        body: 'আসল ব্যবসায় বিনিয়োগে ঝুঁকি আছে। আপনি আপনার টাকা হারাতে পারেন। শুধু সেই টাকা বিনিয়োগ করুন যা হারালেও আপনার ক্ষতি হবে না।'
      }
    : {
        title: 'Risk Warning',
        body: 'Investing in real businesses carries risk. You may lose your money. Only invest what you can afford to lose.'
      };

  return (
    <div className="bg-brand-warn/10 border border-brand-warn/30 rounded-xl p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-brand-warn shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-brand-warn mb-1">{content.title}</p>
        <p className="text-xs text-brand-muted leading-relaxed">{content.body}</p>
      </div>
      <button 
        onClick={() => setDismissed(true)}
        className="text-brand-muted hover:text-brand-text transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
