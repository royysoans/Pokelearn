import { useState } from "react";
import { GameProvider, useGame } from "@/contexts/GameContext";
import { HomePage } from "@/components/HomePage";
import { StarterSelection } from "@/components/StarterSelection";
import { RegionMap } from "@/components/RegionMap";
import { ArenaSelection } from "@/components/ArenaSelection";
import { BattleScreen } from "@/components/BattleScreen";
import { Pokedex } from "@/components/Pokedex";

function GameContent() {
  const { currentPage, setCurrentPage } = useGame();
  const [battleConfig, setBattleConfig] = useState<{
    gym: string;
    difficulty: "easy" | "medium" | "hard" | "leader";
  }>({ gym: "", difficulty: "easy" });

  const handleStartBattle = (gym: string, difficulty: "easy" | "medium" | "hard" | "leader") => {
    setBattleConfig({ gym, difficulty });
    setCurrentPage("battle");
  };

  return (
    <div className="min-h-screen bg-background">
      {currentPage === "home" && <HomePage />}
      {currentPage === "starter" && <StarterSelection />}
      {currentPage === "regions" && <RegionMap />}
      {currentPage === "gyms" && (
        <ArenaSelection
          onStartBattle={handleStartBattle}
          onBack={() => setCurrentPage("regions")}
        />
      )}
      {currentPage === "battle" && (
        <BattleScreen gym={battleConfig.gym} difficulty={battleConfig.difficulty} />
      )}
      {currentPage === "pokedex" && <Pokedex />}
    </div>
  );
}

export default function Index() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
