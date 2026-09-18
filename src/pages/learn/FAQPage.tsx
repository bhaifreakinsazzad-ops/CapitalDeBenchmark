import { LearnPageLayout } from './LearnPageLayout';
import { useAuthStore } from '../../store';

export function FAQPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  const faqs = [
    {
      question: isBn ? 'আমি কি আমার সমস্ত টাকা হারাতে পারি?' : 'Can I lose all my money?',
      answer: isBn 
        ? 'হ্যাঁ, বিনিয়োগে ঝুঁকি আছে। ব্যবসা ব্যর্থ হলে আপনি আপনার বিনিয়োগ হারাতে পারেন। শুধুমাত্র সেই টাকা বিনিয়োগ করুন যা আপনি হারাতে পারবেন।'
        : 'Yes, investments carry risk. If a business fails, you may lose your investment. Only invest money you can afford to lose.',
    },
    {
      question: isBn ? 'ব্যবসা যদি উধাও হয়ে যায়?' : 'What if the business disappears?',
      answer: isBn 
        ? 'সব ব্যবসা আমাদের দ্বারা যাচাই করা হয়। তবে, যদি কোনো ব্যবসা বন্ধ হয়ে যায়, আপনি আপনার বিনিয়োগ হারাতে পারেন।'
        : 'All businesses are verified by us. However, if a business closes down, you may lose your investment.',
    },
    {
      question: isBn ? 'কীভাবে উত্তোলন করব?' : 'How do I withdraw?',
      answer: isBn 
        ? 'ওয়ালেট পেজে যান, "উত্তোলন" এ ক্লিক করুন, আপনার MFS নম্বর এবং পরিমাণ লিখুন। অ্যাডমিন অনুমোদনের পর ২৪ ঘণ্টার মধ্যে টাকা পাবেন।'
        : 'Go to Wallet page, click "Withdraw", enter your MFS number and amount. After admin approval, you\'ll receive funds within 24 hours.',
    },
    {
      question: isBn ? 'আমার টাকা কি নিরাপদ?' : 'Is my money safe?',
      answer: isBn 
        ? 'আপনার টাকা এসক্রোতে থাকে। মাইলস্টোন ফান্ডিং এর ক্ষেত্রে, লক্ষ্য অর্জিত না হলে আপনি স্বয়ংক্রিয় ফেরত পাবেন।'
        : 'Your money is held in escrow. For milestone funding, you\'ll get automatic refund if the target is not reached.',
    },
    {
      question: isBn ? 'রসিদ কী?' : 'What is a receipt?',
      answer: isBn 
        ? 'রসিদ হলো আপনার বিনিয়োগের ডিজিটাল প্রমাণ। এটি আপনার শেয়ারের মালিকানা প্রদর্শন করে।'
        : 'A receipt is digital proof of your investment. It shows your ownership of shares.',
    },
    {
      question: isBn ? 'আমি কি আমার শেয়ার বিক্রি করতে পারি?' : 'Can I sell my shares?',
      answer: isBn 
        ? 'হ্যাঁ, আপনি সেকেন্ডারি মার্কেটে আপনার শেয়ার বিক্রি করতে পারেন। তবে, ক্রেতা পাওয়ার নিশ্চয়তা নেই।'
        : 'Yes, you can sell your shares on the secondary market. However, there\'s no guarantee of finding a buyer.',
    },
    {
      question: isBn ? 'মাইলস্টোন অর্জিত না হলে কী হবে?' : 'What happens if a milestone is not reached?',
      answer: isBn 
        ? 'সমস্ত বিনিয়োগকারী স্বয়ংক্রিয়ভাবে তাদের টাকা ফেরত পাবেন। ব্যবসা স্থগিত করা হবে।'
        : 'All investors will automatically receive refunds. The business will be suspended.',
    },
    {
      question: isBn ? 'কে ব্যবসা যাচাই করে?' : 'Who verifies businesses?',
      answer: isBn 
        ? 'আমাদের অ্যাডমিন টিম প্রতিটি ব্যবসার নথি, তথ্য, এবং বৈধতা যাচাই করে।'
        : 'Our admin team verifies each business\'s documents, information, and legitimacy.',
    },
    {
      question: isBn ? 'কোনো ফি আছে কি?' : 'Are there any fees?',
      answer: isBn 
        ? 'বর্তমানে, বিনিয়োগ বা ট্রেডিং এর জন্য কোনো ফি নেই। ভবিষ্যতে ছোট ফি প্রবর্তন করা হতে পারে।'
        : 'Currently, there are no fees for investing or trading. Small fees may be introduced in the future.',
    },
    {
      question: isBn ? 'আমি কি বাংলাদেশের বাইরে থেকে বিনিয়োগ করতে পারি?' : 'Can I invest from outside Bangladesh?',
      answer: isBn 
        ? 'বর্তমানে, শুধুমাত্র বাংলাদেশী নাগরিকরা bKash/Nagad/Rocket/Upay ব্যবহার করে বিনিয়োগ করতে পারেন।'
        : 'Currently, only Bangladeshi citizens can invest using bKash/Nagad/Rocket/Upay.',
    },
    {
      question: isBn ? 'ন্যূনতম বিনিয়োগ কত?' : 'What is the minimum investment?',
      answer: isBn 
        ? 'ন্যূনতম বিনিয়োগ ৳৫। আপনি ৳৫ থেকে শুরু করতে পারেন।'
        : 'Minimum investment is ৳5. You can start from ৳5.',
    },
    {
      question: isBn ? 'আমি কীভাবে ব্যবসার আপডেট পাব?' : 'How do I get business updates?',
      answer: isBn 
        ? 'আপনি একটি ব্যবসা ফলো করলে, তাদের সমস্ত আপডেট আপনার ফিডে দেখাবে।'
        : 'When you follow a business, all their updates will appear in your feed.',
    },
    {
      question: isBn ? 'ট্রাস্ট স্কোর কী?' : 'What is a trust score?',
      answer: isBn 
        ? 'ট্রাস্ট স্কোর (০-১০০) একটি ব্যবসার নির্ভরযোগ্যতা এবং কার্যকলাপের পরিমাপ। উচ্চ স্কোর = বেশি নির্ভরযোগ্য।'
        : 'Trust score (0-100) measures a business\'s reliability and activity. Higher score = more reliable.',
    },
    {
      question: isBn ? 'আমি কি একাধিক ব্যবসায় বিনিয়োগ করতে পারি?' : 'Can I invest in multiple businesses?',
      answer: isBn 
        ? 'হ্যাঁ, আপনি একাধিক ব্যবসায় বিনিয়োগ করতে পারেন। এটি ঝুঁকি কমাতে সাহায্য করে।'
        : 'Yes, you can invest in multiple businesses. This helps reduce risk.',
    },
    {
      question: isBn ? 'সমস্যা হলে কাকে জানাব?' : 'Who do I contact if there\'s a problem?',
      answer: isBn 
        ? 'support@capitaldebenchmark.com ইমেইল করুন বা প্ল্যাটফর্মের "অভিযোগ প্রতিকার" পেজ দেখুন।'
        : 'Email support@capitaldebenchmark.com or visit the "Grievance Redressal" page on the platform.',
    },
  ];

  return (
    <LearnPageLayout title={isBn ? 'প্রশ্নোত্তর' : 'FAQ'}>
      <div className="prose prose-invert max-w-none">
        <p className="text-brand-muted mb-6">
          {isBn 
            ? 'সাধারণ প্রশ্নের উত্তর।'
            : 'Answers to common questions.'}
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-semibold text-brand-text mb-2">
                {faq.question}
              </h3>
              <p className="text-brand-muted">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </LearnPageLayout>
  );
}
