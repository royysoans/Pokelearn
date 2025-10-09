import { useState, useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { pokemonDB } from "@/data/pokemon";
import { generateQuestions } from "@/data/questions";
import { Question, Pokemon } from "@/types/game";
import { PixelButton } from "./PixelButton";
import { useToast } from "@/hooks/use-toast";

interface BattleScreenProps {
  gym: string;
  difficulty: "easy" | "medium" | "hard" | "leader";
}

export function BattleScreen({ gym, difficulty }: BattleScreenProps) {
  const { gameState, setCurrentPage, addPokemon, addBadge } = useGame();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [battlePokemon, setBattlePokemon] = useState<Pokemon[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (!gameState.currentRegion) return;

    const loadQuestions = async () => {
      const regionPokemon = gameState.currentRegion!.pokemonIds.map(id => pokemonDB[id]);
      
      // Determine Pokemon and question count based on difficulty
      let selectedPokemon: Pokemon[];
      let questionCount: number;
      let subject: string;

      if (difficulty === "leader") {
        // Gym Leader: Legendary Pokemon, 20 mixed questions
        const legendary = regionPokemon.find(p => p.rarity === "legendary");
        selectedPokemon = legendary ? [legendary] : [];
        questionCount = 20;
        
        const [mathQs, sciQs, codeQs] = await Promise.all([
          generateQuestions("math", 7),
          generateQuestions("science", 7),
          generateQuestions("coding", 6),
        ]);
        
        const allQuestions = [...mathQs, ...sciQs, ...codeQs].sort(() => 0.5 - Math.random());
        setQuestions(allQuestions);
        setBattlePokemon(selectedPokemon);
        return;
      }

      // Determine rarity and question count based on difficulty
      const rarityMap = {
        easy: { rarity: "common", count: 5 },
        medium: { rarity: "uncommon", count: 10 },
        hard: { rarity: "epic", count: 15 },
      };

      const config = rarityMap[difficulty];
      selectedPokemon = regionPokemon
        .filter(p => p.rarity === config.rarity)
        .sort(() => 0.5 - Math.random())
        .slice(0, 1);
      
      questionCount = config.count;

      // Determine subject from gym name
      subject = gym.includes("Maths") ? "math" 
        : gym.includes("Science") ? "science"
        : "coding";

      const qs = await generateQuestions(subject, questionCount);
      setQuestions(qs);
      setBattlePokemon(selectedPokemon);
    };

    loadQuestions();
  }, [gym, difficulty, gameState.currentRegion]);

  const currentOpponent = battlePokemon[0];
  const currentQuestion = questions[currentQuestionIndex];
  const requiredCorrect = Math.ceil(questions.length * 0.7);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === currentQuestion.c;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      toast({ title: "Correct! ⚡" });
    } else {
      toast({ title: "Wrong answer!", variant: "destructive" });
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 >= questions.length) {
        handleBattleEnd();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      }
    }, 1000);
  };

  const handleBattleEnd = () => {
    if (correctAnswers >= requiredCorrect) {
      addPokemon(currentOpponent);
      
      // Award badge if Gym Leader was defeated
      if (difficulty === "leader" && gameState.currentRegion) {
        addBadge(`${gameState.currentRegion.name}-Leader`);
        toast({
          title: `🏆 You defeated the ${gameState.currentRegion.name} Gym Leader!`,
          description: `You caught ${currentOpponent.name} and earned a badge!`,
        });
      } else {
        toast({
          title: `You caught ${currentOpponent.name}!`,
          description: currentOpponent.desc,
        });
      }
      
      // Confetti effect
      createConfetti();
      
      const remainingPokemon = battlePokemon.slice(1);
      if (remainingPokemon.length > 0) {
        setBattlePokemon(remainingPokemon);
        setCurrentQuestionIndex(0);
        setCorrectAnswers(0);
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

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-xl md:text-2xl mb-2 text-primary text-shadow-pixel">
          {gym} Battle vs <span style={{ color: currentOpponent.color }}>{currentOpponent.name}</span>
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mb-4">
          Question {currentQuestionIndex + 1} / {questions.length} | Correct: {correctAnswers}
        </p>

        <div
          className="relative w-full h-64 md:h-80 border-4 border-white rounded mb-6 overflow-hidden"
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
              className="pixelated h-32 md:h-40 animate-bounce-slow"
            />
          </div>
        </div>

        <div className="bg-card border-4 border-border rounded p-6 mb-6">
          <p className="text-base md:text-xl mb-6">{currentQuestion.q}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentQuestion.a.sort(() => Math.random() - 0.5).map((answer) => {
              const isSelected = selectedAnswer === answer;
              const isCorrect = answer === currentQuestion.c;
              
              let variant: "primary" | "success" | "secondary" = "primary";
              if (isAnswered && isSelected) {
                variant = isCorrect ? "success" : "secondary";
              }
              
              return (
                <PixelButton
                  key={answer}
                  variant={variant}
                  onClick={() => handleAnswer(answer)}
                  disabled={isAnswered}
                  className="py-4"
                >
                  {answer}
                </PixelButton>
              );
            })}
          </div>
        </div>

        <PixelButton onClick={() => setCurrentPage("gyms")}>
          Flee Battle
        </PixelButton>
      </div>
    </div>
  );
}
