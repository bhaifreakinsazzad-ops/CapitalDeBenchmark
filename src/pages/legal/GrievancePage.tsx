import { LegalPageLayout } from './LegalPageLayout';
import { useAuthStore } from '../../store';

export function GrievancePage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <LegalPageLayout title={isBn ? 'অভিযোগ প্রতিকার' : 'Grievance Redressal'}>
      {isBn ? (
        <>
          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">অভিযোগ দায়ের</h2>
          <p className="text-brand-muted mb-4">
            কোনো সমস্যা বা অভিযোগ থাকলে, অনুগ্রহ করে নিম্নলিখিত উপায়ে যোগাযোগ করুন:
          </p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>ইমেইল: support@capitaldebenchmark.com</li>
            <li>ফোন: +880-XXX-XXXXXXX</li>
            <li>প্ল্যাটফর্মের "সাহায্য" বিভাগ</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">সময়সীমা</h2>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>৪৮ ঘণ্টার মধ্যে স্বীকৃতি</li>
            <li>১৫ কর্মদিবসের মধ্যে সমাধান</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">উচ্চতর আপিল</h2>
          <p className="text-brand-muted mb-4">
            যদি আপনি আমাদের সমাধানে সন্তুষ্ট না হন, আপনি:
          </p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>বাংলাদেশ ব্যাংকের কাছে অভিযোগ করতে পারেন</li>
            <li>ভোক্তা অধিকার সংরক্ষণ অধিদপ্তরে যোগাযোগ করতে পারেন</li>
            <li>আইনি পরামর্শ নিতে পারেন</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">তথ্য প্রদান</h2>
          <p className="text-brand-muted mb-4">
            অভিযোগ দায়ের করার সময় নিম্নলিখিত তথ্য প্রদান করুন:
          </p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>আপনার অ্যাকাউন্ট বিবরণ</li>
            <li>সমস্যার বিস্তারিত বিবরণ</li>
            <li>প্রাসঙ্গিক লেনদেন আইডি বা রসিদ</li>
            <li>স্ক্রিনশট বা অন্যান্য প্রমাণ</li>
          </ul>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Filing a Complaint</h2>
          <p className="text-brand-muted mb-4">
            If you have any issues or complaints, please contact us through the following methods:
          </p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>Email: support@capitaldebenchmark.com</li>
            <li>Phone: +880-XXX-XXXXXXX</li>
            <li>Platform's "Help" section</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Timeline</h2>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>Acknowledgement within 48 hours</li>
            <li>Resolution within 15 business days</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Escalation</h2>
          <p className="text-brand-muted mb-4">
            If you're not satisfied with our resolution, you can:
          </p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>File a complaint with Bangladesh Bank</li>
            <li>Contact the Department of Consumer Rights Protection</li>
            <li>Seek legal advice</li>
          </ul>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Information to Provide</h2>
          <p className="text-brand-muted mb-4">
            When filing a complaint, provide the following information:
          </p>
          <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
            <li>Your account details</li>
            <li>Detailed description of the issue</li>
            <li>Relevant transaction IDs or receipts</li>
            <li>Screenshots or other evidence</li>
          </ul>
        </>
      )}
    </LegalPageLayout>
  );
}
