import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../lib/types';
import { generateWalletId } from '../lib/utils';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      lang: 'bn',
      setLang: (lang) => set({ lang }),
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'capitaldb-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, lang: state.lang }),
    }
  )
);

// Simulated user database for demo purposes
interface UserRecord {
  id: string;
  name: string;
  phone: string;
  password: string;
  role: 'investor' | 'founder' | 'admin' | 'super_admin';
  kyc_status: 'pending' | 'verified' | 'rejected';
  wallet_id: string;
  balance: number;
  preferred_lang: 'bn' | 'en';
}

interface DemoStore {
  users: UserRecord[];
  addUser: (user: UserRecord) => void;
  findUser: (phone: string, password: string) => UserRecord | undefined;
  findByPhone: (phone: string) => UserRecord | undefined;
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: 'admin-001',
          name: 'Capital De Benchmark Admin',
          phone: '01700000000',
          password: 'admin123',
          role: 'super_admin',
          kyc_status: 'verified',
          wallet_id: 'CDB-ADMIN-0001',
          balance: 0,
          preferred_lang: 'bn',
        },
      ],
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      findUser: (phone, password) => get().users.find((u) => u.phone === phone && u.password === password),
      findByPhone: (phone) => get().users.find((u) => u.phone === phone),
    }),
    { name: 'capitaldb-demo' }
  )
);
