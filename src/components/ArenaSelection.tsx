import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { PixelButton } from "./PixelButton";

interface ArenaSelectionProps {
  onStartBattle: (gym: string, difficulty: "easy" | "medium" | "hard" | "leader") => void;
  onBack: () => void;
}

export function ArenaSelection({ onStartBattle, onBack }: ArenaSelectionProps) {
  const { gameState, setCurrentPage } = useGame();
  const [selectedArena, setSelectedArena] = useState<string | null>(null);
  const [showLeaderConfirm, setShowLeaderConfirm] = useState(false);
  const region = gameState.currentRegion;

  if (!region) return null;

  const handleArenaSelect = (arena: string) => {
    setSelectedArena(arena);
  };

  const handleDifficultySelect = (difficulty: "easy" | "medium" | "hard") => {
    if (selectedArena) {
      onStartBattle(selectedArena, difficulty);
    }
  };

  const handleLeaderChallenge = () => {
    setShowLeaderConfirm(true);
  };

  const confirmLeaderBattle = () => {
    onStartBattle("Gym Leader", "leader");
  };

  if (showLeaderConfirm) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center bg-card border-4 border-border rounded-lg p-8">
          <h2 className="text-3xl md:text-4xl mb-6 text-primary text-shadow-pixel">
            Challenge the Gym Leader?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-muted-foreground">
            This is a difficult battle with 20 questions across all subjects. Are you ready?
          </p>
          <div className="flex gap-4 justify-center">
            <PixelButton variant="success" onClick={confirmLeaderBattle} className="px-8 py-6">
              Yes, I'm Ready!
            </PixelButton>
            <PixelButton onClick={() => setShowLeaderConfirm(false)} className="px-8 py-6">
              Not Yet
            </PixelButton>
          </div>
        </div>
      </div>
    );
  }

  if (selectedArena && selectedArena !== "Gym Leader") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-2xl md:text-4xl mb-4 text-primary text-shadow-pixel">
            {region.symbol} {selectedArena}
          </h2>
          <p className="text-muted-foreground mb-8">Select Difficulty</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border-4 border-border rounded-lg p-6">
              <h3 className="text-xl md:text-2xl mb-2 text-primary">Easy</h3>
              <p className="text-sm text-muted-foreground mb-2">5 Questions</p>
              <p className="text-sm text-muted-foreground mb-4">Common Pokémon</p>
              <PixelButton 
                variant="success" 
                onClick={() => handleDifficultySelect("easy")}
                className="w-full"
              >
                Start Easy
              </PixelButton>
            </div>

            <div className="bg-card border-4 border-border rounded-lg p-6">
              <h3 className="text-xl md:text-2xl mb-2 text-primary">Medium</h3>
              <p className="text-sm text-muted-foreground mb-2">10 Questions</p>
              <p className="text-sm text-muted-foreground mb-4">Uncommon Pokémon</p>
              <PixelButton 
                variant="primary" 
                onClick={() => handleDifficultySelect("medium")}
                className="w-full"
              >
                Start Medium
              </PixelButton>
            </div>

            <div className="bg-card border-4 border-border rounded-lg p-6">
              <h3 className="text-xl md:text-2xl mb-2 text-primary">Hard</h3>
              <p className="text-sm text-muted-foreground mb-2">15 Questions</p>
              <p className="text-sm text-muted-foreground mb-4">Epic Pokémon</p>
              <PixelButton 
                variant="secondary" 
                onClick={() => handleDifficultySelect("hard")}
                className="w-full"
              >
                Start Hard
              </PixelButton>
            </div>
          </div>

          <PixelButton onClick={() => setSelectedArena(null)}>
            Back to Arenas
          </PixelButton>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${region.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl md:text-4xl mb-8 text-center text-white text-shadow-pixel">
          {region.symbol} {region.name} Region
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            onClick={() => handleArenaSelect("Maths Arena")}
            className="bg-card/90 border-4 border-border rounded-lg p-8 cursor-pointer hover:scale-105 transition-transform"
          >
            <h3 className="text-2xl md:text-3xl mb-2 text-primary text-center">🔢</h3>
            <h3 className="text-xl md:text-2xl text-center">Maths Arena</h3>
          </div>

          <div 
            onClick={() => handleArenaSelect("Science Arena")}
            className="bg-card/90 border-4 border-border rounded-lg p-8 cursor-pointer hover:scale-105 transition-transform"
          >
            <h3 className="text-2xl md:text-3xl mb-2 text-primary text-center">🔬</h3>
            <h3 className="text-xl md:text-2xl text-center">Science Arena</h3>
          </div>

          <div 
            onClick={() => handleArenaSelect("Coding Arena")}
            className="bg-card/90 border-4 border-border rounded-lg p-8 cursor-pointer hover:scale-105 transition-transform"
          >
            <h3 className="text-2xl md:text-3xl mb-2 text-primary text-center">💻</h3>
            <h3 className="text-xl md:text-2xl text-center">Coding Arena</h3>
          </div>

          <div 
            onClick={handleLeaderChallenge}
            className="bg-secondary/90 border-4 border-border rounded-lg p-8 cursor-pointer hover:scale-105 transition-transform"
          >
            <h3 className="text-2xl md:text-3xl mb-2 text-secondary-foreground text-center">👑</h3>
            <h3 className="text-xl md:text-2xl text-center text-secondary-foreground">Gym Leader</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <PixelButton variant="primary" onClick={() => setCurrentPage("pokedex")}>
            Pokédex ({gameState.pokemon.length})
          </PixelButton>
          <PixelButton onClick={onBack}>
            Back to Map
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
