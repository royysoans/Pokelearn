import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pokemon } from "@/types/game";

interface WhosThatPokemonProps {
  pokemon: Pokemon;
  gym: string;
}

// Typing text hook
function useTypingText(text: string, speed = 60): string {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return displayed;
}

const TAUNT_MAP: Record<string, string[]> = {
  "Maths Arena": [
    "Can your equations keep up with me?",
    "Numbers are my weapon. Prepare yourself.",
    "Solve this... if you dare!",
  ],
  "Science Arena": [
    "My power is backed by science!",
    "Evolution is on my side!",
    "Let's see if you know your elements!",
  ],
  "Coding Arena": [
    "My code is flawless. Is yours?",
    "sudo challenge --trainer",
    "Runtime error? That's your problem now.",
  ],
  "Gym Leader": [
    "You dare challenge me?",
    "I've been waiting for a challenger like you.",
    "Only the strongest will prevail!",
  ],
};

function getRandomTaunt(gym: string): string {
  const key = Object.keys(TAUNT_MAP).find((k) => gym.includes(k.split(" ")[0])) || "Gym Leader";
  const taunts = TAUNT_MAP[key];
  return taunts[Math.floor(Math.random() * taunts.length)];
}

export function WhosThatPokemon({ pokemon, gym }: WhosThatPokemonProps) {
  const [stage, setStage] = useState<"silhouette" | "revealing" | "revealed">("silhouette");
  const [taunt] = useState(() => getRandomTaunt(gym));

  const whoText = useTypingText("Who's that Pokémon?", 55);
  const nameText = useTypingText(stage === "revealed" ? pokemon.name.toUpperCase() + "!" : "", 80);

  useEffect(() => {
    // Phase 1: Show silhouette for 2.4s while text types
    const t1 = setTimeout(() => setStage("revealing"), 2400);
    // Phase 2: Sweep reveal takes 1s, then show name
    const t2 = setTimeout(() => setStage("revealed"), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #1a2a6c 0%, #0a0a2e 100%)",
      }}
    >
      {/* Animated background scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Yellow top bar — anime style */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 h-14 bg-yellow-400 origin-left"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 h-14 bg-yellow-400 origin-right"
      />

      {/* "Who's that Pokémon?" text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative z-10 mb-6 text-center px-4"
      >
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide"
          style={{
            textShadow: "0 0 20px rgba(250, 204, 21, 0.8), 3px 3px 0px rgba(0,0,0,0.8)",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(1.1rem, 3.5vw, 2.5rem)",
            letterSpacing: "0.05em",
          }}
        >
          {whoText}
          <span className="animate-pulse">_</span>
        </h1>
      </motion.div>

      {/* Pokémon Silhouette / Reveal Area */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
        className="relative z-10 w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 mb-8"
      >
        {/* Glow ring behind pokemon */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow:
              stage === "revealed"
                ? [
                    `0 0 40px 10px ${pokemon.color}88`,
                    `0 0 80px 20px ${pokemon.color}55`,
                    `0 0 40px 10px ${pokemon.color}88`,
                  ]
                : ["0 0 40px 10px rgba(100,100,255,0.3)", "0 0 60px 20px rgba(100,100,255,0.15)"],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Silhouette image */}
        <img
          src={pokemon.image}
          alt="???"
          className="w-full h-full object-contain pixelated"
          style={{
            filter:
              stage === "silhouette"
                ? "brightness(0) saturate(100%)"
                : stage === "revealing"
                ? "brightness(0) saturate(100%)"
                : "brightness(1) saturate(1) drop-shadow(0 0 20px rgba(255,255,255,0.6))",
            transition: stage === "revealing" ? "filter 0.0s" : "filter 0.8s ease",
          }}
        />

        {/* Sweep reveal overlay — the magic bar that wipes from left to right */}
        <AnimatePresence>
          {stage === "revealing" && (
            <>
              {/* Colored Pokémon is revealed under the sweep — layered on top */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              >
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-full h-full object-contain pixelated"
                  style={{
                    filter: `drop-shadow(0 0 15px ${pokemon.color})`,
                  }}
                />
              </motion.div>

              {/* The bright light sweep edge */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 45%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.9) 55%, transparent 100%)",
                  width: "60%",
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Flash effect on reveal */}
        <AnimatePresence>
          {stage === "revealed" && (
            <motion.div
              className="absolute inset-0 rounded-full bg-white pointer-events-none"
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Name / Question mark reveal */}
      <div className="relative z-10 text-center px-4">
        <AnimatePresence mode="wait">
          {stage !== "revealed" ? (
            <motion.div
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex gap-3 justify-center">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    className="text-4xl font-black text-yellow-400 drop-shadow-lg"
                    style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.8)" }}
                  >
                    ?
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
            >
              <p
                className="font-black text-yellow-400 tracking-widest mb-3"
                style={{
                  fontSize: "clamp(1.5rem, 5vw, 3rem)",
                  textShadow: "0 0 30px rgba(250,204,21,0.8), 4px 4px 0 rgba(0,0,0,0.9)",
                }}
              >
                {nameText}
              </p>

              {/* Battle taunt */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-sm sm:text-base text-white/80 italic max-w-xs sm:max-w-sm mx-auto"
                style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.8)" }}
              >
                "{taunt}"
              </motion.p>

              {/* Loading dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex gap-2 justify-center mt-5"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.3 }}
                    className="w-2.5 h-2.5 rounded-full bg-yellow-400"
                  />
                ))}
                <span className="text-white/50 text-xs ml-2 self-center">Loading questions...</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
