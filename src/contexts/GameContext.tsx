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
  addPokemon: (pokemon: Pokemon, immediate?: boolean) => Promise<void>;
  setCurrentRegion: (region: Region | null) => void;
  addBadge: (badge: string) => void;
  hasDefeatedGymLeader: (regionName: string) => boolean;
  addCompletedLevel: (regionName: string, subject: string, level: number) => void;
  isLevelCompleted: (regionName: string, subject: string, level: number) => boolean;
  areAllSubjectLevelsCompleted: (regionName: string) => boolean;
  saveNow: () => void;
  evolvePokemon: (pokemonId: number) => Promise<Pokemon | null>;
  setBuddy: (pokemonId: number | null) => void;
  user: User | null;
  currentPokemon: Pokemon | null;
  buddyPokemon: Pokemon | null;
  isGameLoaded: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const prevUserRef = useRef<User | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isGameLoadedRef = useRef(false); // CRITICAL: Track if state is valid from DB
  const [isGameLoaded, setIsGameLoaded] = useState(false);

  const [gameState, setGameState] = useState<GameState>({
    name: "Trainer",
    pokemon: [],
    badges: [],
    currentRegion: null,
    completedLevels: {},
    currentPage: "home",
    buddyPokemonId: null,
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

    // Reset load status on user change
    if (prevUser !== user) {
      isGameLoadedRef.current = false;
      setIsGameLoaded(false);
    }

    if (prevUser && !user) {
      // User is logging out - save their data first
      console.log("🚨 User logging out, saving data before reset");
      saveGameState(prevUser);

      // CRITICAL: Wait a bit before resetting state to ensure save completes
      setTimeout(() => {
        console.log("🔄 Resetting local state after logout save");
        setGameState({
          name: "Trainer",
          pokemon: [],
          badges: [],
          currentRegion: null,
          completedLevels: {},
          currentPage: "home",
          buddyPokemonId: null,
        });
      }, 500); // Give save time to complete
    } else if (user) {
      loadGameState();
    } else if (!prevUser && !user) {
      // Initial render with no user
      setGameState({
        name: "Trainer",
        pokemon: [],
        badges: [],
        currentRegion: null,
        completedLevels: {},
        currentPage: "home",
        buddyPokemonId: null,
      });
    }
  }, [user]);

  // ---------------- AUTO SAVE ----------------
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    // Only auto-save if user is logged in AND has some data
    // This prevents saving empty state during logout
    if (user && (gameState.pokemon.length > 0 || Object.keys(gameState.completedLevels).length > 0)) {
      saveTimeoutRef.current = setTimeout(() => saveGameState(), 2000);
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [gameState, user]);

  // ---------------- LOAD STATE ----------------
  const loadGameState = async () => {
    if (!user) return;

    if (!user) return;

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
        buddyPokemonId: progress?.buddy_pokemon_id || null,
      };

      setGameState(loadedState);
      // CRITICAL: Mark as loaded only after successful state set
      isGameLoadedRef.current = true;
      setIsGameLoaded(true);
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

    // CRITICAL SAFEGUARD: Do not save if we haven't successfully loaded yet
    // This prevents overwriting DB with empty state if load failed
    if (!isGameLoadedRef.current && userToUse) {
      console.error("🛑 BLOCKED SAVE: Game state has not been loaded successfully yet.");
      console.warn("This prevents overwriting your data with empty state.");
      return;
    }

    isSavingRef.current = true;
    isSavingRef.current = true;

    try {
      // 1. Save Progress (Upsert is safe here as it's 1:1)
      const { error: progressError } = await supabase
        .from("user_progress")
        .upsert(
          {
            user_id: userToUse.id,
            current_region: gameState.currentRegion?.name || null,
            completed_levels: gameState.completedLevels,
            current_page: currentPage,
            buddy_pokemon_id: gameState.buddyPokemonId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      if (progressError) throw progressError;
      if (progressError) throw progressError;

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
          if (pokemonError) throw pokemonError;
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
          if (badgeErr) throw badgeErr;
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
  const addPokemon = async (pokemon: Pokemon, immediate: boolean = false) => {
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

    // If immediate save is requested and user exists, save to database right away
    if (immediate && user) {
      try {
        console.log("💾 Immediately saving Pokémon:", pokemon.name);

        // Check if pokemon already exists
        const { data: existingPokemon, error: fetchError } = await supabase
          .from("user_pokemons")
          .select("pokemon_id")
          .eq("user_id", user.id)
          .eq("pokemon_id", pokemon.id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          throw fetchError;
        }

        // Only insert if it doesn't exist
        if (!existingPokemon) {
          const { error: insertError } = await supabase
            .from("user_pokemons")
            .insert({ user_id: user.id, pokemon_id: pokemon.id });

          if (insertError) throw insertError;
          console.log("✅ Pokémon saved immediately:", pokemon.name);

          toast({
            title: "Pokémon Added!",
            description: `${pokemon.name} has been added to your team!`,
          });
        } else {
          console.log("ℹ️ Pokémon already exists in database:", pokemon.name);
        }
      } catch (error: any) {
        console.error("❌ Error immediately saving Pokémon:", error.message || error);
        toast({
          title: "Save Failed",
          description: "Could not save your Pokémon. It will be saved automatically soon.",
          variant: "destructive",
        });
      }
    }
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

  const evolvePokemon = async (pokemonId: number): Promise<Pokemon | null> => {
    const pokemon = gameState.pokemon.find(p => p.id === pokemonId);
    if (!pokemon) {
      console.error("❌ Pokemon not found in user inventory");
      return null;
    }

    if (!pokemon.evolutionId) {
      console.error("❌ Pokemon has no evolution ID");
      return null;
    }

    const evolvedForm = pokemonDB[pokemon.evolutionId];
    if (!evolvedForm) {
      console.error("❌ Evolved form not found in DB for ID:", pokemon.evolutionId);
      return null;
    }

    // Optimistic update
    setGameState(prev => ({
      ...prev,
      pokemon: [...prev.pokemon.filter(p => p.id !== pokemonId), evolvedForm]
    }));

    toast({
      title: "Evolution Successful!",
      description: `Your ${pokemon.name} evolved into ${evolvedForm.name}!`,
    });

    if (user) {
      try {
        // Delete old pokemon
        const { error: deleteError } = await supabase
          .from("user_pokemons")
          .delete()
          .match({ user_id: user.id, pokemon_id: pokemonId });

        if (deleteError) throw deleteError;

        // Insert new pokemon
        const { error: insertError } = await supabase
          .from("user_pokemons")
          .insert({ user_id: user.id, pokemon_id: evolvedForm.id });

        if (insertError) throw insertError;

      } catch (error) {
        console.error("Error saving evolution:", error);
        // Revert state on error (optional, but good practice)
        // For now, we'll just show an error toast as the local state is already updated
        toast({
          title: "Save Error",
          description: "Evolution happened locally but failed to save.",
          variant: "destructive"
        });
      }
    }
    return evolvedForm;
  };

  const setBuddy = (pokemonId: number | null) => {
    setGameState(prev => ({ ...prev, buddyPokemonId: pokemonId }));
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
        evolvePokemon,
        setBuddy,
        user,
        currentPokemon: gameState.pokemon[0] || null, // Default to first pokemon or null
        buddyPokemon: gameState.buddyPokemonId ? pokemonDB[gameState.buddyPokemonId] : null,
        isGameLoaded,
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
