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
        <div className="flex min-h-screen items-center justify-center p-4 bg-slate-900 bg-cover bg-center" style={{ backgroundImage: `url('/Unova.jpg')` }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 bg-card/90 border-4 border-primary rounded-xl p-8 max-w-lg w-full shadow-2xl shadow-primary/20"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-primary text-shadow-pixel mb-2 uppercase tracking-wider">AI Training Center</h2>
                    <p className="text-muted-foreground text-sm">Train on any topic you want with Professor Oak!</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                            <span className="text-xl">🎯</span> What do you want to learn?
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. World War 2, Python, Solar System..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-border rounded-lg bg-background text-lg focus:border-primary focus:outline-none transition-colors"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                            <span className="text-xl">📝</span> Number of Questions
                        </label>
                        <div className="flex gap-3">
                            {[5, 10, 15].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setQuestionCount(num)}
                                    className={`flex-1 py-2 rounded-lg border-2 font-bold transition-all ${questionCount === num
                                            ? "border-primary bg-primary text-primary-foreground scale-105 shadow-lg"
                                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border flex flex-col gap-3">
                        <PixelButton
                            variant="success"
                            onClick={handleStartTraining}
                            disabled={!topic.trim()}
                            className="w-full py-4 text-xl animate-pulse-glow"
                        >
                            Start Training Session
                        </PixelButton>

                        <PixelButton
                            variant="secondary"
                            onClick={() => setCurrentPage("home")}
                            className="w-full"
                        >
                            Back to Base
                        </PixelButton>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
