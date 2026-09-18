import { LearnPageLayout } from './LearnPageLayout';
import { useAuthStore } from '../../store';

export function HowPricesMovePage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <LearnPageLayout title={isBn ? 'মূল্য কীভাবে পরিবর্তন হয়' : 'How Prices Move'}>
      <div className="prose prose-invert max-w-none">
        <p className="text-brand-muted mb-4">
          {isBn 
            ? 'শেয়ারের মূল্য চাহিদা এবং যোগানের উপর ভিত্তি করে পরিবর্তন হয়। যখন বেশি মানুষ একটি শেয়ার কিনতে চায়, মূল্য বাড়ে। যখন বেশি মানুষ বিক্রি করতে চায়, মূল্য কমে।'
            : 'Share prices change based on supply and demand. When more people want to buy a share, the price goes up. When more people want to sell, the price goes down.'}
        </p>

        <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">
          {isBn ? 'প্রাথমিক বনাম সেকেন্ডারি মার্কেট' : 'Primary vs Secondary Market'}
        </h2>
        <p className="text-brand-muted mb-4">
          {isBn 
            ? 'প্রাথমিক মার্কেটে, মূল্য স্থির থাকে — এটি প্রতিষ্ঠাতা দ্বারা নির্ধারিত হয়। সেকেন্ডারি মার্কেটে, মূল্য ট্রেডিং এর উপর ভিত্তি করে পরিবর্তন হয়।'
            : 'In the primary market, the price is fixed — it\'s set by the founder. In the secondary market, the price changes based on trading.'}
        </p>

        <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">
          {isBn ? 'মূল্য প্রভাবিত করে এমন বিষয়' : 'Factors Affecting Price'}
        </h2>
        <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
          <li>{isBn ? 'ব্যবসার পারফরম্যান্স' : 'Business performance'}</li>
          <li>{isBn ? 'বাজারের অবস্থা' : 'Market conditions'}</li>
          <li>{isBn ? 'বিনিয়োগকারীর আত্মবিশ্বাস' : 'Investor confidence'}</li>
          <li>{isBn ? 'শেয়ারের প্রাপ্যতা' : 'Share availability'}</li>
        </ul>

        <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">
          {isBn ? 'ট্রেডিং কৌশল' : 'Trading Strategies'}
        </h2>
        <p className="text-brand-muted mb-4">
          {isBn 
            ? 'আপনি লিমিট অর্ডার (নির্দিষ্ট মূল্যে কিনুন/বিক্রয় করুন) বা মার্কেট অর্ডার (বর্তমান মূল্যে দ্রুত কিনুন/বিক্রয় করুন) ব্যবহার করতে পারেন।'
            : 'You can use limit orders (buy/sell at a specific price) or market orders (buy/sell quickly at current price).'}
        </p>
      </div>
    </LearnPageLayout>
  );
}
