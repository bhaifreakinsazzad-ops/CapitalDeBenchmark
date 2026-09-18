import { useAuthStore } from '../store';

export function useLang() {
  const { lang, setLang } = useAuthStore();
  
  const toggleLang = () => {
    setLang(lang === 'bn' ? 'en' : 'bn');
  };

  return { lang, setLang, toggleLang };
}
