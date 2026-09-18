import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Shield, Users, CreditCard, ArrowDownCircle, ArrowUpCircle, FileText, ClipboardList, LogOut, DollarSign, TrendingUp, Target, BarChart3, Flag, MessageSquare, Megaphone } from 'lucide-react';
import { BrandMark } from './brand-mark';
import { useAuthStore } from '../../store';
import bnMessages from '../../messages/bn.json';
import enMessages from '../../messages/en.json';
import { APP_FULL_NAME } from '../../lib/constants';

export function AdminSidebar() {
  const { lang, logout } = useAuthStore();
  const navigate = useNavigate();
  const t = lang === 'bn' ? bnMessages : enMessages;

  const items = [
    { to: '/admin', icon: LayoutDashboard, label: t.admin.overview },
    { to: '/admin/verify', icon: Shield, label: t.admin.verifyQueue },
    { to: '/admin/kyc', icon: Users, label: t.admin.kycQueue },
    { to: '/admin/users', icon: Users, label: t.admin.users },
    { to: '/admin/recharge', icon: CreditCard, label: t.admin.recharge },
    { to: '/admin/withdraw', icon: ArrowUpCircle, label: t.admin.withdraw },
    { to: '/admin/release', icon: DollarSign, label: lang === 'bn' ? 'ফান্ড রিলিজ' : 'Fund Release' },
    { to: '/admin/investments', icon: TrendingUp, label: lang === 'bn' ? 'বিনিয়োগ' : 'Investments' },
    { to: '/admin/milestone', icon: Target, label: lang === 'bn' ? 'মাইলস্টোন' : 'Milestone' },
    { to: '/admin/orders', icon: BarChart3, label: lang === 'bn' ? 'অর্ডার' : 'Orders' },
    { to: '/admin/trades', icon: TrendingUp, label: lang === 'bn' ? 'লেনদেন' : 'Trades' },
    { to: '/admin/market-maker', icon: BarChart3, label: lang === 'bn' ? 'মার্কেট মেকার' : 'Market Maker' },
    { to: '/admin/reports', icon: Flag, label: lang === 'bn' ? 'রিপোর্ট' : 'Reports' },
    { to: '/admin/comments', icon: MessageSquare, label: lang === 'bn' ? 'মন্তব্য' : 'Comments' },
    { to: '/admin/announcements', icon: Megaphone, label: lang === 'bn' ? 'ঘোষণা' : 'Announcements' },
    { to: '/admin/updates', icon: FileText, label: t.admin.updates },
    { to: '/admin/audit', icon: ClipboardList, label: t.admin.audit },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-brand-panel border-r border-brand-line min-h-screen">
      <div className="p-4 border-b border-brand-line">
        <BrandMark size="md" showFull />
        <p className="text-xs text-brand-muted mt-1 ml-9">{t.admin.title}</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-accent/10 text-brand-accent'
                  : 'text-brand-muted hover:text-brand-text hover:bg-brand-panel2'
              }`
            }
          >
            <Icon className="w-4.5 h-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-brand-line">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-bad hover:bg-brand-panel2 transition-colors w-full"
        >
          <LogOut className="w-4.5 h-4.5" />
          {t.common.logout}
        </button>
      </div>
    </aside>
  );
}
