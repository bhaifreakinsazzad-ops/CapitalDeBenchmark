import { LegalPageLayout } from './LegalPageLayout';
import { useAuthStore } from '../../store';

export function PrivacyPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <LegalPageLayout title={isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}>
      {isBn ? (
        <>
          <p className="text-brand-muted mb-4">
            Capital De Benchmark আপনার গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। এই নীতি ব্যাখ্যা করে আমরা কী ডেটা সংগ্রহ করি, কেন করি, এবং কীভাবে রক্ষা করি।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">১. আমরা কী ডেটা সংগ্রহ করি</h2>
          <p className="text-brand-muted mb-4">ব্যক্তিগত তথ্য:</p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>নাম, ফোন নম্বর, ইমেইল</li>
            <li>জাতীয় পরিচয়পত্র নম্বর এবং ছবি</li>
            <li>ঠিকানা এবং WhatsApp নম্বর</li>
            <li>ওয়ালেট লেনদেন এবং বিনিয়োগ ইতিহাস</li>
            <li>ডিভাইস এবং ব্যবহারের ডেটা</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">২. কেন আমরা ডেটা সংগ্রহ করি</h2>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>অ্যাকাউন্ট তৈরি এবং যাচাইকরণ</li>
            <li>লেনদেন প্রক্রিয়াকরণ</li>
            <li>আইনি বাধ্যবাধকতা পূরণ (KYC/AML)</li>
            <li>প্ল্যাটফর্ম উন্নত করা</li>
            <li>নিরাপত্তা নিশ্চিত করা</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">৩. ডেটা শেয়ারিং</h2>
          <p className="text-brand-muted mb-4">আমরা নিম্নলিখিত ক্ষেত্রে ডেটা শেয়ার করি:</p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>পেমেন্ট প্রোভাইডার (bKash, Nagad, ইত্যাদি)</li>
            <li>SMS এবং ইমেইল প্রোভাইডার</li>
            <li>আইনি প্রয়োজনে সরকারি সংস্থা</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">৪. আপনার অধিকার</h2>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>আপনার ডেটা অ্যাক্সেস করার অধিকার</li>
            <li>ভুল ডেটা সংশোধন করার অধিকার</li>
            <li>ডেটা মুছে ফেলার অনুরোধ করার অধিকার</li>
            <li>ডেটা পোর্টেবিলিটি</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">৫. ডেটা সংরক্ষণ</h2>
          <p className="text-brand-muted mb-4">
            আমরা KYC ডকুমেন্ট ৫ বছর সংরক্ষণ করি (আইনি বাধ্যবাধকতা)। অন্যান্য ডেটা অ্যাকাউন্ট বন্ধ করার ৩০ দিন পর মুছে ফেলা হয়।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">৬. যোগাযোগ</h2>
          <p className="text-brand-muted mb-4">
            গোপনীয়তা সংক্রান্ত প্রশ্নের জন্য: privacy@capitaldebenchmark.com
          </p>
        </>
      ) : (
        <>
          <p className="text-brand-muted mb-4">
            Capital De Benchmark is committed to protecting your privacy. This policy explains what data we collect, why, and how we protect it.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">1. What Data We Collect</h2>
          <p className="text-brand-muted mb-4">Personal Information:</p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>Name, phone number, email</li>
            <li>National ID number and photos</li>
            <li>Address and WhatsApp number</li>
            <li>Wallet transactions and investment history</li>
            <li>Device and usage data</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">2. Why We Collect Data</h2>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>Account creation and verification</li>
            <li>Processing transactions</li>
            <li>Meeting legal obligations (KYC/AML)</li>
            <li>Improving the platform</li>
            <li>Ensuring security</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">3. Data Sharing</h2>
          <p className="text-brand-muted mb-4">We share data in the following cases:</p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>Payment providers (bKash, Nagad, etc.)</li>
            <li>SMS and email providers</li>
            <li>Government authorities when legally required</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">4. Your Rights</h2>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>Right to access your data</li>
            <li>Right to correct inaccurate data</li>
            <li>Right to request data deletion</li>
            <li>Right to data portability</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">5. Data Retention</h2>
          <p className="text-brand-muted mb-4">
            We retain KYC documents for 5 years (legal requirement). Other data is deleted 30 days after account closure.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">6. Contact</h2>
          <p className="text-brand-muted mb-4">
            For privacy inquiries: privacy@capitaldebenchmark.com
          </p>
        </>
      )}
    </LegalPageLayout>
  );
}
