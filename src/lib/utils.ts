import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatMoney(amount: number, lang: 'bn' | 'en' = 'bn'): string {
  const formatted = new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  if (lang === 'bn') {
    return '৳' + toBanglaNumeral(formatted);
  }
  return '৳' + formatted;
}

export function toBanglaNumeral(input: string | number): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(input).replace(/[0-9]/g, (d) => banglaDigits[parseInt(d)]);
}

export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : 
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

export function generateWalletId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `CDB-${part1}-${part2}`;
}

export function generateReceiptCode(): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
  return `RCPT-${year}-${num}`;
}

export function formatDate(date: string | Date, lang: 'bn' | 'en' = 'bn'): string {
  const d = new Date(date);
  if (lang === 'bn') {
    const banglaMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const day = toBanglaNumeral(d.getDate());
    const month = banglaMonths[d.getMonth()];
    const year = toBanglaNumeral(d.getFullYear());
    return `${day} ${month} ${year}`;
  }
  return d.toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });
}
