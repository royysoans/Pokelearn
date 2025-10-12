import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { PixelButton } from "./PixelButton";

interface ArenaSelectionProps {
  onStartBattle: (gym: string, level: number | "leader") => void;
  onBack: () => void;
}

export function ArenaSelection({ onStartBattle, onBack }: ArenaSelectionProps) {
  const { gameState, setCurrentPage, isLevelCompleted, areAllSubjectLevelsCompleted } = useGame();
  const [selectedArena, setSelectedArena] = useState<string | null>(null);
  const [showLeaderConfirm, setShowLeaderConfirm] = useState(false);
  const region = gameState.currentRegion;

  if (!region) return null;

  const handleArenaSelect = (arena: string) => {
    setSelectedArena(arena);
  };

  const handleLevelSelect = (level: number) => {
    if (selectedArena) {
      onStartBattle(selectedArena, level);
    }
  };

  const handleLeaderChallenge = () => {
    if (region && areAllSubjectLevelsCompleted(region.name)) {
      setShowLeaderConfirm(true);
    }
  };

  const confirmLeaderBattle = () => {
    onStartBattle("Gym Leader", "leader");
  };

  if (showLeaderConfirm) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center bg-card border-4 border-border rounded-lg p-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6 text-primary text-shadow-pixel">
            Challenge the Gym Leader?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 text-muted-foreground">
            This is a difficult battle with 15 questions across all subjects. Are you ready?
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
    const subject = selectedArena.includes("Maths") ? "math" : selectedArena.includes("Science") ? "science" : "coding";
    const regionName = region?.name || "";

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-6xl text-center">
          <h2 className="text-xl sm:text-2xl md:text-4xl mb-4 text-primary text-shadow-pixel">
            {region.symbol} {selectedArena}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-8">Select Level (10 questions each, all correct to pass)</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => {
              const isCompleted = isLevelCompleted(regionName, subject, level);
              const isUnlocked = level === 1 || isLevelCompleted(regionName, subject, level - 1);
              const pokemonRarity = level <= 3 ? "Common" : level <= 6 ? "Uncommon" : level <= 9 ? "Epic" : "Legendary";

              return (
                <div
                  key={level}
                  className={`bg-card border-4 border-border rounded-lg p-4 ${
                    isCompleted ? "bg-green-100 border-green-500" : ""
                  } ${!isUnlocked ? "opacity-50" : ""}`}
                >
                  <h3 className="text-base sm:text-lg md:text-xl mb-2 text-primary">Level {level}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{pokemonRarity} Pokémon</p>
                  {isCompleted && <p className="text-xs text-green-600 mb-2">✅ Completed</p>}
                  <PixelButton
                    variant={isCompleted ? "success" : "primary"}
                    onClick={() => isUnlocked && handleLevelSelect(level)}
                    disabled={!isUnlocked}
                    className="w-full text-sm"
                  >
                    {isCompleted ? "Replay" : isUnlocked ? "Start" : "Locked"}
                  </PixelButton>
                </div>
              );
            })}
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
        <h2 className="text-xl sm:text-2xl md:text-4xl mb-8 text-center text-white text-shadow-pixel">
          {region.symbol} {region.name} Region
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div 
            onClick={() => handleArenaSelect("Maths Arena")}
            className="bg-card/90 border-4 border-border rounded-lg p-8 cursor-pointer hover:scale-105 transition-transform"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl mb-2 text-primary text-center">🔢</h3>
            <h3 className="text-lg sm:text-xl md:text-2xl text-center">Maths Arena</h3>
          </div>

          <div 
            onClick={() => handleArenaSelect("Science Arena")}
            className="bg-card/90 border-4 border-border rounded-lg p-8 cursor-pointer hover:scale-105 transition-transform"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl mb-2 text-primary text-center">🔬</h3>
            <h3 className="text-lg sm:text-xl md:text-2xl text-center">Science Arena</h3>
          </div>

          <div 
            onClick={() => handleArenaSelect("Coding Arena")}
            className="bg-card/90 border-4 border-border rounded-lg p-8 cursor-pointer hover:scale-105 transition-transform"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl mb-2 text-primary text-center">💻</h3>
            <h3 className="text-lg sm:text-xl md:text-2xl text-center">Coding Arena</h3>
          </div>

          <div
            onClick={handleLeaderChallenge}
            className={`border-4 border-border rounded-lg p-8 cursor-pointer hover:scale-105 transition-transform ${
              region && areAllSubjectLevelsCompleted(region.name)
                ? "bg-secondary/90"
                : "bg-gray-500/50 opacity-50 cursor-not-allowed"
            }`}
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl mb-2 text-secondary-foreground text-center">👑</h3>
            <h3 className="text-lg sm:text-xl md:text-2xl text-center text-secondary-foreground">Gym Leader</h3>
            {region && !areAllSubjectLevelsCompleted(region.name) && (
              <p className="text-xs text-secondary-foreground/70 mt-2">Complete all levels first</p>
            )}
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
