import { useState } from "react";
import { GameProvider, useGame } from "@/contexts/GameContext";
import { HomePage } from "@/components/HomePage";
import { StarterSelection } from "@/components/StarterSelection";
import { RegionMap } from "@/components/RegionMap";
import { ArenaSelection } from "@/components/ArenaSelection";
import { BattleScreen } from "@/components/BattleScreen";
import { Pokedex } from "@/components/Pokedex";
import { Badges } from "@/pages/Badges";
import { useKonami } from "@/hooks/use-konami";
import { useToast } from "@/hooks/use-toast";

function GameContent() {
  const { currentPage, setCurrentPage, addXP } = useGame();
  const { toast } = useToast();
  const [battleConfig, setBattleConfig] = useState<{
    gym: string;
    level: number | "leader";
  }>({ gym: "", level: 1 });

  const handleStartBattle = (gym: string, level: number | "leader") => {
    setBattleConfig({ gym, level });
    setCurrentPage("battle");
  };

  useKonami(() => {
    addXP(100);
    toast({ title: "Konami Code!", description: "+100 XP bonus unlocked 🎉" });
  });

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
        <BattleScreen gym={battleConfig.gym} level={battleConfig.level} />
      )}
      {currentPage === "pokedex" && <Pokedex />}
      {currentPage === "badges" && <Badges />}
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
