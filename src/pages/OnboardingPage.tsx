import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Shield, PartyPopper } from 'lucide-react';
import { useAuthStore } from '../store';
import { BrandMark } from '../components/layout/brand-mark';

export function OnboardingPage() {
  const { lang } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [riskAccepted, setRiskAccepted] = useState(false);
  const isBn = lang === 'bn';

  const steps = isBn ? [
    { title: 'Capital De Benchmark-এ স্বাগতম!', desc: 'বাংলাদেশের যাচাইকৃত ব্যবসায় বিনিয়োগ করার সহজতম প্ল্যাটফর্ম।', icon: CheckCircle },
    { title: 'Capital De Benchmark কী?', desc: 'আপনি মাত্র ৳৫ থেকে যাচাইকৃত বাংলাদেশী ব্যবসায় শেয়ার কিনতে পারবেন। আপনার শেয়ার ট্রেডযোগ্য রসিদ হিসেবে থাকবে।', icon: Shield },
    { title: 'ঝুঁকি সতর্কতা', desc: 'বিনিয়োগে সবসময় ঝুঁকি থাকে। আপনার ক্ষতি হতে পারে। শুধু সেই টাকা বিনিয়োগ করুন যা হারালেও সমস্যা নেই।', icon: AlertTriangle },
    { title: 'KYC সম্পন্ন করুন', desc: 'আপনার পরিচয় যাচাই করতে KYC সম্পন্ন করুন। এটি ওয়ালেট পেজ থেকে করা যাবে।', icon: Shield },
    { title: 'সব প্রস্তুত!', desc: 'আপনি বিনিয়োগ শুরু করতে প্রস্তুত। ড্যাশবোর্ডে যান।', icon: PartyPopper },
  ] : [
    { title: 'Welcome to Capital De Benchmark!', desc: 'The easiest platform to invest in verified Bangladeshi businesses.', icon: CheckCircle },
    { title: 'What is Capital De Benchmark?', desc: 'You can buy shares in verified Bangladeshi businesses starting from just ৳5. Your shares become tradable receipts.', icon: Shield },
    { title: 'Risk Warning', desc: 'Investments always carry risk. You may lose money. Only invest what you can afford to lose.', icon: AlertTriangle },
    { title: 'Complete KYC', desc: 'Verify your identity by completing KYC. You can do this from the Wallet page.', icon: Shield },
    { title: "All Set!", desc: "You're ready to start investing. Head to your dashboard.", icon: PartyPopper },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (step === 2 && !riskAccepted) return;
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-brand-accent' : 'bg-brand-line'}`} />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center mx-auto mb-6">
            <Icon className={`w-8 h-8 ${step === 2 ? 'text-brand-warn' : 'text-brand-accent'}`} />
          </div>
          <h1 className="text-2xl font-bold text-brand-text mb-3">{currentStep.title}</h1>
          <p className="text-brand-muted leading-relaxed">{currentStep.desc}</p>
        </div>

        {/* Risk checkbox on step 3 */}
        {step === 2 && (
          <label className="flex items-start gap-3 p-4 rounded-xl border border-brand-line bg-brand-panel mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={riskAccepted}
              onChange={(e) => setRiskAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-brand-accent"
            />
            <span className="text-sm text-brand-muted">
              {isBn ? 'আমি ঝুঁকি বুঝি এবং গ্রহণ করি' : 'I understand and accept the risks'}
            </span>
          </label>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="btn-ghost flex-1">
              {isBn ? 'পেছনে' : 'Back'}
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={step === 2 && !riskAccepted}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === steps.length - 1
              ? (isBn ? 'ড্যাশবোর্ডে যান' : 'Go to Dashboard')
              : (isBn ? 'পরবর্তী' : 'Next')}
          </button>
        </div>
      </div>
    </div>
  );
}
