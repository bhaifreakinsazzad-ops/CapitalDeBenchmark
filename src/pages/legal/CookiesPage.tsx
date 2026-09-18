import { LegalPageLayout } from './LegalPageLayout';
import { useAuthStore } from '../../store';

export function CookiesPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <LegalPageLayout title={isBn ? 'কুকি নীতি' : 'Cookie Policy'}>
      {isBn ? (
        <>
          <p className="text-brand-muted mb-4">
            আমরা আপনার অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করি।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">প্রয়োজনীয় কুকি</h2>
          <p className="text-brand-muted mb-4">
            এই কুকিগুলো প্ল্যাটফর্ম চালু করতে প্রয়োজনীয়। এগুলো ছাড়া প্ল্যাটফর্ম কাজ করবে না।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">কার্যকরী কুকি</h2>
          <p className="text-brand-muted mb-4">
            এই কুকিগুলো আপনার পছন্দ (ভাষা, থিম) মনে রাখে।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">বিশ্লেষণাত্মক কুকি</h2>
          <p className="text-brand-muted mb-4">
            এই কুকিগুলো আমাদের প্ল্যাটফর্ম কীভাবে ব্যবহৃত হচ্ছে তা বুঝতে সাহায্য করে। আপনি এই কুকি নিষ্ক্রিয় করতে পারেন।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">কুকি নিয়ন্ত্রণ</h2>
          <p className="text-brand-muted mb-4">
            আপনি আপনার ব্রাউজার সেটিংস থেকে কুকি নিয়ন্ত্রণ বা মুছে ফেলতে পারেন।
          </p>
        </>
      ) : (
        <>
          <p className="text-brand-muted mb-4">
            We use cookies to enhance your experience.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Essential Cookies</h2>
          <p className="text-brand-muted mb-4">
            These cookies are necessary for the platform to function. The platform won't work without them.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Functional Cookies</h2>
          <p className="text-brand-muted mb-4">
            These cookies remember your preferences (language, theme).
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Analytics Cookies</h2>
          <p className="text-brand-muted mb-4">
            These cookies help us understand how the platform is used. You can disable these cookies.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Cookie Control</h2>
          <p className="text-brand-muted mb-4">
            You can control or delete cookies through your browser settings.
          </p>
        </>
      )}
    </LegalPageLayout>
  );
}
