import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { GameState, GamePage, Pokemon, Region } from "@/types/game";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { pokemonDB } from "@/data/pokemon";
import { regions } from "@/data/regions";

interface GameContextType {
  gameState: GameState;
  currentPage: GamePage;
  setCurrentPage: (page: GamePage) => void;
  addPokemon: (pokemon: Pokemon) => void;
  setCurrentRegion: (region: Region | null) => void;
  addBadge: (badge: string) => void;
  hasDefeatedGymLeader: (regionName: string) => boolean;
  addXP: (amount: number) => void;
  addCompletedLevel: (regionName: string, subject: string, level: number) => void;
  isLevelCompleted: (regionName: string, subject: string, level: number) => boolean;
  areAllSubjectLevelsCompleted: (regionName: string) => boolean;
  saveNow: () => void;
  user: User | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const prevUserRef = useRef<User | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    name: "Trainer",
    coins: 50,
    pokemon: [],
    badges: [],
    currentRegion: null,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    completedLevels: {},
    currentPage: "home",
  });

  const [currentPage, setCurrentPage] = useState<GamePage>("home");

  // ---------------- LOAD GAME ----------------
  useEffect(() => {
    const prevUser = prevUserRef.current;
    prevUserRef.current = user;

    if (prevUser && !user) {
      saveGameState(prevUser);
    }

    if (user) {
      loadGameState();
    } else {
      setGameState({
        name: "Trainer",
        coins: 50,
        pokemon: [],
        badges: [],
        currentRegion: null,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        completedLevels: {},
        currentPage: "home",
      });
    }
  }, [user]);

  // ---------------- AUTO SAVE ----------------
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    if (user) {
      saveTimeoutRef.current = setTimeout(() => saveGameState(), 2000);
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [gameState, user]);

  // ---------------- LOAD STATE ----------------
  const loadGameState = async () => {
    if (!user) return;

    console.log("🔄 Loading game state for user:", user.id);

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();
      if (profileError) throw profileError;

      const { data: progress, error: progressError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (progressError && progressError.code !== "PGRST116") throw progressError;

      const { data: userPokemons, error: pokemonError } = await supabase
        .from("user_pokemons")
        .select("pokemon_id")
        .eq("user_id", user.id);
      if (pokemonError) throw pokemonError;

      const { data: userBadges, error: badgesError } = await supabase
        .from("user_badges")
        .select("badge")
        .eq("user_id", user.id);
      if (badgesError) throw badgesError;

      const rawPokemon = userPokemons
        ? userPokemons.map((p) => pokemonDB[p.pokemon_id]).filter(Boolean)
        : [];

      const loadedState: GameState = {
        name: profile?.name || "Trainer",
        coins: progress?.coins || 50,
        pokemon: Array.from(new Map(rawPokemon.map((p) => [p.id, p])).values()),
        badges: [...new Set(userBadges?.map((b) => b.badge) || [])],
        currentRegion: progress?.current_region
          ? regions.find((r) => r.name === progress.current_region) || null
          : null,
        level: progress?.level || 1,
        xp: progress?.xp || 0,
        xpToNextLevel: progress?.xp_to_next_level || 100,
        completedLevels: (progress?.completed_levels as Record<
          string,
          Record<string, number[]>
        >) || {},
        currentPage: "home",
      };

      setGameState(loadedState);
      setCurrentPage("home");
      console.log("✅ Game state loaded successfully");
    } catch (error: any) {
      console.error("❌ Error loading game state:", error.message || error);
    }
  };

  // ---------------- SAVE STATE ----------------
  const saveGameState = async (overrideUser?: User | null) => {
    const userToUse = overrideUser || user;
    if (!userToUse) {
      console.warn("⚠️ No user found — skipping save");
      return;
    }

    console.log("💾 Saving game state for user:", userToUse.id);
    console.log("📦 Pokémon count:", gameState.pokemon.length, "Badges:", gameState.badges.length);

    try {
      const { error: progressError } = await supabase
        .from("user_progress")
        .upsert(
          {
            user_id: userToUse.id,
            current_region: gameState.currentRegion?.name || null,
            level: gameState.level,
            xp: gameState.xp,
            xp_to_next_level: gameState.xpToNextLevel,
            completed_levels: gameState.completedLevels,
            coins: gameState.coins,
            current_page: currentPage,
          },
          { onConflict: "user_id" }
        );
      if (progressError) throw progressError;
      console.log("✅ Progress saved");

      const { error: delPokeErr } = await supabase.from("user_pokemons").delete().eq("user_id", userToUse.id);
      if (delPokeErr) throw delPokeErr;

      if (gameState.pokemon.length > 0) {
        const pokemonInserts = gameState.pokemon.map((p) => ({
          user_id: userToUse.id,
          pokemon_id: p.id,
        }));
        const { error: pokemonError } = await supabase.from("user_pokemons").insert(pokemonInserts);
        if (pokemonError) throw pokemonError;
        console.log("✅ Pokémon saved:", pokemonInserts);
      }

      const { error: delBadgeErr } = await supabase.from("user_badges").delete().eq("user_id", userToUse.id);
      if (delBadgeErr) throw delBadgeErr;

      if (gameState.badges.length > 0) {
        const badgeInserts = gameState.badges.map((b) => ({
          user_id: userToUse.id,
          badge: b,
        }));
        const { error: badgeErr } = await supabase.from("user_badges").insert(badgeInserts);
        if (badgeErr) throw badgeErr;
        console.log("✅ Badges saved:", badgeInserts);
      }

    } catch (error: any) {
      console.error("❌ Error saving game state:", error.message || error);
    }
  };

  // ---------------- GAME ACTIONS ----------------
  const addPokemon = (pokemon: Pokemon) => {
    setGameState((prev) => {
      const newPokemon = prev.pokemon.some((p) => p.id === pokemon.id)
        ? prev.pokemon
        : [...prev.pokemon, pokemon];
      const uniquePokemon = Array.from(new Map(newPokemon.map((p) => [p.id, p])).values());

      const commonCount = uniquePokemon.filter((p) => p.rarity === "common").length;
      const uncommonCount = uniquePokemon.filter((p) => p.rarity === "uncommon").length;
      const newBadges = [...prev.badges];

      [5, 10, 15, 20, 25, 30, 35, 40, 45, 50].forEach((threshold) => {
        if (commonCount >= threshold && !newBadges.includes(`common-${threshold}`))
          newBadges.push(`common-${threshold}`);
      });
      [5, 10, 15, 20, 25].forEach((threshold) => {
        if (uncommonCount >= threshold && !newBadges.includes(`uncommon-${threshold}`))
          newBadges.push(`uncommon-${threshold}`);
      });

      return { ...prev, pokemon: uniquePokemon, badges: newBadges };
    });
  };

  const setCurrentRegion = (region: Region | null) => {
    setGameState((prev) => ({ ...prev, currentRegion: region }));
  };

  const addBadge = (badge: string) => {
    setGameState((prev) => ({
      ...prev,
      badges: prev.badges.includes(badge) ? prev.badges : [...prev.badges, badge],
    }));
  };

  const hasDefeatedGymLeader = (regionName: string) =>
    gameState.badges.includes(`${regionName}-Leader`);

  const levelThresholds = [
    0, 20, 45, 85, 145, 225, 325, 450, 600, 775, 975, 1225,
    1525, 1875, 2275, 2725, 3225, 3825, 4525, 5325,
  ];

  const addXP = (amount: number) => {
    setGameState((prev) => {
      const newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNextLevel = prev.xpToNextLevel;
      for (let i = levelThresholds.length - 1; i >= 0; i--) {
        if (newXP >= levelThresholds[i]) {
          newLevel = i + 1;
          newXpToNextLevel =
            i < levelThresholds.length - 1 ? levelThresholds[i + 1] : levelThresholds[i];
          break;
        }
      }
      return { ...prev, xp: newXP, level: newLevel, xpToNextLevel: newXpToNextLevel };
    });
  };

  const addCompletedLevel = (regionName: string, subject: string, level: number) => {
    setGameState((prev) => {
      const regionLevels = prev.completedLevels[regionName] || {};
      const subjectLevels = regionLevels[subject] || [];
      if (!subjectLevels.includes(level)) {
        const newCompletedLevels = {
          ...prev.completedLevels,
          [regionName]: { ...regionLevels, [subject]: [...subjectLevels, level].sort((a, b) => a - b) },
        };

        const newBadges = [...prev.badges];
        const badgeId = `${regionName.toLowerCase()}-${subject}-arena`;
        if (!newBadges.includes(badgeId)) {
          const levels = newCompletedLevels[regionName][subject];
          if (levels.length === 10 && levels.every((l, i) => l === i + 1)) newBadges.push(badgeId);
        }

        return { ...prev, completedLevels: newCompletedLevels, badges: newBadges };
      }
      return prev;
    });
  };

  const isLevelCompleted = (regionName: string, subject: string, level: number) =>
    (gameState.completedLevels[regionName]?.[subject] || []).includes(level);

  const areAllSubjectLevelsCompleted = (regionName: string) => {
    const regionLevels = gameState.completedLevels[regionName];
    if (!regionLevels) return false;
    return ["math", "science", "coding"].every((subject) => {
      const levels = regionLevels[subject] || [];
      return levels.length === 10 && levels.every((l, i) => l === i + 1);
    });
  };

  const saveNow = () => {
    saveGameState();
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
        addCompletedLevel,
        isLevelCompleted,
        areAllSubjectLevelsCompleted,
        saveNow,
        user,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
}
