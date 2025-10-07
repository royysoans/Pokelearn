import { useState } from "react";
import { GameProvider, useGame } from "@/contexts/GameContext";
import { HomePage } from "@/components/HomePage";
import { StarterSelection } from "@/components/StarterSelection";
import { RegionMap } from "@/components/RegionMap";
import { GymSelection } from "@/components/GymSelection";
import { BattleScreen } from "@/components/BattleScreen";
import { Pokedex } from "@/components/Pokedex";

function GameContent() {
  const { currentPage, setCurrentPage } = useGame();
  const [battleGym, setBattleGym] = useState<string>("");

  const handleStartBattle = (gym: string) => {
    setBattleGym(gym);
    setCurrentPage("battle");
  };

  return (
    <div className="min-h-screen bg-background">
      {currentPage === "home" && <HomePage />}
      {currentPage === "starter" && <StarterSelection />}
      {currentPage === "regions" && <RegionMap />}
      {currentPage === "gyms" && <GymSelection onStartBattle={handleStartBattle} />}
      {currentPage === "battle" && <BattleScreen gym={battleGym} />}
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
