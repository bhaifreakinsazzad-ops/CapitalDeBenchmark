import { PaymentProvider } from './provider';

// Upay API Configuration (STUB - not yet implemented)
const UPAY_CONFIG = {
  baseUrl: 'https://api.upay.com',
  merchantId: '',
  merchantKey: '',
};

// Upay Payment Provider (STUB)
const upayProvider: PaymentProvider = {
  id: 'upay',

  async createIntent({ amount, userPhone, reference, callbackUrl }) {
    throw new Error('Upay payment integration not yet implemented. Please use manual recharge or bKash.');
  },

  async verifyWebhook(rawBody: string, headers: Record<string, string>) {
    throw new Error('Upay webhook verification not yet implemented');
  },

  async queryStatus(providerRef: string) {
    throw new Error('Upay status query not yet implemented');
  },

  async refund(providerRef: string, amount: number) {
    throw new Error('Upay refund not yet implemented');
  },
};

export default upayProvider;
