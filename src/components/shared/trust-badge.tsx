interface TrustBadgeProps {
  score: number;
  className?: string;
}

export function TrustBadge({ score, className = '' }: TrustBadgeProps) {
  let color = 'bg-brand-bad text-white';
  let label = 'Low';
  
  if (score >= 70) {
    color = 'bg-brand-accent text-brand-bg';
    label = 'High';
  } else if (score >= 40) {
    color = 'bg-brand-warn text-brand-bg';
    label = 'Medium';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label} ({score})
    </span>
  );
}
