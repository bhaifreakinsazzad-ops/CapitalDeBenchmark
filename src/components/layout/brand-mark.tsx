import { TrendingUp } from 'lucide-react';
import { APP_FULL_NAME, APP_SHORT_NAME } from '../../lib/constants';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  showFull?: boolean;
}

export function BrandMark({ size = 'md', showFull = false }: BrandMarkProps) {
  const iconSize = size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-7 h-7' : 'w-9 h-9';
  const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl';
  const subTextSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <div className="flex items-center gap-2">
      <div className={`${iconSize} rounded-lg bg-brand-accent/10 flex items-center justify-center`}>
        <TrendingUp className={`${iconSize === 'w-5 h-5' ? 'w-3.5 h-3.5' : iconSize === 'w-7 h-7' ? 'w-4.5 h-4.5' : 'w-5 h-5'} text-brand-accent`} />
      </div>
      <div>
        <span className={`${textSize} font-bold text-brand-text tracking-tight`}>
          {APP_SHORT_NAME}
        </span>
        {showFull && (
          <p className={`${subTextSize} text-brand-muted leading-tight`}>
            {APP_FULL_NAME}
          </p>
        )}
      </div>
    </div>
  );
}
