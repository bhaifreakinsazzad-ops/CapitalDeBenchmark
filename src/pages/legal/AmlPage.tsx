import { LegalPageLayout } from './LegalPageLayout';
import { useAuthStore } from '../../store';

export function AmlPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <LegalPageLayout title={isBn ? 'AML/KYC নীতি' : 'AML/KYC Policy'}>
      {isBn ? (
        <>
          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">KYC প্রয়োজনীয়তা</h2>
          <p className="text-brand-muted mb-4">
            মানি লন্ডারিং প্রতিরোধ (AML) এবং গ্রাহক পরিচয় যাচাই (KYC) নিয়ম মেনে চলতে, আমরা সমস্ত ব্যবহারকারীদের যাচাই করি।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">প্রয়োজনীয় নথি</h2>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>জাতীয় পরিচয়পত্র (সামনে এবং পেছনে)</li>
            <li>বর্তমান ঠিকানার প্রমাণ (ইউটিলিটি বিল)</li>
            <li>সেলফি (যাচাইকরণের জন্য)</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">যাচাইকরণ প্রক্রিয়া</h2>
          <p className="text-brand-muted mb-4">
            সাধারণত ১ ঘণ্টার মধ্যে সম্পন্ন হয়। জটিল ক্ষেত্রে ২৪ ঘণ্টা সময় লাগতে পারে।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">ডেটা সংরক্ষণ</h2>
          <p className="text-brand-muted mb-4">
            আইনি বাধ্যবাধকতা অনুসারে, আমরা KYC নথি ৫ বছর সংরক্ষণ করি।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">সন্দেহজনক কার্যকলাপ</h2>
          <p className="text-brand-muted mb-4">
            আমরা সন্দেহজনক লেনদেন পর্যবেক্ষণ করি এবং প্রয়োজনে কর্তৃপক্ষকে রিপোর্ট করি।
          </p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">KYC Requirements</h2>
          <p className="text-brand-muted mb-4">
            To comply with Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations, we verify all users.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Required Documents</h2>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>National ID (front and back)</li>
            <li>Proof of current address (utility bill)</li>
            <li>Selfie (for verification)</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Verification Process</h2>
          <p className="text-brand-muted mb-4">
            Usually completed within 1 hour. Complex cases may take up to 24 hours.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Data Retention</h2>
          <p className="text-brand-muted mb-4">
            In accordance with legal requirements, we retain KYC documents for 5 years.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Suspicious Activity</h2>
          <p className="text-brand-muted mb-4">
            We monitor suspicious transactions and report to authorities when necessary.
          </p>
        </>
      )}
    </LegalPageLayout>
  );
}
