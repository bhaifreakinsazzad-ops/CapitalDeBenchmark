import { LearnPageLayout } from './LearnPageLayout';
import { useAuthStore } from '../../store';

export function GlossaryPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  const terms = [
    {
      term: isBn ? 'শেয়ার' : 'Share',
      definition: isBn ? 'একটি ব্যবসার মালিকানার একটি ইউনিট' : 'A unit of ownership in a business',
    },
    {
      term: isBn ? 'প্রাথমিক মার্কেট' : 'Primary Market',
      definition: isBn ? 'যেখানে ব্যবসা প্রথমবারের মতো শেয়ার বিক্রি করে' : 'Where businesses sell shares for the first time',
    },
    {
      term: isBn ? 'সেকেন্ডারি মার্কেট' : 'Secondary Market',
      definition: isBn ? 'যেখানে বিনিয়োগকারীরা একে অপরের কাছে শেয়ার কিনে ও বিক্রি করে' : 'Where investors buy and sell shares from each other',
    },
    {
      term: isBn ? 'অর্ডার বুক' : 'Order Book',
      definition: isBn ? 'সমস্ত কেনা ও বিক্রয়ের অর্ডারের তালিকা' : 'List of all buy and sell orders',
    },
    {
      term: isBn ? 'বিড' : 'Bid',
      definition: isBn ? 'একটি শেয়ার কেনার জন্য প্রস্তাবিত মূল্য' : 'Proposed price to buy a share',
    },
    {
      term: isBn ? 'আস্ক' : 'Ask',
      definition: isBn ? 'একটি শেয়ার বিক্রির জন্য প্রস্তাবিত মূল্য' : 'Proposed price to sell a share',
    },
    {
      term: isBn ? 'এসক্রো' : 'Escrow',
      definition: isBn ? 'তৃতীয় পক্ষ দ্বারা ধারণ করা টাকা, শর্ত পূরণ না হওয়া পর্যন্ত' : 'Money held by a third party until conditions are met',
    },
    {
      term: isBn ? 'মাইলস্টোন' : 'Milestone',
      definition: isBn ? 'একটি ব্যবসার জন্য নির্দিষ্ট তহবিল লক্ষ্য' : 'A specific funding target for a business',
    },
    {
      term: isBn ? 'রসিদ' : 'Receipt',
      definition: isBn ? 'আপনার বিনিয়োগের প্রমাণ' : 'Proof of your investment',
    },
    {
      term: isBn ? 'ট্রাস্ট স্কোর' : 'Trust Score',
      definition: isBn ? 'একটি ব্যবসার নির্ভরযোগ্যতার পরিমাপ (০-১০০)' : 'A measure of a business\'s reliability (0-100)',
    },
    {
      term: 'KYC',
      definition: isBn ? 'আপনার পরিচয় যাচাইকরণ প্রক্রিয়া' : 'Know Your Customer - identity verification process',
    },
    {
      term: 'MFS',
      definition: isBn ? 'মোবাইল ফাইন্যান্সিয়াল সার্ভিসেস (bKash, Nagad, ইত্যাদি)' : 'Mobile Financial Services (bKash, Nagad, etc.)',
    },
    {
      term: isBn ? 'হোল্ডিং' : 'Holding',
      definition: isBn ? 'আপনার দ্বারা ধারণ করা শেয়ার' : 'Shares you own',
    },
    {
      term: isBn ? 'পোর্টফোলিও' : 'Portfolio',
      definition: isBn ? 'আপনার সমস্ত বিনিয়োগের সংগ্রহ' : 'Collection of all your investments',
    },
    {
      term: isBn ? 'লভ্যাংশ' : 'Dividend',
      definition: isBn ? 'লাভ থেকে বিনিয়োগকারীদের প্রদান (যদি প্রযোজ্য হয়)' : 'Payment to investors from profits (if applicable)',
    },
    {
      term: isBn ? 'প্রতিষ্ঠাতা' : 'Founder',
      definition: isBn ? 'একটি ব্যবসার মালিক/উদ্যোক্তা' : 'Owner/entrepreneur of a business',
    },
    {
      term: isBn ? 'বাইব্যাক' : 'Buyback',
      definition: isBn ? 'যখন একটি ব্যবসা তার নিজের শেয়ার কিনে নেয়' : 'When a business buys back its own shares',
    },
    {
      term: 'CTR',
      definition: isBn ? 'ক্লিক-থ্রু রেট - বিজ্ঞাপনে ক্লিকের হার' : 'Click-Through Rate - percentage of ad clicks',
    },
    {
      term: isBn ? 'ট্রেড' : 'Trade',
      definition: isBn ? 'শেয়ার কেনা বা বিক্রি করার কৃত্য' : 'The act of buying or selling shares',
    },
    {
      term: isBn ? 'বৈচিত্র্যকরণ' : 'Diversification',
      definition: isBn ? 'ঝুঁকি কমাতে একাধিক ব্যবসায় বিনিয়োগ' : 'Investing in multiple businesses to reduce risk',
    },
  ];

  return (
    <LearnPageLayout title={isBn ? 'শব্দকোষ' : 'Glossary'}>
      <div className="prose prose-invert max-w-none">
        <p className="text-brand-muted mb-6">
          {isBn 
            ? 'Capital De Benchmark-এ ব্যবহৃত গুরুত্বপূর্ণ পরিভাষা।'
            : 'Important terms used in Capital De Benchmark.'}
        </p>

        <div className="space-y-4">
          {terms.map((item, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-semibold text-brand-accent mb-2">
                {item.term}
              </h3>
              <p className="text-brand-muted">
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </div>
    </LearnPageLayout>
  );
}
