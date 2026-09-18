import { formatMoney } from '../../lib/format';

interface MoneyProps {
  amount: number;
  lang?: 'bn' | 'en';
  className?: string;
}

export function Money({ amount, lang = 'bn', className = '' }: MoneyProps) {
  const display = formatMoney(amount, lang);

  return (
    <span className={`tabular-nums ${className}`}>
      <span className="text-brand-accent font-medium">{display.slice(0, 1)}</span>
      {display.slice(1)}
    </span>
  );
}
