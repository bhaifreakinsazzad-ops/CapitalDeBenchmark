import { LearnPageLayout } from './LearnPageLayout';
import { useAuthStore } from '../../store';

export function WalletAndEscrowPage() {
  const { lang } = useAuthStore();
  const isBn = lang === 'bn';

  return (
    <LearnPageLayout title={isBn ? 'ওয়ালেট এবং এসক্রো' : 'Wallet and Escrow'}>
      <div className="prose prose-invert max-w-none">
        <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">
          {isBn ? 'আপনার ওয়ালেট' : 'Your Wallet'}
        </h2>
        <p className="text-brand-muted mb-4">
          {isBn 
            ? 'আপনার ওয়ালেট হলো আপনার Capital De Benchmark অ্যাকাউন্টে থাকা টাকা। আপনি bKash, Nagad, Rocket, বা Upay ব্যবহার করে ওয়ালেট রিচার্জ করতে পারেন।'
            : 'Your wallet is the money in your Capital De Benchmark account. You can recharge your wallet using bKash, Nagad, Rocket, or Upay.'}
        </p>

        <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">
          {isBn ? 'এসক্রো কী?' : 'What is Escrow?'}
        </h2>
        <p className="text-brand-muted mb-4">
          {isBn 
            ? 'এসক্রো হলো একটি নিরাপদ ধারণ পদ্ধতি। যখন আপনি মাইলস্টোন ফান্ডিং মোডে বিনিয়োগ করেন, আপনার টাকা এসক্রোতে থাকে যতক্ষণ না ব্যবসা তার লক্ষ্যে পৌঁছায়।'
            : 'Escrow is a secure holding method. When you invest in milestone funding mode, your money is held in escrow until the business reaches its target.'}
        </p>

        <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">
          {isBn ? 'কেন এসক্রো?' : 'Why Escrow?'}
        </h2>
        <ul className="list-disc list-inside text-brand-muted mb-4 space-y-2">
          <li>{isBn ? 'বিনিয়োগকারীদের রক্ষা করে' : 'Protects investors'}</li>
          <li>{isBn ? 'মাইলস্টোন অর্জিত না হলে স্বয়ংক্রিয় ফেরত' : 'Automatic refund if milestone not reached'}</li>
          <li>{isBn ? 'প্ল্যাটফর্ম টাকা নিরাপদে ধারণ করে' : 'Platform holds money safely'}</li>
        </ul>

        <h2 className="text-xl font-semibold text-brand-text mt-6 mb-3">
          {isBn ? 'উত্তোলন প্রক্রিয়া' : 'Withdrawal Process'}
        </h2>
        <p className="text-brand-muted mb-4">
          {isBn 
            ? 'আপনি যেকোনো সময় আপনার ওয়ালেট থেকে টাকা উত্তোলন করতে পারেন। উত্তোলনের জন্য অ্যাডমিন অনুমোদন প্রয়োজন, যা সাধারণত ২৪ ঘণ্টার মধ্যে সম্পন্ন হয়।'
            : 'You can withdraw money from your wallet anytime. Withdrawals require admin approval, which is usually completed within 24 hours.'}
        </p>
      </div>
    </LearnPageLayout>
  );
}
