import { Question } from "@/types/game";

const questionBank: Record<string, Question[]> = {
  math: [
    { q: "2 + 2?", a: ["3", "4", "5"], c: "4" },
    { q: "5 * 3?", a: ["15", "10", "20"], c: "15" },
    { q: "10 - 7?", a: ["2", "3", "4"], c: "3" },
    { q: "100 / 4?", a: ["20", "30", "25"], c: "25" },
    { q: "Square root of 9?", a: ["3", "9", "81"], c: "3" },
    { q: "6 + 8?", a: ["12", "14", "16"], c: "14" },
    { q: "12 * 12?", a: ["144", "124", "164"], c: "144" },
    { q: "50 / 5?", a: ["10", "5", "15"], c: "10" },
    { q: "7 + 13?", a: ["19", "20", "21"], c: "20" },
    { q: "9 * 4?", a: ["32", "36", "40"], c: "36" },
  ],
  science: [
    { q: "Water formula?", a: ["H2O", "O2", "CO2"], c: "H2O" },
    { q: "The red planet?", a: ["Mars", "Jupiter", "Venus"], c: "Mars" },
    { q: "Largest mammal?", a: ["Elephant", "Blue Whale", "Giraffe"], c: "Blue Whale" },
    { q: "Planet closest to sun?", a: ["Venus", "Earth", "Mercury"], c: "Mercury" },
    { q: "Symbol for Gold?", a: ["Ag", "Au", "Go"], c: "Au" },
    { q: "What is photosynthesis?", a: ["Making photos", "Plant breathing", "Light to energy"], c: "Light to energy" },
    { q: "Speed of light?", a: ["299,792 km/s", "150,000 km/s", "500,000 km/s"], c: "299,792 km/s" },
    { q: "How many bones in human body?", a: ["196", "206", "216"], c: "206" },
    { q: "What gas do plants absorb?", a: ["Oxygen", "Nitrogen", "Carbon Dioxide"], c: "Carbon Dioxide" },
    { q: "Smallest unit of life?", a: ["Atom", "Cell", "Molecule"], c: "Cell" },
  ],
  coding: [
    { q: "HTML tag for paragraph?", a: ["<p>", "<div>", "<span>"], c: "<p>" },
    { q: "JS declare var?", a: ["var", "let", "const"], c: "let" },
    { q: "CSS stands for?", a: ["Cascading Style Sheets", "Creative Style System", "Computer Style Syntax"], c: "Cascading Style Sheets" },
    { q: "Loop keyword?", a: ["repeat", "while", "loop"], c: "while" },
    { q: "What does 'git clone' do?", a: ["Delete repo", "Copy repo", "Create repo"], c: "Copy repo" },
    { q: "Boolean values?", a: ["Yes/No", "1/0", "True/False"], c: "True/False" },
    { q: "Array method to add item?", a: ["push()", "add()", "append()"], c: "push()" },
    { q: "What is JSON?", a: ["JavaScript Object Notation", "Java Standard Object Network", "JavaScript Open Notation"], c: "JavaScript Object Notation" },
    { q: "HTTP status for success?", a: ["200", "404", "500"], c: "200" },
    { q: "React hook for state?", a: ["useState", "useEffect", "useContext"], c: "useState" },
  ],
};

export function generateQuestions(subject: string, count: number): Question[] {
  const questions = questionBank[subject] || [];
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
