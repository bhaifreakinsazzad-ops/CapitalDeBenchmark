// Supabase client stubs - will be connected in later phases
// For Phase 1, we use local demo store for auth

import { APP_FULL_NAME } from '../constants';

// Browser client (for later phases)
export function createBrowserClient() {
  // Will be implemented with actual Supabase URL/key in Phase 2+
  console.log(`[${APP_FULL_NAME}] Supabase browser client - stub mode`);
  return null;
}

// Server client (for later phases with Next.js)
export function createServerClient() {
  console.log(`[${APP_FULL_NAME}] Supabase server client - stub mode`);
  return null;
}

// Admin client with service role (server-only, for later phases)
export function createAdminClient() {
  console.log(`[${APP_FULL_NAME}] Supabase admin client - stub mode`);
  return null;
}
