import { createClient } from '@supabase/supabase-js';
import type { Question } from '../types/game.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  const isDev = import.meta.env.DEV;
  const url = isDev
    ? `http://localhost:54321/functions/v1/${name}`
    : `${supabaseUrl}/functions/v1/${name}`;

  const session = await supabase.auth.getSession();
  const access_token = session.data.session?.access_token;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apiKey: supabaseKey,
      Authorization: `Bearer ${access_token ?? supabaseKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Edge Function error: ${res.status} ${text}`);
  }

  return res.json() as Promise<GenerateQuizResponse>;
}
