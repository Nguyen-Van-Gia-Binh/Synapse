import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './index';

let client: SupabaseClient | null = null;

const key = config.supabase.secretKey || config.supabase.anonKey;

if (config.supabase.url && key) {
  try {
    client = createClient(config.supabase.url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('[Supabase] Initialized Supabase client with URL:', config.supabase.url);
  } catch (err) {
    console.error('[Supabase] Failed to initialize Supabase client:', err);
    client = null;
  }
} else {
  console.warn('[Supabase] Missing SUPABASE_URL or Key. Backend will run in fallback In-Memory mode.');
}

export const supabaseClient = client;

export function isSupabaseConfigured(): boolean {
  return client !== null;
}
