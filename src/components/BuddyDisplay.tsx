import { useGame } from "@/contexts/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useSound } from "@/hooks/use-sound";

const MESSAGES = [
    "Let's go!",
    "I believe in you!",
    "You can do it!",
    "Best friends!",
    "Adventure time!",
    "Hungry...",
    "Zzz...",
    "So strong!",
    "Use Thunderbolt!",
    "Pika Pika!",
];

export function BuddyDisplay() {
    const { buddyPokemon } = useGame();
    const location = useLocation();
    const { playBuddyCry } = useSound();
    const [isInteracting, setIsInteracting] = useState(false);
    const [message, setMessage] = useState("Let's go!");

    const handleInteraction = () => {
        if (isInteracting) return;

        setIsInteracting(true);
        playBuddyCry();

        // Pick random message
        const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        setMessage(randomMsg);

        // Reset after animation
        setTimeout(() => setIsInteracting(false), 2000);
    };

    // Don't show buddy on login/signup/starter pages
    const hiddenPaths = ["/login", "/signup", "/starter"];
    if (hiddenPaths.includes(location.pathname) || !buddyPokemon) return null;

    // Determine position based on page
    const isBattle = location.pathname === "/battle";
    const isMap = location.pathname === "/regions";

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`fixed z-40 ${isBattle
                    ? "bottom-4 right-4" // Battle: Bottom right
                    : isMap
                        ? "bottom-20 left-4" // Map: Above nav bar
                        : "bottom-0 left-4" // Default: Sitting on the bottom edge
                    }`}
            >
                <div
                    className="relative group cursor-pointer"
                    onClick={handleInteraction}
                >
                    {/* Speech Bubble (Hover or Interacting) */}
                    <AnimatePresence>
                        {(isInteracting || true) && ( // Always render but control opacity via CSS group-hover or state
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                animate={{
                                    opacity: isInteracting ? 1 : 0, // Visible when interacting
                                    scale: isInteracting ? 1.1 : 1,
                                    y: isInteracting ? -10 : 0
                                }}
                                whileHover={{ opacity: 1, scale: 1, y: 0 }} // Also visible on hover
                                className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold font-pixel py-2 px-3 rounded-xl border-2 border-black whitespace-nowrap shadow-lg z-50 pointer-events-none"
                            >
                                {isBattle ? "Go get 'em!" : message}
                                <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-black" />
                                <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Buddy Sprite */}
                    <motion.img
                        src={buddyPokemon.image}
                        alt={buddyPokemon.name}
                        className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl pixelated"
                        animate={isInteracting ? {
                            y: [0, -20, 0], // Jump
                            rotate: [0, -10, 10, -10, 10, 0], // Wiggle
                            scale: [1, 1.2, 1]
                        } : {
                            y: [0, -5, 0], // Gentle breathing/bounce
                        }}
                        transition={isInteracting ? {
                            duration: 0.5,
                            ease: "backOut"
                        } : {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        whileTap={{ scale: 0.95 }}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
