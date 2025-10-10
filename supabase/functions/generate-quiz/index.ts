import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Question {
  q: string;
  a: string[];
  c: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, count, region } = await req.json();
    console.log(`Generating ${count} ${subject} questions for ${region || 'unknown region'}`);

    const GEMINI_API_KEY = "AIzaSyBQwsH9hErcI9GyCNdCQBkKMSTlD7DOy3s";

    // Difficulty mapping based on region progression
    // Kanto (easiest) -> Johto -> Hoenn -> Sinnoh -> Unova -> Kalos -> Alola -> Galar (hardest)
    const difficultyMap: Record<string, string> = {
      'Kanto': 'elementary level - basic concepts for beginners',
      'Johto': 'beginner level - simple concepts with slightly more depth',
      'Hoenn': 'intermediate level - moderate difficulty requiring some thinking',
      'Sinnoh': 'intermediate-advanced level - requires understanding of concepts',
      'Unova': 'advanced level - challenging questions requiring analysis',
      'Kalos': 'advanced-expert level - complex problems with multiple steps',
      'Alola': 'expert level - sophisticated questions requiring deep knowledge',
      'Galar': 'master level - extremely challenging questions for experts'
    };

    const difficultyLevel = difficultyMap[region] || 'intermediate level';

    const systemPrompt = `You are a quiz question generator for an educational Pokémon game. Generate engaging, age-appropriate questions for students.

CRITICAL: You must respond with ONLY valid JSON in this exact format, with no additional text, markdown, or explanations:
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
- Generate exactly ${count} questions about ${subject}
- Difficulty level: ${difficultyLevel}
- Each question must have exactly 3 answer choices
- Make questions fun and educational with Pokémon themes when possible
- One answer must be clearly correct
- Keep questions concise and clear
- Adjust difficulty based on the region: ${region || 'Kanto'} (earlier regions = easier, later regions = harder)
- The "c" field must match one of the answers in the "a" array exactly`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nGenerate ${count} ${subject} quiz questions in the JSON format specified.`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('Gemini Response:', content);

    // Parse the JSON response
    let parsedQuestions: Question[];
    try {
      // Remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/```\n?/g, '');
      }
      
      const parsed = JSON.parse(cleanContent);
      parsedQuestions = parsed.questions || [];
      
      // Validate the structure
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        throw new Error('Invalid questions format');
      }
      
      // Validate each question
      parsedQuestions.forEach((q, idx) => {
        if (!q.q || !Array.isArray(q.a) || q.a.length !== 3 || !q.c) {
          throw new Error(`Invalid question format at index ${idx}`);
        }
        if (!q.a.includes(q.c)) {
          throw new Error(`Correct answer not in choices at index ${idx}`);
        }
      });
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, content);
      throw new Error('Failed to parse quiz questions from AI');
    }

    console.log(`Successfully generated ${parsedQuestions.length} questions`);
    
    return new Response(
      JSON.stringify({ questions: parsedQuestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-quiz function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed to generate quiz questions'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
