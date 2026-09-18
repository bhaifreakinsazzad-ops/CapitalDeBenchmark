import { LegalPageLayout } from './LegalPageLayout';
import { useAuthStore } from '../../store';

export function RefundPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <LegalPageLayout title={isBn ? 'ফেরত নীতি' : 'Refund Policy'}>
      {isBn ? (
        <>
          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">প্রাথমিক বিনিয়োগ</h2>
          <p className="text-brand-muted mb-4">
            প্রাথমিক বিনিয়োগ চূড়ান্ত। একবার আপনি শেয়ার কিনলে, তা ফেরত পাওয়া যাবে না, যদি না:
          </p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>ব্যবসাটি মাইলস্টোন মোডে থাকে এবং মাইলস্টোন অর্জনে ব্যর্থ হয় (স্বয়ংক্রিয় ফেরত)</li>
            <li>প্ল্যাটফর্ম ত্রুটির কারণে ভুল লেনদেন হয়</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">রিচার্জ ফেরত</h2>
          <p className="text-brand-muted mb-4">
            যদি আপনার রিচার্জ ব্যর্থ হয় বা ভুলভাবে প্রক্রিয়া করা হয়, সম্পূর্ণ ফেরত দেওয়া হবে।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">উত্তোলন বাতিল</h2>
          <p className="text-brand-muted mb-4">
            অ্যাডমিন প্রত্যাখ্যান করলে, উত্তোলনের অনুরোধ বাতিল হবে এবং টাকা আপনার ওয়ালেটে ফেরত আসবে।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">বিজ্ঞাপন খরচ</h2>
          <p className="text-brand-muted mb-4">
            বিজ্ঞাপন খরচ ফেরতযোগ্য নয়।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">ফেরত প্রক্রিয়া</h2>
          <p className="text-brand-muted mb-4">
            ফেরতযোগ্য ক্ষেত্রে, টাকা ৩-৫ কর্মদিবসের মধ্যে আপনার ওয়ালেটে বা MFS অ্যাকাউন্টে ফেরত দেওয়া হবে।
          </p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Primary Investments</h2>
          <p className="text-brand-muted mb-4">
            Primary investments are final. Once you purchase shares, they cannot be refunded unless:
          </p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>The business is in milestone mode and fails to reach its milestone (automatic refund)</li>
            <li>An erroneous transaction occurs due to platform error</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Recharge Refunds</h2>
          <p className="text-brand-muted mb-4">
            If your recharge fails or is processed incorrectly, a full refund will be provided.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Withdrawal Cancellations</h2>
          <p className="text-brand-muted mb-4">
            If admin rejects a withdrawal request, it will be cancelled and funds returned to your wallet.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Ad Spend</h2>
          <p className="text-brand-muted mb-4">
            Advertising spend is non-refundable.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Refund Process</h2>
          <p className="text-brand-muted mb-4">
            For refundable cases, funds will be returned to your wallet or MFS account within 3-5 business days.
          </p>
        </>
      )}
    </LegalPageLayout>
  );
}
