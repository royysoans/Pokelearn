// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

// Use the Vite-exposed env variables (no dummy fallbacks)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL) {
  throw new Error('Missing VITE_SUPABASE_URL in your environment');
}
if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY in your environment');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const isSupabaseConfigured = !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
export default supabase;
