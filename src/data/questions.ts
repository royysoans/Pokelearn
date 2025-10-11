// src/lib/questions.ts
import type { Question } from "../types/game.ts";
import { invokeFunction } from "../lib/supabaseClient.ts";

// Fallback question bank
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

// ------------------ Generate Questions ------------------
export async function generateQuestions(
  subject: string,
  count: number,
  region?: string,
  gym?: string,
  difficulty?: string,
): Promise<Question[]> {
  try {
    // Call Supabase Edge Function
    const { questions } = await invokeFunction("generate-quiz", { subject, count, region, gym, difficulty });

    // Session & recent dedup
    const usedKey = `usedQuestions:${region ?? "Unknown"}|${gym ?? "Arena"}|${subject}|${difficulty ?? "normal"}`;
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

    selected.forEach(q => {
      used.add(q.q);
      recent.add(normalizeQuestionText(q.q));
    });

    saveUsedQuestionSet(usedKey, used.size > 500 ? new Set(selected.map(q => q.q)) : used);
    saveRecentQuestions(recent);

    return selected.sort(() => Math.random() - 0.5);
  } catch (err) {
    console.error("AI generation failed, using fallback:", err);
    // Return fallback questions
    const base = questionBank[subject] || questionBank.math;
    return base.slice(0, count);
  }
}

// ------------------ Fetch without session logic ------------------
export async function fetchQuizQuestions(subject: string, count: number): Promise<Question[]> {
  try {
    const { questions } = await invokeFunction("generate-quiz", { subject, count });
    return questions;
  } catch (err) {
    console.error("Failed to fetch AI questions, using fallback:", err);
    return (questionBank[subject] || questionBank.math).slice(0, count);
  }
}