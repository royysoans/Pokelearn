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
        setTimeout(() => onCatchSuccess(), 6800);
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
    setTimeout(() => onCatchFail(), 5000);
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

  const ballColorMap = {
    "Pokéball": "#ef4444",
    "Great Ball": "#3b82f6",
    "Ultra Ball": "#eab308"
  };
  const getBallTopColor = () => ballColorMap[rules.type as keyof typeof ballColorMap] || "#ef4444";

  if (phase === "success") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black">
        
        {/* Scene container */}
        <div className="relative w-80 h-80 flex items-center justify-center">

          {/* ---- PHASE 1: Pokémon gets hit and absorbed ---- */}
          <motion.img
            src={pokemon.image}
            alt={pokemon.name}
            className="absolute pixelated w-32 h-32 object-contain"
            style={{ top: "20%", filter: `drop-shadow(0 0 20px ${pokemon.color})` }}
            initial={{ opacity: 1, scale: 1, filter: `brightness(1) drop-shadow(0 0 20px ${pokemon.color})` }}
            animate={{
              opacity: [1, 1, 0.8, 0],
              scale: [1, 1, 0.3, 0],
              filter: [
                `brightness(1) drop-shadow(0 0 20px ${pokemon.color})`, 
                `brightness(1) drop-shadow(0 0 20px ${pokemon.color})`,
                `brightness(3) drop-shadow(0 0 40px ${pokemon.color})`, 
                `brightness(3) drop-shadow(0 0 40px ${pokemon.color})`
              ]
            }}
            transition={{ duration: 1.2, delay: 0.6, times: [0, 0.4, 0.8, 1], ease: "anticipate" }}
          />

          {/* Red/White flash when pokemon gets absorbed */}
          <motion.div
            className="absolute rounded-full pointer-events-none mix-blend-screen"
            style={{ top: "25%", width: 140, height: 140, left: "calc(50% - 70px)" }}
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: [0, 0, 1, 0], scale: [0.1, 0.1, 1.2, 0.2] }}
            transition={{ duration: 1.2, delay: 0.6, times: [0, 0.8, 0.85, 1], ease: "circIn" }}
          >
            <div className={`w-full h-full rounded-full bg-white shadow-[0_0_50px_20px_white]`} />
          </motion.div>

          {/* ---- PHASE 2 & 3: Pokéball throw, hit, and drop ---- */}
          <motion.div
            className="absolute z-10"
            style={{ width: 48, height: 48, left: "calc(50% - 24px)" }}
            initial={{ bottom: "-20%", left: "-20%", opacity: 0, scale: 3, rotate: -720 }}
            animate={{
              bottom: ["-20%", "55%", "35%"],
              left: ["-20%", "50%", "50%"],
              opacity: [1, 1, 1],
              scale: [3, 1.2, 1],
              rotate: [-720, -180, 0]
            }}
            transition={{ 
                duration: 1.2,
                times: [0, 0.6, 1],
                ease: ["easeOut", "easeIn"]
            }}
          >
            {/* The Pokéball wobbling */}
            <motion.div
              className="w-full h-full"
              initial={{ rotate: 0 }}
              animate={{
                rotate: [0, 0, 20, -15, 0, 0, 20, -15, 0, 0, 20, -15, 0, 0],
              }}
              transition={{
                duration: 3.5,
                delay: 1.2,
                times:  [0, 0.1, 0.16, 0.22, 0.28, 0.45, 0.51, 0.57, 0.63, 0.8, 0.86, 0.92, 0.98, 1],
                ease: "easeInOut",
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                <circle cx="50" cy="50" r="48" fill="white" stroke="#222" strokeWidth="4" />
                <path d="M 2 50 A 48 48 0 0 1 98 50 Z" fill={getBallTopColor()} />
                <line x1="2" y1="50" x2="38" y2="50" stroke="#222" strokeWidth="4" />
                <line x1="62" y1="50" x2="98" y2="50" stroke="#222" strokeWidth="4" />
                <circle cx="50" cy="50" r="12" fill="#222" />
                <circle cx="50" cy="50" r="8" fill="white" />
                {/* Flashing Button */}
                <motion.circle 
                  cx="50" cy="50" r="6"
                  animate={{ fill: ["#ffffff", "#ef4444", "#ffffff"] }}
                  transition={{ duration: 0.8, delay: 1.2, repeat: 3, repeatDelay: 0.3, repeatType: "loop" }}
                />
              </svg>
            </motion.div>

            {/* Star flash on final lock */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 2, 3] }}
              transition={{ duration: 0.6, delay: 4.6, ease: "easeOut" }}
            >
              {/* Star shapes */}
              <div className="absolute w-2 h-16 bg-yellow-300 rounded-full rotate-45" style={{ boxShadow: "0 0 10px #fbbf24" }} />
              <div className="absolute w-2 h-16 bg-yellow-300 rounded-full -rotate-45" style={{ boxShadow: "0 0 10px #fbbf24" }} />
              <div className="absolute w-16 h-2 bg-yellow-300 rounded-full" style={{ boxShadow: "0 0 10px #fbbf24" }} />
              <div className="absolute w-2 h-16 bg-yellow-300 rounded-full" style={{ boxShadow: "0 0 10px #fbbf24" }} />
              <div className="w-12 h-12 rounded-full bg-yellow-100 shadow-[0_0_30px_10px_#fde047]" />
            </motion.div>
          </motion.div>
        </div>

        {/* ---- PHASE 4: GOTCHA text ---- */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 4.8, type: "spring", stiffness: 400, damping: 15 }}
          className="text-center mt-4"
        >
          <h2
            className="text-5xl md:text-6xl font-black text-yellow-400 tracking-widest italic"
            style={{ textShadow: "4px 4px 0 #000, 0 0 20px rgba(250,204,21,0.6)" }}
          >
            GOTCHA!
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.2, ease: "easeOut" }}
            className="mt-4 flex justify-center"
          >
            <div className="px-6 py-2 bg-black/40 backdrop-blur-sm rounded-full border border-white/20 inline-block">
              <p className="text-lg md:text-xl font-bold text-white shadow-black drop-shadow-md">
                <span style={{ color: pokemon.color }}>{pokemon.name}</span> was caught!
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (phase === "fail") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black">
        
        <div className="relative w-80 h-80 flex items-center justify-center">

          {/* Phase 1: Pokemon gets hit/absorbed */}
          <motion.img
            src={pokemon.image}
            alt={pokemon.name}
            className="absolute pixelated w-32 h-32 object-contain"
            style={{ top: "20%", filter: `drop-shadow(0 0 20px ${pokemon.color})` }}
            initial={{ opacity: 1, scale: 1, filter: `brightness(1) drop-shadow(0 0 20px ${pokemon.color})` }}
            animate={{
              opacity: [1, 1, 0, 0, 1, 1],
              scale: [1, 1, 0.2, 0.2, 1.2, 1],
              filter: [
                `brightness(1) drop-shadow(0 0 20px ${pokemon.color})`, 
                `brightness(1) drop-shadow(0 0 20px ${pokemon.color})`, 
                `brightness(3) drop-shadow(0 0 20px ${pokemon.color})`, 
                `brightness(3) drop-shadow(0 0 20px ${pokemon.color})`, 
                `brightness(3) drop-shadow(0 0 20px ${pokemon.color})`, 
                `brightness(1) drop-shadow(0 0 20px ${pokemon.color})`
              ]
            }}
            transition={{ 
              duration: 2.8, 
              delay: 0.3, 
              times: [0, 0.2, 0.25, 0.7, 0.8, 1], 
              ease: "easeInOut" 
            }}
          />

          {/* Red/White flash when pokemon gets absorbed */}
          <motion.div
            className="absolute rounded-full pointer-events-none mix-blend-screen"
            style={{ top: "25%", width: 140, height: 140, left: "calc(50% - 70px)" }}
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: [0, 0, 1, 0], scale: [0.1, 0.1, 1.2, 0.2] }}
            transition={{ duration: 1.2, delay: 0.3, times: [0, 0.8, 0.85, 1], ease: "circIn" }}
          />

          {/* Phase 2: Pokeball thrown, wobble, break */}
          <motion.div
            className="absolute z-10"
            style={{ width: 48, height: 48, left: "calc(50% - 24px)" }}
            initial={{ bottom: "-20%", left: "-20%", opacity: 0, scale: 3, rotate: -720 }}
            animate={{
              bottom: ["-20%", "55%", "35%", "35%", "35%"],
              left: ["-20%", "50%", "50%", "50%", "50%"],
              opacity: [1, 1, 1, 1, 0],
              scale: [3, 1.2, 1, 1, 1.5],
              rotate: [-720, -180, 0, 0, 0]
            }}
            transition={{ 
                duration: 3.5,
                delay: 0,
                times: [0, 0.2, 0.34, 0.85, 1],
                ease: ["easeOut", "easeIn", "linear", "linear"]
            }}
          >
            {/* The Pokéball wobbling once then splitting */}
            <motion.div
              className="w-full h-full relative"
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 0, 20, -15, 0, 0] }}
              transition={{ duration: 1.8, delay: 1.2, times: [0, 0.1, 0.3, 0.5, 0.7, 1], ease: "easeInOut" }}
            >
              {/* Ball Bottom half */}
              <motion.svg viewBox="0 0 100 50" className="absolute bottom-0 w-[48px] h-[24px] drop-shadow-2xl"
                  initial={{ y: 24, rotate: 0, opacity: 1 }}
                  animate={{ y: [24, 24, 24, 34], rotate: [0, 0, 0, -10], opacity: [1, 1, 1, 0] }}
                  transition={{ duration: 3.5, times: [0, 0.82, 0.86, 1] }}
                  style={{ transformOrigin: "bottom center", overflow: 'visible' }}
              >
                {/* Because viewBox is 0 0 100 50 but we map it to 100x100 circle bottom half */}
                <path d="M 2 0 A 48 48 0 0 0 98 0 Z" fill="white" stroke="#222" strokeWidth="4" />
                <path d="M 2 0 L 98 0" stroke="#222" strokeWidth="4" />
              </motion.svg>
              
              {/* Ball Top half */}
              <motion.svg viewBox="0 0 100 50" className="absolute top-0 w-[48px] h-[24px] drop-shadow-2xl"
                  initial={{ y: 0, rotate: 0, opacity: 1 }}
                  animate={{ y: [0, 0, 0, -15], x: [0, 0, 0, -10], rotate: [0, 0, 0, -20], opacity: [1, 1, 1, 0] }}
                  transition={{ duration: 3.5, times: [0, 0.82, 0.86, 1] }}
                  style={{ transformOrigin: "top left", overflow: 'visible' }}
              >
                <path d="M 2 50 A 48 48 0 0 1 98 50 Z" fill={getBallTopColor()} stroke="#222" strokeWidth="4" />
                <path d="M 2 50 L 98 50" stroke="#222" strokeWidth="4" />
                <circle cx="50" cy="50" r="12" fill="#222" />
                <circle cx="50" cy="50" r="8" fill="white" />
              </motion.svg>
            </motion.div>
            
            {/* Burst/Smoke when breaking open */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0, 0, 1, 0], scale: [0.5, 0.5, 0.5, 2.5, 3] }}
              transition={{ duration: 3.5, times: [0, 0.8, 0.85, 0.9, 1] }}
            >
              <div className="w-16 h-16 rounded-full bg-red-100" style={{ boxShadow: "0 0 30px 20px #fca5a5", filter: "blur(4px)" }} />
              <div className="absolute w-8 h-8 rounded-full bg-white blur-sm" style={{ top: -20, left: -20, boxShadow: "0 0 20px #fff" }} />
              <div className="absolute w-10 h-10 rounded-full bg-gray-200 blur-md" style={{ top: 10, right: -30, boxShadow: "0 0 20px #e2e8f0" }} />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 2.6, ease: "easeOut" }}
           className="mt-8 text-center"
        >
          <div className="inline-block px-6 py-4 bg-red-950/80 border-2 border-red-500 rounded-lg backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.4)]">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <span className="text-3xl">💢</span> Oh no!
            </h2>
            <p className="text-red-200 font-medium text-lg">The wild Pokémon broke free!</p>
          </div>
        </motion.div>

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
