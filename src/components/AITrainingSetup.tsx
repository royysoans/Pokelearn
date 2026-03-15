import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { motion } from "framer-motion";

const PRESETS = [
  { label: "Quantum Physics", icon: "⚛️", color: "#34d399" },
  { label: "World History", icon: "🏛️", color: "#fbbf24" },
  { label: "Biology", icon: "🧬", color: "#6ee7b7" },
  { label: "Space & Astronomy", icon: "🚀", color: "#38bdf8" },
  { label: "Literature", icon: "📖", color: "#f9a8d4" },
  { label: "Geography", icon: "🌍", color: "#a7f3d0" },
];

export function AITrainingSetup() {
  const { setCurrentPage } = useGame();
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isFocused, setIsFocused] = useState(false);

  const handleStartTraining = () => {
    if (!topic.trim()) return;
    localStorage.setItem("aiTrainingTopic", topic.trim());
    localStorage.setItem("aiTrainingCount", questionCount.toString());
    setCurrentPage("ai-battle");
  };

  const canStart = topic.trim().length > 0;

  return (
    <div className="min-h-screen w-full overflow-y-auto flex items-center justify-center p-4 sm:p-6"
         style={{ background: "linear-gradient(160deg, #0a1a0f 0%, #0f1f17 40%, #131a13 100%)" }}>

      {/* Subtle floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl"
             style={{ background: "radial-gradient(circle, rgba(52,211,153,0.3), transparent)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-15 blur-3xl"
             style={{ background: "radial-gradient(circle, rgba(251,191,36,0.3), transparent)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.25)",
            }}
          >
            <span className="text-3xl">🧠</span>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
            AI Training Center
          </h1>
          <p className="text-white/35 text-sm">Pick a topic. AI generates the quiz.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-5 sm:p-6"
             style={{
               background: "rgba(255,255,255,0.03)",
               border: "1px solid rgba(255,255,255,0.07)",
             }}>

          {/* Topic Input */}
          <div className="mb-5">
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
              Topic
            </label>
            <input
              type="text"
              placeholder="Type any topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && canStart && handleStartTraining()}
              autoFocus
              className="w-full px-4 py-3.5 rounded-xl text-base text-white placeholder:text-white/15 focus:outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1.5px solid ${isFocused ? "rgba(52,211,153,0.5)" : "rgba(255,255,255,0.07)"}`,
                boxShadow: isFocused ? "0 0 15px rgba(52,211,153,0.1)" : "none",
              }}
            />
          </div>

          {/* Preset Chips */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
              Quick Pick
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setTopic(p.label)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 flex items-center gap-1"
                  style={{
                    background: topic === p.label ? `${p.color}18` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${topic === p.label ? p.color + "40" : "rgba(255,255,255,0.05)"}`,
                    color: topic === p.label ? p.color : "rgba(255,255,255,0.4)",
                  }}
                >
                  <span className="text-xs">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
              Questions
            </label>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  onClick={() => setQuestionCount(num)}
                  className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-200"
                  style={{
                    background: questionCount === num ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${questionCount === num ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.05)"}`,
                    color: questionCount === num ? "#6ee7b7" : "rgba(255,255,255,0.3)",
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={handleStartTraining}
            disabled={!canStart}
            className="w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 mb-3"
            style={{
              background: canStart
                ? "linear-gradient(135deg, #059669, #0d9488)"
                : "rgba(255,255,255,0.04)",
              color: canStart ? "#fff" : "rgba(255,255,255,0.15)",
              boxShadow: canStart ? "0 6px 25px rgba(5,150,105,0.3)" : "none",
              cursor: canStart ? "pointer" : "not-allowed",
            }}
          >
            {canStart ? "Start Training" : "Enter a topic to begin"}
          </button>

          <button
            onClick={() => setCurrentPage("home")}
            className="w-full py-2.5 text-white/25 hover:text-white/50 text-sm font-medium transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
