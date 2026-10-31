import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : ((typeof process !== 'undefined' && process.env) ? process.env : {} as any);
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

// Create real client with strict type check or safe fallback proxy
export const supabase: SupabaseClient | null =
  isSupabaseConfigured() && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null;

export const getSupabaseStatus = () => {
  const configured = isSupabaseConfigured();
  return {
    configured,
    url: configured ? supabaseUrl : null,
    mode: configured ? 'live-supabase' : 'local-resilient',
    missingKeys: [
      !supabaseUrl || supabaseUrl.includes('your-project') ? 'VITE_SUPABASE_URL' : null,
      !supabaseAnonKey || supabaseAnonKey.includes('your-anon-key') ? 'VITE_SUPABASE_ANON_KEY' : null,
    ].filter(Boolean) as string[],
  };
};
