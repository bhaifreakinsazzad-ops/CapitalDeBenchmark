// Payment Provider Interface
export interface PaymentProvider {
  id: 'bkash' | 'nagad' | 'rocket' | 'upay';
  createIntent(params: {
    amount: number;
    userPhone: string;
    reference: string;
    callbackUrl: string;
  }): Promise<{
    providerRef: string;
    redirectUrl: string;
    expiresAt: string;
  }>;
  verifyWebhook(rawBody: string, headers: Record<string, string>): Promise<{
    ok: boolean;
    payload?: any;
  }>;
  queryStatus(providerRef: string): Promise<{
    status: 'pending' | 'succeeded' | 'failed' | 'expired';
    trxId?: string;
    amount?: number;
  }>;
  refund?(providerRef: string, amount: number): Promise<{
    ok: boolean;
    refundRef?: string;
  }>;
}

// Provider registry
import bkashProvider from './bkash';
import nagadProvider from './nagad';
import rocketProvider from './rocket';
import upayProvider from './upay';

const providers: Record<string, PaymentProvider> = {
  bkash: bkashProvider,
  nagad: nagadProvider,
  rocket: rocketProvider,
  upay: upayProvider,
};

// Provider factory
export function getPaymentProvider(providerId: string): PaymentProvider {
  const provider = providers[providerId];
  if (!provider) {
    throw new Error(`Unknown payment provider: ${providerId}`);
  }
  return provider;
}
