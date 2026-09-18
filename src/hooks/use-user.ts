import { useAuthStore } from '../store';
import type { User } from '../lib/types';

export function useUser(): { user: User | null; isAuthenticated: boolean } {
  const { user, isAuthenticated } = useAuthStore();
  return { user, isAuthenticated };
}
