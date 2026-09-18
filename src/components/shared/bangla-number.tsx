import { formatNumber } from '../../lib/format';

interface BanglaNumberProps {
  value: string | number;
  lang?: 'bn' | 'en';
  className?: string;
}

export function BanglaNumber({ value, lang = 'bn', className = '' }: BanglaNumberProps) {
  const display = formatNumber(value, lang);
  return <span className={`tabular-nums ${className}`}>{display}</span>;
}
