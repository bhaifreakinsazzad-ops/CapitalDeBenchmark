import { NavLink } from 'react-router-dom';
import { Store, Briefcase, Wallet, Newspaper, User } from 'lucide-react';
import { useAuthStore } from '../../store';
import bnMessages from '../../messages/bn.json';
import enMessages from '../../messages/en.json';

export function BottomNav() {
  const { lang } = useAuthStore();
  const t = lang === 'bn' ? bnMessages : enMessages;

  const items = [
    { to: '/market', icon: Store, label: t.nav.market },
    { to: '/portfolio', icon: Briefcase, label: t.nav.portfolio },
    { to: '/wallet', icon: Wallet, label: t.nav.wallet },
    { to: '/notifications', icon: Newspaper, label: t.nav.updates },
    { to: '/dashboard', icon: User, label: t.nav.profile },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-bg/95 backdrop-blur-md border-t border-brand-line md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                isActive ? 'text-brand-accent' : 'text-brand-muted hover:text-brand-text'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
