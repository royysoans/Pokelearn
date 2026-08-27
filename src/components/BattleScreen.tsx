import { useState, useEffect, useRef } from "react";
import { useGame } from "@/contexts/GameContext";
import { pokemonDB } from "@/data/pokemon";
import { arenaPokemonMap } from "@/data/arenaPokemon";
import { generateQuestions } from "@/data/questions";
import { Question, Pokemon } from "@/types/game";
import { PixelButton } from "./PixelButton";
import { ShareButtons } from "./ShareButtons";
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";
import { QuizSettings } from "./QuizSettings";
import { DownloadQuizButton } from "./DownloadQuizButton";
import { Badge3D } from "./Badge3D";
import { CatchingMiniGame } from "./CatchingMiniGame";
import { WhosThatPokemon } from "./WhosThatPokemon";

interface BattleScreenProps {
  gym: string;
  level: number | "leader";
}

export function BattleScreen({ gym, level }: BattleScreenProps) {
  const { gameState, setCurrentPage, addPokemon, addBadge, addCompletedLevel, saveNow } = useGame();
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
  const [showShareButtons, setShowShareButtons] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [battleEnded, setBattleEnded] = useState(false);
  const [battlePhase, setBattlePhase] = useState<"battle" | "catch" | "victory" | "fled">("battle");
  const [buttonText, setButtonText] = useState("Flee Battle");
  const [canStartBattle, setCanStartBattle] = useState(false);
  const animTimerRef = useRef<NodeJS.Timeout | null>(null);
  const MIN_ANIM_MS = 4500; // WhosThatPokemon animation takes 3.5s, give 1s buffer
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
    if (!gameState.currentRegion) return;

    const loadQuestions = async () => {
      const regionName = gameState.currentRegion!.name;


      // Get fixed Pokemon based on region, gym, and level
      let pokemonKey: string;
      let questionCount: number;
      let selectedPokemon: Pokemon[];

      if (level === "leader") {
        pokemonKey = `${regionName}-Leader`;

        // Set pokemon FIRST so WhosThatPokemon screen can show while questions load
        selectedPokemon = [pokemonDB[arenaPokemonMap[regionName][pokemonKey]]];
        setBattlePokemon(selectedPokemon);
        setCanStartBattle(false);
        if (animTimerRef.current) clearTimeout(animTimerRef.current);
        animTimerRef.current = setTimeout(() => setCanStartBattle(true), MIN_ANIM_MS);

        const [mathQs, sciQs, codeQs] = await Promise.all([
          generateQuestions("math", 5, regionName, gym, level),
          generateQuestions("science", 5, regionName, gym, level),
          generateQuestions("coding", 5, regionName, gym, level),
        ]);
        const allQuestions = [...mathQs, ...sciQs, ...codeQs].sort(() => 0.5 - Math.random());
        setQuestions(allQuestions);
        setCorrectAnswers(0);
        correctAnswersRef.current = 0;
        return;
      }

      // For levels 1-10, always 10 questions
      pokemonKey = `${gym}-${level}`;

      const pokemonId = arenaPokemonMap[regionName][pokemonKey];
      selectedPokemon = [pokemonDB[pokemonId]];

      // Set pokemon FIRST so WhosThatPokemon screen can show while questions load
      setBattlePokemon(selectedPokemon);
      setCanStartBattle(false);
      // Start minimum animation timer — ensures WhosThatPokemon always plays fully
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      animTimerRef.current = setTimeout(() => setCanStartBattle(true), MIN_ANIM_MS);
      setCorrectAnswers(0);
      correctAnswersRef.current = 0;

      // Determine subject from gym name
      const subject = gym.includes("Maths") ? "math"
        : gym.includes("Science") ? "science"
          : "coding";

      const qs = await generateQuestions(subject, 10, regionName, gym, level);
      setQuestions(qs);
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
      setShuffledAnswers([]); // Reset shuffled answers for next question
    }
  };

  // Shuffle answers only once when question changes
  useEffect(() => {
    if (currentQuestion && shuffledAnswers.length === 0) {
      setShuffledAnswers([...currentQuestion.a].sort(() => Math.random() - 0.5));
    }
  }, [currentQuestion, shuffledAnswers.length]);

  const handleBattleEnd = async () => {
    setBattleEnded(true);
    if (correctAnswersRef.current >= requiredCorrect) {
      setBattlePhase("catch");
    } else {
      setBattlePhase("fled");
      toast({
        title: "Not enough correct answers!",
        description: `You need ${requiredCorrect} correct to win.`,
        variant: "destructive"
      });
      setButtonText("Exit Battle");
    }
  };

  const handleCatchSuccess = () => {
    setBattlePhase("victory");
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
    } catch {
      // ignore canvas cleanup errors
    }

    // Award badge if Gym Leader was defeated
    if (level === "leader" && gameState.currentRegion) {
      const badgeId = `${gameState.currentRegion.name.toLowerCase()}-leader`;
      addBadge(badgeId);
      toast({
        title: `🏆 You defeated the ${gameState.currentRegion.name} Gym Leader!`,
        description: `You caught ${currentOpponent.name} and earned a badge!`,
      });
      setShowShareButtons(true);
      setShareMessage(`I just defeated ${currentOpponent.name} in the ${gameState.currentRegion.name} region! Can you beat me?`);
      setButtonText("Exit Battle");
    } else if (typeof level === "number" && gameState.currentRegion) {
      // Add completed level
      const subject = gym.includes("Maths") ? "math" : gym.includes("Science") ? "science" : "coding";
      addCompletedLevel(gameState.currentRegion.name, subject, level);
      toast({
        title: `You completed Level ${level} in ${gym}!`,
        description: `You caught ${currentOpponent.name}!`,
      });
      setButtonText("Exit Battle");
    } else {
      toast({
        title: `You caught ${currentOpponent.name}!`,
        description: currentOpponent.desc,
      });
      setButtonText("Exit Battle");
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
      setBattleEnded(false);
      setBattlePhase("battle");
    } else {
      // User must click Exit Battle manually
    }
  };

  const handleCatchFail = () => {
    setBattlePhase("fled");
    toast({
      title: `${currentOpponent.name} broke free!`,
      description: "It fled the battle!",
      variant: "destructive"
    });
    setButtonText("Exit Battle");
  };



  if (!currentOpponent) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-xl text-primary animate-pulse">Entering the arena...</p>
        </div>
      </div>
    );
  }

  // Show WhosThatPokemon if: no questions yet, OR animation hasn't completed its minimum duration
  if (!currentQuestion || !canStartBattle) {
    return <WhosThatPokemon pokemon={currentOpponent} gym={gym} />;
  }

  const background = gameState.currentRegion?.background || "";
  const battleGradient = "bg-gradient-to-br from-fighting via-fire to-electric";

  const getBackgroundImage = (regionName: string | undefined) => {
    switch (regionName) {
      case "Kanto": return "url(/kanto_bag.png)";
      case "Johto": return "url(/jhoto_bag.png)";
      case "Hoenn": return "url(/hoenn_bag.png)";
      case "Sinnoh": return "url(/sinnoh_bag.png)";
      case "Unova": return "url(/unova_bag.png)";
      case "Kalos": return "url(/kalos_bag.png)";
      case "Alola": return "url(/alola_bag.png)";
      case "Galar": return "url(/galar_bag.png)";
      default: return "";
    }
  };

  const bgImage = getBackgroundImage(gameState.currentRegion?.name);

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={
      bgImage ? { backgroundImage: bgImage, backgroundSize: 'cover', backgroundPosition: 'center' } : {}
    }>
      <div className="w-full max-w-2xl text-center">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl text-primary text-shadow-pixel">
              {gym} Battle vs <span style={{ color: currentOpponent.color }}>{currentOpponent.name}</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
              Question {currentQuestionIndex + 1} / {questions.length} | Correct: {correctAnswers}
            </p>
          </div>
          <QuizSettings
            fontSize={quizFontSize}
            fontFamily={quizFontFamily}
            onFontSizeChange={setQuizFontSize}
            onFontFamilyChange={setQuizFontFamily}
          />
        </div>

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
              className={`pixelated h-24 sm:h-32 md:h-40 animate-bounce-slow ${battlePhase === "fled" ? "opacity-0 transition-opacity duration-1000" : ""}`}
            />
          </div>
        </div>

        {battlePhase === "battle" && (
          <div className={`bg-card border-4 border-border rounded p-4 sm:p-6 mb-6 ${quizFontFamily === "noto" ? "font-noto" : ""}`}>
            <p className={`mb-6 ${quizFontSize === "sm" ? "text-xs sm:text-sm" :
            quizFontSize === "base" ? "text-sm sm:text-base md:text-xl" :
              quizFontSize === "lg" ? "text-base sm:text-lg md:text-2xl" :
                "text-lg sm:text-xl md:text-3xl"
            }`}>
            {currentQuestion.q}
          </p>

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
                <div key={answer} className="w-full">
                  <PixelButton
                    variant={variant}
                    onClick={() => handleAnswer(answer)}
                    disabled={isAnswered}
                    className={`py-3 px-2 w-full text-center leading-tight break-words whitespace-normal min-h-[60px] justify-center ${quizFontSize === "sm" ? "text-xs" :
                      quizFontSize === "base" ? "text-sm" :
                        quizFontSize === "lg" ? "text-base" :
                          "text-lg"
                      }`}
                  >
                    {answer}
                  </PixelButton>
                </div>
              );
            })}
          </div>

          {isAnswered && currentQuestion.e && (
            <div className="mt-4 p-4 border-2 border-primary rounded bg-card/80 text-left mb-4">
              <h4 className="text-primary font-bold mb-2 flex items-center">
                <span className="text-xl mr-2">👨‍🔬</span> Professor's Note
              </h4>
              <p className="text-sm sm:text-base text-foreground">
                {currentQuestion.e}
              </p>
            </div>
          )}

          {battlePhase === "battle" && showNextButton && (
            <div className="mt-4">
              <PixelButton variant="primary" onClick={handleNext}>
                Next Question
              </PixelButton>
            </div>
          )}
        </div>
        )}

        {battlePhase === "catch" && (
          <CatchingMiniGame 
              pokemon={currentOpponent} 
              region={gameState.currentRegion?.name || ""}
              gym={gym}
              subject={gym.includes("Maths") ? "math" : gym.includes("Science") ? "science" : "coding"}
              level={level}
              onCatchSuccess={handleCatchSuccess}
              onCatchFail={handleCatchFail}
          />
        )}

        {showShareButtons && (
          <div className="mb-4">
            <ShareButtons message={shareMessage} />
          </div>
        )}

        {battleEnded && level === "leader" && (
          <div className="my-8 animate-in fade-in zoom-in duration-500">
            <h3 className="text-2xl text-primary font-bold mb-4 text-shadow-pixel animate-pulse">Badge Earned!</h3>
            <div className="h-[300px] w-full">
              <Badge3D color="#facc15" />
            </div>
          </div>
        )}

        {battleEnded && (
          <div className="mb-6">
            <DownloadQuizButton
              questions={questions}
              topic={gym.includes("Maths") ? "Math" : gym.includes("Science") ? "Science" : "Coding"}
            />
          </div>
        )}

        <PixelButton onClick={() => setCurrentPage("gyms")} disabled={!battleEnded && level === "leader"}>
          {buttonText}
        </PixelButton>
      </div>
    </div>
  );
}
