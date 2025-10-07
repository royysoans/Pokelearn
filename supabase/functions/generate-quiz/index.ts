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
    const { subject, count } = await req.json();
    console.log(`Generating ${count} ${subject} questions`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

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
- Each question must have exactly 3 answer choices
- Make questions fun and educational
- One answer must be clearly correct
- Keep questions concise and clear
- The "c" field must match one of the answers in the "a" array exactly`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate ${count} ${subject} quiz questions in the JSON format specified.` }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log('AI Response:', content);

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
