import { LearnPageLayout } from './LearnPageLayout';
import { useAuthStore } from '../../store';

export function UnderstandingSharesPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  const content = {
    title: isBn ? 'শেয়ার বোঝা' : 'Understanding Shares',
    sections: isBn ? [
      {
        heading: 'শেয়ার কী?',
        paragraphs: [
          'শেয়ার হলো একটি ব্যবসার মালিকানার একটি অংশ। যখন আপনি একটি ব্যবসার শেয়ার কেনেন, আপনি সেই ব্যবসার আংশিক মালিক হন।',
          'উদাহরণস্বরূপ: একটি চা বাগানের মোট ১০,০০০ শেয়ার আছে। আপনি যদি ১০০ শেয়ার কেনেন, তাহলে আপনি চা বাগানের ১% মালিক।',
        ],
      },
      {
        heading: 'শেয়ারের মূল্য কীভাবে নির্ধারিত হয়?',
        paragraphs: [
          'প্রতিটি ব্যবসা তাদের শেয়ারের প্রাথমিক মূল্য নির্ধারণ করে। এটি প্রতিষ্ঠাতা ঠিক করেন।',
          'প্রাথমিক মার্কেটে শেয়ারের মূল্য পরিবর্তন হয় না। কিন্তু সেকেন্ডারি মার্কেটে ক্রয়-বিক্রয়ের উপর ভিত্তি করে মূল্য পরিবর্তন হতে পারে।',
          'যদি একটি ব্যবসা ভালো করে, বেশি মানুষ তার শেয়ার কিনতে চাইবে, ফলে মূল্য বাড়তে পারে।',
        ],
      },
      {
        heading: 'আপনার মালিকানা কীভাবে গণনা করা হয়?',
        paragraphs: [
          'আপনার মালিকানা = (আপনার শেয়ার সংখ্যা / মোট শেয়ার সংখ্যা) × ১০০%',
          'উদাহরণ: আপনি ১০০ শেয়ার কিনেছেন, মোট শেয়ার ১০,০০০। আপনার মালিকানা = (১০০/১০,০০০) × ১০০ = ১%',
        ],
      },
      {
        heading: 'শেয়ার থেকে কী পাবেন?',
        bullets: [
          'মালিকানা — ব্যবসার আংশিক মালিক হবেন',
          'লাভের অংশ — ব্যবসা লাভ করলে শেয়ারের মূল্য বাড়তে পারে',
          'ভোটিং অধিকার — কিছু গুরুত্বপূর্ণ সিদ্ধান্তে আপনার মতামত থাকবে',
          'তথ্য — ব্যবসার আপডেট এবং আর্থিক তথ্য পাবেন',
          'বিক্রয়যোগ্যতা — শেয়ার অন্যদের কাছে বিক্রি করতে পারবেন',
        ],
      },
      {
        heading: 'শেয়ারের ধরন',
        paragraphs: [
          'Capital De Benchmark-এ সব শেয়ার সাধারণ শেয়ার (common shares)। এগুলোর মালিকানা, ভোটিং অধিকার, এবং লাভের অংশ সমান।',
          'প্রতিটি শেয়ার একটি রসিদ (receipt) হিসেবে থাকে। এটি আপনার মালিকানার প্রমাণ।',
        ],
      },
    ] : [
      {
        heading: 'What is a Share?',
        paragraphs: [
          'A share represents a unit of ownership in a business. When you buy shares in a business, you become a partial owner of that business.',
          'For example: A tea garden has 10,000 total shares. If you buy 100 shares, you own 1% of the tea garden.',
        ],
      },
      {
        heading: 'How is Share Price Determined?',
        paragraphs: [
          'Each business sets an initial price for their shares. This is decided by the founder.',
          'In the primary market, share prices don\'t change. But in the secondary market, prices can change based on buying and selling.',
          'If a business performs well, more people will want to buy its shares, which may increase the price.',
        ],
      },
      {
        heading: 'How is Your Ownership Calculated?',
        paragraphs: [
          'Your ownership = (Your shares / Total shares) × 100%',
          'Example: You bought 100 shares, total shares are 10,000. Your ownership = (100/10,000) × 100 = 1%',
        ],
      },
      {
        heading: 'What Do You Get from Shares?',
        bullets: [
          'Ownership — You become a partial owner of the business',
          'Profit participation — If the business prospers, share value may increase',
          'Voting rights — Your opinion matters in some important decisions',
          'Information — You receive business updates and financial information',
          'Liquidity — You can sell shares to others',
        ],
      },
      {
        heading: 'Types of Shares',
        paragraphs: [
          'On Capital De Benchmark, all shares are common shares. They have equal ownership, voting rights, and profit participation.',
          'Each share is held as a receipt. This is proof of your ownership.',
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
