import { useState, useEffect } from "react";
import { GameProvider, useGame } from "@/contexts/GameContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { HomePage } from "@/components/HomePage";
import { Login } from "@/components/Login";
import { Signup } from "@/components/Signup";
import { StarterSelection } from "@/components/StarterSelection";
import { RegionMap } from "@/components/RegionMap";
import { ArenaSelection } from "@/components/ArenaSelection";
import { BattleScreen } from "@/components/BattleScreen";
import { Pokedex } from "@/components/Pokedex";
import { Badges } from "@/pages/Badges";
import { Leaderboard } from "@/components/Leaderboard";
import { useKonami } from "@/hooks/use-konami";
import { useToast } from "@/hooks/use-toast";

function GameContent() {
  const { currentPage, setCurrentPage, user } = useGame();
  const { toast } = useToast();
  const [battleConfig, setBattleConfig] = useState<{
    gym: string;
    level: number | "leader";
  }>({ gym: "", level: 1 });

  // Auth guard: redirect to home if not logged in for game pages
  useEffect(() => {
    if (currentPage !== "home" && currentPage !== "login" && currentPage !== "signup" && !user) {
      setCurrentPage("home");
    }
  }, [currentPage, user, setCurrentPage]);

  const handleStartBattle = (gym: string, level: number | "leader") => {
    setBattleConfig({ gym, level });
    setCurrentPage("battle");
  };

  useKonami(() => {
    toast({ title: "Konami Code!", description: "Bonus unlocked 🎉" });
  });

  return (
    <div className="min-h-screen bg-background">
      {currentPage === "home" && <HomePage />}
      {currentPage === "login" && <Login onSwitchToSignup={() => setCurrentPage("signup")} />}
      {currentPage === "signup" && <Signup onSwitchToLogin={() => setCurrentPage("login")} />}
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
      {currentPage === "leaderboard" && <Leaderboard />}
    </div>
  );
}

export default function Index() {
  return (
    <AuthProvider>
      <GameProvider>
        <GameContent />
      </GameProvider>
    </AuthProvider>
  );
}
