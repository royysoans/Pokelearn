// src/lib/questions.ts
import type { Question } from "../types/game.ts";
import { invokeFunction } from "@/integrations/supabase/client";

// Fallback question bank
const questionBank: Record<string, Question[]> = {
  math: [
    { q: "2 + 2?", a: ["3", "4", "5"], c: "4", e: "If you have 2 items and add 2 more, you get 4." },
    { q: "5 * 3?", a: ["15", "10", "20"], c: "15", e: "5 multiplied by 3 is 15." },
    { q: "10 - 7?", a: ["2", "3", "4"], c: "3", e: "Taking 7 away from 10 leaves 3." },
    { q: "100 / 4?", a: ["20", "30", "25"], c: "25", e: "100 divided into 4 equal parts is 25." },
    { q: "Square root of 9?", a: ["3", "9", "81"], c: "3", e: "3 multiplied by itself is 9." },
  ],
  science: [
    { q: "Water formula?", a: ["H2O", "O2", "CO2"], c: "H2O", e: "Water is composed of 2 Hydrogen atoms and 1 Oxygen atom." },
    { q: "The red planet?", a: ["Mars", "Jupiter", "Venus"], c: "Mars", e: "Mars is known as the red planet due to its iron oxide surface layer." },
    { q: "Largest mammal?", a: ["Elephant", "Blue Whale", "Giraffe"], c: "Blue Whale", e: "The Blue Whale is the largest known mammal to have ever lived." },
    { q: "Planet closest to sun?", a: ["Venus", "Earth", "Mercury"], c: "Mercury", e: "Mercury is the innermost planet in our solar system." },
    { q: "Symbol for Gold?", a: ["Ag", "Au", "Go"], c: "Au", e: "Au comes from the Latin word for gold, 'aurum'." },
  ],
  coding: [
    { q: "HTML tag for paragraph?", a: ["<p>", "<div>", "<span>"], c: "<p>", e: "The <p> tag defines a paragraph." },
    { q: "JS declare var?", a: ["var", "let", "const"], c: "let", e: "'let' allows you to declare block-scoped local variables." },
    { q: "CSS stands for?", a: ["Cascading Style Sheets", "Creative Style System", "Computer Style Syntax"], c: "Cascading Style Sheets", e: "CSS describes how HTML elements are to be displayed." },
    { q: "Loop keyword?", a: ["repeat", "while", "loop"], c: "while", e: "The 'while' loop executes a block of code as long as a specified condition is true." },
    { q: "What does 'git clone' do?", a: ["Delete repo", "Copy repo", "Create repo"], c: "Copy repo", e: "'git clone' is used to copy an existing repository." },
  ],
};

// ------------------ Session Cache Helpers ------------------
function getUsedQuestionSet(key: string): Set<string> {
  try {
    const raw = typeof globalThis !== "undefined" ? globalThis.sessionStorage?.getItem(key) : null;
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveUsedQuestionSet(key: string, used: Set<string>) {
  try {
    if (typeof globalThis !== "undefined") {
      globalThis.sessionStorage?.setItem(key, JSON.stringify(Array.from(used)));
    }
  } catch {
    console.error("Ignored sessionStorage error");
  }
}

function getRecentQuestions(): Set<string> {
  try {
    const raw = typeof globalThis !== "undefined" ? globalThis.sessionStorage?.getItem("recentQuestions") : null;
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveRecentQuestions(recent: Set<string>) {
  try {
    const arr = Array.from(recent).slice(-400); // cap buffer
    if (typeof globalThis !== "undefined") {
      globalThis.sessionStorage?.setItem("recentQuestions", JSON.stringify(arr));
    }
  } catch {
    console.error("Ignored sessionStorage error");
  }
}

function normalizeQuestionText(text: string): string {
  return text.toLowerCase().trim().replace(/[\s\?\.!,:;]+$/g, "").replace(/\s+/g, " ");
}

// ------------------ Offline Quiz Cache Helpers ------------------
function saveToOfflineCache(cacheKey: string, questions: Question[]) {
  try {
    if (typeof localStorage === "undefined" || !questions.length) return;
    const existingRaw = localStorage.getItem(`offlineQuiz:${cacheKey}`);
    let existing: Question[] = [];
    if (existingRaw) {
      try { existing = JSON.parse(existingRaw); } catch {}
    }
    const combined = [...existing];
    const existingTexts = new Set(existing.map(q => normalizeQuestionText(q.q)));
    for (const q of questions) {
      const norm = normalizeQuestionText(q.q);
      if (!existingTexts.has(norm)) {
        existingTexts.add(norm);
        combined.push(q);
      }
    }
    localStorage.setItem(`offlineQuiz:${cacheKey}`, JSON.stringify(combined.slice(-100)));
  } catch (err) {
    console.warn("Could not save questions to offline cache:", err);
  }
}

function getFromOfflineCache(cacheKey: string): Question[] | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(`offlineQuiz:${cacheKey}`);
    if (!raw) return null;
    const questions = JSON.parse(raw) as Question[];
    return questions.length > 0 ? questions : null;
  } catch {
    return null;
  }
}

// ------------------ Generate Questions ------------------
export async function generateQuestions(
  subject: string,
  count: number,
  region?: string,
  gym?: string,
  level?: number | string,
): Promise<Question[]> {
  const cacheKey = `${region ?? "Kanto"}:${gym ?? "General"}:${subject}:${level ?? "1"}`;
  
  try {
    // Call Supabase Edge Function
    let difficultyStr: string;
    if (level === "leader") {
      difficultyStr = "expert";
    } else if (typeof level === "number") {
      difficultyStr = level <= 3 ? "easy" : level <= 6 ? "medium" : level <= 9 ? "hard" : "expert";
    } else {
      difficultyStr = "normal";
    }
    const { questions } = await invokeFunction("generate-quiz", { subject, count, region, gym, difficulty: difficultyStr });

    if (questions && questions.length > 0) {
      saveToOfflineCache(cacheKey, questions);
    }

    // Session & recent dedup
    const usedKey = `usedQuestions:${region ?? "Unknown"}|${gym ?? "Arena"}|${subject}|${level ?? "normal"}`;
    const used = getUsedQuestionSet(usedKey);
    const recent = getRecentQuestions();

    const fresh = questions.filter(q => {
      const norm = normalizeQuestionText(q.q);
      return !used.has(q.q) && !recent.has(norm);
    });
    const reused = questions.filter(q => {
      const norm = normalizeQuestionText(q.q);
      return used.has(q.q) || recent.has(norm);
    });

    let selected = fresh.slice(0, count);
    if (selected.length < count) selected = [...selected, ...reused.slice(0, count - selected.length)];

    // If still not enough, fill with duplicates from selected (cycling)
    if (selected.length < count && selected.length > 0) {
      const missing = count - selected.length;
      for (let i = 0; i < missing; i++) {
        selected.push({ ...selected[i % selected.length] });
      }
    }

    selected.forEach(q => {
      used.add(q.q);
      recent.add(normalizeQuestionText(q.q));
    });

    saveUsedQuestionSet(usedKey, used.size > 500 ? new Set(selected.map(q => q.q)) : used);
    saveRecentQuestions(recent);

    return selected.sort(() => Math.random() - 0.5);
  } catch (err) {
    console.error("AI generation failed, checking offline cache or fallback:", err);

    // Try offline cache first before static bank fallback
    const cached = getFromOfflineCache(cacheKey);
    if (cached && cached.length >= count) {
      console.log(`📦 Restored ${count} questions from offline cache for key ${cacheKey}`);
      return cached.sort(() => Math.random() - 0.5).slice(0, count);
    }

    // Return fallback questions, repeating if necessary to reach count
    const base = questionBank[subject] || [
      { q: `What is the most important concept in ${subject}?`, a: ["Understanding", "Practice", "Patience"], c: "Understanding", e: `The core of ${subject} relies on understanding the fundamentals.` },
      { q: `Which of these is related to ${subject}?`, a: ["Everything", "Nothing", "Something"], c: "Everything", e: `Many concepts tie back to ${subject}.` }
    ];
    return Array.from({ length: count }, (_, i) => ({ ...base[i % base.length] }));
  }
}

// ------------------ Fetch without session logic ------------------
export async function fetchQuizQuestions(subject: string, count: number): Promise<Question[]> {
  try {
    const { questions } = await invokeFunction("generate-quiz", { subject, count });
    if (questions && questions.length > 0) {
      saveToOfflineCache(`general:${subject}`, questions);
    }
    return questions;
  } catch (err) {
    console.error("Failed to fetch AI questions, checking offline cache or fallback:", err);
    const cached = getFromOfflineCache(`general:${subject}`);
    if (cached && cached.length >= count) {
      return cached.sort(() => Math.random() - 0.5).slice(0, count);
    }
    const base = questionBank[subject] || [
      { q: `What is the most important concept in ${subject}?`, a: ["Understanding", "Practice", "Patience"], c: "Understanding", e: `The core of ${subject} relies on understanding the fundamentals.` },
      { q: `Which of these is related to ${subject}?`, a: ["Everything", "Nothing", "Something"], c: "Everything", e: `Many concepts tie back to ${subject}.` }
    ];
    return Array.from({ length: count }, (_, i) => ({ ...base[i % base.length] }));
  }
}

