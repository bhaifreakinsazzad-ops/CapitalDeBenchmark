import { PaymentProvider } from './provider';

// Nagad API Configuration (STUB - not yet implemented)
const NAGAD_CONFIG = {
  baseUrl: 'https://api.nagad.com',
  merchantId: '',
  merchantKey: '',
};

// Nagad Payment Provider (STUB)
const nagadProvider: PaymentProvider = {
  id: 'nagad',

  async createIntent({ amount, userPhone, reference, callbackUrl }) {
    throw new Error('Nagad payment integration not yet implemented. Please use manual recharge or bKash.');
  },

  async verifyWebhook(rawBody: string, headers: Record<string, string>) {
    throw new Error('Nagad webhook verification not yet implemented');
  },

  async queryStatus(providerRef: string) {
    throw new Error('Nagad status query not yet implemented');
  },

  async refund(providerRef: string, amount: number) {
    throw new Error('Nagad refund not yet implemented');
  },
};

export default nagadProvider;
