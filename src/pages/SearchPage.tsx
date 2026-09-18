import { useState, useEffect } from 'react';
import { Search as SearchIcon, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store';
import { useBusinessStore } from '../lib/services/business';
import { Money } from '../components/shared/money';
import { EmptyState } from '../components/shared/empty-state';
import { CATEGORIES } from '../lib/constants';

export function SearchPage() {
  const { lang } = useAuthStore();
  const { businesses } = useBusinessStore();
  const isBn = lang === 'bn';
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Search logic
  useEffect(() => {
    if (!debouncedQuery && !category && !location) {
      setResults([]);
      return;
    }

    let filtered = businesses.filter(b => b.status === 'active');

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.story.toLowerCase().includes(q)
      );
    }

    if (category) {
      filtered = filtered.filter(b => b.category === category);
    }

    if (location) {
      const loc = location.toLowerCase();
      filtered = filtered.filter(b => b.location.toLowerCase().includes(loc));
    }

    // Sort by trust score
    filtered.sort((a, b) => b.trust_score - a.trust_score);

    setResults(filtered);
  }, [debouncedQuery, category, location, businesses]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-brand-text mb-6">{isBn ? 'অনুসন্ধান' : 'Search'}</h1>

      {/* Search Input */}
      <div className="card mb-6">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isBn ? 'ব্যবসা, ক্যাটাগরি, বা স্থান খুঁজুন...' : 'Search businesses, categories, or locations...'}
            className="w-full pl-10 pr-4 py-3 bg-brand-panel2 border border-brand-line rounded-xl text-sm"
          />
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-brand-muted mb-1">{isBn ? 'ক্যাটাগরি' : 'Category'}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
            >
              <option value="">{isBn ? 'সব ক্যাটাগরি' : 'All Categories'}</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-brand-muted mb-1">{isBn ? 'স্থান' : 'Location'}</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={isBn ? 'যেমন: ঢাকা' : 'e.g., Dhaka'}
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length === 0 && (debouncedQuery || category || location) ? (
        <EmptyState
          icon={SearchIcon}
          title={isBn ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No results found'}
          description={isBn ? 'অন্য কিওয়ার্ড বা ফিল্টার চেষ্টা করুন' : 'Try different keywords or filters'}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((business) => (
            <a
              key={business.id}
              href={`/biz/${business.slug}`}
              className="card hover:border-brand-accent/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-brand-panel2 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-brand-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-brand-text truncate">{business.name}</h3>
                  <p className="text-xs text-brand-muted mb-2">{business.category} · {business.location}</p>
                  <div className="flex items-center justify-between text-xs">
                    <Money amount={business.share_price} lang={lang} className="font-semibold" />
                    <span className="text-brand-muted">Trust: {business.trust_score}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
