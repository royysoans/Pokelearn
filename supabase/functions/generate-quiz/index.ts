// Deno edge function for quiz generation
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

// Allow overriding the port for local runs to avoid conflicts
const PORT = Number(Deno.env.get("PORT") ?? "8000");

Deno.serve({ port: PORT }, async (req) => {
  const url = new URL(req.url);

  // 🧩 Handle favicon.ico
  if (url.pathname === "/favicon.ico") {
    return new Response(null, { status: 204 });
  }

  // 🧩 Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // 🧩 Handle non-POST methods gracefully
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        message: "Quiz generator is running. Send a POST with JSON body { subject, count, region }.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    let body: any;
    try {
      body = await req.json();
    } catch (_) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body", details: "Expected JSON: { subject, count, region }" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { subject, count, region, gym, difficulty: battleDifficulty } = body ?? {};
    if (!subject || !count) {
      return new Response(
        JSON.stringify({ error: "Missing fields", details: "Provide subject and count (and optional region)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    console.log(`Generating ${count} ${subject} questions for ${region || "unknown region"} | gym=${gym ?? 'N/A'} | difficulty=${battleDifficulty ?? 'N/A'}`);

    // 🧩 Load Gemini API key securely
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not found in environment variables.");
      throw new Error("Server configuration error: Missing API key.");
    }

  // 🧩 Region-based difficulty and Pokémon flavor (aligned to requested scale)
    const regionData: Record<string, { difficulty: string; flavor: string }> = {
      Kanto: {
        difficulty: "very easy — simple concepts for beginners",
        flavor: "Use classic Pokémon like Pikachu, Bulbasaur, Charmander, and Squirtle; focus on basics.",
      },
      Johto: {
        difficulty: "easy — basic logic and simple Pokémon trivia",
        flavor: "Light reasoning; Pokémon like Chikorita, Cyndaquil, and Totodile.",
      },
      Hoenn: {
        difficulty: "medium — moderate difficulty, simple reasoning required",
        flavor: "Short calculations or single-step concepts; Torchic, Mudkip, Treecko.",
      },
      Sinnoh: {
        difficulty: "medium-hard — requires some problem-solving and applied knowledge",
        flavor: "Introduce multi-step reasoning; Piplup, Chimchar, Turtwig.",
      },
      Unova: {
        difficulty: "hard — multi-step reasoning and more challenging questions",
        flavor: "Analytical thinking; Snivy, Tepig, Oshawott.",
      },
      Kalos: {
        difficulty: "very hard — complex questions with multiple steps",
        flavor: "Layered reasoning and problem-solving; Froakie, Fennekin, Chespin.",
      },
      Alola: {
        difficulty: "expert — advanced reasoning and creative problem-solving",
        flavor: "Higher-order application; Rowlet, Litten, Popplio.",
      },
      Galar: {
        difficulty: "master — extremely challenging, requires high-level thinking",
        flavor: "Most conceptually demanding; Grookey, Scorbunny, Sobble.",
      },
    };

    const { difficulty, flavor } = regionData[region] || {
      difficulty: "intermediate level",
      flavor: "Use a balanced mix of Pokémon and moderate question complexity.",
    };

    // 🧩 Strong system prompt
    const systemPrompt = `You are a quiz generator for an educational Pokémon learning game.

CRITICAL: Respond ONLY with valid JSON in this format:
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
- Adjust complexity by battle difficulty:
  - easy: smaller numbers, single-step reasoning, straightforward facts
  - medium: moderate numbers, one or two steps, light traps
  - hard: multi-step reasoning, larger numbers/ranges, trickier distractors
  - leader: hardest multi-step reasoning, real-world or cross-concept applications
- ${flavor}
- Each region must have unique, non-repetitive questions.
- Each question must have exactly 3 answer choices, one of which is correct.
- Ensure "c" exactly matches one of the choices in "a".
- Make questions Pokémon-themed, educational, concise, and fun for ages 10–16.`;

    // 🧩 Gemini API request
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nGenerate ${count} unique ${subject} quiz questions in JSON only.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Gemini API error:", response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    // 🧩 Parse response
    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    console.log("🔍 Raw Gemini content:", content);

    // 🧩 Clean up and parse AI response
    let parsedQuestions: Question[];
    try {
      let cleanContent = content.trim();
      cleanContent = cleanContent.replace(/^```json\s*/i, "").replace(/```$/i, "");
      const parsed = JSON.parse(cleanContent);
      parsedQuestions = parsed.questions || [];

      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        throw new Error("Invalid questions format");
      }

      parsedQuestions.forEach((q, idx) => {
        if (!q.q || !Array.isArray(q.a) || q.a.length !== 3 || !q.c) {
          throw new Error(`Invalid question format at index ${idx}`);
        }
        if (!q.a.includes(q.c)) {
          throw new Error(`Correct answer not in choices at index ${idx}`);
        }
      });
    } catch (parseError) {
      console.error("❌ Failed to parse AI response:", parseError, content);
      throw new Error("Failed to parse quiz questions from AI.");
    }

    console.log(`✅ Successfully generated ${parsedQuestions.length} questions.`);
    return new Response(
      JSON.stringify({ questions: parsedQuestions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("❌ Error in generate-quiz function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        details: "Failed to generate quiz questions",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
