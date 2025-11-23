import { useEffect, useState, useRef } from "react";
import { useGame } from "@/contexts/GameContext";
import { PixelButton } from "./PixelButton";
import { ShareButtons } from "./ShareButtons";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Crown, ArrowLeft, Star, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LeaderboardEntry {
  name: string;
  pokemonCount: number;
  rank: number;
  userId: string;
  rankChange?: number; // positive = moved up, negative = moved down, 0 = no change
}

export function Leaderboard() {
  const { gameState, setCurrentPage } = useGame();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const previousRanksRef = useRef<Map<string, number>>(new Map());

  const fetchData = async () => {
    try {
      // Query the leaderboard_view which does server-side aggregation
      // This avoids the 1000-row limit issue with user_pokemons
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from("leaderboard_view")
        .select("user_id, name, pokemon_count");

      if (leaderboardError) throw leaderboardError;

      const sortedData = (leaderboardData || [])
        .map((entry: any) => ({
          name: entry.name || "Unknown Trainer",
          pokemonCount: entry.pokemon_count || 0,
          userId: entry.user_id,
          rank: 0,
          rankChange: 0
        }))
        .sort((a, b) => b.pokemonCount - a.pokemonCount)
        .map((entry, index) => {
          const newRank = index + 1;
          const oldRank = previousRanksRef.current.get(entry.userId);
          const rankChange = oldRank ? oldRank - newRank : 0;

          previousRanksRef.current.set(entry.userId, newRank);

          return { ...entry, rank: newRank, rankChange };
        });

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
  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  const getRankChangeIcon = (rankChange: number) => {
    if (rankChange > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (rankChange < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

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
            {/* Podium Display for Top 3 */}
            {top3.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-center mb-6 text-primary">🏆 Top Champions 🏆</h2>

                <div className="flex items-end justify-center gap-4 mb-8">
                  {/* 2nd Place */}
                  {top3[1] && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-center flex-1 max-w-[180px]"
                    >
                      <div className="relative mb-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center border-4 border-gray-400 shadow-lg">
                          <Medal className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-gray-400 rounded-full w-8 h-8 flex items-center justify-center font-bold text-white text-sm border-2 border-white">
                          2
                        </div>
                      </div>
                      <div className="w-full bg-gradient-to-t from-gray-400/20 to-gray-400/10 border-2 border-gray-400/50 rounded-t-xl p-4 text-center" style={{ height: '140px' }}>
                        <p className="font-bold text-white mb-1 truncate">{top3[1].name}</p>
                        <p className="text-2xl font-bold text-gray-300 mb-2">{top3[1].pokemonCount}</p>
                        <p className="text-xs text-muted-foreground">Pokémon</p>
                      </div>
                    </motion.div>
                  )}

                  {/* 1st Place */}
                  {top3[0] && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex flex-col items-center flex-1 max-w-[200px]"
                    >
                      <div className="relative mb-3">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center border-4 border-yellow-400 shadow-xl animate-pulse">
                          <Crown className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center font-bold text-white text-lg border-2 border-white">
                          1
                        </div>
                        <Star className="absolute -top-3 -left-3 w-6 h-6 text-yellow-400 fill-yellow-400 animate-spin-slow" />
                      </div>
                      <div className="w-full bg-gradient-to-t from-yellow-500/20 to-yellow-500/10 border-2 border-yellow-500/50 rounded-t-xl p-4 text-center" style={{ height: '180px' }}>
                        <p className="font-bold text-white mb-1 truncate">{top3[0].name}</p>
                        <p className="text-3xl font-bold text-yellow-400 mb-2">{top3[0].pokemonCount}</p>
                        <p className="text-xs text-muted-foreground">Pokémon</p>
                        <Trophy className="w-8 h-8 text-yellow-400 mx-auto mt-2" />
                      </div>
                    </motion.div>
                  )}

                  {/* 3rd Place */}
                  {top3[2] && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col items-center flex-1 max-w-[180px]"
                    >
                      <div className="relative mb-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center border-4 border-amber-600 shadow-lg">
                          <Medal className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-amber-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-white text-sm border-2 border-white">
                          3
                        </div>
                      </div>
                      <div className="w-full bg-gradient-to-t from-amber-600/20 to-amber-600/10 border-2 border-amber-600/50 rounded-t-xl p-4 text-center" style={{ height: '120px' }}>
                        <p className="font-bold text-white mb-1 truncate">{top3[2].name}</p>
                        <p className="text-2xl font-bold text-amber-600 mb-2">{top3[2].pokemonCount}</p>
                        <p className="text-xs text-muted-foreground">Pokémon</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Rest of Leaderboard */}
            {rest.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-muted-foreground mb-4">Other Trainers</h3>
                {rest.map((entry, index) => {
                  const isCurrentUser = currentUserRank === entry.rank;

                  return (
                    <motion.div
                      key={entry.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className={`relative p-4 rounded-xl border ${isCurrentUser ? "border-primary bg-primary/10" : "border-white/10 bg-card/40"
                        } backdrop-blur-md shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 text-center font-bold text-xl text-muted-foreground flex justify-center">
                          #{entry.rank}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold text-lg ${isCurrentUser ? "text-primary" : "text-white"}`}>
                                {entry.name} {isCurrentUser && "(You)"}
                              </span>
                              {/* Rank Change Indicator */}
                              {entry.rankChange !== 0 && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="flex items-center gap-1"
                                >
                                  {getRankChangeIcon(entry.rankChange!)}
                                  <span className={`text-xs font-bold ${entry.rankChange! > 0 ? "text-green-400" : "text-red-400"
                                    }`}>
                                    {Math.abs(entry.rankChange!)}
                                  </span>
                                </motion.div>
                              )}
                            </div>
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
                              className="absolute top-0 left-0 h-full rounded-full bg-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

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
