import { LegalPageLayout } from './LegalPageLayout';
import { useAuthStore } from '../../store';

export function RiskPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <LegalPageLayout title={isBn ? 'ঝুঁকি প্রকাশ' : 'Risk Disclosure'}>
      {isBn ? (
        <>
          <div className="bg-brand-bad/10 border border-brand-bad/30 rounded-xl p-4 mb-6">
            <p className="text-brand-bad font-semibold">
              ⚠️ বিনিয়োগে ঝুঁকি আছে। আপনি আপনার সম্পূর্ণ বিনিয়োগ হারাতে পারেন।
            </p>
          </div>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">ব্যবসায়িক ঝুঁকি</h2>
          <p className="text-brand-muted mb-4">
            আপনি যে ব্যবসায় বিনিয়োগ করছেন তা ব্যর্থ হতে পারে। ব্যবসা ক্ষতিগ্রস্ত হলে, আপনার শেয়ারের মূল্য শূন্যে নেমে যেতে পারে এবং আপনি আপনার সম্পূর্ণ বিনিয়োগ হারাতে পারেন।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">মূল্য পরিবর্তনের ঝুঁকি</h2>
          <p className="text-brand-muted mb-4">
            শেয়ারের মূল্য পরিবর্তনশীল। বাজারের চাহিদা এবং যোগান, ব্যবসার পারফরম্যান্স, এবং অন্যান্য কারণে মূল্য বাড়তে বা কমতে পারে।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">তরলতার ঝুঁকি</h2>
          <p className="text-brand-muted mb-4">
            সেকেন্ডারি মার্কেটে আপনার শেয়ার বিক্রি করার জন্য ক্রেতা পাওয়ার নিশ্চয়তা নেই। আপনি চাইলেও শেয়ার বিক্রি করতে নাও পারেন।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">কোনো বীমা নেই</h2>
          <p className="text-brand-muted mb-4">
            Capital De Benchmark-এ বিনিয়োগ ব্যাংক ডিপোজিটের মতো বীমাকৃত নয়। বাংলাদেশ ব্যাংক বা অন্য কোনো সরকারি সংস্থা আপনার বিনিয়োগ রক্ষা করে না।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">ঘনীভূত ঝুঁকি</h2>
          <p className="text-brand-muted mb-4">
            অল্প সংখ্যক ব্যবসায় বিনিয়োগ করা ঝুঁকিপূর্ণ। আপনার পোর্টফোলিও বৈচিত্র্যময় করা গুরুত্বপূর্ণ।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">প্ল্যাটফর্ম ঝুঁকি</h2>
          <p className="text-brand-muted mb-4">
            প্রযুক্তিগত ত্রুটি, সাইবার আক্রমণ, বা প্ল্যাটফর্ম বন্ধ হয়ে যাওয়ার ঝুঁকি আছে।
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">নিয়ন্ত্রক ঝুঁকি</h2>
          <p className="text-brand-muted mb-4">
            বাংলাদেশ সিকিউরিটিজ অ্যান্ড এক্সচেঞ্জ কমিশন (BSEC) বা অন্য নিয়ন্ত্রক সংস্থা নতুন নিয়ম জারি করতে পারে যা প্ল্যাটফর্মকে প্রভাবিত করে।
          </p>

          <div className="bg-brand-panel2 border border-brand-line rounded-xl p-4 mt-6">
            <p className="text-brand-text font-semibold mb-2">
              {isBn ? 'গুরুত্বপূর্ণ:' : 'Important:'}
            </p>
            <p className="text-brand-muted">
              {isBn 
                ? 'শুধুমাত্র সেই টাকা বিনিয়োগ করুন যা হারালেও আপনার জীবনযাত্রায় বড় প্রভাব পড়বে না। বিনিয়োগের আগে একজন আর্থিক উপদেষ্টার সাথে পরামর্শ করুন।'
                : 'Only invest money you can afford to lose without significantly impacting your lifestyle. Consult a financial advisor before investing.'}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="bg-brand-bad/10 border border-brand-bad/30 rounded-xl p-4 mb-6">
            <p className="text-brand-bad font-semibold">
              ⚠️ Investments carry risk. You may lose your entire investment.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Business Risk</h2>
          <p className="text-brand-muted mb-4">
            The businesses you invest in may fail. If a business performs poorly, your share value may drop to zero and you could lose your entire investment.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Price Volatility Risk</h2>
          <p className="text-brand-muted mb-4">
            Share prices are volatile. Market demand and supply, business performance, and other factors can cause prices to rise or fall.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Liquidity Risk</h2>
          <p className="text-brand-muted mb-4">
            There's no guarantee you'll find a buyer when you want to sell your shares on the secondary market. You may not be able to sell even if you want to.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">No Insurance</h2>
          <p className="text-brand-muted mb-4">
            Investments on Capital De Benchmark are not insured like bank deposits. Bangladesh Bank or any other government agency does not protect your investment.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Concentration Risk</h2>
          <p className="text-brand-muted mb-4">
            Investing in a small number of businesses is risky. It's important to diversify your portfolio.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Platform Risk</h2>
          <p className="text-brand-muted mb-4">
            There are risks of technical failures, cyber attacks, or the platform shutting down.
          </p>

          <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">Regulatory Risk</h2>
          <p className="text-brand-muted mb-4">
            The Bangladesh Securities and Exchange Commission (BSEC) or other regulatory bodies may issue new rules that affect the platform.
          </p>

          <div className="bg-brand-panel2 border border-brand-line rounded-xl p-4 mt-6">
            <p className="text-brand-text font-semibold mb-2">Important:</p>
            <p className="text-brand-muted">
              Only invest money you can afford to lose without significantly impacting your lifestyle. Consult a financial advisor before investing.
            </p>
          </div>
        </>
      )}
    </LegalPageLayout>
  );
}
