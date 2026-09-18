import { useAuthStore } from '../../store';

interface LangToggleProps {
  className?: string;
}

export function LangToggle({ className = '' }: LangToggleProps) {
  const { lang, setLang, user, updateUser } = useAuthStore();

  const toggle = () => {
    const newLang = lang === 'bn' ? 'en' : 'bn';
    setLang(newLang);
    if (user) {
      updateUser({ preferred_lang: newLang });
    }
  };

  return (
    <button
      onClick={toggle}
      className={`px-3 py-1.5 rounded-lg border border-brand-line text-sm font-medium text-brand-muted hover:text-brand-text hover:border-brand-accent transition-all ${className}`}
    >
      {lang === 'bn' ? 'EN' : 'বাং'}
    </button>
  );
}
