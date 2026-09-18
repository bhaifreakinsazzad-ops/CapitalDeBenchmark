import { LearnPageLayout } from './LearnPageLayout';
import { useAuthStore } from '../../store';

export function HowToStartPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  const content = {
    title: isBn ? 'কীভাবে শুরু করবেন' : 'How to Start',
    sections: isBn ? [
      {
        heading: '৫টি সহজ ধাপে শুরু করুন',
        paragraphs: [
          'Capital De Benchmark-এ বিনিয়োগ শুরু করা খুবই সহজ। নিচের ধাপগুলো অনুসরণ করুন:',
        ],
      },
      {
        heading: 'ধাপ ১: অ্যাকাউন্ট তৈরি করুন',
        paragraphs: [
          'আপনার মোবাইল নম্বর দিয়ে রেজিস্টার করুন। একটি শক্তিশালী পাসওয়ার্ড বেছে নিন।',
          'রেজিস্ট্রেশনের পর আপনাকে একটি অনবোর্ডিং প্রক্রিয়ার মধ্য দিয়ে যেতে হবে।',
        ],
      },
      {
        heading: 'ধাপ ২: KYC যাচাইকরণ সম্পন্ন করুন',
        paragraphs: [
          'সবাইকে সুরক্ষিত রাখতে, আমরা আপনার পরিচয় যাচাই করি। এটি বাধ্যতামূলক।',
          'আপনার জাতীয় পরিচয়পত্র (NID), বর্তমান ঠিকানা, এবং একটি সেলফি আপলোড করুন।',
          'সাধারণত ১ ঘণ্টার মধ্যে যাচাইকরণ সম্পন্ন হয়।',
        ],
      },
      {
        heading: 'ধাপ ৩: ওয়ালেটে টাকা যোগ করুন',
        paragraphs: [
          'bKash, Nagad, Rocket, বা Upay ব্যবহার করে ওয়ালেট রিচার্জ করুন।',
          'প্ল্যাটফর্মের নির্দিষ্ট নম্বরে টাকা পাঠান এবং TrxID জমা দিন।',
          'অ্যাডমিন যাচাই করার পর টাকা আপনার ওয়ালেটে যোগ হবে।',
        ],
      },
      {
        heading: 'ধাপ ৪: ব্যবসা ব্রাউজ করুন',
        paragraphs: [
          'বাজার পৃষ্ঠায় গিয়ে যাচাইকৃত ব্যবসাগুলো দেখুন।',
          'প্রতিটি ব্যবসার গল্প, আর্থিক তথ্য, এবং আপডেট পড়ুন।',
          'আপনার পছন্দের ব্যবসা খুঁজে বের করুন।',
        ],
      },
      {
        heading: 'ধাপ ৫: বিনিয়োগ করুন',
        paragraphs: [
          'যে ব্যবসায় বিনিয়োগ করতে চান, সেই পৃষ্ঠায় যান।',
          'কতটি শেয়ার কিনবেন তা নির্বাচন করুন।',
          'বিনিয়োগ নিশ্চিত করুন। আপনার শেয়ার সাথে সাথেই আপনার পোর্টফোলিওতে যোগ হবে।',
        ],
      },
      {
        heading: 'পরবর্তী পদক্ষেপ',
        paragraphs: [
          'বিনিয়োগ করার পর, আপনি ব্যবসার আপডেট পেতে থাকবেন।',
          'আপনি চাইলে আপনার শেয়ার সেকেন্ডারি মার্কেটে বিক্রি করতে পারবেন।',
          'একাধিক ব্যবসায় বিনিয়োগ করে আপনার পোর্টফোলিও বৈচিত্র্যময় করুন।',
        ],
      },
    ] : [
      {
        heading: 'Start in 5 Easy Steps',
        paragraphs: [
          'Starting to invest on Capital De Benchmark is very simple. Follow these steps:',
        ],
      },
      {
        heading: 'Step 1: Create an Account',
        paragraphs: [
          'Register with your mobile number. Choose a strong password.',
          'After registration, you\'ll go through an onboarding process.',
        ],
      },
      {
        heading: 'Step 2: Complete KYC Verification',
        paragraphs: [
          'To keep everyone safe, we verify your identity. This is mandatory.',
          'Upload your National ID (NID), present address, and a selfie.',
          'Verification is usually completed within 1 hour.',
        ],
      },
      {
        heading: 'Step 3: Add Money to Your Wallet',
        paragraphs: [
          'Recharge your wallet using bKash, Nagad, Rocket, or Upay.',
          'Send money to the platform\'s specified number and submit the TrxID.',
          'After admin verification, the money will be added to your wallet.',
        ],
      },
      {
        heading: 'Step 4: Browse Businesses',
        paragraphs: [
          'Go to the Market page to see verified businesses.',
          'Read each business\'s story, financial information, and updates.',
          'Find businesses that interest you.',
        ],
      },
      {
        heading: 'Step 5: Invest',
        paragraphs: [
          'Go to the page of the business you want to invest in.',
          'Select how many shares you want to buy.',
          'Confirm your investment. Your shares will be added to your portfolio immediately.',
        ],
      },
      {
        heading: 'Next Steps',
        paragraphs: [
          'After investing, you\'ll start receiving updates from the business.',
          'You can sell your shares on the secondary market if you wish.',
          'Diversify your portfolio by investing in multiple businesses.',
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
        </section>
      ))}
    </LearnPageLayout>
  );
}
