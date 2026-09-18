import { PaymentProvider } from './provider';

// Rocket API Configuration (STUB - not yet implemented)
const ROCKET_CONFIG = {
  baseUrl: 'https://api.rocket.com',
  merchantId: '',
  merchantKey: '',
};

// Rocket Payment Provider (STUB)
const rocketProvider: PaymentProvider = {
  id: 'rocket',

  async createIntent({ amount, userPhone, reference, callbackUrl }) {
    throw new Error('Rocket payment integration not yet implemented. Please use manual recharge or bKash.');
  },

  async verifyWebhook(rawBody: string, headers: Record<string, string>) {
    throw new Error('Rocket webhook verification not yet implemented');
  },

  async queryStatus(providerRef: string) {
    throw new Error('Rocket status query not yet implemented');
  },

  async refund(providerRef: string, amount: number) {
    throw new Error('Rocket refund not yet implemented');
  },
};

export default rocketProvider;
