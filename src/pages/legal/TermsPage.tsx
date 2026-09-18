import { LegalPageLayout } from './LegalPageLayout';
import { useAuthStore } from '../../store';

export function TermsPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <LegalPageLayout title={isBn ? 'সেবার শর্তাবলী' : 'Terms of Service'}>
      {isBn ? (
        <>
          <p className="text-brand-muted mb-4">
            Capital De Benchmark ("প্ল্যাটফর্ম", "আমরা", "আমাদের") ব্যবহার করে, আপনি এই শর্তাবলী ("শর্তাবলী") মেনে চলতে সম্মত হচ্ছেন।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">১. যোগ্যতা</h2>
          <p className="text-brand-muted mb-4">
            আপনি অবশ্যই ১৮ বছর বা তার বেশি বয়সী হতে হবে এবং বাংলাদেশের বৈধ নাগরিক বা স্থায়ী বাসিন্দা হতে হবে। আপনি এই শর্তাবলী মেনে চলতে সক্ষম হতে হবে।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">২. অ্যাকাউন্ট এবং KYC</h2>
          <p className="text-brand-muted mb-4">
            বিনিয়োগ করতে, আপনাকে অবশ্যই:
          </p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>একটি অ্যাকাউন্ট তৈরি করতে হবে</li>
            <li>KYC যাচাইকরণ সম্পন্ন করতে হবে (জাতীয় পরিচয়পত্র, ঠিকানা প্রমাণ)</li>
            <li>সঠিক এবং সম্পূর্ণ তথ্য প্রদান করতে হবে</li>
            <li>আপনার অ্যাকাউন্টের নিরাপত্তা বজায় রাখতে হবে</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">৩. বিনিয়োগের প্রকৃতি</h2>
          <p className="text-brand-muted mb-4">
            Capital De Benchmark একটি মাইক্রো-ইনভেস্টমেন্ট প্ল্যাটফর্ম যা যাচাইকৃত বাংলাদেশী ব্যবসায় বিনিয়োগের সুযোগ প্রদান করে। গুরুত্বপূর্ণ বিষয়:
          </p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>বিনিয়োগ ঝুঁকিপূর্ণ এবং আপনি আপনার বিনিয়োগকৃত টাকা হারাতে পারেন</li>
            <li>কোনো লাভের নিশ্চয়তা নেই</li>
            <li>ব্যবসার পারফরম্যান্সের উপর ভিত্তি করে শেয়ারের মূল্য পরিবর্তন হতে পারে</li>
            <li>আপনি সেকেন্ডারি মার্কেটে আপনার শেয়ার বিক্রি করতে পারেন, কিন্তু ক্রেতা পাওয়ার নিশ্চয়তা নেই</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">৪. প্ল্যাটফর্মের ভূমিকা</h2>
          <p className="text-brand-muted mb-4">
            Capital De Benchmark একটি এসক্রো কার্স্টোডিয়ান হিসেবে কাজ করে। আমরা:
          </p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>ব্যবসা যাচাই করি কিন্তু তাদের পারফরম্যান্সের গ্যারান্টি দিই না</li>
            <li>লেনদেন সুবিধা প্রদান করি কিন্তু বিনিয়োগ পরামর্শ দিই না</li>
            <li>আপনার টাকা নিরাপদে সংরক্ষণ করি কিন্তু বাজার ঝুঁকি থেকে রক্ষা করি না</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">৫. দায়িত্বের সীমাবদ্ধতা</h2>
          <p className="text-brand-muted mb-4">
            আইন দ্বারা অনুমোদিত সর্বোচ্চ পরিমাণ পর্যন্ত, Capital De Benchmark কোনো পরোক্ষ, আকস্মিক, বিশেষ, বা পরিণতিমূলক ক্ষতির জন্য দায়ী থাকবে না। আমাদের মোট দায় আপনার বিনিয়োগকৃত পরিমাণের মধ্যে সীমাবদ্ধ থাকবে।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">৬. সমাপ্তি</h2>
          <p className="text-brand-muted mb-4">
            আমরা যেকোনো সময় আপনার অ্যাকাউন্ট স্থগিত বা সমাপ্ত করতে পারি যদি আপনি এই শর্তাবলী লঙ্ঘন করেন। আপনি যেকোনো সময় আপনার অ্যাকাউন্ট বন্ধ করতে পারেন।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">৭. প্রযোজ্য আইন</h2>
          <p className="text-brand-muted mb-4">
            এই শর্তাবলী বাংলাদেশের আইন দ্বারা নিয়ন্ত্রিত হবে। কোনো বিরোধ ঢাকার আদালতে নিষ্পত্তি করা হবে।
          </p>
        </>
      ) : (
        <>
          <p className="text-brand-muted mb-4">
            By using Capital De Benchmark ("Platform", "we", "us", "our"), you agree to be bound by these Terms of Service ("Terms").
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">1. Eligibility</h2>
          <p className="text-brand-muted mb-4">
            You must be at least 18 years old and a legal resident or citizen of Bangladesh. You must have the capacity to agree to these Terms.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">2. Account and KYC</h2>
          <p className="text-brand-muted mb-4">
            To invest, you must:
          </p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>Create an account</li>
            <li>Complete KYC verification (National ID, proof of address)</li>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">3. Nature of Investments</h2>
          <p className="text-brand-muted mb-4">
            Capital De Benchmark is a micro-investment platform that provides opportunities to invest in verified Bangladeshi businesses. Important considerations:
          </p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>Investments are risky and you may lose your invested money</li>
            <li>There are no guaranteed returns</li>
            <li>Share prices may fluctuate based on business performance</li>
            <li>You can sell your shares on the secondary market, but there's no guarantee of finding a buyer</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">4. Platform's Role</h2>
          <p className="text-brand-muted mb-4">
            Capital De Benchmark acts as an escrow custodian. We:
          </p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>Verify businesses but do not guarantee their performance</li>
            <li>Facilitate transactions but do not provide investment advice</li>
            <li>Safeguard your funds but do not protect against market risk</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">5. Limitation of Liability</h2>
          <p className="text-brand-muted mb-4">
            To the maximum extent permitted by law, Capital De Benchmark shall not be liable for any indirect, incidental, special, or consequential damages. Our total liability shall be limited to the amount you invested.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">6. Termination</h2>
          <p className="text-brand-muted mb-4">
            We may suspend or terminate your account at any time if you violate these Terms. You may close your account at any time.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">7. Governing Law</h2>
          <p className="text-brand-muted mb-4">
            These Terms shall be governed by the laws of Bangladesh. Any disputes shall be resolved in the courts of Dhaka.
          </p>
        </>
      )}
    </LegalPageLayout>
  );
}
