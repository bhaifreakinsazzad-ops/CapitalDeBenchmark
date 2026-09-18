import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, LayoutDashboard, Briefcase, Wallet, ChevronDown } from 'lucide-react';
import { BrandMark } from './brand-mark';
import { LangToggle } from './lang-toggle';
import { useAuthStore } from '../../store';
import bnMessages from '../../messages/bn.json';
import enMessages from '../../messages/en.json';

export function TopBar() {
  const { user, lang, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = lang === 'bn' ? bnMessages : enMessages;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-md border-b border-brand-line">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <BrandMark size="sm" />
        </Link>

        <div className="flex items-center gap-2">
          <LangToggle />
          
          {user && (
            <>
              <button className="relative p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-panel transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-bad rounded-full" />
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-brand-panel transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-accent/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-brand-accent" />
                  </div>
                  <ChevronDown className="w-3 h-3 text-brand-muted" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-brand-panel border border-brand-line rounded-xl shadow-xl overflow-hidden">
                    <div className="p-3 border-b border-brand-line">
                      <p className="text-sm font-medium text-brand-text truncate">{user.name}</p>
                      <p className="text-xs text-brand-muted">{user.wallet_id}</p>
                    </div>
                    <nav className="p-1">
                      <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-muted hover:text-brand-text hover:bg-brand-panel2 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> {t.nav.dashboard}
                      </Link>
                      <Link to="/portfolio" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-muted hover:text-brand-text hover:bg-brand-panel2 transition-colors">
                        <Briefcase className="w-4 h-4" /> {t.nav.portfolio}
                      </Link>
                      <Link to="/wallet" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-muted hover:text-brand-text hover:bg-brand-panel2 transition-colors">
                        <Wallet className="w-4 h-4" /> {t.nav.wallet}
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-bad hover:bg-brand-panel2 transition-colors w-full text-left">
                        <LogOut className="w-4 h-4" /> {t.common.logout}
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
