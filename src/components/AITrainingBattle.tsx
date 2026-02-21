import { useState, useEffect, useRef } from "react";
import { useGame } from "@/contexts/GameContext";
import { generateQuestions } from "@/data/questions";
import { Question, GamePage } from "@/types/game";
import { PixelButton } from "./PixelButton";
import { ShareButtons } from "./ShareButtons";
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";
import { QuizSettings } from "./QuizSettings";
import { DownloadQuizButton } from "./DownloadQuizButton";

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

    useEffect(() => {
        localStorage.setItem("quizFontSize", quizFontSize);
    }, [quizFontSize]);

    useEffect(() => {
        localStorage.setItem("quizFontFamily", quizFontFamily);
    }, [quizFontFamily]);

    useEffect(() => {
        const t = localStorage.getItem("aiTrainingTopic") || "Random Trivia";
        const c = parseInt(localStorage.getItem("aiTrainingCount") || "5", 10);
        setTopic(t);
        setQuestionCount(c);

        const loadQuestions = async () => {
            // We pass the topic as the subject to generateQuestions.
            // Region, gym, and level don't matter as much here for generation limits,
            // but we send safe defaults to ensure generation works.
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

        // Canvas confetti effect
        try {
            const canvas = document.createElement("canvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.position = "fixed";
            canvas.style.left = "0";
            canvas.style.top = "0";
            canvas.style.pointerEvents = "none";
            canvas.style.zIndex = "9999";
            document.body.appendChild(canvas);
            const ctx = canvas.getContext("2d");
            const pieces = Array.from({ length: 160 }).map(() => ({
                x: Math.random() * canvas.width,
                y: -20 - Math.random() * 200,
                r: 4 + Math.random() * 6,
                c: ["#facc15", "#22c55e", "#3b82f6", "#f472b6"][Math.floor(Math.random() * 4)],
                vx: -2 + Math.random() * 4,
                vy: 2 + Math.random() * 3,
                a: Math.random() * Math.PI * 2,
                va: -0.2 + Math.random() * 0.4,
            }));
            let frame = 0;
            const loop = () => {
                if (!ctx) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                pieces.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.a += p.va;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.a);
                    ctx.fillStyle = p.c;
                    ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
                    ctx.restore();
                });
                frame++;
                if (frame < 240) requestAnimationFrame(loop); else canvas.remove();
            };
            requestAnimationFrame(loop);
        } catch { }

        toast({
            title: `Training Complete!`,
            description: `You scored ${correctAnswers + (selectedAnswer === currentQuestion.c ? 1 : 0)} out of ${questions.length}.`,
        });
    };

    if (!currentQuestion && !battleEnded) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]">
                <div className="text-center relative z-10">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin"></div>
                    <p className="text-xl text-cyan-400 animate-pulse font-medium tracking-wide">Compiling Neural Lesson on <strong className="text-white">{topic}</strong>...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]">
            <div className="w-full max-w-3xl text-center z-10">
                <div className="flex items-center justify-between mb-6 bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                    <div className="text-left">
                        <h2 className="text-xl md:text-2xl text-cyan-400 font-extrabold uppercase tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                            {topic}
                        </h2>
                        <div className="flex items-center mt-2 space-x-3">
                            <span className="bg-cyan-950/50 border border-cyan-800 text-cyan-300 text-xs px-2 py-1 rounded">
                                {battleEnded ? 'SESSION COMPLETE' : `DATA NODE ${currentQuestionIndex + 1}/${questions.length}`}
                            </span>
                            <span className="text-slate-400 text-sm">
                                Accuracy: <span className="text-cyan-400 font-bold">{correctAnswers}</span>
                            </span>
                        </div>
                    </div>
                    <QuizSettings
                        fontSize={quizFontSize}
                        fontFamily={quizFontFamily}
                        onFontSizeChange={setQuizFontSize}
                        onFontFamilyChange={setQuizFontFamily}
                    />
                </div>

                {!battleEnded && currentQuestion ? (
                    <div className={`relative bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 rounded-2xl p-6 sm:p-8 mb-6 ${quizFontFamily === "noto" ? "font-noto" : ""}`}>
                        <p className={`mb-8 text-cyan-50 ${quizFontSize === "sm" ? "text-sm sm:text-base" :
                            quizFontSize === "base" ? "text-base sm:text-lg md:text-xl" :
                                quizFontSize === "lg" ? "text-lg sm:text-xl md:text-2xl" :
                                    "text-xl sm:text-2xl md:text-3xl"
                            }`}>
                            {currentQuestion.q}
                        </p>

                        <div className="space-y-3">
                            {shuffledAnswers.map((answer) => {
                                const isSelected = selectedAnswer === answer;
                                const isCorrect = answer === currentQuestion.c;

                                let buttonStyle = "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-50 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]";

                                if (isAnswered) {
                                    if (isCorrect) {
                                        buttonStyle = "border-cyan-400 bg-cyan-900/40 text-cyan-100 font-bold scale-[1.02] shadow-[0_0_20px_rgba(34,211,238,0.3)]";
                                    } else if (isSelected) {
                                        buttonStyle = "border-rose-500 bg-rose-900/40 text-rose-200 opacity-80";
                                    } else {
                                        buttonStyle = "opacity-40 border-slate-900 bg-slate-950 text-slate-500";
                                    }
                                }

                                return (
                                    <button
                                        key={answer}
                                        onClick={() => handleAnswer(answer)}
                                        disabled={isAnswered}
                                        className={`w-full text-left py-4 px-6 rounded-lg border-2 transition-all duration-300 ${buttonStyle} ${quizFontSize === "sm" ? "text-xs" :
                                            quizFontSize === "base" ? "text-sm" :
                                                quizFontSize === "lg" ? "text-base" :
                                                    "text-lg"
                                            }`}
                                    >
                                        {answer}
                                    </button>
                                );
                            })}
                        </div>

                        {isAnswered && currentQuestion.e && (
                            <div className="mt-8 p-6 border border-cyan-500/30 bg-cyan-950/20 rounded-xl text-left mb-4 animate-slide-in-up shadow-inner">
                                <h4 className="text-cyan-400 font-bold mb-3 flex items-center tracking-widest uppercase text-xs">
                                    <span className="mr-2 text-lg">🧠</span> Analysis
                                </h4>
                                <p className="text-sm sm:text-base text-cyan-100/80 leading-relaxed">
                                    {currentQuestion.e}
                                </p>
                            </div>
                        )}

                        {showNextButton && (
                            <div className="mt-8">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-4 rounded-xl bg-cyan-600/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-bold text-lg transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]"
                                >
                                    {currentQuestionIndex + 1 >= questions.length ? "Finish Analysis" : "Next Directive"}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 rounded-2xl p-10 mb-6 animate-scale-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

                        <div className="text-5xl mb-6 flex justify-center">
                            <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                                📊
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-cyan-50 mb-3 tracking-tight">Protocol Complete</h2>
                        <p className="text-lg text-cyan-200/70 mb-10">
                            Accuracy Rating: <span className="text-cyan-400 font-bold font-mono text-2xl mx-1">{correctAnswers}/{questions.length}</span>
                        </p>

                        <div className="mb-10 p-1 bg-gradient-to-r from-cyan-900/0 via-cyan-800/50 to-cyan-900/0">
                            <DownloadQuizButton
                                questions={questions}
                                topic={topic}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={() => setCurrentPage("ai-training")} className="flex-1 py-4 rounded-xl border border-cyan-700 bg-cyan-900/30 hover:bg-cyan-800/50 text-cyan-300 font-semibold transition-colors">
                                New Search
                            </button>
                            <button onClick={() => setCurrentPage("home")} className="flex-1 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold transition-colors">
                                Disconnect
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
