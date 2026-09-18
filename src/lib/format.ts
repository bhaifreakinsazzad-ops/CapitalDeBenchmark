/**
 * Capital De Benchmark - Formatting Utilities
 * Handles localization for numbers, currency, dates, and relative time
 */

// Bangla digit mapping
const banglaDigits: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯'
};

/**
 * Convert Western digits to Bangla digits
 */
export function toBanglaDigits(str: string | number): string {
  return String(str).replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
}

/**
 * Format money with proper locale handling
 * @param amount - The amount to format
 * @param locale - 'bn' for Bangla, 'en' for English
 * @returns Formatted string with ৳ symbol
 */
export function formatMoney(amount: number | string, locale: 'bn' | 'en' = 'bn'): string {
  const n = Number(amount || 0);
  const western = new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
  
  const digits = locale === 'bn' ? toBanglaDigits(western) : western;
  return `৳${digits}`;
}

/**
 * Format a number with locale-aware digit conversion
 * @param n - The number to format
 * @param locale - 'bn' for Bangla, 'en' for English
 * @returns Formatted number string
 */
export function formatNumber(n: number | string, locale: 'bn' | 'en' = 'bn'): string {
  const western = new Intl.NumberFormat('en-BD').format(Number(n || 0));
  return locale === 'bn' ? toBanglaDigits(western) : western;
}

/**
 * Format a percentage with locale-aware digit conversion
 * @param n - The percentage value (0-100)
 * @param locale - 'bn' for Bangla, 'en' for English
 * @returns Formatted percentage string
 */
export function formatPercent(n: number, locale: 'bn' | 'en' = 'bn'): string {
  const western = `${n.toFixed(1)}%`;
  return locale === 'bn' ? toBanglaDigits(western) : western;
}

/**
 * Format a date with locale-aware formatting
 * @param timestamp - Date string, timestamp, or Date object
 * @param locale - 'bn' for Bangla, 'en' for English
 * @returns Formatted date string (e.g., "১৫ জানুয়ারি ২০২৪" or "15 Jan 2024")
 */
export function formatDate(timestamp: string | number | Date, locale: 'bn' | 'en' = 'bn'): string {
  const d = new Date(timestamp);
  
  if (locale === 'bn') {
    const banglaMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    
    const day = toBanglaDigits(d.getDate());
    const month = banglaMonths[d.getMonth()];
    const year = toBanglaDigits(d.getFullYear());
    
    return `${day} ${month} ${year}`;
  }
  
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Format a date and time with locale-aware formatting
 * @param timestamp - Date string, timestamp, or Date object
 * @param locale - 'bn' for Bangla, 'en' for English
 * @returns Formatted date and time string
 */
export function formatDateTime(timestamp: string | number | Date, locale: 'bn' | 'en' = 'bn'): string {
  const d = new Date(timestamp);
  
  if (locale === 'bn') {
    const banglaMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    
    const day = toBanglaDigits(d.getDate());
    const month = banglaMonths[d.getMonth()];
    const year = toBanglaDigits(d.getFullYear());
    const hours = toBanglaDigits(d.getHours().toString().padStart(2, '0'));
    const minutes = toBanglaDigits(d.getMinutes().toString().padStart(2, '0'));
    
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  }
  
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Format a relative time (e.g., "5 minutes ago")
 * @param timestamp - Date string, timestamp, or Date object
 * @param locale - 'bn' for Bangla, 'en' for English
 * @returns Relative time string
 */
export function formatRelative(timestamp: string | number | Date, locale: 'bn' | 'en' = 'bn'): string {
  const d = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (locale === 'bn') {
    if (diffSecs < 60) return 'এইমাত্র';
    if (diffMins < 60) return `${toBanglaDigits(diffMins)} মিনিট আগে`;
    if (diffHours < 24) return `${toBanglaDigits(diffHours)} ঘণ্টা আগে`;
    if (diffDays === 1) return 'গতকাল';
    if (diffDays < 7) return `${toBanglaDigits(diffDays)} দিন আগে`;
    return formatDate(timestamp, 'bn');
  }
  
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  return formatDate(timestamp, 'en');
}

/**
 * Format a large number with abbreviations (K, M, B)
 * @param n - The number to format
 * @param locale - 'bn' for Bangla, 'en' for English
 * @returns Abbreviated number string
 */
export function formatCompact(n: number, locale: 'bn' | 'en' = 'bn'): string {
  if (n >= 1000000000) {
    const val = (n / 1000000000).toFixed(1);
    return locale === 'bn' ? `${toBanglaDigits(val)}B` : `${val}B`;
  }
  if (n >= 1000000) {
    const val = (n / 1000000).toFixed(1);
    return locale === 'bn' ? `${toBanglaDigits(val)}M` : `${val}M`;
  }
  if (n >= 1000) {
    const val = (n / 1000).toFixed(1);
    return locale === 'bn' ? `${toBanglaDigits(val)}K` : `${val}K`;
  }
  return formatNumber(n, locale);
}
