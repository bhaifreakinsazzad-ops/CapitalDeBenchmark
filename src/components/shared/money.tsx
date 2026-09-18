import { toBanglaNumeral } from '../../lib/utils';

interface MoneyProps {
  amount: number;
  lang?: 'bn' | 'en';
  className?: string;
}

export function Money({ amount, lang = 'bn', className = '' }: MoneyProps) {
  const formatted = new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  const display = lang === 'bn' ? toBanglaNumeral(formatted) : formatted;

  return (
    <span className={`tabular-nums ${className}`}>
      <span className="text-brand-accent font-medium">৳</span>
      {display}
    </span>
  );
}
