import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xnfrsjugeugtlkfuyszu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZnJzanVnZXVndGxrZnV5c3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMzcxODQsImV4cCI6MjA5OTYxMzE4NH0.asB-lr8GKPSkOKgeHhg7EFnmwIh6sSaZ8h0fy8t-j24';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sign in with Google using official Supabase Auth OAuth flow
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) {
    console.error('Supabase Google OAuth Error:', error);
    throw error;
  }
  return data;
}

/**
 * Get current authenticated user session from Supabase
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error fetching Supabase session:', error);
    return null;
  }
  return session;
}
