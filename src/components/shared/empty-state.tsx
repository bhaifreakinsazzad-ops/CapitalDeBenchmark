import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-panel2 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-brand-muted" />
      </div>
      <h3 className="text-lg font-semibold text-brand-text mb-2">{title}</h3>
      {description && <p className="text-sm text-brand-muted max-w-sm mb-4">{description}</p>}
      {actionLabel && actionHref && (
        <Link to={actionHref} className="btn-primary text-sm">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
