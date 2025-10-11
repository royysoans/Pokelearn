// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import type { Question } from '../types/game.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Request type for your Edge Function
interface GenerateQuizRequest {
  subject: string;
  count: number;
  region?: string;
  gym?: string;
  difficulty?: string;
}

// Response type for your Edge Function
interface GenerateQuizResponse {
  questions: Question[];
}

// Helper to call Edge Functions
export async function invokeFunction(
  name: string,
  body: GenerateQuizRequest
): Promise<GenerateQuizResponse> {
  const isDev = import.meta.env.DEV; // Vite sets this automatically
  const url = isDev
    ? `http://localhost:54321/functions/v1/${name}` // local dev
    : `${supabaseUrl}/functions/v1/${name}`;          // production

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apiKey: supabaseKey, // required by Supabase functions
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Edge Function error: ${res.status} ${text}`);
  }

  return res.json() as Promise<GenerateQuizResponse>;
}