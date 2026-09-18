import { toBanglaNumeral } from '../../lib/utils';

interface BanglaNumberProps {
  value: string | number;
  lang?: 'bn' | 'en';
  className?: string;
}

export function BanglaNumber({ value, lang = 'bn', className = '' }: BanglaNumberProps) {
  const display = lang === 'bn' ? toBanglaNumeral(String(value)) : String(value);
  return <span className={`tabular-nums ${className}`}>{display}</span>;
}
