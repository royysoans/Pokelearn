import { Question } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";

// Fallback questions in case AI generation fails
const questionBank: Record<string, Question[]> = {
  math: [
    { q: "2 + 2?", a: ["3", "4", "5"], c: "4" },
    { q: "5 * 3?", a: ["15", "10", "20"], c: "15" },
    { q: "10 - 7?", a: ["2", "3", "4"], c: "3" },
    { q: "100 / 4?", a: ["20", "30", "25"], c: "25" },
    { q: "Square root of 9?", a: ["3", "9", "81"], c: "3" },
  ],
  science: [
    { q: "Water formula?", a: ["H2O", "O2", "CO2"], c: "H2O" },
    { q: "The red planet?", a: ["Mars", "Jupiter", "Venus"], c: "Mars" },
    { q: "Largest mammal?", a: ["Elephant", "Blue Whale", "Giraffe"], c: "Blue Whale" },
    { q: "Planet closest to sun?", a: ["Venus", "Earth", "Mercury"], c: "Mercury" },
    { q: "Symbol for Gold?", a: ["Ag", "Au", "Go"], c: "Au" },
  ],
  coding: [
    { q: "HTML tag for paragraph?", a: ["<p>", "<div>", "<span>"], c: "<p>" },
    { q: "JS declare var?", a: ["var", "let", "const"], c: "let" },
    { q: "CSS stands for?", a: ["Cascading Style Sheets", "Creative Style System", "Computer Style Syntax"], c: "Cascading Style Sheets" },
    { q: "Loop keyword?", a: ["repeat", "while", "loop"], c: "while" },
    { q: "What does 'git clone' do?", a: ["Delete repo", "Copy repo", "Create repo"], c: "Copy repo" },
  ],
};

export async function generateQuestions(subject: string, count: number, region?: string): Promise<Question[]> {
  try {
    // Call the AI edge function to generate questions
    const { data, error } = await supabase.functions.invoke('generate-quiz', {
      body: { subject, count, region }
    });

    if (error) {
      console.error('Error generating AI questions:', error);
      throw error;
    }

    if (data?.error) {
      console.error('AI generation error:', data.error);
      throw new Error(data.error);
    }

    if (data?.questions && Array.isArray(data.questions) && data.questions.length > 0) {
      console.log(`Successfully generated ${data.questions.length} AI questions for ${subject}`);
      return data.questions;
    }

    throw new Error('No questions returned from AI');

  } catch (error) {
    console.error('Failed to generate AI questions, using fallback:', error);
    // Fallback to hardcoded questions
    const questions = questionBank[subject] || questionBank.math;
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
