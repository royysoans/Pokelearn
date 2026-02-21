// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Question } from '@/types/game';

// Use the Vite-exposed env variables (no dummy fallbacks)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isSupabaseConfigured = !!SUPABASE_URL && !!SUPABASE_ANON_KEY;

// Create the client, but handle the case where env vars are missing so the app doesn't crash on load
// Instead, it will just be unconfigured and caught by AuthGuard.
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder'
);

interface GenerateQuizRequest {
  subject: string;
  count: number;
  region?: string;
  gym?: string;
  difficulty?: string;
}

interface GenerateQuizResponse {
  questions: Question[];
}

export async function invokeFunction(
  name: string,
  body: GenerateQuizRequest
): Promise<GenerateQuizResponse> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase.functions.invoke(name, {
    body,
  });

  if (error) {
    throw new Error(`Edge Function error: ${error.message}`);
  }

  return data as GenerateQuizResponse;
}

export default supabase;
