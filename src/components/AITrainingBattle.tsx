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
            <div className="flex min-h-screen items-center justify-center p-4 bg-slate-900 border-x-4 border-indigo-600">
                <div className="text-center">
                    <div className="animate-spin text-6xl mb-4">⚙️</div>
                    <p className="text-xl text-primary animate-pulse">Professor Oak is compiling your custom lesson on <strong className="text-electric">{topic}</strong>...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-slate-900" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('/Unova.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="w-full max-w-3xl text-center">
                <div className="flex items-center justify-between mb-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <div className="text-left">
                        <h2 className="text-xl sm:text-2xl text-primary font-bold uppercase tracking-wider">
                            {topic}
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground border-l-2 border-indigo-500 pl-2 mt-1">
                            {battleEnded ? 'Session Complete' : `Question ${currentQuestionIndex + 1} of ${questions.length}`} | Score: {correctAnswers}/{questions.length}
                        </p>
                    </div>
                    <QuizSettings
                        fontSize={quizFontSize}
                        fontFamily={quizFontFamily}
                        onFontSizeChange={setQuizFontSize}
                        onFontFamilyChange={setQuizFontFamily}
                    // Skip custom subject settings here to keep it clean
                    />
                </div>

                {!battleEnded && currentQuestion ? (
                    <div className={`bg-card/90 backdrop-blur-sm border-4 border-indigo-500 shadow-xl shadow-indigo-500/20 rounded-xl p-6 sm:p-8 mb-6 ${quizFontFamily === "noto" ? "font-noto" : ""}`}>
                        <p className={`mb-8 ${quizFontSize === "sm" ? "text-sm sm:text-base" :
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

                                let variant: "primary" | "success" | "secondary" = "secondary";
                                let buttonStyle = "border-slate-700 bg-slate-800 text-foreground hover:border-indigo-500";

                                if (isAnswered) {
                                    if (isCorrect) {
                                        variant = "success";
                                        buttonStyle = "border-green-500 bg-green-900/40 font-bold scale-[1.02] shadow-lg shadow-green-500/20";
                                    } else if (isSelected) {
                                        variant = "primary";
                                        buttonStyle = "border-red-500 bg-red-900/40 opacity-70";
                                    } else {
                                        buttonStyle = "opacity-50 border-slate-800 bg-slate-900";
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
                            <div className="mt-8 p-5 border-l-4 border-indigo-500 bg-indigo-900/20 rounded-r-lg text-left mb-4 animate-slide-in-up">
                                <h4 className="text-indigo-400 font-bold mb-2 flex items-center tracking-wider uppercase text-sm">
                                    <span className="text-xl mr-2">👨‍🔬</span> Professor Oak's Analysis
                                </h4>
                                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                                    {currentQuestion.e}
                                </p>
                            </div>
                        )}

                        {showNextButton && (
                            <div className="mt-8">
                                <PixelButton variant="primary" onClick={handleNext} className="w-full py-4 text-xl">
                                    {currentQuestionIndex + 1 >= questions.length ? "Finish Training" : "Next Question"}
                                </PixelButton>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-card/90 backdrop-blur-sm border-4 border-emerald-500 shadow-xl shadow-emerald-500/20 rounded-xl p-8 mb-6 animate-scale-in">
                        <div className="text-6xl mb-4">🎓</div>
                        <h2 className="text-3xl font-bold text-emerald-400 mb-2">Training Complete!</h2>
                        <p className="text-xl text-slate-300 mb-8">
                            You scored <strong className="text-white text-3xl">{correctAnswers}</strong> out of <strong className="text-white">{questions.length}</strong> on <strong className="text-indigo-400">{topic}</strong>.
                        </p>

                        <div className="mb-8">
                            <DownloadQuizButton
                                questions={questions}
                                topic={topic}
                            />
                        </div>

                        <div className="flex gap-4">
                            <PixelButton onClick={() => setCurrentPage("ai-training" as any)} variant="secondary" className="flex-1 py-3">
                                New Topic
                            </PixelButton>
                            <PixelButton onClick={() => setCurrentPage("home")} variant="primary" className="flex-1 py-3">
                                Back to Base
                            </PixelButton>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
