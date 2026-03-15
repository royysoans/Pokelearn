import { useState, useEffect, useRef } from "react";
import { Pokemon, Question } from "@/types/game";
import { generateQuestions } from "@/data/questions";
import { PixelButton } from "./PixelButton";
import { motion } from "framer-motion";

interface CatchingMiniGameProps {
  pokemon: Pokemon;
  region: string;
  gym: string;
  subject: "math" | "science" | "coding";
  level: number | "leader";
  onCatchSuccess: () => void;
  onCatchFail: () => void;
}

export function CatchingMiniGame({
  pokemon,
  region,
  gym,
  subject,
  level,
  onCatchSuccess,
  onCatchFail,
}: CatchingMiniGameProps) {
  const [phase, setPhase] = useState<"intro" | "loading" | "playing" | "success" | "fail">("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef(phase);
  const handleFailRef = useRef<() => void>(() => {});

  const getDifficultyRules = () => {
    if (pokemon.rarity === "common") return { type: "Pokéball", count: 1, time: 15, color: "bg-red-500" };
    if (pokemon.rarity === "uncommon") return { type: "Great Ball", count: 2, time: 12, color: "bg-blue-500" };
    return { type: "Ultra Ball", count: 3, time: 10, color: "bg-yellow-500" };
  };

  const rules = getDifficultyRules();

  const startMiniGame = async () => {
    setPhase("loading");
    try {
      // Generate questions specifically for the capture phase
      // Level is now passed down to generate appropriately scaled questions
      const qs = await generateQuestions(subject, rules.count, region, gym, level);
      setQuestions(qs);
      setPhase("playing");
      setTimeLeft(rules.time);
    } catch (error) {
      console.error("Failed to generate catch questions", error);
      // Fallback behavior if Gemini fails: auto-catch
      onCatchSuccess();
    }
  };

  // Keep phaseRef in sync
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (phase === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            // Guard: only fail if we're still in "playing" phase
            if (phaseRef.current === "playing") {
              handleFailRef.current();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentQIndex]);

  useEffect(() => {
    if (questions.length > 0 && phase === "playing") {
      setShuffledAnswers([...questions[currentQIndex].a].sort(() => Math.random() - 0.5));
    }
  }, [currentQIndex, questions, phase]);

  const handleAnswer = (answer: string) => {
    if (phase !== "playing") return;
    
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = answer === questions[currentQIndex].c;

    if (isCorrect) {
      if (currentQIndex + 1 >= rules.count) {
        setPhase("success");
        setTimeout(() => onCatchSuccess(), 2000);
      } else {
        // Next question
        setCurrentQIndex((prev) => prev + 1);
        setTimeLeft(rules.time);
      }
    } else {
      handleFail();
    }
  };

  const handleFail = () => {
    setPhase("fail");
    setTimeout(() => onCatchFail(), 3000);
  };

  // Keep the ref in sync so the timer always calls the latest version
  useEffect(() => {
    handleFailRef.current = handleFail;
  });

  if (phase === "intro") {
    return (
      <div className="bg-card border-4 border-border rounded p-4 sm:p-6 mb-6 flex flex-col items-center justify-center animate-in fade-in duration-300">
        <h2 className="text-xl md:text-2xl text-primary mb-2 text-shadow-pixel blink">Catch Sequence!</h2>
        <p className="text-center mb-4 max-w-sm text-sm md:text-base leading-tight">
          The wild <span style={{ color: pokemon.color }} className="font-bold">{pokemon.name}</span> is weak! <br />
          Rarity: <strong>{pokemon.rarity.toUpperCase()}</strong>. <br />
          You need a <strong className={rules.color + " text-white px-2 rounded inline-block mt-1"}>{rules.type}</strong>!
        </p>
        <div className="bg-background p-3 rounded mb-4 text-xs md:text-sm shadow-inner">
          <p>Answer <strong>{rules.count}</strong> question(s) right.</p>
          <p>Time per question: <strong>{rules.time}s</strong></p>
        </div>
        <PixelButton onClick={startMiniGame} className="w-full max-w-xs">Throw {rules.type}!</PixelButton>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div className="bg-card border-4 border-border rounded p-4 sm:p-6 mb-6 flex flex-col items-center justify-center min-h-[200px] animate-in fade-in duration-300 overflow-hidden relative">
        <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
            {/* SVG Dartboard */}
            <svg viewBox="0 0 100 100" className="w-24 h-24 absolute drop-shadow-md">
                <circle cx="50" cy="50" r="48" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
                <circle cx="50" cy="50" r="38" fill="#0f172a" />
                <circle cx="50" cy="50" r="28" fill="#e2e8f0" />
                <circle cx="50" cy="50" r="18" fill="#ef4444" />
                <circle cx="50" cy="50" r="8" fill="#0f172a" />
                <line x1="50" y1="2" x2="50" y2="98" stroke="#334155" strokeWidth="1" opacity="0.5"/>
                <line x1="2" y1="50" x2="98" y2="50" stroke="#334155" strokeWidth="1" opacity="0.5"/>
            </svg>
        </div>
        <p className="text-primary animate-pulse font-bold text-lg">Aiming {rules.type}...</p>
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="bg-card border-4 border-border rounded p-4 sm:p-6 mb-6 flex flex-col items-center justify-center min-h-[200px] animate-in fade-in duration-300">
        <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-6xl mb-4"
        >
            ✨
        </motion.div>
        <h2 className="text-3xl text-success font-bold text-shadow-pixel animate-bounce">Gotcha!</h2>
      </div>
    );
  }

  if (phase === "fail") {
    return (
      <div className="bg-card border-4 border-border rounded p-4 sm:p-6 mb-6 flex flex-col items-center justify-center min-h-[200px] animate-in fade-in duration-300">
        <motion.div
            initial={{ x: -20 }}
            animate={{ x: 20 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.1 }}
            className="text-6xl mb-4"
        >
            💨
        </motion.div>
        <h2 className="text-xl text-destructive font-bold mb-2">Oh no!</h2>
        <p className="text-muted-foreground text-sm font-bold">The Pokémon broke free and fled!</p>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="bg-card border-4 border-border rounded p-4 sm:p-6 mb-6 flex flex-col animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4 border-b-2 border-border/50 pb-2">
        <div className="text-primary font-bold text-sm md:text-base">
          {rules.type}: {currentQIndex + 1} / {rules.count}
        </div>
        <div className={`text-lg md:text-xl font-bold ${timeLeft <= 3 ? "text-destructive animate-pulse" : "text-foreground"}`}>
          ⏱ {timeLeft}s
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm sm:text-base md:text-xl leading-snug break-words">{currentQ?.q}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {shuffledAnswers.map((answer) => (
          <div key={answer} className="w-full">
            <PixelButton
              variant="secondary"
              className="py-3 px-2 w-full text-center leading-tight break-words whitespace-normal min-h-[60px] justify-center text-sm md:text-base"
              onClick={() => handleAnswer(answer)}
            >
              <span className="line-clamp-3">{answer}</span>
            </PixelButton>
          </div>
        ))}
      </div>
    </div>
  );
}
