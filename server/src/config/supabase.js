// ============================================
// Supabase Client Configuration
// Provides both public (anon) and admin clients
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client — respects Row Level Security (RLS)
// Used for user-scoped operations
export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  }
);

// Admin client — bypasses RLS
// Used ONLY for server-side operations (seeding, migrations, admin)
export const supabaseAdmin = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseServiceKey || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Create an authenticated Supabase client for a specific user.
 * @param {string} accessToken - User's JWT access token
 * @returns {SupabaseClient}
 */
export function createUserClient(accessToken) {
  return createClient(
    supabaseUrl || 'http://localhost:54321',
    supabaseAnonKey || 'placeholder-anon-key',
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
}

export default supabase;
