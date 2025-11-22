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

    console.log(`🎓 Generating ${count} ${subject} questions for ${region || "unknown region"} | gym=${gym ?? "N/A"} | difficulty=${battleDifficulty ?? "N/A"}`);

    // Load Gemini API key
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("Server configuration error: Missing GEMINI_API_KEY");

    // Region & topic configuration
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

    const regionTopics: Record<string, { math: string[], science: string[], technical: string[] }> = {
      Kanto: {
        math: ["3 digit addition", "subtraction", "2 digit multiplication", "division", "Remainder", "Quotient"],
        science: ["Living and non Living things", "Sense organs", "Water Cycle"],
        technical: ["Basics of Computers"]
      },
      Johto: {
        math: ["Factors", "multiples", "Fractions"],
        science: ["States of matter", "Solar system", "Pollution"],
        technical: ["Basics of HTML"]
      },
      Hoenn: {
        math: ["LCM", "HCF", "Factorizations"],
        science: ["Light", "Sound", "Magnetism"],
        technical: ["Basics of CSS"]
      },
      Sinnoh: {
        math: ["Expansions", "Factorizations", "LCM"],
        science: ["Basic of light", "Sound", "Magnetism"],
        technical: ["Intermediate HTML/CSS"]
      },
      Unova: {
        math: ["Area and Perimeter", "Geometry", "Triangles"],
        science: ["Periodic Table", "Force", "Plant System"],
        technical: ["Basics of Java"]
      },
      Kalos: {
        math: ["Area", "Volume", "Algebra"],
        science: ["Plant System", "Force Numericals"],
        technical: ["Basics of JavaScript"]
      },
      Alola: {
        math: ["Trigonometry", "Simple Interest", "Indices"],
        science: ["Organic Chemistry", "Pressure", "Friction"],
        technical: ["Basics of Python"]
      },
      Galar: {
        math: ["Trigonometry", "Compound Interest", "Indices"],
        science: ["Chemical Bonding", "Metals and Non-metals"],
        technical: ["Intermediate Python"]
      },
    };

    const subj = subject.toLowerCase();
    const topics = regionTopics[region ?? "Kanto"]?.[subj] ?? [];

    const systemPrompt = `You are a quiz generator for an educational Pokémon game.
Generate exactly ${count} ${subject} questions from these topics: ${topics.join(", ")}.
Region: ${region || "Kanto"} | Difficulty: ${difficulty} | Gym: ${gym ?? "General"}
${flavor}
Respond ONLY with valid JSON:
{
  "questions": [
    { "q": "Question text", "a": ["Option 1", "Option 2", "Option 3"], "c": "Correct Option" }
  ]
}`;

    // ✅ Use Gemini 2.5 Flash (correct model)
    const GEMINI_URL =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: { temperature: 0.8, topK: 40, topP: 0.95 },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Gemini API error:", response.status, text);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsedQuestions: Question[] = [];

    try {
      const clean = content.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
      const json = JSON.parse(clean);
      parsedQuestions = json.questions ?? [];
      if (!parsedQuestions.length) throw new Error("No questions found");
    } catch (err) {
      console.warn("⚠️ Failed to parse Gemini output, falling back to default:", err);
      parsedQuestions = [
        { q: "What is 2 + 2?", a: ["3", "4", "5"], c: "4" },
        { q: "Which Pokémon type is strong against Water?", a: ["Fire", "Electric", "Rock"], c: "Electric" },
        { q: "What color is Pikachu?", a: ["Red", "Yellow", "Blue"], c: "Yellow" },
      ];
    }

    console.log(`✅ Generated ${parsedQuestions.length} questions.`);
    return new Response(JSON.stringify({ questions: parsedQuestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error in generate-quiz:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error), details: "Failed to generate quiz questions" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
