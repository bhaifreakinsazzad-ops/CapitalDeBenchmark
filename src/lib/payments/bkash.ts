import { PaymentProvider } from './provider';

// bKash Merchant API Configuration
const BKASH_CONFIG = {
  baseUrl: (window as any).__BKASH_BASE_URL__ || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
  appKey: (window as any).__BKASH_APP_KEY__ || '',
  appSecret: (window as any).__BKASH_APP_SECRET__ || '',
  username: (window as any).__BKASH_USERNAME__ || '',
  password: (window as any).__BKASH_PASSWORD__ || '',
};

let authToken: string | null = null;
let tokenExpiry: number = 0;

// Grant token from bKash
async function grantToken(): Promise<string> {
  if (authToken && Date.now() < tokenExpiry) {
    return authToken;
  }

  const response = await fetch(`${BKASH_CONFIG.baseUrl}/tokenized/checkout/token/grant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'username': BKASH_CONFIG.username,
      'password': BKASH_CONFIG.password,
    },
    body: JSON.stringify({
      app_key: BKASH_CONFIG.appKey,
      app_secret: BKASH_CONFIG.appSecret,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to grant bKash token');
  }

  const data = await response.json();
  authToken = data.id_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 min before expiry

  return authToken!;
}

// bKash Payment Provider
const bkashProvider: PaymentProvider = {
  id: 'bkash',

  async createIntent({ amount, userPhone, reference, callbackUrl }) {
    const token = await grantToken();

    const response = await fetch(`${BKASH_CONFIG.baseUrl}/tokenized/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'authorization': token,
        'x-app-key': BKASH_CONFIG.appKey,
      },
      body: JSON.stringify({
        mode: '0011', // Single payment
        payerReference: reference,
        callbackURL: callbackUrl,
        amount: amount.toFixed(2),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: `CDB-${Date.now()}`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errorMessage || 'Failed to create bKash payment');
    }

    const data = await response.json();

    return {
      providerRef: data.paymentID,
      redirectUrl: data.bkashURL,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
    };
  },

  async verifyWebhook(rawBody: string, headers: Record<string, string>) {
    // bKash doesn't use webhooks in the traditional sense
    // Instead, we verify via callback and execute payment
    try {
      const payload = JSON.parse(rawBody);
      
      // Verify the payment status
      const status = await this.queryStatus(payload.paymentID);
      
      return {
        ok: status.status === 'succeeded',
        payload: {
          ...payload,
          trxId: status.trxId,
          amount: status.amount,
        },
      };
    } catch (error) {
      return { ok: false };
    }
  },

  async queryStatus(providerRef: string) {
    const token = await grantToken();

    const response = await fetch(`${BKASH_CONFIG.baseUrl}/tokenized/checkout/payment/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'authorization': token,
        'x-app-key': BKASH_CONFIG.appKey,
      },
      body: JSON.stringify({
        paymentID: providerRef,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to query bKash payment status');
    }

    const data = await response.json();

    // Map bKash status to our status
    let status: 'pending' | 'succeeded' | 'failed' | 'expired';
    switch (data.transactionStatus) {
      case 'Completed':
        status = 'succeeded';
        break;
      case 'Initiated':
      case 'Pending':
        status = 'pending';
        break;
      case 'Cancelled':
      case 'Declined':
        status = 'failed';
        break;
      case 'Expired':
        status = 'expired';
        break;
      default:
        status = 'pending';
    }

    return {
      status,
      trxId: data.trxID,
      amount: parseFloat(data.amount),
    };
  },

  async refund(providerRef: string, amount: number) {
    const token = await grantToken();

    const response = await fetch(`${BKASH_CONFIG.baseUrl}/tokenized/checkout/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'authorization': token,
        'x-app-key': BKASH_CONFIG.appKey,
      },
      body: JSON.stringify({
        paymentID: providerRef,
        amount: amount.toFixed(2),
        currency: 'BDT',
        trxID: `REF-${Date.now()}`,
        sku: 'refund',
        reason: 'User requested refund',
      }),
    });

    if (!response.ok) {
      return { ok: false };
    }

    const data = await response.json();

    return {
      ok: true,
      refundRef: data.refundTrxID,
    };
  },
};

export default bkashProvider;
