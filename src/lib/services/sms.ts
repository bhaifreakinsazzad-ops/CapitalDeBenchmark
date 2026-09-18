// SMS Service Configuration
const SMS_CONFIG = {
  provider: (window as any).__SMS_PROVIDER__ || 'bulksmsbd',
  apiKey: (window as any).__SMS_API_KEY__ || '',
  senderId: (window as any).__SMS_SENDER_ID__ || 'CapitalDB',
  baseUrl: (window as any).__SMS_BASE_URL__ || 'https://bulksmsbd.com/api/smsapi',
};

export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Send SMS via BulkSMSBD (primary BD provider)
export async function sendSms(phone: string, message: string): Promise<SmsResult> {
  if (!SMS_CONFIG.apiKey) {
    console.warn('SMS API key not configured, skipping SMS send');
    return { success: false, error: 'SMS not configured' };
  }

  try {
    const response = await fetch(SMS_CONFIG.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: SMS_CONFIG.apiKey,
        type: 'text',
        number: phone,
        senderid: SMS_CONFIG.senderId,
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`SMS API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: data.status === 'success' || data.status === 'OK',
      messageId: data.data?.id || data.message_id,
      error: data.status !== 'success' && data.status !== 'OK' ? data.message : undefined,
    };
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// SMS Templates
export const SMS_TEMPLATES = {
  otp: (code: string, lang: 'bn' | 'en' = 'bn') => {
    if (lang === 'bn') {
      return `আপনার Capital De Benchmark যাচাইকরণ কোড: ${code}। কাউকে দেবেন না।`;
    }
    return `Your Capital De Benchmark verification code: ${code}. Do not share with anyone.`;
  },

  rechargeApproved: (amount: number, lang: 'bn' | 'en' = 'bn') => {
    if (lang === 'bn') {
      return `আপনার ওয়ালেটে ৳${amount} রিচার্জ সফল হয়েছে। ধন্যবাদ!`;
    }
    return `৳${amount} successfully recharged to your wallet. Thank you!`;
  },

  withdrawalProcessed: (amount: number, lang: 'bn' | 'en' = 'bn') => {
    if (lang === 'bn') {
      return `আপনার ৳${amount} উত্তোলন প্রক্রিয়াধীন। ২৪ ঘণ্টার মধ্যে পাবেন।`;
    }
    return `Your ৳${amount} withdrawal is being processed. You'll receive it within 24 hours.`;
  },

  investmentConfirmed: (businessName: string, shares: number, amount: number, lang: 'bn' | 'en' = 'bn') => {
    if (lang === 'bn') {
      return `${businessName}-এ ${shares}টি শেয়ারের জন্য ৳${amount} বিনিয়োগ নিশ্চিত হয়েছে।`;
    }
    return `Investment of ৳${amount} for ${shares} shares in ${businessName} confirmed.`;
  },

  tradeExecuted: (businessName: string, shares: number, price: number, lang: 'bn' | 'en' = 'bn') => {
    if (lang === 'bn') {
      return `${businessName}-এর ${shares}টি শেয়ার ৳${price} দরে ট্রেড সম্পন্ন।`;
    }
    return `Trade executed: ${shares} shares of ${businessName} at ৳${price}.`;
  },

  kycApproved: (lang: 'bn' | 'en' = 'bn') => {
    if (lang === 'bn') {
      return `আপনার KYC যাচাইকরণ সফল হয়েছে। এখন বিনিয়োগ করতে পারবেন।`;
    }
    return `Your KYC verification is complete. You can now invest.`;
  },

  kycRejected: (reason: string, lang: 'bn' | 'en' = 'bn') => {
    if (lang === 'bn') {
      return `আপনার KYC প্রত্যাখ্যাত হয়েছে। কারণ: ${reason}। পুনরায় জমা দিন।`;
    }
    return `Your KYC was rejected. Reason: ${reason}. Please resubmit.`;
  },
};
