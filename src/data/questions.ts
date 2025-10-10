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

// Session cache helpers for avoiding repeats per region+gym+subject
function getUsedQuestionSet(key: string): Set<string> {
  try {
    const raw = typeof window !== 'undefined' ? window.sessionStorage.getItem(key) : null;
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveUsedQuestionSet(key: string, used: Set<string>) {
  try {
    const arr = Array.from(used);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(key, JSON.stringify(arr));
    }
  } catch {
    // ignore storage errors
  }
}

// Global recent buffer across the whole session to aggressively prevent repeats
function getRecentQuestions(): Set<string> {
  try {
    const raw = typeof window !== 'undefined' ? window.sessionStorage.getItem('recentQuestions') : null;
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch { return new Set(); }
}

function saveRecentQuestions(recent: Set<string>) {
  try {
    const arr = Array.from(recent).slice(-400); // cap buffer
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('recentQuestions', JSON.stringify(arr));
    }
  } catch {}
}

function normalizeQuestionText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\?\.!,:;]+$/g, '')
    .replace(/\s+/g, ' ');
}

export async function generateQuestions(
  subject: string,
  count: number,
  region?: string,
  gym?: string,
  difficulty?: string,
): Promise<Question[]> {
  try {
    // Call the AI edge function to generate questions
    const { data, error } = await supabase.functions.invoke('generate-quiz', {
      body: { subject, count, region, gym, difficulty }
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
      // Post-process: session de-dup + global recent de-dup
      const usedKey = `usedQuestions:${region ?? 'Unknown'}|${gym ?? 'Arena'}|${subject}|${difficulty ?? 'normal'}`;
      const used = getUsedQuestionSet(usedKey);
      const recent = getRecentQuestions();
      const pool: Question[] = data.questions as Question[];
      const fresh = pool.filter(q => {
        const norm = normalizeQuestionText(q.q);
        return !used.has(q.q) && !recent.has(norm);
      });
      const reused = pool.filter(q => {
        const norm = normalizeQuestionText(q.q);
        return used.has(q.q) || recent.has(norm);
      });
      let selected = fresh.slice(0, count);
      if (selected.length < count) {
        selected = [...selected, ...reused.slice(0, count - selected.length)];
      }
      // Update used set (cap to prevent unbounded growth)
      selected.forEach(q => {
        used.add(q.q);
        recent.add(normalizeQuestionText(q.q));
      });
      if (used.size > 500) {
        // trim oldest approximately by recreating from recent selection only
        saveUsedQuestionSet(usedKey, new Set(selected.map(q => q.q)));
      } else {
        saveUsedQuestionSet(usedKey, used);
      }
      saveRecentQuestions(recent);
      return selected.sort(() => Math.random() - 0.5);
    }

    throw new Error('No questions returned from AI');

  } catch (error) {
    console.error('Failed to generate AI questions, using fallback:', error);
    // Fallback to hardcoded questions with region-based scaling
    const base = questionBank[subject] || questionBank.math;

    // Procedural scaling for math to simulate difficulty tiers
    function generateMathByDifficulty(level: number): Question[] {
      const items: Question[] = [];
      const maxBase = 10 + level * 5;
      const opPool: Array<"+"|"-"|"*"|"/"> = level < 2 ? ["+","-"] : level < 4 ? ["+","-","*"] : ["+","-","*","/"];
      for (let i = 0; i < 30; i++) {
        const op = opPool[(i + level) % opPool.length];
        let a = 2 + ((i * 7 + level) % maxBase);
        let b = 2 + ((i * 5 + level * 3) % maxBase);
        let q = "";
        let correct: number;

        if (op === "/") {
          // Ensure clean division: make dividend = quotient * divisor
          const divisor = Math.max(2, (b % (6 + level)) + 2);
          const quotient = Math.max(1, (a % (8 + level)) + 1);
          const dividend = divisor * quotient;
          q = `${dividend} ÷ ${divisor}`;
          correct = quotient;
        } else if (op === "*") {
          // Keep products reasonable
          a = Math.min(a, 10 + level * 2);
          b = Math.min(b, 10 + level * 2);
          q = `${a} × ${b}`;
          correct = a * b;
        } else if (op === "+") {
          q = `${a} + ${b}`;
          correct = a + b;
        } else { // "-"
          // Ensure non-negative
          if (b > a) [a, b] = [b, a];
          q = `${a} - ${b}`;
          correct = a - b;
        }

        // Build plausible distractors
        const step = Math.max(1, Math.floor(level / 2) + 1);
        const d1 = correct + step;
        const d2 = Math.max(0, correct - step);
        const choices = new Set<string>([String(correct), String(d1), String(d2)]);
        // If duplicates happened, add another close value
        while (choices.size < 3) {
          choices.add(String(correct + step + 1));
        }
        const answers = Array.from(choices).sort(() => Math.random() - 0.5);
        items.push({ q: q + "?", a: answers, c: String(correct) });
      }
      return items;
    }

    // Procedural scaling for science
    function generateScienceByDifficulty(level: number): Question[] {
      const topics = [
        ["Water formula?", "H2O", ["O2", "CO2"]],
        ["Red planet?", "Mars", ["Jupiter", "Venus"]],
        ["Nearest star to Earth?", "Sun", ["Alpha Centauri", "Sirius"]],
        ["Human adult teeth count?", "32", ["28", "30"]],
        ["Acceleration due to gravity (m/s^2)?", "9.8", ["8.9", "10.8"]],
        ["pH of neutral water?", "7", ["6", "8"]],
        ["Boiling point of water (°C)?", "100", ["90", "110"]],
        ["Gas plants absorb?", "CO2", ["O2", "N2"]],
      ] as const;
      const items: Question[] = [];
      for (let i = 0; i < topics.length; i++) {
        const [q, correct, distractors] = topics[i];
        // Increase difficulty by mixing numeric variants and less obvious distractors
        const extra = String(correct) === correct && /\d/.test(String(correct))
          ? String(Number(correct) + (level % 3) + 1)
          : distractors[(i + level) % distractors.length];
        const answers = [String(correct), distractors[0], distractors[1] ?? extra, extra]
          .slice(0, 3)
          .sort(() => Math.random() - 0.5);
        items.push({ q, a: answers, c: String(correct) });
      }
      return items;
    }

    // Procedural scaling for coding
    function generateCodingByDifficulty(level: number): Question[] {
      const base: Array<[string, string, string[], string]> = [
        ["HTML tag for paragraph?", "<p>", ["<div>", "<span>"], "<p>"],
        ["JS keyword to declare block-scoped variable?", "let", ["var", "const"], "let"],
        ["CSS stands for?", "Cascading Style Sheets", ["Creative Style System", "Computer Style Syntax"], "Cascading Style Sheets"],
        ["Array length property in JS?", "length", ["size", "count"], "length"],
        ["Equality operator avoiding type coercion?", "===", ["==", "="], "==="],
      ];
      const items: Question[] = [];
      for (let i = 0; i < base.length; i++) {
        const [q, correct, distractors] = base[i];
        const extra = level > 3 ? (i % 2 === 0 ? "Object.is" : "!==") : distractors[(i + level) % distractors.length];
        const answers = [String(correct), distractors[0], extra].sort(() => Math.random() - 0.5);
        items.push({ q, a: answers, c: String(correct) });
      }
      // Add programmatic questions scaling with level
      if (level >= 3) {
        for (let n = 1; n <= Math.min(5, level); n++) {
          const correct = n * (level + 1);
          const q = `What is ${n} * ${level + 1} in JS?`;
          const answers = [String(correct), String(correct + 1), String(correct - 1)].sort(() => Math.random() - 0.5);
          items.push({ q, a: answers, c: String(correct) });
        }
      }
      return items;
    }

    const regionLevel: Record<string, number> = {
      Kanto: 0,       // very easy
      Johto: 1,       // easy
      Hoenn: 2,       // medium
      Sinnoh: 3,      // medium-hard
      Unova: 4,       // hard
      Kalos: 5,       // very hard
      Alola: 6,       // expert
      Galar: 7,       // master
    };

    const level = region ? (regionLevel[region] ?? 2) : 2;
    // Increase difficulty within region by battle difficulty
    const diffOffset = (
      difficulty === 'leader' ? 3 :
      difficulty === 'hard' ? 2 :
      difficulty === 'medium' ? 1 : 0
    );
    const effectiveLevel = Math.min(8, level + diffOffset);

    let pool: Question[] = base;
    if (subject === 'math') {
      const generated = generateMathByDifficulty(effectiveLevel);
      pool = [...base, ...generated];
    } else if (subject === 'science') {
      const generated = generateScienceByDifficulty(effectiveLevel);
      pool = [...base, ...generated];
    } else if (subject === 'coding') {
      const generated = generateCodingByDifficulty(effectiveLevel);
      pool = [...base, ...generated];
    }

    // Seeded selection to reduce repetition across region/gym/difficulty
    const seedKey = `${region ?? 'Unknown'}|${gym ?? 'Arena'}|${difficulty ?? 'normal'}|${subject}`;
    let hash = 0;
    for (let i = 0; i < seedKey.length; i++) {
      hash = ((hash << 5) - hash) + seedKey.charCodeAt(i);
      hash |= 0; // convert to 32-bit int
    }
    const offset = Math.abs(hash) % Math.max(1, pool.length - count);
    const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];

    // Apply session de-dup per region+gym+subject
    const usedKey = `usedQuestions:${region ?? 'Unknown'}|${gym ?? 'Arena'}|${subject}|${difficulty ?? 'normal'}`;
    const used = getUsedQuestionSet(usedKey);
    const recent = getRecentQuestions();
    const fresh = rotated.filter(q => {
      const norm = normalizeQuestionText(q.q);
      return !used.has(q.q) && !recent.has(norm);
    });
    const reused = rotated.filter(q => {
      const norm = normalizeQuestionText(q.q);
      return used.has(q.q) || recent.has(norm);
    });
    let selection = fresh.slice(0, count);
    if (selection.length < count) {
      selection = [...selection, ...reused.slice(0, count - selection.length)];
    }
    selection = selection.sort(() => Math.random() - 0.5);
    // Update used set and persist
    selection.forEach(q => {
      used.add(q.q);
      recent.add(normalizeQuestionText(q.q));
    });
    if (used.size > 500) {
      saveUsedQuestionSet(usedKey, new Set(selection.map(q => q.q)));
    } else {
      saveUsedQuestionSet(usedKey, used);
    }
    saveRecentQuestions(recent);
    return selection;
  }
}
