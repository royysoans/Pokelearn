import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GameState, GamePage, Pokemon, Region } from "@/types/game";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { pokemonDB } from "@/data/pokemon";
import { regions } from "@/data/regions";
import { useToast } from "@/hooks/use-toast";

interface GameContextType {
  gameState: GameState;
  currentPage: GamePage;
  setCurrentPage: (page: GamePage) => void;
  addPokemon: (pokemon: Pokemon) => void;
  setCurrentRegion: (region: Region | null) => void;
  addBadge: (badge: string) => void;
  hasDefeatedGymLeader: (regionName: string) => boolean;
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
    completedLevels: {},
    currentPage: "home",
  });

  const [currentPage, setCurrentPageState] = useState<GamePage>("home");
  const navigate = useNavigate();
  const location = useLocation();

  // Sync URL to state
  useEffect(() => {
    const path = location.pathname.substring(1) || "home";
    // Map path to GamePage if needed, or just cast if paths match GamePage values
    // Our paths: /, /login, /signup, /starter, /regions, /gyms, /battle, /pokedex, /badges, /leaderboard
    // GamePage: "home" | "login" | "signup" | "starter" | "regions" | "gyms" | "battle" | "pokedex" | "badges" | "leaderboard"

    if (path === "home" || path === "") {
      setCurrentPageState("home");
    } else if (["login", "signup", "starter", "regions", "gyms", "battle", "pokedex", "badges", "leaderboard"].includes(path)) {
      setCurrentPageState(path as GamePage);
    }
  }, [location]);

  const setCurrentPage = (page: GamePage) => {
    setCurrentPageState(page);
    if (page === "home") navigate("/");
    else navigate(`/${page}`);
  };

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
        completedLevels: (progress?.completed_levels as Record<
          string,
          Record<string, number[]>
        >) || {},
        currentPage: (progress?.current_page as GamePage) || "home",
      };

      setGameState(loadedState);
      // setCurrentPage("home"); // REMOVED: This was causing the app to reset to home on tab switch
      console.log("✅ Game state loaded successfully");
    } catch (error: any) {
      console.error("❌ Error loading game state:", error.message || error);
      toast({
        title: "Load Failed",
        description: "Could not load your game data. Please refresh to try again.",
        variant: "destructive",
      });
    }
  };

  // ---------------- SAVE STATE ----------------
  // ---------------- SAVE STATE ----------------
  const isSavingRef = useRef(false);
  const { toast } = useToast(); // Need to import useToast if not available, but it's likely available in context or hook

  const saveGameState = async (overrideUser?: User | null) => {
    const userToUse = overrideUser || user;
    if (!userToUse) {
      console.warn("⚠️ No user found — skipping save");
      return;
    }

    if (isSavingRef.current) {
      console.log("⏳ Save already in progress, skipping...");
      return;
    }

    isSavingRef.current = true;
    console.log("💾 Saving game state for user:", userToUse.id);
    console.log("📦 Pokémon count:", gameState.pokemon.length, "Badges:", gameState.badges.length);

    try {
      // 1. Save Progress (Upsert is safe here as it's 1:1)
      const { error: progressError } = await supabase
        .from("user_progress")
        .upsert(
          {
            user_id: userToUse.id,
            current_region: gameState.currentRegion?.name || null,
            completed_levels: gameState.completedLevels,
            coins: gameState.coins,
            current_page: currentPage,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      if (progressError) throw progressError;
      console.log("✅ Progress saved");

      // 2. Save Pokemon (Additive only - NO DELETE)
      if (gameState.pokemon.length > 0) {
        // Fetch existing pokemon IDs for this user to avoid duplicates
        const { data: existingPokemon, error: fetchError } = await supabase
          .from("user_pokemons")
          .select("pokemon_id")
          .eq("user_id", userToUse.id);

        if (fetchError) throw fetchError;

        const existingIds = new Set(existingPokemon?.map(p => p.pokemon_id) || []);
        const newPokemon = gameState.pokemon.filter(p => !existingIds.has(p.id));

        if (newPokemon.length > 0) {
          const pokemonInserts = newPokemon.map((p) => ({
            user_id: userToUse.id,
            pokemon_id: p.id,
          }));

          const { error: pokemonError } = await supabase.from("user_pokemons").insert(pokemonInserts);
          if (pokemonError) throw pokemonError;
          console.log("✅ New Pokémon saved:", pokemonInserts.length);
        } else {
          console.log("✅ No new Pokémon to save");
        }
      }

      // 3. Save Badges (Additive only - NO DELETE)
      if (gameState.badges.length > 0) {
        // Fetch existing badges
        const { data: existingBadges, error: fetchBadgeError } = await supabase
          .from("user_badges")
          .select("badge")
          .eq("user_id", userToUse.id);

        if (fetchBadgeError) throw fetchBadgeError;

        const existingBadgeSet = new Set(existingBadges?.map(b => b.badge) || []);
        const newBadges = gameState.badges.filter(b => !existingBadgeSet.has(b));

        if (newBadges.length > 0) {
          const badgeInserts = newBadges.map((b) => ({
            user_id: userToUse.id,
            badge: b,
          }));
          const { error: badgeErr } = await supabase.from("user_badges").insert(badgeInserts);
          if (badgeErr) throw badgeErr;
          console.log("✅ New Badges saved:", newBadges.length);
        } else {
          console.log("✅ No new Badges to save");
        }
      }

    } catch (error: any) {
      console.error("❌ Error saving game state:", error.message || error);
      toast({
        title: "Save Failed",
        description: "Could not save your progress. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      isSavingRef.current = false;
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
    gameState.badges.includes(`${regionName}-Leader`) || gameState.badges.includes(`${regionName.toLowerCase()}-leader`);



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
