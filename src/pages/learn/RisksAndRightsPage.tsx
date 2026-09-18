import { LearnPageLayout } from './LearnPageLayout';
import { useAuthStore } from '../../store';

export function RisksAndRightsPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <LearnPageLayout title={isBn ? 'ঝুঁকি এবং অধিকার' : 'Risks and Rights'}>
      <div className="prose prose-invert max-w-none">
        <div className="bg-brand-bad/10 border border-brand-bad/30 rounded-xl p-4 mb-6">
          <p className="text-brand-bad font-semibold">
            {isBn 
              ? '⚠️ বিনিয়োগে ঝুঁকি আছে। আপনি আপনার সম্পূর্ণ বিনিয়োগ হারাতে পারেন।'
              : '⚠️ Investments carry risk. You may lose your entire investment.'}
          </p>
        </div>

        <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">
          {isBn ? 'ঝুঁকি' : 'Risks'}
        </h2>
        <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
          <li>{isBn ? 'ব্যবসা ব্যর্থ হতে পারে' : 'Business may fail'}</li>
          <li>{isBn ? 'শেয়ারের মূল্য কমতে পারে' : 'Share price may drop'}</li>
          <li>{isBn ? 'তরলতার অভাব - বিক্রি করতে ক্রেতা নাও পাওয়া যেতে পারে' : 'Liquidity risk - may not find a buyer when selling'}</li>
          <li>{isBn ? 'কোনো বীমা নেই' : 'No insurance coverage'}</li>
          <li>{isBn ? 'নিয়ন্ত্রক পরিবর্তন' : 'Regulatory changes'}</li>
        </ul>

        <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">
          {isBn ? 'আপনার অধিকার' : 'Your Rights'}
        </h2>
        <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
          <li>{isBn ? 'আপনি সবসময় আপনার শেয়ারের মালিক থাকেন' : 'You always own your shares'}</li>
          <li>{isBn ? 'আপনি আপনার শেয়ার বিক্রি করতে পারেন' : 'You can sell your shares'}</li>
          <li>{isBn ? 'আপনি সমস্ত আপডেট দেখতে পারেন' : 'You can see all updates'}</li>
          <li>{isBn ? 'এসক্রো মাইলস্টোন বিনিয়োগ রক্ষা করে' : 'Escrow protects milestone investments'}</li>
          <li>{isBn ? 'আপনি যেকোনো সময় উত্তোলন করতে পারেন' : 'You can withdraw anytime'}</li>
        </ul>

        <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">
          {isBn ? 'ঝুঁকি কমানোর উপায়' : 'How to Reduce Risk'}
        </h2>
        <p className="text-brand-muted mb-4">
          {isBn 
            ? 'একাধিক ব্যবসায় বিনিয়োগ করে আপনার পোর্টফোলিও বৈচিত্র্যময় করুন। শুধুমাত্র সেই টাকা বিনিয়োগ করুন যা আপনি হারাতে পারবেন।'
            : 'Diversify your portfolio by investing in multiple businesses. Only invest money you can afford to lose.'}
        </p>
      </div>
    </LearnPageLayout>
  );
}
