// supabase/functions/generate-quiz/index.ts
// Deno Edge Function for quiz generation
// Run locally with:
// deno run --allow-net --allow-env --allow-read --env-file=.env supabase/functions/generate-quiz/index.ts

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface Question {
  q: string;
  a: string[];
  c: string;
}

interface QuizRequestBody {
  subject: string;
  count: number;
  region?: string;
  gym?: string;
  difficulty?: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

const PORT = Number(Deno.env.get("PORT") ?? "54321");

Deno.serve({ port: PORT }, async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  // favicon.ico
  if (url.pathname === "/favicon.ico") return new Response(null, { status: 204 });

  // CORS preflight
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        message: "Quiz generator is running. Send a POST with JSON body { subject, count, region }.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    let body: QuizRequestBody;
    try {
      body = (await req.json()) as QuizRequestBody;
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body", details: "Expected JSON: { subject, count, region }" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { subject, count, region, gym, difficulty: battleDifficulty } = body;
    if (!subject || !count) {
      return new Response(
        JSON.stringify({ error: "Missing fields", details: "Provide subject and count (and optional region)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating ${count} ${subject} questions for ${region || "unknown region"} | gym=${gym ?? "N/A"} | difficulty=${battleDifficulty ?? "N/A"}`);

    // Load Gemini API key
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("Server configuration error: Missing API key.");

    // Region-based difficulty
    const regionData: Record<string, { difficulty: string; flavor: string }> = {
      Kanto: { difficulty: "very easy", flavor: "Use classic Pokémon like Pikachu, Bulbasaur." },
      Johto: { difficulty: "easy", flavor: "Light reasoning; Pokémon like Chikorita, Cyndaquil." },
      Hoenn: { difficulty: "medium", flavor: "Simple reasoning; Torchic, Mudkip, Treecko." },
      Sinnoh: { difficulty: "medium-hard", flavor: "Multi-step reasoning; Piplup, Chimchar." },
      Unova: { difficulty: "hard", flavor: "Challenging questions; Snivy, Tepig." },
      Kalos: { difficulty: "very hard", flavor: "Complex questions; Froakie, Fennekin." },
      Alola: { difficulty: "expert", flavor: "Advanced reasoning; Rowlet, Litten." },
      Galar: { difficulty: "master", flavor: "High-level thinking; Grookey, Sobble." },
    };

    const { difficulty, flavor } = regionData[region ?? ""] || { difficulty: "intermediate", flavor: "Balanced difficulty." };

    // System prompt
    const systemPrompt = `You are a quiz generator for an educational Pokémon learning game.
CRITICAL: Respond ONLY with valid JSON:
{
  "questions": [
    {
      "q": "question text?",
      "a": ["answer1", "answer2", "answer3"],
      "c": "correct answer"
    }
  ]
}
Rules:
- Generate exactly ${count} questions about ${subject}.
- Region: ${region || "Kanto"}
- Regional difficulty guideline: ${difficulty}
- Gym: ${gym ?? "General"}
- Battle difficulty: ${battleDifficulty ?? "normal"}
- ${flavor}
- Each question must have exactly 3 answer choices, one correct.
- Ensure "c" matches one of the choices in "a".
- Pokémon-themed, educational, fun for ages 10–16.`;

    // Call Gemini 2.0
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { temperature: 0.8, topK: 40, topP: 0.95 },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsedQuestions: Question[];
    try {
      const cleanContent = content.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
      parsedQuestions = (JSON.parse(cleanContent).questions as Question[]) || [];
      if (!parsedQuestions.length) throw new Error("No questions generated.");
      parsedQuestions.forEach((q, idx) => {
        if (!q.q || !Array.isArray(q.a) || q.a.length !== 3 || !q.c || !q.a.includes(q.c)) {
          throw new Error(`Invalid question at index ${idx}`);
        }
      });
    } catch (err) {
      console.error("Failed to parse AI response:", err, content);
      throw new Error("Failed to parse quiz questions from AI.");
    }

    console.log(`✅ Generated ${parsedQuestions.length} questions.`);
    return new Response(JSON.stringify({ questions: parsedQuestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-quiz function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error), details: "Failed to generate quiz questions" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});