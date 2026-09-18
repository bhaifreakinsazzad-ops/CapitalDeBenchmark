import { X, Info, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';
import { useAuthStore } from '../store';
import { useSocialStore } from '../lib/services/social';

export function AnnouncementBanner() {
  const { user } = useAuthStore();
  const { getActiveAnnouncements, dismissAnnouncement, isAnnouncementDismissed } = useSocialStore();

  const announcements = getActiveAnnouncements().filter(a => 
    !user || !a.dismissible || !isAnnouncementDismissed(user.id, a.id)
  ).slice(0, 3);

  if (announcements.length === 0) return null;

  const variantStyles = {
    info: 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue',
    warning: 'bg-brand-warn/10 border-brand-warn/30 text-brand-warn',
    success: 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent',
    critical: 'bg-brand-bad/10 border-brand-bad/30 text-brand-bad',
  };

  const variantIcons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
    critical: AlertOctagon,
  };

  return (
    <div className="space-y-2">
      {announcements.map((announcement) => {
        const Icon = variantIcons[announcement.variant];
        const styles = variantStyles[announcement.variant];

        const handleDismiss = () => {
          if (user && announcement.dismissible) {
            dismissAnnouncement(user.id, announcement.id);
          }
        };

        return (
          <div key={announcement.id} className={`border rounded-xl p-3 flex items-start gap-3 ${styles}`}>
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{announcement.title}</p>
              <p className="text-xs opacity-80 mt-0.5">{announcement.body}</p>
            </div>
            {announcement.dismissible && (
              <button onClick={handleDismiss} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
