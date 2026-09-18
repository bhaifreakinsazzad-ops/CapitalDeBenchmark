import { LearnPageLayout } from './LearnPageLayout';
import { useAuthStore } from '../../store';

export function WhatIsMicroInvestingPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  const content = {
    title: isBn ? 'মাইক্রো-ইনভেস্টমেন্ট কী?' : 'What is Micro-Investing?',
    sections: isBn ? [
      {
        heading: 'মাইক্রো-ইনভেস্টমেন্টের মূল কথা',
        paragraphs: [
          'মাইক্রো-ইনভেস্টমেন্ট হলো ছোট পরিমাণ অর্থ দিয়ে ব্যবসায় বিনিয়োগ করার পদ্ধতি। Capital De Benchmark-এ আপনি মাত্র ৳৫ থেকে শুরু করতে পারেন।',
          'এটি ঐতিহ্যগত শেয়ার বাজারের মতো, কিন্তু অনেক বেশি সহজ এবং সুলভ। আপনি সরাসরি বাংলাদেশের যাচাইকৃত ব্যবসায় বিনিয়োগ করেন।',
        ],
      },
      {
        heading: 'কীভাবে কাজ করে?',
        paragraphs: [
          'প্রতিটি ব্যবসা তাদের শেয়ার নির্দিষ্ট মূল্যে বিক্রি করে। আপনি যত শেয়ার কিনবেন, ব্যবসায় আপনার মালিকানা তত বাড়বে।',
          'উদাহরণস্বরূপ: একটি ব্যবসার মোট ১০,০০০ শেয়ার আছে। আপনি যদি ১০০ শেয়ার কেনেন, তাহলে আপনার ১% মালিকানা থাকবে।',
          'ব্যবসা লাভ করলে আপনার শেয়ারের মূল্য বাড়তে পারে। আপনি চাইলে এই শেয়ার অন্যদের কাছে বিক্রি করতে পারবেন।',
        ],
      },
      {
        heading: 'কেন মাইক্রো-ইনভেস্টমেন্ট?',
        bullets: [
          '৳৫ থেকে শুরু করা যায় — বড় পুঁজির প্রয়োজন নেই',
          'আসল ব্যবসায় বিনিয়োগ — কাল্পনিক কিছু নয়',
          'স্বচ্ছতা — প্রতিটি ব্যবসার তথ্য দেখতে পাবেন',
          'তরলতা — শেয়ার বিক্রি করে টাকা তুলতে পারবেন',
          'বৈচিত্র্য — বিভিন্ন ব্যবসায় বিনিয়োগ করে ঝুঁকি কমাতে পারবেন',
        ],
      },
      {
        heading: 'গুরুত্বপূর্ণ বিষয়',
        paragraphs: [
          'বিনিয়োগে সবসময় ঝুঁকি থাকে। ব্যবসা ক্ষতিগ্রস্ত হলে আপনি আপনার বিনিয়োগকৃত টাকা হারাতে পারেন।',
          'তাই শুধু সেই টাকা বিনিয়োগ করুন যা হারালেও আপনার জীবনযাত্রায় বড় প্রভাব পড়বে না।',
          'Capital De Benchmark কোনো লাভের নিশ্চয়তা দেয় না। আমরা শুধু বিনিয়োগের সুযোগ তৈরি করে দিই।',
        ],
      },
    ] : [
      {
        heading: 'The Basics of Micro-Investing',
        paragraphs: [
          'Micro-investing is the practice of investing small amounts of money in businesses. On Capital De Benchmark, you can start with as little as ৳5.',
          'It\'s similar to traditional stock markets, but much more accessible and affordable. You invest directly in verified Bangladeshi businesses.',
        ],
      },
      {
        heading: 'How Does It Work?',
        paragraphs: [
          'Each business sells shares at a specific price. The more shares you buy, the larger your ownership stake in the business.',
          'For example: A business has 10,000 total shares. If you buy 100 shares, you\'ll own 1% of the business.',
          'If the business prospers, your shares may increase in value. You can also sell your shares to other investors if you wish.',
        ],
      },
      {
        heading: 'Why Micro-Investing?',
        bullets: [
          'Start from ৳5 — no need for large capital',
          'Invest in real businesses — not something imaginary',
          'Transparency — you can see information about every business',
          'Liquidity — you can sell shares to withdraw your money',
          'Diversification — spread risk by investing in multiple businesses',
        ],
      },
      {
        heading: 'Important Considerations',
        paragraphs: [
          'Investment always carries risk. If a business fails, you may lose your invested money.',
          'Therefore, only invest money that you can afford to lose without significantly impacting your lifestyle.',
          'Capital De Benchmark does not guarantee any returns. We only provide the opportunity to invest.',
        ],
      },
    ],
  };

  return (
    <LearnPageLayout title={content.title}>
      {content.sections.map((section, idx) => (
        <section key={idx} className="mb-8">
          <h2 className="text-2xl font-semibold text-brand-text mb-4">
            {section.heading}
          </h2>
          {section.paragraphs?.map((para, pIdx) => (
            <p key={pIdx} className="text-brand-muted leading-relaxed mb-4">
              {para}
            </p>
          ))}
          {section.bullets && (
            <ul className="space-y-2 mb-4">
              {section.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className="flex items-start gap-2 text-brand-muted">
                  <span className="text-brand-accent mt-1">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </LearnPageLayout>
  );
}
