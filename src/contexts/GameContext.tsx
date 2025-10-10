import { createContext, useContext, useState, ReactNode } from "react";
import { GameState, GamePage, Pokemon, Region } from "@/types/game";

interface GameContextType {
  gameState: GameState;
  currentPage: GamePage;
  setCurrentPage: (page: GamePage) => void;
  addPokemon: (pokemon: Pokemon) => void;
  setCurrentRegion: (region: Region | null) => void;
  addBadge: (badge: string) => void;
  hasDefeatedGymLeader: (regionName: string) => boolean;
  addXP: (amount: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    name: "Trainer",
    coins: 50,
    pokemon: [],
    badges: [],
    currentRegion: null,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
  });

  const [currentPage, setCurrentPage] = useState<GamePage>("home");

  const addPokemon = (pokemon: Pokemon) => {
    setGameState(prev => ({
      ...prev,
      pokemon: prev.pokemon.some(p => p.id === pokemon.id)
        ? prev.pokemon
        : [...prev.pokemon, pokemon],
    }));
  };

  const setCurrentRegion = (region: Region | null) => {
    setGameState(prev => ({ ...prev, currentRegion: region }));
  };

  const addBadge = (badge: string) => {
    setGameState(prev => ({
      ...prev,
      badges: prev.badges.includes(badge) ? prev.badges : [...prev.badges, badge],
    }));
  };

  const hasDefeatedGymLeader = (regionName: string) => {
    return gameState.badges.includes(`${regionName}-Leader`);
  };

  const levelThresholds = [
    0, 20, 45, 85, 145, 225, 325, 450, 600, 775, 975, 1225, 1525, 1875, 2275, 2725, 3225, 3825, 4525, 5325
  ];

  const addXP = (amount: number) => {
    setGameState(prev => {
      const newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNextLevel = prev.xpToNextLevel;

      // Calculate new level based on total XP
      for (let i = levelThresholds.length - 1; i >= 0; i--) {
        if (newXP >= levelThresholds[i]) {
          newLevel = i + 1;
          newXpToNextLevel = i < levelThresholds.length - 1 
            ? levelThresholds[i + 1] 
            : levelThresholds[i]; // Max level
          break;
        }
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newXpToNextLevel,
      };
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        currentPage,
        setCurrentPage,
        addPokemon,
        setCurrentRegion,
        addBadge,
        hasDefeatedGymLeader,
        addXP,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
