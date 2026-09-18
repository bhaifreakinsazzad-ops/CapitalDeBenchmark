// Email Service Configuration (using Resend)
const EMAIL_CONFIG = {
  apiKey: (window as any).__RESEND_API_KEY__ || '',
  fromEmail: (window as any).__EMAIL_FROM__ || 'Capital De Benchmark <no-reply@capitaldebenchmark.com>',
};

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Send email via Resend
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<EmailResult> {
  if (!EMAIL_CONFIG.apiKey) {
    console.warn('Email API key not configured, skipping email send');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMAIL_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        from: EMAIL_CONFIG.fromEmail,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Email API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      messageId: data.id,
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Email Templates
export const EMAIL_TEMPLATES = {
  welcome: (name: string, lang: 'bn' | 'en' = 'bn') => ({
    subject: lang === 'bn' ? 'Capital De Benchmark-এ স্বাগতম!' : 'Welcome to Capital De Benchmark!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00d09c;">${lang === 'bn' ? 'স্বাগতম!' : 'Welcome!'}</h1>
        <p>${lang === 'bn' ? `প্রিয় ${name},` : `Dear ${name},`}</p>
        <p>${lang === 'bn' 
          ? 'Capital De Benchmark-এ আপনাকে স্বাগতম! বাংলাদেশের যাচাইকৃত ব্যবসায় বিনিয়োগ করার সহজতম প্ল্যাটফর্ম।'
          : 'Welcome to Capital De Benchmark! The easiest platform to invest in verified Bangladeshi businesses.'}</p>
        <p>${lang === 'bn' 
          ? 'পরবর্তী পদক্ষেপ:'
          : 'Next steps:'}</p>
        <ol>
          <li>${lang === 'bn' ? 'KYC যাচাইকরণ সম্পন্ন করুন' : 'Complete KYC verification'}</li>
          <li>${lang === 'bn' ? 'ওয়ালেট রিচার্জ করুন' : 'Recharge your wallet'}</li>
          <li>${lang === 'bn' ? 'ব্যবসা ব্রাউজ করুন এবং বিনিয়োগ শুরু করুন' : 'Browse businesses and start investing'}</li>
        </ol>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          ${lang === 'bn' 
            ? 'এই ইমেইলটি স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে। অনুগ্রহ করে সরাসরি উত্তর দেবেন না।'
            : 'This is an automated email. Please do not reply directly.'}
        </p>
      </div>
    `,
  }),

  kycApproved: (name: string, lang: 'bn' | 'en' = 'bn') => ({
    subject: lang === 'bn' ? 'KYC যাচাইকরণ সফল' : 'KYC Verification Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00d09c;">${lang === 'bn' ? 'KYC সফল!' : 'KYC Approved!'}</h1>
        <p>${lang === 'bn' ? `প্রিয় ${name},` : `Dear ${name},`}</p>
        <p>${lang === 'bn' 
          ? 'আপনার KYC যাচাইকরণ সফলভাবে সম্পন্ন হয়েছে। এখন আপনি বিনিয়োগ করতে এবং উত্তোলন করতে পারবেন।'
          : 'Your KYC verification has been successfully completed. You can now invest and withdraw.'}</p>
        <p>${lang === 'bn' 
          ? 'বাজারে গিয়ে যাচাইকৃত ব্যবসায় বিনিয়োগ শুরু করুন!'
          : 'Head to the market and start investing in verified businesses!'}</p>
      </div>
    `,
  }),

  kycRejected: (name: string, reason: string, lang: 'bn' | 'en' = 'bn') => ({
    subject: lang === 'bn' ? 'KYC প্রত্যাখ্যাত' : 'KYC Rejected',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f0525f;">${lang === 'bn' ? 'KYC প্রত্যাখ্যাত' : 'KYC Rejected'}</h1>
        <p>${lang === 'bn' ? `প্রিয় ${name},` : `Dear ${name},`}</p>
        <p>${lang === 'bn' 
          ? 'দুঃখিত, আপনার KYC যাচাইকরণ প্রত্যাখ্যাত হয়েছে।'
          : 'We regret to inform you that your KYC verification has been rejected.'}</p>
        <p><strong>${lang === 'bn' ? 'কারণ:' : 'Reason:'}</strong> ${reason}</p>
        <p>${lang === 'bn' 
          ? 'অনুগ্রহ করে সমস্যা সংশোধন করে পুনরায় জমা দিন।'
          : 'Please correct the issue and resubmit.'}</p>
      </div>
    `,
  }),

  investmentReceipt: (
    name: string,
    businessName: string,
    shares: number,
    amount: number,
    receiptCode: string,
    lang: 'bn' | 'en' = 'bn'
  ) => ({
    subject: lang === 'bn' ? 'বিনিয়োগ রসিদ' : 'Investment Receipt',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00d09c;">${lang === 'bn' ? 'বিনিয়োগ নিশ্চিত' : 'Investment Confirmed'}</h1>
        <p>${lang === 'bn' ? `প্রিয় ${name},` : `Dear ${name},`}</p>
        <p>${lang === 'bn' 
          ? `${businessName}-এ আপনার বিনিয়োগ নিশ্চিত হয়েছে।`
          : `Your investment in ${businessName} has been confirmed.`}</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>${lang === 'bn' ? 'ব্যবসা:' : 'Business:'}</strong> ${businessName}</p>
          <p><strong>${lang === 'bn' ? 'শেয়ার:' : 'Shares:'}</strong> ${shares}</p>
          <p><strong>${lang === 'bn' ? 'পরিমাণ:' : 'Amount:'}</strong> ৳${amount}</p>
          <p><strong>${lang === 'bn' ? 'রসিদ কোড:' : 'Receipt Code:'}</strong> ${receiptCode}</p>
        </div>
        <p>${lang === 'bn' 
          ? 'আপনার পোর্টফোলিওতে এই বিনিয়োগ দেখতে পাবেন।'
          : 'You can view this investment in your portfolio.'}</p>
      </div>
    `,
  }),

  withdrawalProcessed: (name: string, amount: number, lang: 'bn' | 'en' = 'bn') => ({
    subject: lang === 'bn' ? 'উত্তোলন প্রক্রিয়াধীন' : 'Withdrawal Being Processed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00d09c;">${lang === 'bn' ? 'উত্তোলন প্রক্রিয়াধীন' : 'Withdrawal Processing'}</h1>
        <p>${lang === 'bn' ? `প্রিয় ${name},` : `Dear ${name},`}</p>
        <p>${lang === 'bn' 
          ? `আপনার ৳${amount} উত্তোলন অনুরোধ অনুমোদিত হয়েছে এবং প্রক্রিয়াধীন।`
          : `Your withdrawal request of ৳${amount} has been approved and is being processed.`}</p>
        <p>${lang === 'bn' 
          ? '২৪ ঘণ্টার মধ্যে আপনার MFS অ্যাকাউন্টে টাকা পৌঁছে যাবে।'
          : 'The funds will be transferred to your MFS account within 24 hours.'}</p>
      </div>
    `,
  }),
};
