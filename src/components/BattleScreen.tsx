import { useState, useEffect, useRef } from "react";
import { useGame } from "@/contexts/GameContext";
import { pokemonDB } from "@/data/pokemon";
import { arenaPokemonMap } from "@/data/arenaPokemon";
import { generateQuestions } from "@/data/questions";
import { Question, Pokemon } from "@/types/game";
import { PixelButton } from "./PixelButton";
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";

interface BattleScreenProps {
  gym: string;
  level: number | "leader";
}

export function BattleScreen({ gym, level }: BattleScreenProps) {
  const { gameState, setCurrentPage, addPokemon, addBadge, addXP, addCompletedLevel, saveNow } = useGame();
  const { toast } = useToast();
  const { playCorrect, playWrong, playVictory } = useSound();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [battlePokemon, setBattlePokemon] = useState<Pokemon[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const correctAnswersRef = useRef(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [showNextButton, setShowNextButton] = useState(false);



  useEffect(() => {
    if (!gameState.currentRegion) return;

    const loadQuestions = async () => {
      const regionName = gameState.currentRegion!.name;

      // Get fixed Pokemon based on region, gym, and level
      let pokemonKey: string;
      let questionCount: number;
      let selectedPokemon: Pokemon[];

      if (level === "leader") {
        pokemonKey = `${regionName}-Leader`;
        questionCount = 15; // 5 each subject

        const [mathQs, sciQs, codeQs] = await Promise.all([
          generateQuestions("math", 5, regionName, gym, level as any),
          generateQuestions("science", 5, regionName, gym, level as any),
          generateQuestions("coding", 5, regionName, gym, level as any),
        ]);
        const allQuestions = [...mathQs, ...sciQs, ...codeQs].sort(() => 0.5 - Math.random());
        selectedPokemon = [pokemonDB[arenaPokemonMap[regionName][pokemonKey]]];
        setQuestions(allQuestions);
        setBattlePokemon(selectedPokemon);
        setCorrectAnswers(0);
        correctAnswersRef.current = 0;
        return;
      }

      // For levels 1-10, always 10 questions
      questionCount = 10;
      pokemonKey = `${gym}-${level}`;

      const pokemonId = arenaPokemonMap[regionName][pokemonKey];
      selectedPokemon = [pokemonDB[pokemonId]];

      // Determine subject from gym name
      const subject = gym.includes("Maths") ? "math"
        : gym.includes("Science") ? "science"
        : "coding";

      const qs = await generateQuestions(subject, questionCount, regionName, gym, level);
      setQuestions(qs);
      setBattlePokemon(selectedPokemon);
      setCorrectAnswers(0);
      correctAnswersRef.current = 0;
    };

    loadQuestions();
  }, [gym, level, gameState.currentRegion]);

  const currentOpponent = battlePokemon[0];
  const currentQuestion = questions[currentQuestionIndex];
  const requiredCorrect = level === "leader" ? 13 : 8;

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setShowNextButton(true);

    const isCorrect = answer === currentQuestion.c;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      correctAnswersRef.current += 1;
      addXP(10);
      toast({ title: "Correct! +10 XP ⚡" });
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
      setShuffledAnswers([]); // Reset shuffled answers for next question
    }
  };

  // Shuffle answers only once when question changes
  useEffect(() => {
    if (currentQuestion && shuffledAnswers.length === 0) {
      setShuffledAnswers([...currentQuestion.a].sort(() => Math.random() - 0.5));
    }
  }, [currentQuestion, shuffledAnswers.length]);

  const handleBattleEnd = () => {
    if (correctAnswersRef.current >= requiredCorrect) {
      addPokemon(currentOpponent);
      playVictory();

      // Canvas confetti effect (replaces DOM nodes)
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
      } catch {}

      // Award badge if Gym Leader was defeated
      if (level === "leader" && gameState.currentRegion) {
        const badgeId = `${gameState.currentRegion.name.toLowerCase()}-leader`;
        addBadge(badgeId);
        toast({
          title: `🏆 You defeated the ${gameState.currentRegion.name} Gym Leader!`,
          description: `You caught ${currentOpponent.name} and earned a badge!`,
        });
      } else if (typeof level === "number" && gameState.currentRegion) {
        // Add completed level
        const subject = gym.includes("Maths") ? "math" : gym.includes("Science") ? "science" : "coding";
        addCompletedLevel(gameState.currentRegion.name, subject, level);
        toast({
          title: `You completed Level ${level} in ${gym}!`,
          description: `You caught ${currentOpponent.name}!`,
        });
      } else {
        toast({
          title: `You caught ${currentOpponent.name}!`,
          description: currentOpponent.desc,
        });
      }

      // Force immediate save to persist caught Pokemon and badges
      saveNow();

      const remainingPokemon = battlePokemon.slice(1);
      if (remainingPokemon.length > 0) {
        setBattlePokemon(remainingPokemon);
        setCurrentQuestionIndex(0);
        setCorrectAnswers(0);
        correctAnswersRef.current = 0;
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setTimeout(() => setCurrentPage("gyms"), 2000);
      }
    } else {
      toast({
        title: "Not enough correct answers!",
        description: `You need ${requiredCorrect} correct to win.`,
        variant: "destructive"
      });
      setTimeout(() => setCurrentPage("gyms"), 1500);
    }
  };

  const createConfetti = () => {
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement("div");
      confetti.className = "fixed w-3 h-3 animate-confetti-fall";
      confetti.style.left = Math.random() * window.innerWidth + "px";
      confetti.style.top = "-20px";
      confetti.style.backgroundColor = ["#facc15", "#22c55e", "#3b82f6", "#f472b6"][Math.floor(Math.random() * 4)];
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  if (!currentOpponent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-bounce-slow text-6xl mb-4">🎮</div>
          <p className="text-xl text-primary">Preparing battle...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-pulse text-6xl mb-4">⚡</div>
          <p className="text-xl text-primary">Generating questions...</p>
        </div>
      </div>
    );
  }

  const background = gameState.currentRegion?.background || "";
  const battleGradient = "bg-gradient-to-br from-fighting via-fire to-electric";

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={gameState.currentRegion?.name === "Kanto" ? { backgroundImage: `url(/kanto_bag.png)`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl mb-2 text-primary text-shadow-pixel">
          {gym} Battle vs <span style={{ color: currentOpponent.color }}>{currentOpponent.name}</span>
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4">
          Question {currentQuestionIndex + 1} / {questions.length} | Correct: {correctAnswers}
        </p>

        <div
          className={`relative w-full h-48 sm:h-64 md:h-80 border-4 border-white rounded mb-6 overflow-hidden ${battleGradient}`}
          style={{
            backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.7)), url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={currentOpponent.image}
              alt={currentOpponent.name}
              className="pixelated h-24 sm:h-32 md:h-40 animate-bounce-slow"
            />
          </div>
        </div>

        <div className="bg-card border-4 border-border rounded p-4 sm:p-6 mb-6">
          <p className="text-sm sm:text-base md:text-xl mb-6">{currentQuestion.q}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {shuffledAnswers.map((answer) => {
              const isSelected = selectedAnswer === answer;
              const isCorrect = answer === currentQuestion.c;

              let variant: "primary" | "success" | "secondary" = "primary";
              if (isAnswered) {
                if (isCorrect) {
                  variant = "success"; // Green for correct
                } else if (isSelected) {
                  variant = "secondary"; // Red for wrong selected
                }
              }

              return (
                <div className="w-full">
                  <PixelButton
                    key={answer}
                    variant={variant}
                    onClick={() => handleAnswer(answer)}
                    disabled={isAnswered}
                    className="py-3 px-2 w-full text-center text-sm leading-tight break-words whitespace-normal min-h-[60px] justify-center"
                  >
                    {answer}
                  </PixelButton>
                </div>
              );
            })}
          </div>

          {showNextButton && (
            <div className="mt-4">
              <PixelButton variant="primary" onClick={handleNext}>
                Next Question
              </PixelButton>
            </div>
          )}
        </div>

        <PixelButton onClick={() => setCurrentPage("gyms")}>
          Flee Battle
        </PixelButton>
      </div>
    </div>
  );
}
