import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlatformSettings {
  // Money minimums
  min_deposit_bdt: number;
  min_investment_bdt: number;
  min_share_price_bdt: number;
  min_payout_bdt: number;
  
  // Feature flags
  signup_open: boolean;
  ads_enabled: boolean;
  comments_enabled: boolean;
  secondary_market_open: boolean;
  kyc_required_to_invest: boolean;
  
  // Payouts
  withdrawals_require_admin: boolean;
  payout_sla_hours: number;
  
  // Milestones
  default_milestone_days: number;
  
  // Branding
  platform_full_name: string;
  platform_short_name: string;
  wallet_prefix: string;
  
  // Trust
  trust_min_for_market_display: number;
  
  // Metadata
  updated_at: string;
}

interface SettingsStore {
  settings: PlatformSettings;
  
  // Get a setting
  get: <K extends keyof PlatformSettings>(key: K) => PlatformSettings[K];
  
  // Update settings
  update: (updates: Partial<PlatformSettings>) => { success: boolean };
  
  // Reset to defaults
  resetToDefaults: () => void;
}

const defaultSettings: PlatformSettings = {
  min_deposit_bdt: 5,
  min_investment_bdt: 5,
  min_share_price_bdt: 5,
  min_payout_bdt: 100,
  
  signup_open: true,
  ads_enabled: true,
  comments_enabled: true,
  secondary_market_open: true,
  kyc_required_to_invest: true,
  
  withdrawals_require_admin: true,
  payout_sla_hours: 24,
  
  default_milestone_days: 90,
  
  platform_full_name: 'Capital De Benchmark',
  platform_short_name: 'CapitalDB',
  wallet_prefix: 'CDB',
  
  trust_min_for_market_display: 0,
  
  updated_at: new Date().toISOString(),
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      
      get: (key) => get().settings[key],
      
      update: (updates) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...updates,
            updated_at: new Date().toISOString(),
          },
        }));
        return { success: true };
      },
      
      resetToDefaults: () => {
        set({ settings: { ...defaultSettings, updated_at: new Date().toISOString() } });
      },
    }),
    { name: 'capitaldb-settings' }
  )
);
