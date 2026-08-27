import { useState, useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { generateQuestions } from "@/data/questions";
import { Question } from "@/types/game";
import { ShareButtons } from "./ShareButtons";
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";
import { QuizSettings } from "./QuizSettings";
import { DownloadQuizButton } from "./DownloadQuizButton";
import { motion, AnimatePresence } from "framer-motion";

export function AITrainingBattle() {
    const { setCurrentPage } = useGame();
    const { toast } = useToast();
    const { playCorrect, playWrong, playVictory } = useSound();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
    const [showNextButton, setShowNextButton] = useState(false);
    const [battleEnded, setBattleEnded] = useState(false);

    const [topic, setTopic] = useState("");
    const [questionCount, setQuestionCount] = useState(5);

    const [quizFontSize, setQuizFontSize] = useState<"sm" | "base" | "lg" | "xl">(() =>
        (localStorage.getItem("quizFontSize") as "sm" | "base" | "lg" | "xl") || "base"
    );
    const [quizFontFamily, setQuizFontFamily] = useState<"normal" | "noto">(() =>
        (localStorage.getItem("quizFontFamily") as "normal" | "noto") || "normal"
    );

    useEffect(() => { localStorage.setItem("quizFontSize", quizFontSize); }, [quizFontSize]);
    useEffect(() => { localStorage.setItem("quizFontFamily", quizFontFamily); }, [quizFontFamily]);

    useEffect(() => {
        const t = localStorage.getItem("aiTrainingTopic") || "Random Trivia";
        const c = parseInt(localStorage.getItem("aiTrainingCount") || "5", 10);
        setTopic(t);
        setQuestionCount(c);
        const loadQuestions = async () => {
            const qs = await generateQuestions(t, c, "Custom", "AI Training", 1);
            setQuestions(qs);
            setCorrectAnswers(0);
        };
        loadQuestions();
    }, []);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = (answer: string) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        setShowNextButton(true);
        const isCorrect = answer === currentQuestion.c;
        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            toast({ title: "Correct!" });
            playCorrect();
        } else {
            toast({ title: "Wrong answer!", variant: "destructive" });
            playWrong();
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex + 1 >= questions.length) {
            handleBattleEnd();
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setShowNextButton(false);
            setShuffledAnswers([]);
        }
    };

    useEffect(() => {
        if (currentQuestion && shuffledAnswers.length === 0) {
            setShuffledAnswers([...currentQuestion.a].sort(() => Math.random() - 0.5));
        }
    }, [currentQuestion, shuffledAnswers.length]);

    const handleBattleEnd = async () => {
        setBattleEnded(true);
        playVictory();
        try {
            const canvas = document.createElement("canvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            Object.assign(canvas.style, { position: "fixed", left: "0", top: "0", pointerEvents: "none", zIndex: "9999" });
            document.body.appendChild(canvas);
            const ctx = canvas.getContext("2d");
            const pieces = Array.from({ length: 140 }).map(() => ({
                x: Math.random() * canvas.width, y: -20 - Math.random() * 200,
                r: 4 + Math.random() * 5,
                c: ["#34d399", "#6ee7b7", "#fbbf24", "#a7f3d0"][Math.floor(Math.random() * 4)],
                vx: -2 + Math.random() * 4, vy: 2 + Math.random() * 3,
                a: Math.random() * Math.PI * 2, va: -0.2 + Math.random() * 0.4,
            }));
            let frame = 0;
            const loop = () => {
                if (!ctx) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                pieces.forEach(p => {
                    p.x += p.vx; p.y += p.vy; p.a += p.va;
                    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
                    ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
                    ctx.restore();
                });
                frame++;
                if (frame < 240) requestAnimationFrame(loop); else canvas.remove();
            };
            requestAnimationFrame(loop);
        } catch {
            // ignore canvas cleanup errors
        }
        toast({ title: "Training Complete!", description: `You scored ${correctAnswers} out of ${questions.length}.` });
    };

    const progress = questions.length > 0 ? ((currentQuestionIndex + (isAnswered ? 1 : 0)) / questions.length) * 100 : 0;
    const scorePercent = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;

    const BG = "linear-gradient(160deg, #0a1a0f 0%, #0f1f17 40%, #131a13 100%)";

    // Loading
    if (!currentQuestion && !battleEnded) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center" style={{ background: BG }}>
                <div className="text-center">
                    <div className="w-14 h-14 mx-auto mb-5 rounded-full animate-spin"
                         style={{ border: "3px solid rgba(52,211,153,0.15)", borderTopColor: "#34d399" }} />
                    <p className="text-white/50">
                        Generating <strong className="text-emerald-400">{topic}</strong> questions...
                    </p>
                </div>
            </div>
        );
    }

    // Results
    if (battleEnded) {
        const grade = scorePercent >= 90 ? { label: "S", color: "#34d399", bg: "rgba(52,211,153,0.1)" }
            : scorePercent >= 70 ? { label: "A", color: "#6ee7b7", bg: "rgba(110,231,183,0.1)" }
            : scorePercent >= 50 ? { label: "B", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" }
            : { label: "C", color: "#f87171", bg: "rgba(248,113,113,0.1)" };

        return (
            <div className="min-h-screen w-full overflow-y-auto flex items-center justify-center p-4 sm:p-6"
                 style={{ background: BG }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md text-center"
                >
                    <div className="rounded-2xl p-6 sm:p-8"
                         style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>

                        {/* Grade */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                            className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
                            style={{
                                background: grade.bg,
                                border: `2px solid ${grade.color}`,
                                boxShadow: `0 0 30px ${grade.color}30`,
                            }}
                        >
                            <span className="text-4xl font-black" style={{ color: grade.color }}>{grade.label}</span>
                        </motion.div>

                        <h2 className="text-xl sm:text-2xl font-black text-white mb-1">Training Complete</h2>
                        <p className="text-white/30 text-xs mb-5">{topic}</p>

                        {/* Score */}
                        <div className="flex items-center justify-center gap-6 mb-6">
                            <div>
                                <p className="text-3xl font-black" style={{ color: grade.color }}>
                                    {correctAnswers}/{questions.length}
                                </p>
                                <p className="text-white/25 text-[10px] mt-0.5">Correct</p>
                            </div>
                            <div className="w-px h-10 bg-white/8" />
                            <div>
                                <p className="text-3xl font-black" style={{ color: grade.color }}>
                                    {scorePercent}%
                                </p>
                                <p className="text-white/25 text-[10px] mt-0.5">Accuracy</p>
                            </div>
                        </div>

                        {/* Breakdown dots */}
                        <div className="flex gap-1 justify-center mb-6 flex-wrap">
                            {questions.map((_, i) => (
                                <div key={i} className="w-2.5 h-2.5 rounded-sm"
                                     style={{ background: i < correctAnswers ? grade.color : "rgba(255,255,255,0.08)" }} />
                            ))}
                        </div>

                        <div className="mb-5">
                            <DownloadQuizButton questions={questions} topic={topic} />
                        </div>

                        <div className="flex gap-2.5">
                            <button
                                onClick={() => setCurrentPage("ai-training")}
                                className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all"
                                style={{ background: "linear-gradient(135deg, #059669, #0d9488)", boxShadow: "0 4px 15px rgba(5,150,105,0.25)" }}
                            >
                                New Topic
                            </button>
                            <button
                                onClick={() => setCurrentPage("home")}
                                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
                            >
                                Dashboard
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Quiz
    return (
        <div className="min-h-screen w-full flex flex-col" style={{ background: BG }}>

            {/* Top bar */}
            <div className="flex-shrink-0 px-4 sm:px-6 pt-4">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                            <button onClick={() => setCurrentPage("ai-training")}
                                    className="text-white/25 hover:text-white/50 transition-colors text-sm">
                                ← Exit
                            </button>
                            <div className="w-px h-3.5 bg-white/10" />
                            <span className="text-emerald-400 font-semibold text-sm truncate max-w-[120px] sm:max-w-xs">
                                {topic}
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <QuizSettings
                                fontSize={quizFontSize} fontFamily={quizFontFamily}
                                onFontSizeChange={setQuizFontSize} onFontFamilyChange={setQuizFontFamily}
                            />
                            <span className="text-[11px] font-bold px-2 py-1 rounded-md"
                                  style={{ background: "rgba(52,211,153,0.1)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.2)" }}>
                                {currentQuestionIndex + 1}/{questions.length}
                            </span>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <motion.div className="h-full rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4 }}
                            style={{ background: "linear-gradient(90deg, #059669, #34d399)" }}
                        />
                    </div>
                </div>
            </div>

            {/* Question */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-4 overflow-y-auto">
                <div className="w-full max-w-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className={`rounded-xl p-5 sm:p-6 mb-4 ${quizFontFamily === "noto" ? "font-noto" : ""}`}
                                 style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                <p className={`text-white leading-relaxed ${
                                    quizFontSize === "sm" ? "text-sm" :
                                    quizFontSize === "base" ? "text-base sm:text-lg" :
                                    quizFontSize === "lg" ? "text-lg sm:text-xl" :
                                    "text-xl sm:text-2xl"
                                }`}>
                                    {currentQuestion?.q}
                                </p>
                            </div>

                            {/* Answers */}
                            <div className="space-y-2.5">
                                {shuffledAnswers.map((answer, idx) => {
                                    const isSelected = selectedAnswer === answer;
                                    const isCorrect = answer === currentQuestion?.c;
                                    const letter = String.fromCharCode(65 + idx);

                                    let bg = "rgba(255,255,255,0.025)";
                                    let border = "rgba(255,255,255,0.06)";
                                    let textColor = "rgba(255,255,255,0.65)";
                                    let shadow = "none";
                                    let badge = "rgba(255,255,255,0.05)";
                                    let badgeColor = "rgba(255,255,255,0.35)";
                                    let badgeText = letter;

                                    if (isAnswered) {
                                        if (isCorrect) {
                                            bg = "rgba(52,211,153,0.1)"; border = "rgba(52,211,153,0.4)";
                                            textColor = "#6ee7b7"; shadow = "0 0 15px rgba(52,211,153,0.1)";
                                            badge = "rgba(52,211,153,0.15)"; badgeColor = "#34d399"; badgeText = "✓";
                                        } else if (isSelected) {
                                            bg = "rgba(239,68,68,0.08)"; border = "rgba(239,68,68,0.4)";
                                            textColor = "#f87171";
                                            badge = "rgba(239,68,68,0.15)"; badgeColor = "#f87171"; badgeText = "✗";
                                        } else {
                                            textColor = "rgba(255,255,255,0.15)";
                                        }
                                    }

                                    return (
                                        <button
                                            key={answer}
                                            onClick={() => handleAnswer(answer)}
                                            disabled={isAnswered}
                                            className={`w-full text-left py-3.5 px-4 rounded-xl flex items-start gap-3 transition-all duration-200 ${
                                                !isAnswered ? "hover:translate-x-1" : ""
                                            } ${quizFontSize === "sm" ? "text-xs" :
                                                quizFontSize === "base" ? "text-sm" :
                                                quizFontSize === "lg" ? "text-base" : "text-lg"
                                            }`}
                                            style={{ background: bg, border: `1px solid ${border}`, color: textColor, boxShadow: shadow, cursor: isAnswered ? "default" : "pointer" }}
                                        >
                                            <span className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold mt-px"
                                                  style={{ background: badge, color: badgeColor }}>
                                                {badgeText}
                                            </span>
                                            <span className="break-words leading-snug">{answer}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Explanation */}
                            <AnimatePresence>
                                {isAnswered && currentQuestion?.e && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="mt-4 rounded-xl p-4"
                                        style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}
                                    >
                                        <p className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest mb-1.5">
                                            💡 Explanation
                                        </p>
                                        <p className="text-sm text-white/50 leading-relaxed">{currentQuestion.e}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Next */}
                            {showNextButton && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                                    <button
                                        onClick={handleNext}
                                        className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all"
                                        style={{ background: "linear-gradient(135deg, #059669, #0d9488)", boxShadow: "0 4px 15px rgba(5,150,105,0.25)" }}
                                    >
                                        {currentQuestionIndex + 1 >= questions.length ? "See Results" : "Next Question →"}
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom dots */}
            <div className="flex-shrink-0 px-4 pb-4">
                <div className="max-w-2xl mx-auto flex items-center justify-center gap-1">
                    {questions.map((_, i) => (
                        <div key={i} className="rounded-full transition-all duration-300"
                             style={{
                                 width: i === currentQuestionIndex ? 20 : 6,
                                 height: 4,
                                 background: i < currentQuestionIndex
                                     ? "#34d399" : i === currentQuestionIndex
                                     ? "#6ee7b7" : "rgba(255,255,255,0.06)",
                             }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
