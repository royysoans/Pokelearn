import { useState } from "react";
import { PixelButton } from "./PixelButton";
import { useGame } from "@/contexts/GameContext";
import { motion } from "framer-motion";

export function AITrainingSetup() {
    const { setCurrentPage } = useGame();
    const [topic, setTopic] = useState("");
    const [questionCount, setQuestionCount] = useState<number>(5);

    const handleStartTraining = () => {
        if (!topic.trim()) return;

        // Save the configuration to local storage so the Battle screen can pick it up
        localStorage.setItem("aiTrainingTopic", topic.trim());
        localStorage.setItem("aiTrainingCount", questionCount.toString());

        // Navigate to the AI Training Battle screen
        setCurrentPage("ai-battle" as any); // We will add this route
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl shadow-cyan-500/10"
            >
                {/* Decorative Tech Rings */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full border border-cyan-500/10 rounded-full animate-spin-slow"></div>
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full border border-blue-500/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                </div>

                <div className="text-center mb-10 relative z-10">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-cyan-500/10 rounded-2xl border border-cyan-400/30 flex items-center justify-center">
                            <span className="text-4xl">🧬</span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 tracking-tight">AI Data Center</h2>
                    <p className="text-cyan-200/60 text-sm font-medium">Initialize a custom neural training protocol.</p>
                </div>

                <div className="space-y-8 relative z-10">
                    <div>
                        <label className="text-sm font-semibold text-cyan-100 mb-3 flex items-center gap-2 uppercase tracking-wider">
                            <span className="text-cyan-400">01.</span> Subject Directive
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. quantum physics, french revolution..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-950/50 border border-cyan-500/20 rounded-xl text-lg text-cyan-50 placeholder:text-cyan-900/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all shadow-inner"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-cyan-100 mb-3 flex items-center gap-2 uppercase tracking-wider">
                            <span className="text-cyan-400">02.</span> Iteration Count
                        </label>
                        <div className="flex gap-3">
                            {[5, 10, 15].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setQuestionCount(num)}
                                    className={`flex-1 py-3 rounded-xl border font-bold transition-all duration-300 ${questionCount === num
                                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] shadow-cyan-400/20"
                                        : "border-slate-800 bg-slate-950/50 text-slate-500 hover:border-cyan-500/30 hover:text-cyan-200"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 mt-4 flex flex-col gap-4">
                        <button
                            onClick={handleStartTraining}
                            disabled={!topic.trim()}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-lg shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            <span className="relative z-10">Initialize Sequence</span>
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        </button>

                        <button
                            onClick={() => setCurrentPage("home")}
                            className="w-full py-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                        >
                            Abort Process
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
