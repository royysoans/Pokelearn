import { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { PixelButton } from "./PixelButton";
import { ShareButtons } from "./ShareButtons";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Crown, ArrowLeft, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LeaderboardEntry {
  name: string;
  pokemonCount: number;
  rank: number;
  userId: string;
}

export function Leaderboard() {
  const { gameState, setCurrentPage } = useGame();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      // 1. Get all user pokemons
      const { data: pokemonData, error: pokemonError } = await supabase
        .from("user_pokemons")
        .select("user_id, pokemon_id");

      if (pokemonError) throw pokemonError;

      // 2. Get all profiles
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name");

      if (profileError) throw profileError;

      // 3. Create a map of user_id to name
      const userMap: { [key: string]: string } = {};
      profileData.forEach((profile: any) => {
        userMap[profile.id] = profile.name;
      });

      // 4. Count distinct pokemon per user
      const userPokemonSets: { [key: string]: Set<number> } = {};
      pokemonData.forEach((item: any) => {
        if (!userPokemonSets[item.user_id]) {
          userPokemonSets[item.user_id] = new Set();
        }
        userPokemonSets[item.user_id].add(item.pokemon_id);
      });

      const sortedData = Object.keys(userPokemonSets)
        .map(userId => ({
          name: userMap[userId] || "Unknown Trainer",
          pokemonCount: userPokemonSets[userId].size,
          userId: userId,
          rank: 0 // Placeholder
        }))
        .sort((a, b) => b.pokemonCount - a.pokemonCount)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setLeaderboardData(sortedData);

      // Find current user rank
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const myEntry = sortedData.find(e => e.userId === user.id);
        if (myEntry) setCurrentUserRank(myEntry.rank);
      }

    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const subscription = supabase
      .channel('leaderboard_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_pokemons' },
        () => fetchData()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const maxPokemon = leaderboardData.length > 0 ? leaderboardData[0].pokemonCount : 1;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[url('/grid-pattern.png')] bg-fixed">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center md:text-left">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-6xl font-bold text-primary text-shadow-pixel mb-2"
            >
              Leaderboard
            </motion.h1>
            <p className="text-muted-foreground">
              Top trainers from around the world
            </p>
          </div>

          <PixelButton onClick={() => setCurrentPage('regions')} variant="secondary">
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Map
            </span>
          </PixelButton>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* List Section */}
            <div className="space-y-4">
              {leaderboardData.map((entry, index) => {
                const isCurrentUser = currentUserRank === entry.rank;
                const isTop3 = entry.rank <= 3;

                let rankColor = "text-muted-foreground";
                let borderColor = "border-white/10";
                let bgGradient = "bg-card/40";
                let icon = null;

                if (entry.rank === 1) {
                  rankColor = "text-yellow-400";
                  borderColor = "border-yellow-500/50";
                  bgGradient = "bg-gradient-to-r from-yellow-500/10 to-transparent";
                  icon = <Crown className="w-5 h-5 text-yellow-400" />;
                } else if (entry.rank === 2) {
                  rankColor = "text-gray-300";
                  borderColor = "border-gray-400/50";
                  bgGradient = "bg-gradient-to-r from-gray-400/10 to-transparent";
                  icon = <Medal className="w-5 h-5 text-gray-300" />;
                } else if (entry.rank === 3) {
                  rankColor = "text-amber-600";
                  borderColor = "border-amber-600/50";
                  bgGradient = "bg-gradient-to-r from-amber-600/10 to-transparent";
                  icon = <Medal className="w-5 h-5 text-amber-600" />;
                }

                if (isCurrentUser) {
                  borderColor = "border-primary";
                  bgGradient = "bg-primary/10";
                }

                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className={`relative p-4 rounded-xl border ${borderColor} ${bgGradient} backdrop-blur-md shadow-lg transition-all duration-300`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 text-center font-bold text-xl ${rankColor} flex justify-center`}>
                        {icon || `#${entry.rank}`}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-bold text-lg ${isCurrentUser ? "text-primary" : "text-white"}`}>
                            {entry.name} {isCurrentUser && "(You)"}
                          </span>
                          <span className="text-white/80">
                            {entry.pokemonCount} <span className="text-xs text-muted-foreground">Caught</span>
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-2 bg-black/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(entry.pokemonCount / maxPokemon) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                            className={`absolute top-0 left-0 h-full rounded-full ${entry.rank === 1 ? "bg-yellow-400" :
                              entry.rank === 2 ? "bg-gray-300" :
                                entry.rank === 3 ? "bg-amber-600" :
                                  "bg-primary"
                              }`}
                          />
                        </div>
                      </div>

                      {isTop3 && (
                        <div className="absolute -top-1 -right-1">
                          <Star className={`w-4 h-4 ${rankColor} fill-current animate-pulse`} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Share Section */}
            <div className="mt-12 text-center">
              <ShareButtons
                message={`I'm ranked #${currentUserRank || '?'} on the PokéLearn Leaderboard with ${gameState.pokemon.length} Pokémon! 🏆`}
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
}
