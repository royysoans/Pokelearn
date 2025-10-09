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
