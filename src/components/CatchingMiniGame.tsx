import { useState, useEffect, useRef } from "react";
import { Pokemon, Question } from "@/types/game";
import { generateQuestions } from "@/data/questions";
import { PixelButton } from "./PixelButton";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showRingPulse, setShowRingPulse] = useState(false);
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
      // Catch questions should be EASIER than battle questions — they're timed and high-stakes
      // Drop the difficulty by ~3 levels (one tier) so they feel fair
      const catchLevel: number | "leader" =
        level === "leader" ? 6
        : typeof level === "number" ? Math.max(1, level - 3)
        : 1;
      const qs = await generateQuestions(subject, rules.count, region, gym, catchLevel);
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
        setTimeout(() => onCatchSuccess(), 5500);
      } else {
        // Flash the ring pulse, then advance
        setShowRingPulse(true);
        setTimeout(() => {
          setShowRingPulse(false);
          setCurrentQIndex((prev) => prev + 1);
          setTimeLeft(rules.time);
        }, 600);
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
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
           style={{ background: "radial-gradient(ellipse at center, #0a0a2e 0%, #000000 100%)" }}>

        {/* Scene container */}
        <div className="relative w-80 h-80 flex items-center justify-center">

          {/* ---- PHASE 1: Pokémon appears center ---- */}
          <motion.img
            src={pokemon.image}
            alt={pokemon.name}
            className="absolute pixelated w-32 h-32 object-contain"
            style={{ top: "20%", filter: `drop-shadow(0 0 20px ${pokemon.color})` }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: [1, 1, 1, 0],
              scale: [1, 1, 1.1, 0],
            }}
            transition={{ duration: 1.2, delay: 0.8, times: [0, 0.5, 0.7, 1], ease: "easeIn" }}
          />

          {/* Red flash when pokemon gets absorbed */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ top: "25%", width: 140, height: 140, left: "calc(50% - 70px)" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0, 0.8, 0], scale: [0.5, 0.5, 1.5, 2] }}
            transition={{ duration: 1.2, delay: 0.8, times: [0, 0.6, 0.8, 1] }}
          >
            <div className="w-full h-full rounded-full bg-white" />
          </motion.div>

          {/* ---- PHASE 2: Pokéball flies up from bottom ---- */}
          <motion.div
            className="absolute"
            style={{ width: 56, height: 56, left: "calc(50% - 28px)" }}
            initial={{ bottom: "-20%", opacity: 0 }}
            animate={{
              bottom: ["-20%", "35%", "35%", "35%", "35%"],
              opacity: [0, 1, 1, 1, 1],
            }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            {/* The Pokéball after it lands */}
            <motion.div
              className="w-full h-full"
              initial={{ rotate: 0 }}
              animate={{
                // Wobble: pause, left, right, pause, left, right, pause, left, right, settle
                rotate: [0, 0, 0, 25, -25, 0, 0, 25, -25, 0, 0, 20, -20, 0],
              }}
              transition={{
                duration: 4.0,
                delay: 2.0,
                times:  [0, 0.02, 0.05, 0.1, 0.15, 0.2, 0.3, 0.35, 0.4, 0.45, 0.55, 0.6, 0.65, 0.7],
                ease: "easeInOut",
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                <circle cx="50" cy="50" r="48" fill="white" stroke="#222" strokeWidth="4" />
                <path d="M 2 50 A 48 48 0 0 1 98 50 Z" fill="#ef4444" />
                <line x1="2" y1="50" x2="38" y2="50" stroke="#222" strokeWidth="4" />
                <line x1="62" y1="50" x2="98" y2="50" stroke="#222" strokeWidth="4" />
                <circle cx="50" cy="50" r="12" fill="#222" />
                <circle cx="50" cy="50" r="8" fill="white" />
                <circle cx="47" cy="47" r="2.5" fill="rgba(255,255,255,0.7)" />
              </svg>
            </motion.div>

            {/* Star flash on final lock — appears after 3 wobbles */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0, 1, 0], scale: [0, 0, 1.8, 2.5] }}
              transition={{ duration: 1.0, delay: 4.6 }}
            >
              <div className="w-16 h-16 rounded-full bg-yellow-300" style={{ boxShadow: "0 0 40px 20px rgba(250,204,21,0.6)" }} />
            </motion.div>
          </motion.div>
        </div>

        {/* ---- PHASE 3: GOTCHA text ---- */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 4.8, type: "spring", stiffness: 300, damping: 20 }}
          className="text-center mt-4"
        >
          <h2
            className="text-5xl font-black text-yellow-400 tracking-widest"
            style={{ textShadow: "4px 4px 0 #000, 0 0 30px rgba(250,204,21,0.7)" }}
          >
            GOTCHA!
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5.2 }}
            className="text-lg mt-2 font-bold"
            style={{ color: pokemon.color, textShadow: "0 0 10px rgba(255,255,255,0.3)" }}
          >
            {pokemon.name} was caught!
          </motion.p>
        </motion.div>
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
  // Ring progress: 1.0 = fully open, 0.0 = fully closed
  const ringProgress = 1 - (currentQIndex / rules.count);
  // Ring scale goes from 1.0 down to 0.35
  const ringScale = 0.35 + ringProgress * 0.65;
  // Color transitions: cyan → yellow → orange → red as ring closes
  const ringHue = ringProgress * 180; // 180=cyan, 90=yellow-green, 0=red

  return (
    <div className="bg-card border-4 border-border rounded p-4 sm:p-6 mb-6 flex flex-col animate-in fade-in duration-300">

      {/* ===== Pokémon + Capture Ring ===== */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative w-40 h-40 flex items-center justify-center">

          {/* Outer glow ring */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            animate={{
              scale: showRingPulse ? [ringScale, ringScale * 1.3, ringScale * 0.9] : ringScale,
              opacity: showRingPulse ? [1, 0.5, 1] : 0.9,
            }}
            transition={{
              duration: showRingPulse ? 0.5 : 0.8,
              ease: "easeInOut",
            }}
            style={{
              width: 160,
              height: 160,
              border: `4px solid hsl(${ringHue}, 90%, 55%)`,
              boxShadow: `0 0 20px 4px hsla(${ringHue}, 90%, 55%, 0.5), inset 0 0 15px 2px hsla(${ringHue}, 90%, 55%, 0.2)`,
            }}
          />

          {/* Inner pulsing ring */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            animate={{
              scale: showRingPulse ? [ringScale * 0.85, ringScale * 1.1, ringScale * 0.8] : ringScale * 0.85,
              opacity: showRingPulse ? [0.7, 0.3, 0.7] : 0.5,
            }}
            transition={{
              duration: showRingPulse ? 0.5 : 1.2,
              ease: "easeInOut",
            }}
            style={{
              width: 160,
              height: 160,
              border: `2px solid hsl(${ringHue}, 80%, 70%)`,
              boxShadow: `0 0 12px 2px hsla(${ringHue}, 80%, 70%, 0.3)`,
            }}
          />

          {/* Correct answer flash burst */}
          <AnimatePresence>
            {showRingPulse && (
              <motion.div
                key="pulse"
                className="absolute rounded-full pointer-events-none"
                initial={{ scale: 0.3, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  width: 120,
                  height: 120,
                  background: `radial-gradient(circle, hsla(${ringHue}, 90%, 60%, 0.5), transparent)`,
                }}
              />
            )}
          </AnimatePresence>

          {/* Pokémon image */}
          <motion.img
            src={pokemon.image}
            alt={pokemon.name}
            className="pixelated w-20 h-20 sm:w-24 sm:h-24 object-contain relative z-10"
            animate={{
              scale: showRingPulse ? [1, 0.9, 1.05, 1] : 1,
            }}
            transition={{ duration: 0.4 }}
            style={{ filter: `drop-shadow(0 0 8px ${pokemon.color})` }}
          />
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-2">
          {Array.from({ length: rules.count }).map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              animate={{
                scale: i === currentQIndex ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.6, repeat: i === currentQIndex ? Infinity : 0 }}
              style={{
                width: 10,
                height: 10,
                background: i < currentQIndex
                  ? `hsl(${180 - (i / rules.count) * 180}, 90%, 55%)`
                  : i === currentQIndex
                  ? `hsl(${ringHue}, 90%, 55%)`
                  : "rgba(255,255,255,0.2)",
                boxShadow: i <= currentQIndex ? `0 0 6px hsla(${ringHue}, 90%, 55%, 0.5)` : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* ===== Header row ===== */}
      <div className="flex justify-between items-center mb-4 border-b-2 border-border/50 pb-2">
        <div className="text-primary font-bold text-sm md:text-base">
          {rules.type}: {currentQIndex + 1} / {rules.count}
        </div>
        <div className={`text-lg md:text-xl font-bold ${timeLeft <= 3 ? "text-destructive animate-pulse" : "text-foreground"}`}>
          ⏱ {timeLeft}s
        </div>
      </div>

      {/* ===== Question ===== */}
      <div className="mb-6">
        <p className="text-sm sm:text-base md:text-xl leading-snug break-words">{currentQ?.q}</p>
      </div>

      {/* ===== Answer buttons ===== */}
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
